import { AUDIOS } from "@/config";
import { PositionalAudio } from "@react-three/drei";


/**
 * 环境音
 * @param debug 显示音源的覆盖范围
 */
export default function Ambiance({ debug = false }) {
  console.log('Ambiance',debug)
  return (
    <group>
      {/* 沙滩海浪声 */}
      <mesh position={[61, -4, 70]}>
        {debug && (
          <>
            <sphereGeometry args={[30, 64, 64]} />
            <meshStandardMaterial transparent opacity={0.5} />
          </>
        )}
        {/* <PositionalAudio url={AUDIOS.beach} distance={30} autoplay loop /> */}
      </mesh>
      <mesh position={[42, -4, -15]}>
        {debug && (
          <>
            <sphereGeometry args={[10, 64, 64]} />
            <meshStandardMaterial transparent opacity={0.5} />
          </>
        )}
        {/* <PositionalAudio url={AUDIOS.beach} distance={10} autoplay loop /> */}
      </mesh>
      <mesh position={[-25, 0, -120]}>
        {debug && (
          <>
            <sphereGeometry args={[30, 64, 64]} />
            <meshStandardMaterial transparent opacity={0.5} />
          </>
        )}
        {/* <PositionalAudio url={AUDIOS.beach} distance={30} autoplay loop /> */}
      </mesh>
      {/* 森林鸟叫声 */}
      <mesh position={[0, 5, 3]}>
        {debug && (
          <>
            <sphereGeometry args={[20, 64, 64]} />
            <meshStandardMaterial transparent opacity={0.5} />
          </>
        )}
        {/* <PositionalAudio url={AUDIOS.forest} distance={2} autoplay loop /> */}
      </mesh>
    </group>
  );
}
