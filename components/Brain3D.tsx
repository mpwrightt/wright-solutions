"use client"

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Html, useProgress, OrbitControls, Float } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { useMotionPreference } from '@/hooks/useMotionPreference'
import { useDevicePerformance, type PerformanceLevel } from '@/hooks/useDevicePerformance'
import { use3DPerformanceMonitoring } from '@/hooks/usePerformanceMonitoring'
import { InstancedNeuralNetwork } from '@/utils/instancedGeometry'
import { ProceduralBrain3D } from './ProceduralBrain3D'

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

// Optimized Placeholder ANN using instanced geometry
function PlaceholderANN({ performanceLevel }: { performanceLevel: PerformanceLevel }) {
  const groupRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useMotionPreference()
  const [hovered, setHovered] = useState(false)
  const performanceMonitoring = use3DPerformanceMonitoring()

  // Spring animation for hover effect
  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  // Create instanced neural network
  const instancedNetwork = useMemo(() => {
    const layers = [
      { nodeCount: 4, position: new THREE.Vector3(0, 0, -1.5), color: '#ff6b6b' },
      { nodeCount: 6, position: new THREE.Vector3(0, 0, 0), color: '#4ecdc4' },
      { nodeCount: 4, position: new THREE.Vector3(0, 0, 1.5), color: '#45b7d1' }
    ]

    return new InstancedNeuralNetwork(layers, performanceLevel)
  }, [performanceLevel])

  useFrame((state) => {
    if (!groupRef.current || prefersReducedMotion) return
    
    performanceMonitoring.measureRenderTime(() => {
      const time = state.clock.getElapsedTime()
      
      // Gentle floating animation
      groupRef.current!.position.y = Math.sin(time * 0.5) * 0.1
      
      // Subtle rotation
      groupRef.current!.rotation.y = time * 0.2
    })

    // Track performance metrics
    const complexity = performanceLevel === 'high' ? 100 : performanceLevel === 'medium' ? 50 : 25
    performanceMonitoring.updateSceneMetrics(complexity, 1, 0)
    performanceMonitoring.trackGPUOperation(1, complexity * 10)
  })

  return (
    <animated.group 
      ref={groupRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={instancedNetwork.getGroup()} />
      
      {/* Data flow particles - only for high performance */}
      {performanceLevel === 'high' && Array.from({ length: 4 }, (_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3
          ]}>
            <sphereGeometry args={[0.02, 8, 6]} />
            <meshBasicMaterial 
              color={hovered ? '#00ffff' : '#ffffff'} 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        </Float>
      ))}
    </animated.group>
  )
}

// GLTF ANN model component  
function GLTFANNModel({ path }: { path: string; performanceLevel: PerformanceLevel }) {
  const meshRef = useRef<THREE.Group>(null)
  const prefersReducedMotion = useMotionPreference()
  const performanceMonitoring = use3DPerformanceMonitoring()
  
  // Load GLTF model
  const { scene: originalScene } = useGLTF(path)

  // Optimize GLTF model
  const optimizedScene = useMemo(() => {
    // For now, just return the original scene
    // Model optimization can be applied separately if needed
    return originalScene
  }, [originalScene])

  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return
    
    // Track performance
    performanceMonitoring.measureRenderTime(() => {
      const time = state.clock.getElapsedTime()
      meshRef.current!.rotation.y = time * 0.1
      meshRef.current!.position.y = Math.sin(time * 0.5) * 0.05
    })

    // Track GPU operations
    performanceMonitoring.trackGPUOperation(1, 5000) // Estimate for GLTF model
  })

  return (
    <group ref={meshRef}>
      <primitive object={optimizedScene} scale={2} />
    </group>
  )
}

// ANN model component with smart fallback
function ANNModel({ path, performanceLevel }: { path?: string; performanceLevel: PerformanceLevel }) {
  // Check if model file exists, fallback to procedural if not
  if (!path) {
    return <ProceduralBrain3D performanceLevel={performanceLevel} />
  }

  // Use error boundary to catch GLTF loading failures
  return (
    <Suspense fallback={<PlaceholderANN performanceLevel={performanceLevel} />}>
      <GLTFModelWithFallback path={path} performanceLevel={performanceLevel} />
    </Suspense>
  )
}

// GLTF wrapper with procedural fallback
function GLTFModelWithFallback({ path, performanceLevel }: { path: string; performanceLevel: PerformanceLevel }) {
  try {
    return <GLTFANNModel path={path} performanceLevel={performanceLevel} />
  } catch {
    console.warn('GLTF model failed to load, using procedural neural network')
    return <ProceduralBrain3D performanceLevel={performanceLevel} />
  }
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
  
  // Temporarily disable GLTF model until it's downloaded
  // Use procedural neural network instead
  const fallbackMode = !modelPath || modelPath === '/models/ann-model.glb'

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
        <Brain3DScene 
          modelPath={fallbackMode ? undefined : modelPath} 
          performanceLevel={performanceLevel} 
        />
      </Canvas>
    </div>
  )
}

// Preload function for the brain model
Brain3D.preload = (path: string) => {
  useGLTF.preload(path)
}