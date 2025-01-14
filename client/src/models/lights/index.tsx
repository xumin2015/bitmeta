// import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Lights({ debug = false }) {
  // 添加光源位置与方向的辅助线
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // 在光源被渲染后添加 光照阴影的辅助线
  const { scene } = useThree();
  useEffect(() => {
    if (lightRef.current && lightRef.current.shadow && debug) {
      const shadowCameraHelper = new THREE.CameraHelper(lightRef.current.shadow.camera);
      scene.add(shadowCameraHelper);
    }
  }, [lightRef, scene, debug]);

  return (
    <>
      <directionalLight
        castShadow
        color={'#FFFACD'}
        shadow-normalBias={0.06}
        position={[200, 300, 100]}
        intensity={2}
        shadow-mapSize={[1024 * 2, 1024 * 2]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-top={40}
        shadow-camera-right={40}
        shadow-camera-bottom={-40}
        shadow-camera-left={-40}
        name="followLight"
        ref={lightRef}
        shadow-softness
      />
      <ambientLight intensity={.6} />

      {/* <Environment preset={"city"} /> */}


    </>
  );
}