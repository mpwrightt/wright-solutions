import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export interface MergeConfig {
  preserveMaterials: boolean
  maxVertices: number
  enableAutoLOD: boolean
  respectTransforms: boolean
}

export interface MergeResult {
  mergedMesh: THREE.Mesh
  originalCount: number
  mergedCount: number
  drawCallReduction: number
  vertexReduction: number
}

/**
 * Advanced mesh merging utility for reducing draw calls
 */
export class MeshMerger {
  private config: MergeConfig

  constructor(config: Partial<MergeConfig> = {}) {
    this.config = {
      preserveMaterials: true,
      maxVertices: 65536, // Typical GPU limit
      enableAutoLOD: false,
      respectTransforms: true,
      ...config
    }
  }

  /**
   * Merge multiple meshes into a single mesh
   */
  mergeMeshes(meshes: THREE.Mesh[]): MergeResult {
    if (meshes.length === 0) {
      throw new Error('No meshes provided for merging')
    }

    if (meshes.length === 1) {
      return {
        mergedMesh: meshes[0].clone(),
        originalCount: 1,
        mergedCount: 1,
        drawCallReduction: 0,
        vertexReduction: 0
      }
    }

    // Group meshes by material if preserving materials
    const meshGroups = this.config.preserveMaterials ? 
      this.groupMeshesByMaterial(meshes) : 
      new Map([['all', meshes]])

    const mergedGeometries: THREE.BufferGeometry[] = []
    const mergedMaterials: THREE.Material[] = []
    let totalOriginalVertices = 0
    let totalMergedVertices = 0

    // Process each material group
    meshGroups.forEach((groupMeshes, materialKey) => {
      const result = this.mergeGeometriesFromMeshes(groupMeshes)
      
      if (result.mergedGeometry && result.mergedGeometry.attributes.position) {
        mergedGeometries.push(result.mergedGeometry)
        mergedMaterials.push(result.material)
        
        totalOriginalVertices += result.originalVertexCount
        totalMergedVertices += result.mergedVertexCount
      }
    })

    // Create final merged mesh
    let finalMesh: THREE.Mesh
    
    if (mergedGeometries.length === 1) {
      finalMesh = new THREE.Mesh(mergedGeometries[0], mergedMaterials[0])
    } else {
      // Multiple material groups - create multi-material mesh
      const combinedGeometry = this.combineGeometries(mergedGeometries)
      const multiMaterial = mergedMaterials.length > 1 ? mergedMaterials : mergedMaterials[0]
      
      finalMesh = new THREE.Mesh(combinedGeometry, multiMaterial)
    }

    // Apply optimizations
    this.optimizeMergedMesh(finalMesh)

    const vertexReduction = totalOriginalVertices - totalMergedVertices
    const drawCallReduction = meshes.length - (mergedGeometries.length || 1)

    return {
      mergedMesh: finalMesh,
      originalCount: meshes.length,
      mergedCount: mergedGeometries.length || 1,
      drawCallReduction,
      vertexReduction
    }
  }

  /**
   * Group meshes by material signature
   */
  private groupMeshesByMaterial(meshes: THREE.Mesh[]): Map<string, THREE.Mesh[]> {
    const groups = new Map<string, THREE.Mesh[]>()

    meshes.forEach(mesh => {
      const materialKey = this.getMaterialKey(mesh.material)
      
      if (!groups.has(materialKey)) {
        groups.set(materialKey, [])
      }
      
      groups.get(materialKey)!.push(mesh)
    })

    return groups
  }

  /**
   * Generate unique key for material
   */
  private getMaterialKey(material: THREE.Material | THREE.Material[]): string {
    if (Array.isArray(material)) {
      return material.map(m => m.uuid).join('_')
    }
    
    // Include relevant material properties for better grouping
    let key = material.uuid
    
    if (material instanceof THREE.MeshStandardMaterial) {
      key += `_${material.color.getHexString()}`
      key += `_${material.metalness}`
      key += `_${material.roughness}`
      key += `_${material.transparent ? 't' : 'o'}`
    }
    
    return key
  }

