import { useMemo, useEffect, useState, useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { CapsuleCollider, RapierRigidBody, RigidBody, quat } from "@react-three/rapier";
import { SkeletonUtils } from "three-stdlib";
import { PATH,PATH0, PATH1,PLAYER_STATUS } from "@/config";
import { useModels } from "@/stores/models";
import * as THREE from "three";

useGLTF.preload(PATH);
const Actor = memo(({ id }: { id: string }) => {


  const players = useModels(state => state.players)
  // const curPlayer = players.get(id);
  // /*----------------------------变量命名------------------------------*/
  // // 加载模型
  // const resultPath=curPlayer?.sex=='1'?PATH1:PATH0;
  const { scene, animations } = useGLTF(PATH);
  // 克隆网格
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  // 获取动画
  const { ref, actions, names } = useAnimations(animations, clone);

  const [status, setStatus] = useState(PLAYER_STATUS.idle); // 玩家状态
  const playerRef = useRef<RapierRigidBody>(null) //  玩家所在刚体


  const lastPos = useRef(new THREE.Vector3());

  /*----------------------------生命周期-------------------------------*/
  // 运动状态
  useEffect(() => {
    switch (status) {
      
      case PLAYER_STATUS.run:
        // console.log('useEffect-status-run',names,actions[names[0]], actions[names[1]]);
        actions[PLAYER_STATUS.idle]?.fadeOut(0.2);
        actions[PLAYER_STATUS.run]?.reset().fadeIn(0.2).play();
        break;
      case PLAYER_STATUS.walk:
        console.log('useEffect-status-walk');
        actions[PLAYER_STATUS.idle]?.fadeOut(0.2);
        actions[PLAYER_STATUS.run]?.reset().fadeIn(0.2).play();
        break;
      default:
        console.log('useEffect-status-default');
        actions[PLAYER_STATUS.run]?.fadeOut(0.2);
        actions[PLAYER_STATUS.idle]?.reset().fadeIn(0.2).play();
        break;
    }
  }, [status]);

  useFrame(() => {
    //   if (!playerRef?.current) return;
    // const player = players.get(id);
    // if (!player) return;
    // const { pos } = player;
    // playerRef.current.setTranslation(pos, false);

    // console.log('actors',playerRef?.current,players.get(id))
    const player = players.get(id);

    if(!playerRef?.current||!player){
      console.log('actors3',playerRef?.current,players.get(id))
    }
    if (!playerRef?.current) return;
   
    if (!player) return;

    
    const { pos } = player;
    // if (pos.x == lastPos.current.x && pos.z == lastPos.current.z) return setStatus(PLAYER_STATUS.idle)

    const direction = new THREE.Vector3().subVectors(pos, lastPos.current);  // 计算方向向量
    playerRef.current.setTranslation(pos, false);

    // 记录位置
    lastPos.current.copy(pos)

    // 如果方向向量的 x 或 z 分量不为 0，表示玩家在移动
    if ((direction.x) != 0 || (direction.z) != 0) {
      setStatus(PLAYER_STATUS.run);  // 更新状态为 'run'
      if (direction.lengthSq() > 0.001) rotation(direction)
    } else {
      setStatus(PLAYER_STATUS.idle);  // 更新状态为 'idle'
    }
  });

  /*----------------------------辅助函数-------------------------------*/
  // 人物旋转
  function rotation(velocity: THREE.Vector3) {
    if (!playerRef?.current) return;
    const angle = Math.atan2(velocity.x, velocity.z);  // 计算角色需要旋转的角度
    // 应用旋转角度
    const newRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    playerRef.current.setRotation(newRotation, false);
  }

  /*----------------------------模型渲染-------------------------------*/
  return (
    <group dispose={null}>
      <RigidBody
        ref={playerRef}
        colliders={false}
        enabledRotations={[false, false, false]}
      >
        <primitive ref={ref} object={clone} position={[0, -1, 0]} />
        <CapsuleCollider args={[0.6, 0.3]} position={[0, -0.1, 0]} />
      </RigidBody>
    </group>
  );
})
export default Actor