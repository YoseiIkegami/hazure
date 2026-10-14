import { Environment, OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Howl } from "howler";
import { useEffect, useMemo, useState } from "react";

import { items, pickItem, type MachineItem } from "./items";

const soundData = "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAgICAgICAgICAgICAgICA";

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

function Can({ item, serial }: { item: MachineItem; serial: number }) {
  return <RigidBody key={serial} colliders="hull" restitution={0.45} friction={0.7} position={[0, 3.3, 0]} angularVelocity={[2, 1, 4]}>
    <group rotation={[0.1, 0, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.48, 0.48, 1.25, 32]} /><meshStandardMaterial color={item.color} roughness={0.32} metalness={0.35} /></mesh>
      <Text position={[0, 0, 0.49]} rotation={[0, 0, 0]} fontSize={0.14} maxWidth={0.75} color="#17172a" anchorX="center" anchorY="middle">{item.label}</Text>
    </group>
  </RigidBody>;
}

function Scene({ item, serial }: { item: MachineItem; serial: number }) {
  return <Canvas shadows camera={{ position: [0, 1.6, 8], fov: 42 }} dpr={[1, 1.5]}>
    <color attach="background" args={["#121326"]} />
    <ambientLight intensity={1.5} />
    <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow />
    <Physics gravity={[0, -12, 0]}>
      <RigidBody type="fixed"><mesh receiveShadow position={[0, -1.3, 0]}><boxGeometry args={[8, 0.3, 3]} /><meshStandardMaterial color="#34355b" /></mesh></RigidBody>
      <RigidBody type="fixed"><mesh position={[0, 0.7, -0.8]} castShadow><boxGeometry args={[4.3, 4.4, 0.35]} /><meshStandardMaterial color="#25264a" metalness={0.35} roughness={0.3} /></mesh></RigidBody>
      <RigidBody type="fixed"><mesh position={[0, -0.48, 0.32]}><boxGeometry args={[3.4, 0.45, 1.1]} /><meshStandardMaterial color="#090a19" /></mesh></RigidBody>
      <RigidBody type="fixed"><mesh position={[0, -0.58, 0.95]}><boxGeometry args={[2.2, 0.14, 0.25]} /><meshStandardMaterial emissive="#f8efbc" emissiveIntensity={1} color="#5a573d" /></mesh></RigidBody>
      <Can item={item} serial={serial} />
    </Physics>
    <Text position={[0, 2.7, -0.58]} fontSize={0.55} letterSpacing={0.13} color="#f8efbc">HAZURE</Text>
    <Text position={[0, 2.2, -0.58]} fontSize={0.15} color="#b8b7d8">NOTHING FOR SALE</Text>
    <Environment preset="city" />
    <OrbitControls enablePan={false} minDistance={6} maxDistance={10} maxPolarAngle={Math.PI / 2.1} />
  </Canvas>;
}

function MachineControls({ onVend, muted, onMute }: { onVend: (index: number) => void; muted: boolean; onMute: () => void }) {
  return <div className="controls">
    <div className="lights" aria-hidden="true"><i /><i /><i /></div>
    <p>何も買えません。何かは出ます。</p>
    <div className="buttons">{items.slice(0, 4).map((item, index) => <button key={item.label} type="button" className="vend" onClick={() => onVend(index)}><span style={{ background: item.color }} /><b>{String(index + 1).padStart(2, "0")}</b><small>{index === 3 ? "夜の隙間" : "押してみる"}</small></button>)}</div>
    <button className="mute" type="button" onClick={onMute}>{muted ? "音を出す" : "音を止める"}</button>
  </div>;
}

export default function App() {
  const [webgl] = useState(supportsWebGl);
  const [item, setItem] = useState<MachineItem>(() => pickItem(0));
  const [serial, setSerial] = useState(0);
  const [muted, setMuted] = useState(true);
  const [message, setMessage] = useState("取り出し口は、まだ空です。");
  const plunk = useMemo(() => new Howl({ src: [soundData], volume: 0.35, preload: true }), []);

  useEffect(() => () => { plunk.unload(); }, [plunk]);

  function vend(index: number) {
    const next = pickItem(index + serial + 1);
    setItem(next);
    setSerial((value) => value + 1);
    setMessage(`取り出し口に「${next.label}」。${next.note}`);
    if (!muted) plunk.play();
  }

  return <main>
    <a className="back" href="https://www.ikg-systems.com/#experiments">← IKG Systems の実験へ</a>
    <header><p>USELESS VENDING MACHINE / 01</p><h1>HAZURE</h1><span>何も売っていない自動販売機</span></header>
    <section className="machine" aria-label="HAZURE 自動販売機">
      {webgl ? <div className="scene"><Scene item={item} serial={serial} /></div> : <div className="fallback" aria-label="自動販売機の低負荷版"><div className="fallback-logo">HAZURE</div><div className="fallback-window" style={{ background: item.color }}>{item.label}</div><div className="fallback-slot">取り出し口</div></div>}
      <MachineControls onVend={vend} muted={muted} onMute={() => setMuted((value) => !value)} />
    </section>
    <section className="receipt" aria-live="polite"><p>取り出し口</p><strong>{message}</strong></section>
    <p className="foot">売り切れはありません。登録・保存もありません。{webgl ? "缶をドラッグして眺められます。" : "低負荷表示で稼働中です。"}</p>
  </main>;
}