  /**
   * Merge geometries from a group of meshes
   */
  private mergeGeometriesFromMeshes(meshes: THREE.Mesh[]): {
    mergedGeometry: THREE.BufferGeometry | null
    material: THREE.Material
    originalVertexCount: number
    mergedVertexCount: number
  } {
    const geometries: THREE.BufferGeometry[] = []
    let originalVertexCount = 0
    
    // Extract and transform geometries
    meshes.forEach(mesh => {
      const geometry = mesh.geometry.clone()
      
      if (this.config.respectTransforms) {
        // Apply mesh transform to geometry
        geometry.applyMatrix4(mesh.matrixWorld)
      }
      
      geometries.push(geometry)
      originalVertexCount += geometry.attributes.position?.count || 0
    })

    // Merge the geometries
    const mergedGeometry = this.mergeBufferGeometries(geometries)
    const mergedVertexCount = mergedGeometry?.attributes.position?.count || 0

    return {
      mergedGeometry,
      material: meshes[0].material as THREE.Material, // Use first mesh material
      originalVertexCount,
      mergedVertexCount
    }
  }

  /**
   * Merge multiple buffer geometries into one
   */
  private mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
    if (geometries.length === 0) return null
    if (geometries.length === 1) return geometries[0]

    // Check vertex count limit
    const totalVertices = geometries.reduce(
      (sum, geo) => sum + (geo.attributes.position?.count || 0), 0
    )
    
    if (totalVertices > this.config.maxVertices) {
      console.warn(`Vertex count ${totalVertices} exceeds limit ${this.config.maxVertices}. Consider reducing geometry complexity.`)
      // Could implement automatic LOD reduction here
      if (this.config.enableAutoLOD) {
        return this.createLODGeometry(geometries)
      }
    }

    try {
      // Use THREE.js built-in merge utilities
      return BufferGeometryUtils.mergeGeometries(geometries, false)
    } catch (error) {
      console.error('Failed to merge geometries:', error)
      // Fallback: return the first geometry
      return geometries[0]
    }
  }

  /**
   * Create LOD (Level of Detail) geometry when vertex limit exceeded
   */
  private createLODGeometry(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    // Simple LOD: reduce geometry complexity
    const simplifiedGeometries = geometries.map(geometry => {
      const simplified = geometry.clone()
      
      // Remove secondary UV channel to save memory
      if (simplified.attributes.uv2) {
        simplified.deleteAttribute('uv2')
      }
      
      // Simplify by removing every nth vertex (crude but effective)
      if (simplified.attributes.position.count > 1000) {
        const positions = simplified.attributes.position.array
        const normals = simplified.attributes.normal?.array
        const uvs = simplified.attributes.uv?.array
        
        const step = Math.ceil(simplified.attributes.position.count / 500) // Target ~500 vertices
        const newPositions: number[] = []
        const newNormals: number[] = []
        const newUvs: number[] = []
        
        for (let i = 0; i < positions.length; i += step * 3) {
          newPositions.push(positions[i], positions[i + 1], positions[i + 2])
          
          if (normals) {
            newNormals.push(normals[i], normals[i + 1], normals[i + 2])
          }
          
          if (uvs) {
            const uvIndex = Math.floor(i / 3) * 2
            if (uvIndex < uvs.length - 1) {
              newUvs.push(uvs[uvIndex], uvs[uvIndex + 1])
            }
          }
        }
        
        simplified.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3))
        if (newNormals.length > 0) {
          simplified.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3))
        }
        if (newUvs.length > 0) {
          simplified.setAttribute('uv', new THREE.Float32BufferAttribute(newUvs, 2))
        }
      }
      
      return simplified
    })
    
    return BufferGeometryUtils.mergeGeometries(simplifiedGeometries, false) || geometries[0]
  }

  /**
   * Combine multiple geometries into one (for multi-material support)
   */
  private combineGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    if (geometries.length === 1) {
      return geometries[0]
    }

    // For multi-material meshes, we need to combine geometries while preserving material indices
    const combined = new THREE.BufferGeometry()
    const attributes: { [key: string]: number[][] } = {}
    const groups: Array<{ start: number; count: number; materialIndex: number }> = []
    
    let vertexOffset = 0
    
    geometries.forEach((geometry, materialIndex) => {
      const positionAttribute = geometry.attributes.position
      if (!positionAttribute) return
      
      const vertexCount = positionAttribute.count
      
      // Collect all attributes
      Object.keys(geometry.attributes).forEach(name => {
        if (!attributes[name]) attributes[name] = []
        
        const attribute = geometry.attributes[name]
        const array = Array.from(attribute.array)
        attributes[name].push(array)
      })
      
      // Add group for this material
      groups.push({
        start: vertexOffset,
        count: vertexCount,
        materialIndex
      })
      
      vertexOffset += vertexCount
    })
    
    // Set combined attributes
    Object.keys(attributes).forEach(name => {
      const arrays = attributes[name]
      const combinedArray = arrays.flat()
      const itemSize = geometries[0].attributes[name].itemSize
      
      combined.setAttribute(name, new THREE.Float32BufferAttribute(combinedArray, itemSize))
    })
    
    // Set groups for multi-material
    groups.forEach(group => {
      combined.addGroup(group.start, group.count, group.materialIndex)
    })
    
    return combined
  }

  /**
   * Apply final optimizations to merged mesh
   */
  private optimizeMergedMesh(mesh: THREE.Mesh) {
    const geometry = mesh.geometry
    
    // Compute bounds for frustum culling
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
    
    // Merge vertices to remove duplicates
    const mergedGeometry = BufferGeometryUtils.mergeVertices(geometry)
    if (mergedGeometry && mergedGeometry.attributes.position.count < geometry.attributes.position.count) {
      mesh.geometry = mergedGeometry
    }
    
    // Ensure normals are computed
    if (!mesh.geometry.attributes.normal) {
      mesh.geometry.computeVertexNormals()
    }
  }

  /**
   * Static utility method for quick mesh merging
   */
  static quickMerge(meshes: THREE.Mesh[], preserveMaterials = true): THREE.Mesh {
    const merger = new MeshMerger({ preserveMaterials })
    const result = merger.mergeMeshes(meshes)
    return result.mergedMesh
  }
}

