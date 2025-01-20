import { useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { openShadow } from "@/utils";

const PARK_PATH = "./models/concert.glb";
// const ISLAND_PATH = './models/island/SM_Islands_01.gltf'

useGLTF.preload(PARK_PATH);

export default function concert() {
  /*----------------------------变量命名------------------------------*/
  // 加载模型
  const park = useGLTF(PARK_PATH); // 地面

  /*----------------------------生命周期-------------------------------*/
  // dom更新后渲染前
  useLayoutEffect(() => {
    if (!park.scene) return;
    openShadow(park.scene);
  }, [park.scene]);
  // const widthArg=1;
  // const heightArg=1;
  return (
    <group dispose={null}>
      <RigidBody
        name="环境"
        type="fixed"
        scale={0.05}
        rotation={[0, -0.5, 0]}
        colliders="trimesh"
        position={[-3, 8, -14]}
      >
        <primitive size={[10, 10, 10]} object={park.scene} />
        {/* <primitive object={island.scene} /> */}
      </RigidBody>
    </group>
  );
}
