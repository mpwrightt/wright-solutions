"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { useDevicePerformance, type PerformanceLevel } from '@/hooks/useDevicePerformance'

// Performance-optimized configuration
const PERFORMANCE_CONFIG = {
  high: {
    nodeCount: 12,
    connectionCount: 15,
    nodeDetail: [8, 6], // widthSegments, heightSegments
    animationSpeed: 1,
    particleCount: 8,
  },
  medium: {
    nodeCount: 8,
    connectionCount: 10,
    nodeDetail: [6, 4],
    animationSpeed: 0.7,
    particleCount: 4,
  },
  low: {
    nodeCount: 6,
    connectionCount: 6,
    nodeDetail: [4, 3],
    animationSpeed: 0.5,
    particleCount: 2,
  }
}

interface NodeData {
  position: [number, number, number]
  scale: number
  color: string
  connections: number[]
}

// Generate optimized neural network structure
function generateNeuralNetwork(performanceLevel: PerformanceLevel): {
  nodes: NodeData[]
  connections: Array<{ start: [number, number, number], end: [number, number, number] }>
} {
  const config = PERFORMANCE_CONFIG[performanceLevel]
  const nodes: NodeData[] = []
  const connections: Array<{ start: [number, number, number], end: [number, number, number] }> = []

  // Create nodes in layers (input, hidden, output)
  const layers = [
    { count: Math.ceil(config.nodeCount * 0.4), z: -2 },
    { count: Math.ceil(config.nodeCount * 0.4), z: 0 },
    { count: Math.ceil(config.nodeCount * 0.2), z: 2 }
  ]

  layers.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.count; i++) {
      const angle = (i / layer.count) * Math.PI * 2
      const radius = 1.5 + layerIndex * 0.3
      
      nodes.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          layer.z
        ],
        scale: 0.8 + Math.random() * 0.4,
        color: layerIndex === 1 ? '#00ffff' : '#0088ff',
        connections: []
      })
    }
  })

  // Create connections between layers
  let connectionCount = 0
  for (let layer = 0; layer < layers.length - 1; layer++) {
    const startLayer = layers.slice(0, layer + 1).reduce((sum, l) => sum + l.count, 0) - layers[layer].count
    const endLayer = layers.slice(0, layer + 2).reduce((sum, l) => sum + l.count, 0) - layers[layer + 1].count
    
    for (let i = 0; i < layers[layer].count && connectionCount < config.connectionCount; i++) {
      for (let j = 0; j < layers[layer + 1].count && connectionCount < config.connectionCount; j++) {
        if (Math.random() > 0.4) { // Not all nodes connected
          connections.push({
            start: nodes[startLayer + i].position,
            end: nodes[endLayer + j].position
          })
          connectionCount++
        }
      }
    }
  }

  return { nodes, connections }
}

// Individual neural node component
function NeuralNode({ 
  position, 
  scale, 
  color, 
  animationSpeed, 
  nodeDetail,
  index 
}: {
  position: [number, number, number]
  scale: number
  color: string
  animationSpeed: number
  nodeDetail: number[]
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const prefersReducedMotion = useMotionPreference()

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return
    
    const time = state.clock.getElapsedTime()
    
    // Subtle floating animation
    meshRef.current.position.y = position[1] + Math.sin(time * animationSpeed + index * 0.5) * 0.05
    
    // Gentle pulsing
    const pulseScale = 1 + Math.sin(time * animationSpeed * 2 + index) * 0.1
    meshRef.current.scale.setScalar(scale * pulseScale)
    
    // Slow rotation
    meshRef.current.rotation.y = time * animationSpeed * 0.2
  })

  return (
    <Sphere
      ref={meshRef}
      position={position}
      scale={scale}
      args={[0.1, nodeDetail[0], nodeDetail[1]]}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.4}
      />
    </Sphere>
  )
}

// Neural connection lines
function NeuralConnections({ 
  connections
}: { 
  connections: Array<{ start: [number, number, number], end: [number, number, number] }>
}) {
  return (
    <group>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#00ffff"
          lineWidth={1}
          opacity={0.4}
          transparent
        />
      ))}
    </group>
  )
}

// Floating data particles
function DataParticles({ 
  count, 
  animationSpeed 
}: { 
  count: number
  animationSpeed: number
}) {
  const particlesRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useMotionPreference()

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 0.5,
      phase: i * 0.5
    }))
  }, [count])

  useFrame((state) => {
    if (!particlesRef.current || prefersReducedMotion) return
    
    const time = state.clock.getElapsedTime()
    
    particlesRef.current.children.forEach((particle, index) => {
      const data = particles[index]
      particle.position.y = data.position[1] + Math.sin(time * data.speed * animationSpeed + data.phase) * 0.3
      particle.position.x = data.position[0] + Math.cos(time * data.speed * animationSpeed * 0.5 + data.phase) * 0.2
    })
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <Sphere
          key={index}
          position={particle.position}
          scale={0.02}
          args={[1, 4, 3]}
        >
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Main 3D Scene component
function Neural3DScene() {
  const performanceLevel = useDevicePerformance()
  const prefersReducedMotion = useMotionPreference()
  
  const { nodes, connections } = useMemo(
    () => generateNeuralNetwork(performanceLevel),
    [performanceLevel]
  )
  
  const config = PERFORMANCE_CONFIG[performanceLevel]
  const animationSpeed = prefersReducedMotion ? 0 : config.animationSpeed

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Key light */}
      <pointLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#00ffff"
      />
      
      {/* Fill light */}
      <pointLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#0088ff"
      />

      {/* Neural nodes */}
      {nodes.map((node, index) => (
        <NeuralNode
          key={index}
          position={node.position}
          scale={node.scale}
          color={node.color}
          animationSpeed={animationSpeed}
          nodeDetail={config.nodeDetail}
          index={index}
        />
      ))}

      {/* Neural connections */}
      <NeuralConnections
        connections={connections}
      />

      {/* Floating data particles */}
      <DataParticles
        count={config.particleCount}
        animationSpeed={animationSpeed}
      />
    </>
  )
}

// Main Neural3D component with Canvas
export function Neural3D() {
  const performanceLevel = useDevicePerformance()
  const prefersReducedMotion = useMotionPreference()

  // Performance settings based on device capability
  const canvasSettings = useMemo(() => {
    const baseSettings = {
      camera: { position: [0, 0, 6] as [number, number, number], fov: 60 },
      gl: { 
        antialias: performanceLevel === 'high',
        alpha: true,
        powerPreference: 'high-performance' as const
      },
      dpr: prefersReducedMotion ? 1 : [1, performanceLevel === 'high' ? 2 : 1.5] as [number, number],
      performance: {
        min: performanceLevel === 'low' ? 0.2 : 0.5,
        max: prefersReducedMotion ? 0.8 : 1
      }
    }

    return baseSettings
  }, [performanceLevel, prefersReducedMotion])

  return (
    <div className="w-full h-full">
      <Canvas
        {...canvasSettings}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
      >
        <Neural3DScene />
      </Canvas>
    </div>
  )
}