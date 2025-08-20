import * as THREE from 'three'

export interface AtlasConfig {
  maxAtlasSize: number
  padding: number
  powerOfTwo: boolean
  enableMipmaps: boolean
  compressionFormat?: 'DXT1' | 'DXT5' | 'ETC1' | 'PVRTC'
}

export interface AtlasResult {
  atlasTexture: THREE.Texture
  materialMapping: Map<string, THREE.Material>
  textureReduction: number
  memoryReduction: number
}

export interface TextureInfo {
  texture: THREE.Texture
  material: THREE.Material
  uvTransform: {
    offsetX: number
    offsetY: number
    scaleX: number
    scaleY: number
  }
}

/**
 * Texture atlas generator for optimizing material memory usage
 */
export class TextureAtlasGenerator {
  private config: AtlasConfig
  protected canvas: HTMLCanvasElement
  protected context: CanvasRenderingContext2D

  constructor(config: Partial<AtlasConfig> = {}) {
    this.config = {
      maxAtlasSize: 4096,
      padding: 2,
      powerOfTwo: true,
      enableMipmaps: true,
      ...config
    }

    // Create canvas for texture combination
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
  }

  /**
   * Generate texture atlas from materials
   */
  generateAtlas(materials: THREE.Material[]): AtlasResult {
    // Extract textures from materials
    const textureInfos = this.extractTextures(materials)
    
    if (textureInfos.length === 0) {
      throw new Error('No textures found in provided materials')
    }

    // Calculate optimal atlas layout
    const layout = this.calculateLayout(textureInfos)
    
    // Create atlas texture
    const atlasTexture = this.createAtlasTexture(textureInfos, layout)
    
    // Update materials with new UV coordinates
    const materialMapping = this.updateMaterials(materials, textureInfos, layout)
    
    const textureReduction = textureInfos.length - 1 // All combined into one
    const memoryReduction = this.calculateMemoryReduction(textureInfos, atlasTexture)

    return {
      atlasTexture,
      materialMapping,
      textureReduction,
      memoryReduction
    }
  }

