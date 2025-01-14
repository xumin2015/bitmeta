import { useAnimations } from "@react-three/drei";
import { useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { useGame } from "ecctrl";

/**
  * 人物动画设置
  * @param animations 动画集合
  * @param animationSet 动画设置（按键对应触发的动画）
  */
export function Animation(props: AnimationProps) {
  const groupRef = useRef(null);
  const { actions } = useAnimations(props.animations, groupRef);

  const curAnimation = useGame((state) => state.curAnimation);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet
  );

  // 初始化动画设置
  useEffect(() => {
    initializeAnimationSet(props.animationSet);
  }, []);

  // 播放动画
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action: any =
      actions[curAnimation ? curAnimation : props.animationSet.idle];
    if (!action) return
    // 某些动画只执行一次
    if (
      curAnimation === props.animationSet.jump ||
      curAnimation === props.animationSet.jumpLand ||
      curAnimation === props.animationSet.action1 ||
      curAnimation === props.animationSet.action2 ||
      curAnimation === props.animationSet.action3 ||
      curAnimation === props.animationSet.action4
    ) {
      action
        .reset()
        .fadeIn(0.2)
        .setLoop(THREE.LoopOnce, 0)
        .play();
      // clamp 处理，动画播放完之后，停止在最后一帧
      action.clampWhenFinished = true;
    } else {
      action.reset().fadeIn(0.2).play();
    }
    // 只执行一次的动画，重置到原始状态
    action._mixer.addEventListener("finished", () => resetAnimation());
    return () => {
      // 退出上一个动作，避免动画重叠
      action.fadeOut(0.2);

      // 去除混合器的监听
      action._mixer.removeEventListener("finished", () =>
        resetAnimation()
      );
      action._mixer._listeners = [];
    };
  }, [curAnimation]);

  return (
    <Suspense fallback={null}>
      <group ref={groupRef} dispose={null} userData={{ camExcludeCollision: true }}>
        {props.children}
      </group>
    </Suspense>
  );
}

export type AnimationProps = {
  animations: THREE.AnimationClip[];
  animationSet: AnimationSet;
  children: React.ReactNode;
};
export type AnimationSet = {
  idle: string;
  walk?: string;
  run?: string;
  jump?: string;
  jumpIdle?: string;
  jumpLand?: string;
  fall?: string;
  // 可以自定义追加动作触发的动画
  action1?: string;
  action2?: string;
  action3?: string;
  action4?: string;
};