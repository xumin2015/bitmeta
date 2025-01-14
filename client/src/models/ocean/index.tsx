import { useMemo, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Water, WaterOptions } from "three/examples/jsm/Addons.js";

extend({ Water });
/**
  * 海洋
  * @param range 水面的范围
  */
export default function Ocean({ range }: { range: number }) {
  const ref = useRef<Water>(null)
  const { scene, gl } = useThree()

  // 水面波纹的法线贴图
  const waterNormals = useTexture("/textures/waters.jpeg")
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geometry = useMemo(() => new THREE.PlaneGeometry(range, range), [range]);
  const options: WaterOptions = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xFFFACD, // 太阳的颜色
      // waterColor: 0x001e0f, // 水的颜色
      waterColor: "skyblue", // 水的颜色
      distortionScale: 3.7,
      fog: !!scene.fog,
      format: gl.toneMapping,
    }),
    [gl.toneMapping, scene.fog, waterNormals]
  );

  useFrame((state, delta) => {
    if (!state || !ref?.current) return;
    ref.current.material.uniforms.time.value += delta;
  });

  return (
    <water
      ref={ref}
      args={[geometry, options]}
      rotation-x={-Math.PI / 2}
      position={[0, -5.5, 0]}
    />
  );
}