  /**
   * Extract textures from materials
   */
  private extractTextures(materials: THREE.Material[]): TextureInfo[] {
    const textureInfos: TextureInfo[] = []
    const processedTextures = new Set<string>()

    materials.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial) {
        // Process diffuse map
        if (material.map && !processedTextures.has(material.map.uuid)) {
          processedTextures.add(material.map.uuid)
          textureInfos.push({
            texture: material.map,
            material,
            uvTransform: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 }
          })
        }
      }
    })

    return textureInfos
  }

  /**
   * Calculate optimal layout for textures in atlas
   */
  private calculateLayout(textureInfos: TextureInfo[]): Array<{
    textureInfo: TextureInfo
    x: number
    y: number
    width: number
    height: number
  }> {
    // Sort textures by size (largest first for better packing)
    const sortedTextures = [...textureInfos].sort((a, b) => {
      const aArea = (a.texture.image?.width || 256) * (a.texture.image?.height || 256)
      const bArea = (b.texture.image?.width || 256) * (b.texture.image?.height || 256)
      return bArea - aArea
    })

    const layout: Array<{
      textureInfo: TextureInfo
      x: number
      y: number
      width: number
      height: number
    }> = []

    // Simple bin packing algorithm
    const bins = [{ x: 0, y: 0, width: this.config.maxAtlasSize, height: this.config.maxAtlasSize }]

    sortedTextures.forEach(textureInfo => {
      const image = textureInfo.texture.image
      const texWidth = image?.width || 256
      const texHeight = image?.height || 256
      
      // Add padding
      const paddedWidth = texWidth + this.config.padding * 2
      const paddedHeight = texHeight + this.config.padding * 2

      // Find suitable bin
      const binIndex = bins.findIndex(bin => 
        bin.width >= paddedWidth && bin.height >= paddedHeight
      )

      if (binIndex === -1) {
        console.warn(`Texture ${textureInfo.texture.uuid} doesn't fit in atlas`)
        return
      }

      const bin = bins[binIndex]
      
      // Place texture in bin
      layout.push({
        textureInfo,
        x: bin.x + this.config.padding,
        y: bin.y + this.config.padding,
        width: texWidth,
        height: texHeight
      })

      // Update bin (split remaining space)
      bins.splice(binIndex, 1)
      
      // Add remaining horizontal space
      if (bin.width > paddedWidth) {
        bins.push({
          x: bin.x + paddedWidth,
          y: bin.y,
          width: bin.width - paddedWidth,
          height: paddedHeight
        })
      }
      
      // Add remaining vertical space
      if (bin.height > paddedHeight) {
        bins.push({
          x: bin.x,
          y: bin.y + paddedHeight,
          width: bin.width,
          height: bin.height - paddedHeight
        })
      }
    })

    return layout
  }

  /**
   * Create atlas texture from layout
   */
  private createAtlasTexture(
    textureInfos: TextureInfo[], 
    layout: Array<{ textureInfo: TextureInfo; x: number; y: number; width: number; height: number }>
  ): THREE.Texture {
    // Calculate actual atlas size needed
    let maxX = 0, maxY = 0
    layout.forEach(item => {
      maxX = Math.max(maxX, item.x + item.width)
      maxY = Math.max(maxY, item.y + item.height)
    })

    // Ensure power of two if required
    let atlasWidth = maxX
    let atlasHeight = maxY
    
    if (this.config.powerOfTwo) {
      atlasWidth = this.nearestPowerOfTwo(maxX)
      atlasHeight = this.nearestPowerOfTwo(maxY)
    }

    // Set up canvas
    this.canvas.width = atlasWidth
    this.canvas.height = atlasHeight
    this.context.clearRect(0, 0, atlasWidth, atlasHeight)

    // Draw textures onto atlas
    layout.forEach(item => {
      const image = item.textureInfo.texture.image
      if (image && image.complete) {
        try {
          this.context.drawImage(
            image,
            item.x, item.y,
            item.width, item.height
          )
        } catch (error) {
          console.warn('Failed to draw texture to atlas:', error)
        }
      }
    })

    // Create THREE.js texture from canvas
    const atlasTexture = new THREE.CanvasTexture(this.canvas)
    atlasTexture.generateMipmaps = this.config.enableMipmaps
    atlasTexture.wrapS = THREE.RepeatWrapping
    atlasTexture.wrapT = THREE.RepeatWrapping
    atlasTexture.needsUpdate = true

    return atlasTexture
  }

  /**
   * Update materials with new UV coordinates
   */
  private updateMaterials(
    materials: THREE.Material[],
    textureInfos: TextureInfo[],
    layout: Array<{ textureInfo: TextureInfo; x: number; y: number; width: number; height: number }>
  ): Map<string, THREE.Material> {
    const materialMapping = new Map<string, THREE.Material>()
    const atlasWidth = this.canvas.width
    const atlasHeight = this.canvas.height

    // Calculate UV transforms for each texture
    const uvTransforms = new Map<string, {
      offsetX: number
      offsetY: number
      scaleX: number
      scaleY: number
    }>()

    layout.forEach(item => {
      const scaleX = item.width / atlasWidth
      const scaleY = item.height / atlasHeight
      const offsetX = item.x / atlasWidth
      const offsetY = item.y / atlasHeight

      uvTransforms.set(item.textureInfo.texture.uuid, {
        offsetX,
        offsetY: 1.0 - offsetY - scaleY, // Flip Y coordinate
        scaleX,
        scaleY
      })
    })

    // Update materials
    materials.forEach(material => {
      if (material instanceof THREE.MeshStandardMaterial && material.map) {
        const transform = uvTransforms.get(material.map.uuid)
        
        if (transform) {
          // Clone material to avoid modifying original
          const newMaterial = material.clone()
          
          // Update UV transform
          newMaterial.map!.repeat.set(transform.scaleX, transform.scaleY)
          newMaterial.map!.offset.set(transform.offsetX, transform.offsetY)
          newMaterial.map!.needsUpdate = true
          
          materialMapping.set(material.uuid, newMaterial)
        }
      }
    })

    return materialMapping
  }

  /**
   * Calculate memory reduction from atlasing
   */
  private calculateMemoryReduction(textureInfos: TextureInfo[], atlasTexture: THREE.Texture): number {
    let originalMemory = 0
    
    textureInfos.forEach(info => {
      const image = info.texture.image
      if (image) {
        const width = image.width || 256
        const height = image.height || 256
        originalMemory += width * height * 4 // Assume RGBA
      }
    })

    const atlasMemory = this.canvas.width * this.canvas.height * 4
    return Math.max(0, originalMemory - atlasMemory)
  }

  /**
   * Find nearest power of two
   */
  private nearestPowerOfTwo(value: number): number {
    return Math.pow(2, Math.ceil(Math.log2(value)))
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.canvas.remove()
  }
}

/**
 * Specialized texture atlas for neural network materials
 */
export class NeuralNetworkAtlas extends TextureAtlasGenerator {
  constructor() {
    super({
      maxAtlasSize: 2048, // Smaller atlas for neural network textures
      padding: 1,
      powerOfTwo: true,
      enableMipmaps: false // Neural networks often use simple textures
    })
  }

  /**
   * Create specialized atlas for neural network node materials
   */
  createNodeAtlas(nodeMaterials: THREE.MeshStandardMaterial[]): AtlasResult {
    // Filter materials that actually have textures
    const materialsWithTextures = nodeMaterials.filter(material => material.map)
    
    if (materialsWithTextures.length === 0) {
      // Create a simple color atlas for materials without textures
      return this.createColorAtlas(nodeMaterials)
    }

    return this.generateAtlas(materialsWithTextures)
  }

