import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

/**
 * 云层
 * @param num 云朵的数量
 */
export default function CloudLayer({ num = 30 }: { num?: number }) {
  return (
    <Clouds
      material={THREE.MeshLambertMaterial}
      limit={200}
      range={200}
      texture="./textures/cloud.png"
    >
      <Cloud
        position={[0, 150, 0]}
        bounds={[250, 1, 250]}
        concentrate="outside"
        growth={100}
        opacity={1.25}
        volume={50}
        segments={num}
      />
    </Clouds>
  );
}
