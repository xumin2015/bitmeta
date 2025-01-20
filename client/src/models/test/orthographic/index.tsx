import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import Lights from "../../lights";
import Floor from "../../floor";
import Ambiance from "../../ambiance";
import Ocean from "../../ocean";

export default function Orthographic() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      orthographic
      camera={{
        position: [0, 50, 0],
        up: [0, 1, 0],
      }}
    >
      <OrbitControls enableRotate={false} />
      {/* <axesHelper args={[155]} position={[0, 10, 0]} /> */}

      <Lights />
      <Ambiance />
      <Sky distance={500} sunPosition={[200, 300, 100]} />
      <Ocean range={500} />
      <Physics timeStep="vary">
        <Floor />
      </Physics>
    </Canvas>
  );
}
