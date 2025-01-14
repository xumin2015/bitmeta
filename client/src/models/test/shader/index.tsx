import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

export default function WindEffect() {
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame(() => {
    const time = performance.now() / 1000;
    if (!materialRef.current) return;
    materialRef.current.uniforms.time.value = time;
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          void main() {
            // 使用时间和纹理坐标模拟风的效果
            vec3 windColor = vec3(0.2, 0.5, 1.0); // 风的颜色
            float windStrength = 0.5; // 风的强度
            vec2 windOffset = vec2(sin(time * 0.5), cos(time * 0.3)) * windStrength;
            vec2 offsetUv = vUv + windOffset * 0.1;
            vec3 color = mix(vec3(1.0), windColor, length(windOffset)); // 使用 mix 函数实现颜色渐变
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}