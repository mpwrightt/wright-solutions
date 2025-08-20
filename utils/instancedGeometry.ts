import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export interface InstanceConfig {
  count: number
  positions: THREE.Vector3[]
  scales?: THREE.Vector3[]
  rotations?: THREE.Euler[]
  colors?: THREE.Color[]
  visible?: boolean[]
}

/**
 * Create instanced mesh for repeated geometry
 */
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  config: InstanceConfig
): THREE.InstancedMesh {
  const instancedMesh = new THREE.InstancedMesh(geometry, material, config.count)
  
  // Set up transformation matrices
  const matrix = new THREE.Matrix4()
  const position = new THREE.Vector3()
  const scale = new THREE.Vector3(1, 1, 1)
  const quaternion = new THREE.Quaternion()

  for (let i = 0; i < config.count; i++) {
    // Position
    if (config.positions[i]) {
      position.copy(config.positions[i])
    }

    // Scale
    if (config.scales && config.scales[i]) {
      scale.copy(config.scales[i])
    }

    // Rotation
    if (config.rotations && config.rotations[i]) {
      quaternion.setFromEuler(config.rotations[i])
    }

    // Apply transformation
    matrix.compose(position, quaternion, scale)
    instancedMesh.setMatrixAt(i, matrix)

    // Color variation
    if (config.colors && config.colors[i]) {
      instancedMesh.setColorAt(i, config.colors[i])
    }
  }

  instancedMesh.instanceMatrix.needsUpdate = true
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true
  }

  return instancedMesh
}

/**
 * React hook for animated instanced particles
 */
export function useInstancedParticles(config: {
  count: number
  geometry: THREE.BufferGeometry
  material: THREE.Material
  speed?: number
  radius?: number
  animationType?: 'float' | 'orbit' | 'pulse'
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const positions = useMemo(() => 
    Array.from({ length: config.count }, () => 
      new THREE.Vector3(
        (Math.random() - 0.5) * (config.radius || 4),
        (Math.random() - 0.5) * (config.radius || 4),
        (Math.random() - 0.5) * (config.radius || 4)
      )
    ), [config.count, config.radius]
  )

  const phases = useMemo(() =>
    Array.from({ length: config.count }, () => Math.random() * Math.PI * 2),
    [config.count]
  )

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime() * (config.speed || 1)
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()

    for (let i = 0; i < config.count; i++) {
      const phase = phases[i]
      
      switch (config.animationType) {
        case 'orbit':
          position.set(
            Math.cos(time + phase) * (config.radius || 2),
            Math.sin(time * 0.5 + phase) * 0.5,
            Math.sin(time + phase) * (config.radius || 2)
          )
          break
          
        case 'pulse':
          const pulseFactor = 1 + Math.sin(time * 2 + phase) * 0.3
          scale.setScalar(pulseFactor)
          position.copy(positions[i])
          break
          
        default: // float
          position.set(
            positions[i].x + Math.sin(time + phase) * 0.2,
            positions[i].y + Math.cos(time * 0.7 + phase) * 0.3,
            positions[i].z + Math.sin(time * 1.3 + phase) * 0.2
          )
          scale.setScalar(1)
          break
      }

      matrix.compose(position, quaternion, scale)
      meshRef.current.setMatrixAt(i, matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const instancedMesh = useMemo(() => {
    return createInstancedMesh(config.geometry, config.material, {
      count: config.count,
      positions,
      colors: positions.map(() => new THREE.Color().setHSL(Math.random(), 0.7, 0.8))
    })
  }, [config.geometry, config.material, config.count, positions])

  return { meshRef, instancedMesh }
}

/**
 * React hook for instanced neural network nodes
 */
export function useInstancedNeuralNodes(layers: Array<{ nodeCount: number; position: THREE.Vector3; color: string }>) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  const { positions, colors, count } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const colors: THREE.Color[] = []
    let totalCount = 0

    layers.forEach((layer) => {
      for (let i = 0; i < layer.nodeCount; i++) {
        const angle = (i / layer.nodeCount) * Math.PI * 2
        const radius = 0.8
        
        positions.push(new THREE.Vector3(
          layer.position.x + Math.cos(angle) * radius,
          layer.position.y + Math.sin(angle) * radius,
          layer.position.z
        ))
        
        colors.push(new THREE.Color(layer.color))
        totalCount++
      }
    })

    return { positions, colors, count: totalCount }
  }, [layers])

  const scales = useMemo(() => 
    positions.map(() => new THREE.Vector3().setScalar(0.1 + Math.random() * 0.05)),
    [positions.length]
  )

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()

    for (let i = 0; i < count; i++) {
      // Pulsing animation
      const pulseFactor = 1 + Math.sin(time * 2 + i * 0.1) * 0.2
      position.copy(positions[i])
      scale.copy(scales[i]).multiplyScalar(pulseFactor)

      matrix.compose(position, quaternion, scale)
      meshRef.current.setMatrixAt(i, matrix)

      // Color pulsing
      const colorIntensity = 0.7 + Math.sin(time * 3 + i * 0.2) * 0.3
      const color = colors[i].clone().multiplyScalar(colorIntensity)
      meshRef.current.setColorAt(i, color)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return {
    meshRef,
    count,
    positions,
    colors,
    scales
  }
}

/**
 * Instanced connection lines between neural nodes
 */
export function createInstancedConnections(
  startPositions: THREE.Vector3[],
  endPositions: THREE.Vector3[]
): THREE.InstancedMesh {
  const geometry = new THREE.CylinderGeometry(0.005, 0.005, 1, 6)
  const material = new THREE.MeshBasicMaterial({ 
    color: '#ffffff',
    transparent: true,
    opacity: 0.6
  })

  const connections: THREE.Vector3[] = []
  const rotations: THREE.Euler[] = []
  const scales: THREE.Vector3[] = []

  startPositions.forEach((start) => {
    endPositions.forEach((end) => {
      const direction = end.clone().sub(start)
      const distance = direction.length()
      const midpoint = start.clone().add(direction.multiplyScalar(0.5))
      
      connections.push(midpoint)
      
      // Calculate rotation to align with connection
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        axis, 
        direction.normalize()
      )
      rotations.push(new THREE.Euler().setFromQuaternion(quaternion))
      scales.push(new THREE.Vector3(1, distance, 1))
    })
  })

  return createInstancedMesh(geometry, material, {
    count: connections.length,
    positions: connections,
    rotations,
    scales
  })
}