/**
 * Utility for merging neural network visualization elements
 */
export class NeuralNetworkMeshMerger extends MeshMerger {
  constructor() {
    super({
      preserveMaterials: true,
      maxVertices: 32768, // Lower limit for complex neural networks
      enableAutoLOD: true,
      respectTransforms: true
    })
  }

  /**
   * Merge neural network nodes with optimized settings
   */
  mergeNeuralNodes(nodes: THREE.Mesh[]): MergeResult {
    // Group nodes by layer for better organization
    const layerGroups = this.groupNodesByLayer(nodes)
    const allMerged: THREE.Mesh[] = []
    
    let totalReduction = 0
    let totalOriginalCount = 0
    
    layerGroups.forEach((layerNodes, layerIndex) => {
      const result = this.mergeMeshes(layerNodes)
      result.mergedMesh.name = `neural_layer_${layerIndex}`
      
      allMerged.push(result.mergedMesh)
      totalReduction += result.drawCallReduction
      totalOriginalCount += result.originalCount
    })
    
    // Create final group
    const group = new THREE.Group()
    allMerged.forEach(mesh => group.add(mesh))
    
    // Return as single mesh if possible, otherwise use group
    const finalMesh = allMerged.length === 1 ? 
      allMerged[0] : 
      new THREE.Mesh() // Placeholder for group

    return {
      mergedMesh: finalMesh,
      originalCount: totalOriginalCount,
      mergedCount: allMerged.length,
      drawCallReduction: totalReduction,
      vertexReduction: 0
    }
  }

  /**
   * Group neural nodes by their Z position (layer)
   */
  private groupNodesByLayer(nodes: THREE.Mesh[]): Map<number, THREE.Mesh[]> {
    const layers = new Map<number, THREE.Mesh[]>()
    
    nodes.forEach(node => {
      const layerZ = Math.round(node.position.z * 10) / 10 // Round to nearest 0.1
      
      if (!layers.has(layerZ)) {
        layers.set(layerZ, [])
      }
      
      layers.get(layerZ)!.push(node)
    })
    
    return layers
  }
}

/**
 * Factory function for common merge scenarios
 */
export function createOptimizedMesh(
  meshes: THREE.Mesh[],
  scenario: 'neural_network' | 'particles' | 'architecture' | 'generic' = 'generic'
): MergeResult {
  let merger: MeshMerger
  
  switch (scenario) {
    case 'neural_network':
      merger = new NeuralNetworkMeshMerger()
      break
      
    case 'particles':
      merger = new MeshMerger({
        preserveMaterials: false, // Particles often share materials
        maxVertices: 100000,
        enableAutoLOD: true,
        respectTransforms: true
      })
      break
      
    case 'architecture':
      merger = new MeshMerger({
        preserveMaterials: true, // Preserve different materials
        maxVertices: 200000,
        enableAutoLOD: false, // Keep architectural detail
        respectTransforms: true
      })
      break
      
    default:
      merger = new MeshMerger()
      break
  }
  
  return merger.mergeMeshes(meshes)
}