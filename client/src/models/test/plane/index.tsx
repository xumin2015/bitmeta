import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function TestPlane() {
  // 加载模型
  const roughPlane = useGLTF("./models/roughPlane.glb");

  useEffect(() => {
    // 接受阴影
    roughPlane.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.receiveShadow = true;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh" >
        <primitive object={roughPlane.scene} position={[10, -1.2, 10]} />
        <mesh receiveShadow position={[0, -3.5, 0]}>
          <boxGeometry args={[300, 5, 300]} />
          <meshStandardMaterial color="lightblue" />
        </mesh>
      </RigidBody>
    </group>

  );
}