/**
 * Performance-optimized instanced neural network
 */
export class InstancedNeuralNetwork {
  private nodeMesh: THREE.InstancedMesh
  private connectionMesh: THREE.InstancedMesh | undefined
  private group: THREE.Group

  constructor(
    layers: Array<{ nodeCount: number; position: THREE.Vector3; color: string }>,
    performanceLevel: 'high' | 'medium' | 'low'
  ) {
    this.group = new THREE.Group()

    // Create instanced nodes
    const nodeGeometry = new THREE.SphereGeometry(
      0.08, 
      performanceLevel === 'high' ? 16 : performanceLevel === 'medium' ? 12 : 8,
      performanceLevel === 'high' ? 12 : performanceLevel === 'medium' ? 8 : 6
    )
    
    const nodeMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.2,
      emissiveIntensity: 0.2
    })

    // Calculate all node positions and colors
    const allNodePositions: THREE.Vector3[] = []
    const allNodeColors: THREE.Color[] = []
    
    layers.forEach((layer) => {
      for (let i = 0; i < layer.nodeCount; i++) {
        const angle = (i / layer.nodeCount) * Math.PI * 2
        const radius = 0.8
        
        allNodePositions.push(new THREE.Vector3(
          layer.position.x + Math.cos(angle) * radius,
          layer.position.y + Math.sin(angle) * radius,
          layer.position.z
        ))
        
        allNodeColors.push(new THREE.Color(layer.color))
      }
    })

    // Create instanced node mesh
    this.nodeMesh = createInstancedMesh(nodeGeometry, nodeMaterial, {
      count: allNodePositions.length,
      positions: allNodePositions,
      colors: allNodeColors
    })

    // Create connections if performance allows
    if (performanceLevel !== 'low') {
      const layerPositions = layers.map(layer => {
        const positions: THREE.Vector3[] = []
        for (let i = 0; i < layer.nodeCount; i++) {
          const angle = (i / layer.nodeCount) * Math.PI * 2
          const radius = 0.8
          positions.push(new THREE.Vector3(
            layer.position.x + Math.cos(angle) * radius,
            layer.position.y + Math.sin(angle) * radius,
            layer.position.z
          ))
        }
        return positions
      })

      // Create connections between adjacent layers
      const allConnections: { start: THREE.Vector3; end: THREE.Vector3 }[] = []
      for (let layerIndex = 0; layerIndex < layerPositions.length - 1; layerIndex++) {
        layerPositions[layerIndex].forEach((startPos) => {
          layerPositions[layerIndex + 1].forEach((endPos) => {
            allConnections.push({ start: startPos, end: endPos })
          })
        })
      }

      if (allConnections.length > 0) {
        this.connectionMesh = createInstancedConnections(
          allConnections.map(c => c.start),
          allConnections.map(c => c.end)
        )
        this.group.add(this.connectionMesh)
      }
    }

    this.group.add(this.nodeMesh)
  }

  getGroup(): THREE.Group {
    return this.group
  }

  dispose() {
    this.nodeMesh.dispose()
    this.connectionMesh?.dispose()
  }
}