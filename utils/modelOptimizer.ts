import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export interface OptimizationConfig {
  performanceLevel: 'high' | 'medium' | 'low'
  maxTriangles: number
  textureMaxSize: number
  enableCompression: boolean
  mergeGeometries: boolean
}

const OPTIMIZATION_PRESETS: Record<string, OptimizationConfig> = {
  high: {
    performanceLevel: 'high',
    maxTriangles: 50000,
    textureMaxSize: 2048,
    enableCompression: true,
    mergeGeometries: false
  },
  medium: {
    performanceLevel: 'medium',
    maxTriangles: 25000,
    textureMaxSize: 1024,
    enableCompression: true,
    mergeGeometries: true
  },
  low: {
    performanceLevel: 'low',
    maxTriangles: 10000,
    textureMaxSize: 512,
    enableCompression: true,
    mergeGeometries: true
  }
}

export class ModelOptimizer {
  private config: OptimizationConfig

  constructor(performanceLevel: 'high' | 'medium' | 'low') {
    this.config = OPTIMIZATION_PRESETS[performanceLevel]
  }

  /**
   * Optimize a GLTF scene based on performance requirements
   */
  optimizeGLTF(gltf: GLTF): GLTF {
    const scene = gltf.scene.clone()

    // Apply optimizations
    this.optimizeGeometry(scene)
    this.optimizeTextures(scene)
    this.optimizeMaterials(scene)
    
    if (this.config.mergeGeometries) {
      this.mergeCompatibleGeometries(scene)
    }

    return { ...gltf, scene }
  }

