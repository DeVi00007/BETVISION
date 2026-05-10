import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ==========================================
   PLASMA CRYSTAL BALL — Sportfogadási varázsgömb
   - Kristálygömb középen belső plazma fényekkel
   - Tesla coil stílusú elektromos ívek
   - Lebegő odds/adat részecskék
   - Elektromos kék + narancssárga fényvilág
   ========================================== */

/* ---- PLASMA CRYSTAL BALL ---- */
function PlasmaCrystalBall() {
  const ballRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_state, delta) => {
    if (!ballRef.current) return;
    ballRef.current.rotation.y += delta * 0.3;
    const targetX = mouseRef.current.y * 0.1;
    const targetZ = -mouseRef.current.x * 0.1;
    ballRef.current.rotation.x += (targetX - ballRef.current.rotation.x) * 0.05;
    ballRef.current.rotation.z += (targetZ - ballRef.current.rotation.z) * 0.05;

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group ref={ballRef} position={[0, 0.5, 0]}>
      {/* Outer glass sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#0B2D4D"
          roughness={0.05}
          metalness={0.9}
          transmission={0.3}
          thickness={1.5}
          emissive="#003D66"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Inner plasma glow */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Wireframe cage around ball */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(2.3, 2)]} />
        <lineBasicMaterial color="#00D4FF" transparent opacity={0.15} />
      </lineSegments>
      {/* Tesla arc ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.015, 8, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.3, 0.5]}>
        <torusGeometry args={[3.2, 0.01, 8, 48]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ---- TESLA ARCS (elektromos ívek) ---- */
function TeslaArcs() {
  const arcsRef = useRef<THREE.Group>(null);

  const arcs = useMemo(() => {
    const lines: { points: THREE.Vector3[]; color: string }[] = [];
    for (let a = 0; a < 8; a++) {
      const angle = (Math.PI * 2 * a) / 8;
      const pts: THREE.Vector3[] = [];
      const startR = 2.3;
      const endR = 4.5;
      const segs = 20;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const r = startR + (endR - startR) * t;
        const jitter = Math.sin(t * Math.PI * 6 + a) * 0.3 * (1 - t);
        pts.push(new THREE.Vector3(
          Math.cos(angle + jitter * 0.5) * r,
          (Math.random() - 0.5) * 0.5 * t + 0.5,
          Math.sin(angle + jitter * 0.5) * r
        ));
      }
      lines.push({ points: pts, color: a % 2 === 0 ? '#00D4FF' : '#F59E0B' });
    }
    return lines;
  }, []);

  useFrame((state) => {
    if (!arcsRef.current) return;
    arcsRef.current.children.forEach((child, i) => {
      const line = child as THREE.Line;
      if (line.geometry) {
        const pos = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < pos.length / 3; j++) {
          const t = j / (pos.length / 3);
          pos[j * 3 + 1] += Math.sin(state.clock.elapsedTime * 8 + i + j) * 0.005 * t;
        }
        line.geometry.attributes.position.needsUpdate = true;
      }
    });
  });

  const arcObjects = arcs.map((arc) => {
    const geom = new THREE.BufferGeometry().setFromPoints(arc.points);
    return { geom, color: arc.color };
  });

  return (
    <group ref={arcsRef}>
      {arcObjects.map((arc, i) => (
        <primitive key={i} object={new THREE.Line(arc.geom, new THREE.LineBasicMaterial({ color: arc.color, transparent: true, opacity: 0.4 }))} />
      ))}
    </group>
  );
}

/* ---- ELECTRIC GRID (Tesla coil alap) ---- */
function ElectricGrid() {
  return (
    <group position={[0, -3.5, 0]}>
      <gridHelper args={[30, 30, '#00D4FF', '#0A2744']} position={[0, 0, 0]} />
      <gridHelper args={[30, 60, '#F59E0B', '#0A1A30']} position={[0, -0.05, 0]} />
      {/* Center energy spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.4} />
      </mesh>
      {/* Outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3, 3.05, 64]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ---- FLOATING DATA PARTICLES ---- */
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const count = 80;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = Math.random() * 15 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      spd[i] = 0.3 + Math.random() * 0.6;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < posArray.length / 3; i++) {
      posArray[i * 3 + 1] += speeds[i] * delta;
      if (posArray[i * 3 + 1] > 12) {
        posArray[i * 3 + 1] = -4;
        posArray[i * 3] = (Math.random() - 0.5) * 25;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#00D4FF" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ---- FLOATING ODDS CARDS ---- */
function FloatingCardGroup() {
  const cards = [
    { pos: [-5, 2.5, -1] as [number, number, number], delay: 0, color: '#00D4FF' },
    { pos: [5, 2, -2] as [number, number, number], delay: 2, color: '#F59E0B' },
    { pos: [-4, -0.5, 2] as [number, number, number], delay: 4, color: '#00D4FF' },
    { pos: [4, -1, 1] as [number, number, number], delay: 1, color: '#F59E0B' },
    { pos: [0, 4, -3] as [number, number, number], delay: 3, color: '#00D4FF' },
    { pos: [-6, 0.5, -3] as [number, number, number], delay: 5, color: '#F59E0B' },
  ];

  return (
    <>
      {cards.map((card, i) => (
        <FloatingOddsCard key={i} {...card} />
      ))}
    </>
  );
}

function FloatingOddsCard({ pos, delay, color }: {
  pos: [number, number, number];
  delay: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.set(
      pos[0],
      pos[1] + Math.sin(t * 0.7) * 0.25,
      pos[2]
    );
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.8, 1.0, 0.05]} />
        <meshStandardMaterial
          color="#0D1B2A"
          roughness={0.5}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.06}
        />
      </mesh>
      <mesh position={[0, 0.49, 0.01]}>
        <boxGeometry args={[1.8, 0.02, 0.06]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.49, 0.01]}>
        <boxGeometry args={[1.8, 0.02, 0.06]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* ---- MAIN SCENE ---- */
export default function WireframeStadium() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#38BDF8" />
      <pointLight position={[0, 4, 0]} intensity={1.0} color="#00D4FF" distance={15} />
      <pointLight position={[-5, 2, 3]} intensity={0.4} color="#F59E0B" distance={12} />

      <PlasmaCrystalBall />
      <TeslaArcs />
      <ElectricGrid />
      <FloatingCardGroup />
      <FloatingParticles />

      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.9} radius={0.5} />
      </EffectComposer>
    </>
  );
}