  /**
   * Create color-based atlas for materials without textures
   */
  private createColorAtlas(materials: THREE.MeshStandardMaterial[]): AtlasResult {
    const colors = materials.map(material => material.color)
    const uniqueColors = [...new Set(colors.map(color => color.getHex()))]
    
    // Create small atlas with color swatches
    const swatchSize = 64
    const cols = Math.ceil(Math.sqrt(uniqueColors.length))
    const atlasSize = cols * swatchSize
    
    this.canvas.width = atlasSize
    this.canvas.height = atlasSize
    this.context.clearRect(0, 0, atlasSize, atlasSize)
    
    const colorToUV = new Map<number, { offsetX: number; offsetY: number; scaleX: number; scaleY: number }>()
    
    uniqueColors.forEach((color, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = col * swatchSize
      const y = row * swatchSize
      
      // Draw color swatch
      this.context.fillStyle = `#${color.toString(16).padStart(6, '0')}`
      this.context.fillRect(x, y, swatchSize, swatchSize)
      
      // Store UV coordinates
      colorToUV.set(color, {
        offsetX: x / atlasSize,
        offsetY: y / atlasSize,
        scaleX: swatchSize / atlasSize,
        scaleY: swatchSize / atlasSize
      })
    })
    
    const atlasTexture = new THREE.CanvasTexture(this.canvas)
    atlasTexture.needsUpdate = true
    
    // Update materials with atlas texture and UV coordinates
    const materialMapping = new Map<string, THREE.Material>()
    
    materials.forEach(material => {
      const colorHex = material.color.getHex()
      const uvTransform = colorToUV.get(colorHex)
      
      if (uvTransform) {
        const newMaterial = material.clone()
        newMaterial.map = atlasTexture
        newMaterial.map.repeat.set(uvTransform.scaleX, uvTransform.scaleY)
        newMaterial.map.offset.set(uvTransform.offsetX, uvTransform.offsetY)
        
        materialMapping.set(material.uuid, newMaterial)
      }
    })
    
    return {
      atlasTexture,
      materialMapping,
      textureReduction: materials.length - 1,
      memoryReduction: 0 // Minimal for color atlas
    }
  }
}

/**
 * Factory functions for common atlas scenarios
 */
export function createTextureAtlas(
  materials: THREE.Material[],
  scenario: 'neural_network' | 'architectural' | 'particle' | 'generic' = 'generic'
): AtlasResult {
  let generator: TextureAtlasGenerator
  
  switch (scenario) {
    case 'neural_network':
      generator = new NeuralNetworkAtlas()
      return (generator as NeuralNetworkAtlas).createNodeAtlas(materials as THREE.MeshStandardMaterial[])
      
    case 'architectural':
      generator = new TextureAtlasGenerator({
        maxAtlasSize: 8192, // High resolution for architectural detail
        padding: 4,
        powerOfTwo: true,
        enableMipmaps: true
      })
      break
      
    case 'particle':
      generator = new TextureAtlasGenerator({
        maxAtlasSize: 1024, // Small atlas for simple particles
        padding: 1,
        powerOfTwo: true,
        enableMipmaps: false
      })
      break
      
    default:
      generator = new TextureAtlasGenerator()
      break
  }
  
  return generator.generateAtlas(materials)
}

/**
 * Utility to optimize existing scene with texture atlasing
 */
export function optimizeSceneTextures(scene: THREE.Scene, scenario: 'neural_network' | 'generic' = 'generic'): {
  atlasResults: AtlasResult[]
  totalTextureReduction: number
  totalMemoryReduction: number
} {
  const materialGroups = new Map<string, THREE.Material[]>()
  
  // Collect materials from scene
  scene.traverse(object => {
    if (object instanceof THREE.Mesh && object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      
      materials.forEach(material => {
        if (material instanceof THREE.MeshStandardMaterial) {
          const groupKey = scenario // Could be more sophisticated grouping
          
          if (!materialGroups.has(groupKey)) {
            materialGroups.set(groupKey, [])
          }
          
          materialGroups.get(groupKey)!.push(material)
        }
      })
    }
  })
  
  const atlasResults: AtlasResult[] = []
  let totalTextureReduction = 0
  let totalMemoryReduction = 0
  
  // Create atlas for each material group
  materialGroups.forEach((materials, groupKey) => {
    if (materials.length > 1) {
      try {
        const result = createTextureAtlas(materials, scenario)
        atlasResults.push(result)
        totalTextureReduction += result.textureReduction
        totalMemoryReduction += result.memoryReduction
      } catch (error) {
        console.warn(`Failed to create atlas for group ${groupKey}:`, error)
      }
    }
  })
  
  return {
    atlasResults,
    totalTextureReduction,
    totalMemoryReduction
  }
}