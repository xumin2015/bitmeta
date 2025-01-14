import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, KeyboardControls, Preload, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import * as THREE from "three";

import Lights from "./lights";
import Floor from "./floor";
import Player from "./player";
import Ambiance from "./ambiance";
import Ocean from "./ocean";
import CloudLayer from "./cloudLayer";
import { DEBUG } from "@/config";
import Others from "./others";
import { useModels } from "@/stores/models";

// 按键映射
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
  { name: "jump", keys: ["Space"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];
export default function Models() {
  // 游戏开始后启动物理引擎
  const gameStart = useModels((state) => state.gameStart);

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{
        fov: 65,
        near: 0.1,
        far: 1000,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      onPointerDown={(e) => {
        e.pointerType === "mouse" &&
          (e.target as HTMLCanvasElement).requestPointerLock();
      }}
    >
      <Suspense fallback={null}>
        <Lights />
        <Ambiance />
        <Sky distance={500} sunPosition={[200, 300, 100]} />
        <fog attach="fog" args={[0xfff0ea, 1, 200]} />
        <Ocean range={500} />
        <CloudLayer />

        <Physics debug={DEBUG} timeStep="vary" paused={!gameStart}>
          <KeyboardControls map={keyboardMap}>
            <Player />
          </KeyboardControls>
          <Floor />
          <Others />
        </Physics>
        {DEBUG && <Perf position="top-left" />}
        <axesHelper args={[155]} />
      </Suspense>
      <Preload />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
