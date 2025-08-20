"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useMotionPreference } from '@/hooks/useMotionPreference'

interface ProceduralBrain3DProps {
  performanceLevel: 'high' | 'medium' | 'low'
}

// Procedural neural network component that doesn't require external models
export function ProceduralBrain3D({ performanceLevel }: ProceduralBrain3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useMotionPreference()

  // Performance-based node count
  const nodeCount = performanceLevel === 'high' ? 20 : performanceLevel === 'medium' ? 12 : 8

  // Generate neural network structure
  const networkData = useMemo(() => {
    const nodes: Array<{ position: [number, number, number]; size: number; layer: number }> = []
    const connections: Array<{ from: number; to: number; strength: number }> = []

    // Create layered structure (input -> hidden -> output)
    const layers = [
      Math.floor(nodeCount * 0.3), // Input layer
      Math.floor(nodeCount * 0.5), // Hidden layer  
      Math.floor(nodeCount * 0.2)  // Output layer
    ]

    layers.forEach((layerSize, layerIndex) => {
      const layerX = (layerIndex - 1) * 2 // Reduced spacing
      
      for (let i = 0; i < layerSize; i++) {
        const angle = (i / layerSize) * Math.PI * 2
        const radius = 1 + Math.random() * 0.5 // Smaller radius
        
        nodes.push({
          position: [
            layerX + (Math.random() - 0.5) * 0.3,
            Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3,
            Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3
          ],
          size: 0.05 + Math.random() * 0.03, // Smaller nodes
          layer: layerIndex
        })
      }
    })

    // Create connections between layers
    let fromIndex = 0
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const fromCount = layers[layer]
      const toCount = layers[layer + 1]
      
      for (let from = 0; from < fromCount; from++) {
        for (let to = 0; to < toCount; to++) {
          if (Math.random() < 0.6) { // 60% connection probability
            connections.push({
              from: fromIndex + from,
              to: fromIndex + fromCount + to,
              strength: Math.random()
            })
          }
        }
      }
      fromIndex += fromCount
    }

    return { nodes, connections }
  }, [nodeCount])

  // Animation spring
  const { rotation } = useSpring({
    rotation: prefersReducedMotion ? [0, 0, 0] : [0, Math.PI * 2, 0],
    config: { duration: 20000 },
    loop: !prefersReducedMotion
  })

  // Frame-based animation
  useFrame((state) => {
    if (!prefersReducedMotion && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <animated.group ref={groupRef} rotation={rotation as unknown as [number, number, number]}>
      {/* Test mesh to ensure rendering works */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Neural Network Nodes */}
      {networkData.nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={node.position}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={
              node.layer === 0 ? '#007bff' : // Input layer - blue
              node.layer === 1 ? '#00b4d8' : // Hidden layer - cyan
              '#0077b6' // Output layer - darker blue
            }
            emissive={
              node.layer === 0 ? '#001133' :
              node.layer === 1 ? '#001a1f' :
              '#001122'
            }
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* Neural Network Connections */}
      {performanceLevel !== 'low' && networkData.connections.map((connection, index) => {
        const fromNode = networkData.nodes[connection.from]
        const toNode = networkData.nodes[connection.to]
        
        if (!fromNode || !toNode) return null

        const distance = Math.sqrt(
          Math.pow(toNode.position[0] - fromNode.position[0], 2) +
          Math.pow(toNode.position[1] - fromNode.position[1], 2) +
          Math.pow(toNode.position[2] - fromNode.position[2], 2)
        )

        const midPoint: [number, number, number] = [
          (fromNode.position[0] + toNode.position[0]) / 2,
          (fromNode.position[1] + toNode.position[1]) / 2,
          (fromNode.position[2] + toNode.position[2]) / 2
        ]

        return (
          <mesh 
            key={`connection-${index}`}
            position={midPoint}
            lookAt={toNode.position}
          >
            <cylinderGeometry args={[0.005, 0.005, distance, 6]} />
            <meshBasicMaterial
              color="#007bff"
              opacity={0.3 + connection.strength * 0.4}
              transparent
            />
          </mesh>
        )
      })}

      {/* Central processing core */}
      {performanceLevel === 'high' && (
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.3, 2]} />
          <meshStandardMaterial
            color="#00b4d8"
            emissive="#001133"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      )}

      {/* Floating data particles */}
      {!prefersReducedMotion && performanceLevel !== 'low' && (
        <ParticleSystem count={performanceLevel === 'high' ? 50 : 20} />
      )}
    </animated.group>
  )
}

// Animated particle system for enhanced visual appeal
function ParticleSystem({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 10
      ],
      speed: 0.01 + Math.random() * 0.02,
      offset: Math.random() * Math.PI * 2
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return

    const temp = new THREE.Object3D()
    
    particles.forEach((particle, i) => {
      const time = state.clock.elapsedTime * particle.speed + particle.offset
      
      temp.position.set(
        particle.position[0] + Math.sin(time) * 0.5,
        particle.position[1] + Math.cos(time * 0.7) * 0.5,
        particle.position[2] + Math.sin(time * 0.5) * 0.5
      )
      
      temp.updateMatrix()
      meshRef.current!.setMatrixAt(i, temp.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#00b4d8" opacity={0.6} transparent />
    </instancedMesh>
  )
}