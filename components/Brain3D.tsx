"use client"

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Html, useProgress, OrbitControls, Float } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { useDevicePerformance, type PerformanceLevel } from '@/hooks/useDevicePerformance'

// Performance configuration for different quality levels
const PERFORMANCE_CONFIG = {
  high: {
    enableEnvironment: true,
    enableShadows: true,
    enablePostProcessing: true,
    lightIntensity: 1,
    envIntensity: 1,
    dpr: [1, 2] as [number, number],
    antialias: true
  },
  medium: {
    enableEnvironment: true,
    enableShadows: false,
    enablePostProcessing: false,
    lightIntensity: 0.8,
    envIntensity: 0.8,
    dpr: [1, 1.5] as [number, number],
    antialias: true
  },
  low: {
    enableEnvironment: false,
    enableShadows: false,
    enablePostProcessing: false,
    lightIntensity: 0.6,
    envIntensity: 0.5,
    dpr: 1,
    antialias: false
  }
}

// Loading progress component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-2" />
        <div className="text-accent font-medium">{Math.round(progress)}% loaded</div>
      </div>
    </Html>
  )
}

// Placeholder ANN geometry (will be replaced with actual model)
function PlaceholderANN({ performanceLevel }: { performanceLevel: PerformanceLevel }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const prefersReducedMotion = useMotionPreference()
  const [hovered, setHovered] = useState(false)

  // Spring animation for hover effect
  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return
    
    const time = state.clock.getElapsedTime()
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1
    
    // Subtle rotation
    meshRef.current.rotation.y = time * 0.2
  })

  // Neural network geometry using nodes and connections
  const networkGeometry = useMemo(() => {
    // Node geometries for different layers
    const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 6)
    const connectionGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 4)
    
    return { nodeGeometry, connectionGeometry }
  }, [])

  // Generate neural network layers
  const networkLayers = useMemo(() => {
    const layers = [
      { nodes: 4, z: -1.5, color: '#ff6b6b' }, // Input layer
      { nodes: 6, z: 0, color: '#4ecdc4' },     // Hidden layer 1
      { nodes: 4, z: 1.5, color: '#45b7d1' }   // Output layer
    ]
    
    const nodes: Array<{ position: [number, number, number]; color: string }> = []
    const connections: Array<{ start: [number, number, number]; end: [number, number, number] }> = []
    
    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.nodes; i++) {
        const angle = (i / layer.nodes) * Math.PI * 2
        const radius = 0.8
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          layer.z
        ]
        nodes.push({ position, color: layer.color })
        
        // Create connections to next layer
        if (layerIndex < layers.length - 1) {
          const nextLayer = layers[layerIndex + 1]
          for (let j = 0; j < nextLayer.nodes; j++) {
            const nextAngle = (j / nextLayer.nodes) * Math.PI * 2
            const nextPosition: [number, number, number] = [
              Math.cos(nextAngle) * radius,
              Math.sin(nextAngle) * radius,
              nextLayer.z
            ]
            connections.push({ start: position, end: nextPosition })
          }
        }
      }
    })
    
    return { nodes, connections }
  }, [])

  return (
    <animated.group 
      ref={meshRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Network nodes */}
      {networkLayers.nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position} geometry={networkGeometry.nodeGeometry}>
          <meshStandardMaterial
            color={hovered ? '#00ffff' : node.color}
            metalness={0.3}
            roughness={0.2}
            emissive={hovered ? '#00ffff' : node.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Network connections */}
      {networkLayers.connections.map((connection, i) => {
        const start = new THREE.Vector3(...connection.start)
        const end = new THREE.Vector3(...connection.end)
        const direction = end.clone().sub(start)
        const length = direction.length()
        const position = start.clone().add(direction.clone().multiplyScalar(0.5))
        
        return (
          <mesh 
            key={`connection-${i}`} 
            position={position.toArray()}
            geometry={networkGeometry.connectionGeometry}
            lookAt={end}
          >
            <meshBasicMaterial 
              color={hovered ? '#00ffff' : '#ffffff'} 
              transparent 
              opacity={hovered ? 0.8 : 0.3}
            />
          </mesh>
        )
      })}
      
      {/* Data flow particles */}
      {Array.from({ length: performanceLevel === 'high' ? 8 : 4 }, (_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3
          ]}>
            <sphereGeometry args={[0.02, 8, 6]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}
    </animated.group>
  )
}

// GLTF ANN model component  
function GLTFANNModel({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const meshRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useMotionPreference()

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return
    
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.y = time * 0.1
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.05
  })

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={2} />
    </group>
  )
}

// ANN model component (will load GLTF when available)
function ANNModel({ path, performanceLevel }: { path?: string; performanceLevel: PerformanceLevel }) {
  if (!path) {
    return <PlaceholderANN performanceLevel={performanceLevel} />
  }

  return <GLTFANNModel path={path} />
}

// Lighting setup
function StudioLighting({ performanceLevel }: { performanceLevel: PerformanceLevel }) {
  const config = PERFORMANCE_CONFIG[performanceLevel]
  
  return (
    <>
      {/* Key light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={config.lightIntensity}
        color="#ffffff"
        castShadow={config.enableShadows}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-3, 2, -1]}
        intensity={config.lightIntensity * 0.3}
        color="#00aaff"
      />
      
      {/* Rim light */}
      <directionalLight
        position={[0, 0, -5]}
        intensity={config.lightIntensity * 0.5}
        color="#0066ff"
      />
      
      {/* Ambient light */}
      <ambientLight intensity={config.lightIntensity * 0.2} color="#1a1a2e" />
    </>
  )
}

// Main 3D scene
function Brain3DScene({ modelPath, performanceLevel }: { modelPath?: string; performanceLevel: PerformanceLevel }) {
  const config = PERFORMANCE_CONFIG[performanceLevel]
  
  return (
    <>
      <StudioLighting performanceLevel={performanceLevel} />
      
      {config.enableEnvironment && (
        <Environment
          preset="studio"
          environmentIntensity={config.envIntensity}
        />
      )}
      
      <Suspense fallback={<Loader />}>
        <ANNModel path={modelPath} performanceLevel={performanceLevel} />
      </Suspense>
      
      {/* Interactive controls for high-performance devices */}
      {performanceLevel === 'high' && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      )}
    </>
  )
}

// Main Brain3D component (renamed from Brain3D to ANN3D)
export function Brain3D({ modelPath }: { modelPath?: string }) {
  const performanceLevel = useDevicePerformance()
  const prefersReducedMotion = useMotionPreference()
  const config = PERFORMANCE_CONFIG[performanceLevel]

  const canvasSettings = useMemo(() => ({
    camera: { position: [0, 0, 4] as [number, number, number], fov: 50 },
    gl: {
      antialias: config.antialias,
      alpha: true,
      powerPreference: 'high-performance' as const
    },
    dpr: prefersReducedMotion ? 1 : config.dpr,
    shadows: config.enableShadows,
    performance: {
      min: performanceLevel === 'low' ? 0.2 : 0.5,
      max: prefersReducedMotion ? 0.8 : 1
    }
  }), [performanceLevel, prefersReducedMotion, config])

  return (
    <div className="w-full h-full">
      <Canvas
        {...canvasSettings}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
      >
        <Brain3DScene modelPath={modelPath} performanceLevel={performanceLevel} />
      </Canvas>
    </div>
  )
}

// Preload function for the brain model
Brain3D.preload = (path: string) => {
  useGLTF.preload(path)
}