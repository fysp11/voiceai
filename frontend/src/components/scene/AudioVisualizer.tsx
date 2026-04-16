import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useVoiceAIStore } from '@/store/voiceAI'

function AudioSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const audioLevel = useVoiceAIStore((state) => state.audioLevel)
  const isRecording = useVoiceAIStore((state) => state.isRecording)

  const baseScale = 1
  const maxScale = 1.5

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = baseScale + (maxScale - baseScale) * audioLevel * 2
      const currentScale = meshRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15)
      meshRef.current.scale.set(newScale, newScale, newScale)

      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.002

      if (isRecording) {
        // Use elapsed time for color cycling
        const color = new THREE.Color().setHSL(0.7, 0.8, 0.5)
        ;(meshRef.current.material as THREE.MeshStandardMaterial).emissive = color
        ;(meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.3 + audioLevel * 0.5
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#1a1a2e"
        emissive="#6366f1"
        emissiveIntensity={0.2}
        metalness={0.9}
        roughness={0.1}
        wireframe={false}
      />
    </Sphere>
  )
}

function FloatingRings() {
  const ringRef = useRef<THREE.Mesh>(null)
  const audioLevel = useVoiceAIStore((state) => state.audioLevel)

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003
      const scale = 1 + audioLevel * 0.3
      ringRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[2.2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
    </mesh>
  )
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const audioLevel = useVoiceAIStore((state) => state.audioLevel)

  const { positions, velocities } = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 2

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }

    return { positions, velocities }
  }, [])

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position

      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + velocities[i * 3]
        let y = pos.getY(i) + velocities[i * 3 + 1]
        let z = pos.getZ(i) + velocities[i * 3 + 2]

        const dist = Math.sqrt(x * x + y * y + z * z)
        if (dist > 5 || dist < 2.5) {
          velocities[i * 3] *= -1
          velocities[i * 3 + 1] *= -1
          velocities[i * 3 + 2] *= -1
        }

        pos.setXYZ(i, x, y, z)
      }

      pos.needsUpdate = true

      const scale = 1 + audioLevel * 0.2
      pointsRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#818cf8"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />

      <AudioSphere />
      <FloatingRings />
      <Particles />

      <fog attach="fog" args={['#0a0a0a', 5, 15]} />
    </>
  )
}

export default function AudioVisualizer() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}