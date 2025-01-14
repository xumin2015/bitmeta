import { useCallback } from "react";
import * as THREE from "three";
import createSocket from "socket.io-client";
import { SOCKET_ADDRESS, MULTI } from "@/config";

/**
 * 处理浮点数
 * 参数：
 * num: 待处理数字
 * digit: 保留小数位，默认3
 */
export function toFixed(num: number, digit = 3) {
  const scale = 10 ** digit;
  return Math.floor(num * scale) / scale;
}

/**
 * 为模型的网格启用阴影
 * 参数：
 * scene: 模型的根节点
 */
export function openShadow(scene: THREE.Group<THREE.Object3DEventMap>) {
  scene.traverse(
    (obj) =>
      obj instanceof THREE.Mesh && (obj.receiveShadow = obj.castShadow = true)
  );
}

/**
 * 获取随机整数
 * 参数：
 * min: 随机范围起始数
 * max: 随机范围结束数
 */
export const randInt = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random()) + min;

/**
 * 节流函数
 */
export const useThrottle = (fn: MyFunction, delay: number): MyFunction => {
  let click = false;
  return useCallback(function (this: unknown, ...args: unknown[]) {
    if (click) return;
    click = true;
    fn.apply(this, args);
    setTimeout(() => {
      click = false;
    }, delay);
  }, []);
};
type MyFunction = (...args: unknown[]) => void;


export function generateUserId() {
  return String(new Date().getTime()+randInt(0,1000))
}

/**
 * socket通信
 */
export const socket = MULTI && (() => createSocket(SOCKET_ADDRESS))();