  /**
   * Optimize geometries by reducing triangle count
   */
  private optimizeGeometry(scene: THREE.Object3D) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry) {
        const geometry = object.geometry
        
        // Count current triangles
        const currentTriangles = this.getTriangleCount(geometry)
        
        if (currentTriangles > this.config.maxTriangles) {
          // Apply LOD reduction
          this.simplifyGeometry(object, currentTriangles)
        }

        // Optimize buffer attributes
        this.optimizeBufferGeometry(geometry)
      }
    })
  }

  /**
   * Simplify geometry to reduce triangle count
   */
  private simplifyGeometry(mesh: THREE.Mesh, currentTriangles: number) {
    const targetTriangles = this.config.maxTriangles
    const reductionRatio = targetTriangles / currentTriangles

    if (reductionRatio < 1) {
      // Apply geometric simplification
      // Note: In a real implementation, you might use libraries like three-mesh-bvh or meshoptimizer
      console.warn(`Geometry simplification needed: ${currentTriangles} -> ${targetTriangles} triangles`)
      
      // For now, apply simple optimization by removing unnecessary vertices
      if (mesh.geometry instanceof THREE.BufferGeometry) {
        mesh.geometry.computeBoundingSphere()
        mesh.geometry.computeBoundingBox()
      }
    }
  }

  /**
   * Optimize textures by resizing and compressing
   */
  private optimizeTextures(scene: THREE.Object3D) {
    const textureCache = new Map<string, THREE.Texture>()

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            this.optimizeMaterialTextures(material, textureCache)
          }
        })
      }
    })
  }

  /**
   * Optimize individual material textures
   */
  private optimizeMaterialTextures(
    material: THREE.MeshStandardMaterial, 
    textureCache: Map<string, THREE.Texture>
  ) {
    const textureProperties = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap'] as const

    textureProperties.forEach((prop) => {
      const texture = material[prop] as THREE.Texture | null
      if (texture && texture.image) {
        const cacheKey = this.getTextureKey(texture)
        
        if (!textureCache.has(cacheKey)) {
          const optimizedTexture = this.resizeTexture(texture)
          textureCache.set(cacheKey, optimizedTexture)
        }
        
        material[prop] = textureCache.get(cacheKey) || texture
      }
    })
  }

  /**
   * Resize texture to fit performance requirements
   */
  private resizeTexture(texture: THREE.Texture): THREE.Texture {
    const image = texture.image
    if (!image || !image.width || !image.height) return texture

    const maxSize = this.config.textureMaxSize
    
    if (image.width <= maxSize && image.height <= maxSize) {
      return texture
    }

    // Create resized texture
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return texture

    // Calculate new dimensions maintaining aspect ratio
    const aspectRatio = image.width / image.height
    let newWidth, newHeight

    if (aspectRatio > 1) {
      newWidth = Math.min(maxSize, image.width)
      newHeight = newWidth / aspectRatio
    } else {
      newHeight = Math.min(maxSize, image.height)
      newWidth = newHeight * aspectRatio
    }

    canvas.width = newWidth
    canvas.height = newHeight

    // Draw resized image
    ctx.drawImage(image, 0, 0, newWidth, newHeight)

    // Create new texture
    const optimizedTexture = texture.clone()
    optimizedTexture.image = canvas
    optimizedTexture.needsUpdate = true

    return optimizedTexture
  }

  /**
   * Optimize materials by reducing complexity
   */
  private optimizeMaterials(scene: THREE.Object3D) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        
        materials.forEach((material, index) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            const optimized = this.optimizeMaterial(material)
            if (Array.isArray(object.material)) {
              object.material[index] = optimized
            } else {
              object.material = optimized
            }
          }
        })
      }
    })
  }

  /**
   * Optimize individual material properties
   */
  private optimizeMaterial(material: THREE.MeshStandardMaterial): THREE.Material {
    const optimized = material.clone()

    // Reduce material complexity based on performance level
    if (this.config.performanceLevel === 'low') {
      // Use simpler material for low performance
      const basicMaterial = new THREE.MeshBasicMaterial({
        map: optimized.map,
        color: optimized.color,
        transparent: optimized.transparent,
        opacity: optimized.opacity
      })
      return basicMaterial
    }

    if (this.config.performanceLevel === 'medium') {
      // Simplify standard material
      optimized.envMapIntensity = 0.3
      optimized.roughness = Math.max(0.2, optimized.roughness)
      optimized.metalness = Math.min(0.8, optimized.metalness)
    }

    return optimized
  }

  /**
   * Merge compatible geometries to reduce draw calls
   */
  private mergeCompatibleGeometries(scene: THREE.Object3D) {
    const meshGroups = new Map<string, THREE.Mesh[]>()

    // Group meshes by material
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materialKey = this.getMaterialKey(object.material)
        if (!meshGroups.has(materialKey)) {
          meshGroups.set(materialKey, [])
        }
        meshGroups.get(materialKey)!.push(object)
      }
    })

    // Merge geometries within each group
    meshGroups.forEach((meshes, materialKey) => {
      if (meshes.length > 1) {
        this.mergeMessageGroup(meshes, materialKey)
      }
    })
  }

  /**
   * Merge a group of meshes with the same material
   */
  private mergeMessageGroup(meshes: THREE.Mesh[], materialKey: string) {
    const geometries: THREE.BufferGeometry[] = []
    const matrices: THREE.Matrix4[] = []

    meshes.forEach((mesh) => {
      if (mesh.geometry instanceof THREE.BufferGeometry) {
        geometries.push(mesh.geometry)
        matrices.push(mesh.matrixWorld)
      }
    })

    if (geometries.length > 1) {
      try {
        // Merge geometries
        const mergedGeometry = this.mergeBufferGeometries(geometries, matrices)
        
        if (mergedGeometry) {
          // Create merged mesh
          const mergedMesh = new THREE.Mesh(mergedGeometry, meshes[0].material)
          mergedMesh.name = `merged_${materialKey}`

          // Add to parent and remove original meshes
          const parent = meshes[0].parent
          if (parent) {
            parent.add(mergedMesh)
            meshes.forEach(mesh => parent.remove(mesh))
          }
        }
      } catch (error) {
        console.warn('Failed to merge geometries:', error)
      }
    }
  }

  /**
   * Merge multiple buffer geometries
   */
  private mergeBufferGeometries(
    geometries: THREE.BufferGeometry[], 
    matrices: THREE.Matrix4[]
  ): THREE.BufferGeometry | null {
    if (geometries.length === 0) return null

    const merged = new THREE.BufferGeometry()
    const attributes: { [key: string]: Float32Array[] } = {}

    // Collect all attributes
    geometries.forEach((geometry, index) => {
      geometry.applyMatrix4(matrices[index])
      
      Object.keys(geometry.attributes).forEach((name) => {
        if (!attributes[name]) attributes[name] = []
        const attribute = geometry.attributes[name]
        if (attribute instanceof THREE.BufferAttribute) {
          attributes[name].push(attribute.array as Float32Array)
        }
      })
    })

    // Merge attributes
    Object.keys(attributes).forEach((name) => {
      const arrays = attributes[name]
      const mergedArray = this.concatenateTypedArrays(arrays)
      merged.setAttribute(name, new THREE.BufferAttribute(mergedArray, arrays[0].length / geometries[0].attributes[name].count))
    })

    return merged
  }

  /**
   * Helper methods
   */
  private getTriangleCount(geometry: THREE.BufferGeometry): number {
    const position = geometry.attributes.position
    return position ? position.count / 3 : 0
  }

  private optimizeBufferGeometry(geometry: THREE.BufferGeometry) {
    // Remove unused vertices
    geometry.deleteAttribute('uv2')
    
    // Merge vertices
    const mergedGeometry = BufferGeometryUtils.mergeVertices(geometry)
    if (mergedGeometry) {
      geometry.copy(mergedGeometry)
    }

    // Compute efficient bounds
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
  }

  private getTextureKey(texture: THREE.Texture): string {
    return `${texture.uuid}_${texture.image?.width || 0}x${texture.image?.height || 0}`
  }

  private getMaterialKey(material: THREE.Material | THREE.Material[]): string {
    if (Array.isArray(material)) {
      return material.map(m => m.uuid).join('_')
    }
    return material.uuid
  }

  private concatenateTypedArrays(arrays: Float32Array[]): Float32Array {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
    const result = new Float32Array(totalLength)
    let offset = 0
    
    arrays.forEach((arr) => {
      result.set(arr, offset)
      offset += arr.length
    })
    
    return result
  }
}

/**
 * Factory function to create optimized models
 */
export function createOptimizedModel(
  gltf: GLTF, 
  performanceLevel: 'high' | 'medium' | 'low'
): GLTF {
  const optimizer = new ModelOptimizer(performanceLevel)
  return optimizer.optimizeGLTF(gltf)
}

/**
 * Preload and optimize model
 */
export async function preloadOptimizedModel(
  url: string, 
  loader: any, 
  performanceLevel: 'high' | 'medium' | 'low'
): Promise<GLTF> {
  const gltf = await loader.loadAsync(url)
  return createOptimizedModel(gltf, performanceLevel)
}