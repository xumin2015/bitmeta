import { useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { openShadow } from "@/utils";


const LAND_PATH = './models/land/SM_Landscape_MG01.gltf'
const ISLAND_PATH = './models/island/SM_Islands_01.gltf'

useGLTF.preload(ISLAND_PATH);

export default function Floor() {
  /*----------------------------变量命名------------------------------*/
  // 加载模型
  const land = useGLTF(LAND_PATH); // 地面
  const island = useGLTF(ISLAND_PATH); // 岛屿建筑
  /*----------------------------生命周期-------------------------------*/
  // dom更新后渲染前
  useLayoutEffect(() => {
    if (!island.scene || !land.scene) return
    openShadow(land.scene);
    openShadow(island.scene);
  }, [island.scene, land.scene]);

  return (
    <group dispose={null}>
      <RigidBody
        name="环境"
        type="fixed"
        colliders="trimesh"
        position={[-20, -10, 80]}
      >
        <primitive object={land.scene} />
        <primitive object={island.scene} />
      </RigidBody>
    </group>
  );
}


