import { PositionalAudio, useGLTF } from "@react-three/drei";
import Ecctrl, { useGame } from "ecctrl";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Animation, AnimationSet } from "../animation";
import { openShadow, socket, toFixed, generateUserId } from "@/utils";
import { useFrame, useThree } from "@react-three/fiber";
import { useModels } from "@/stores/models";
import { AUDIOS, DEBUG, MULTI, PATH, SocketEvents } from "@/config";
import { RapierRigidBody } from "@react-three/rapier";

useGLTF.preload(PATH);

const baseFixedNum = 3;
const lastPos = new THREE.Vector3();
export default function Player() {
  const { scene, animations } = useGLTF(PATH);
  const playRef = useRef<THREE.Object3D | undefined>(null); // 玩家模型引用
  const rigidRef = useRef<RapierRigidBody>(null); //  玩家所在刚体
  const bgmRef = useRef<THREE.PositionalAudio>(null); // bgm音频
  const stepsRef = useRef<THREE.PositionalAudio>(null); // 脚步音频


  const gameStart = useModels((state) => state.gameStart);
  const userName = useModels((state) => state.userName);

  // 当前状态
  const curAnimation = useGame((state) => state.curAnimation);
  // 重命名动画
  const animationSet: AnimationSet = {
    idle: "idle",
    walk: "run",
    run: "walk",
    action1: "agree",
    action2: "headShake",
    action3: "sad_pose",
    action4: "sneak_pose",
  };

  // 将音频监听器添加到玩家身上
  useEffect(() => {
    if (!playRef?.current || !bgmRef?.current) return;
    const playerObject = playRef.current;
    const bgmObj = bgmRef.current;
    playerObject.add(bgmObj.listener);
    return () => {
      playerObject.remove(bgmObj.listener);
    };
  }, []);

  // 存储玩家的位置
  const player = useThree((state) => state.scene).getObjectByName("player");
  const update = useModels((state) => state.update);

  useEffect(() => {
    // console.log('player-effect',player?.position)
    // // player?.position?.x=0.1;

    player && update({ playerPos: player?.position });
  }, [player]);

  useLayoutEffect(() => {
    scene && openShadow(scene);
  }, [scene]);

  // 当播放walk动画时播放脚步声
  useEffect(() => {
    if (curAnimation == animationSet.walk) {
      stepsRef.current?.play();
    } else {
      stepsRef.current?.stop();
    }
  }, [curAnimation]);

  useFrame(() => {
    // console.log('useFrame')
    // player && update({ playerPos: curPosition });
    // console.log('gameStart',gameStart)
    // if(!gameStart)
    if (!MULTI || !rigidRef?.current||!gameStart) {
      return;
    }

    const pos = rigidRef.current!.translation();

    if (pos.z == 0 && pos.x == 0) {
      const curNumber = Math.random() * 3;
      const curPos = new THREE.Vector3(curNumber, pos.y, curNumber);
      rigidRef.current!.setTranslation(curPos, true);
      return;
    }

    // if (pos.x.toFixed(8) == lastPos.x.toFixed(8) && pos.z.toFixed(8) == lastPos.z.toFixed(8)&& pos.y.toFixed(8) == lastPos.y.toFixed(8)){
    //   // const curPosition=new THREE.Vector3(0.1,2,3);
    //   // player && update({ playerPos: curPosition });
    //   return;
    // }
    // if (pos.x == lastPos.x && pos.z== lastPos.z){
    //   // const curPosition=new THREE.Vector3(0.1,2,3);
    //   // player && update({ playerPos: curPosition });
    //   return;
    // }
    // console.log('useFrame',pos,lastPos)
    if (
      pos.x.toFixed(baseFixedNum) == lastPos.x.toFixed(baseFixedNum) &&
      pos.z.toFixed(baseFixedNum) == lastPos.z.toFixed(baseFixedNum) &&
      pos.y.toFixed(baseFixedNum) == lastPos.y.toFixed(baseFixedNum)
    ) {
      // const curPosition=new THREE.Vector3(0.1,2,3);
      // player && update({ playerPos: curPosition });
      return;
    }

    console.log("useFrame-others", { ...pos }, { lastPos });
    lastPos.copy(pos);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore

    const userParams = { userId: "",userName:userName };
    if (localStorage.userParams) {
      const curParams = JSON.parse(localStorage.userParams);
      if (curParams) userParams.userId = curParams.userId;
    } else {
      userParams.userId = generateUserId();
    }
    userParams.userName=userName;
    localStorage.userParams = JSON.stringify(userParams);

    const message = {
      type: "position",
      id: userParams.userId,
      userName:userParams.userName,
      position: [toFixed(pos.x), toFixed(pos.y), toFixed(pos.z)],
    };

    socket.emit(String(SocketEvents.MSG), [message]);
    console.log('emit23232')
  });

  const aaa = 0;

  return (
    <Ecctrl
      // debug={DEBUG}
      animated
      followLight
      autoBalance={false}
      position={[aaa, 8, aaa]}
      floatHeight={0.01}
      capsuleRadius={0.3}
      capsuleHalfHeight={0.5}
      camCollision={false} // 相机碰撞检测
      camMaxDis={DEBUG ? -1500 : -10} // 相机缩放的极限距离
      camZoomSpeed={DEBUG ? 10 : 4} // 相机缩放速度
      maxVelLimit={DEBUG ? 5 : 3} // 人物移动速度
      jumpVel={5} // 跳跃速度
      dragDampingC={0.5} // 运动阻力（摩檫力、空气阻力）系数
      name="player"
      ref={rigidRef}
    >
      <Suspense fallback={<capsuleGeometry args={[0.3, 1]} />}>
        <Animation animations={animations} animationSet={animationSet}>
          <primitive
            ref={playRef}
            castShadow
            object={scene}
            position={[aaa, -0.8, aaa]}
          />
        </Animation>
      </Suspense>

      {/* <PositionalAudio
        ref={bgmRef}
        url={AUDIOS.song}
        distance={1}
        autoplay
        loop
      /> */}
      <PositionalAudio ref={stepsRef} url={AUDIOS.steps} distance={1} loop />
    </Ecctrl>
  );
}
