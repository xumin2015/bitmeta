/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />
import { ReactThreeFiber } from "@react-three/fiber";
import { Water } from "three/examples/jsm/Addons.js";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: ReactThreeFiber.Object3DNode<Water, typeof Water>;
    }
  }
}


interface Window {
  // 添加你需要的属性和方法
  myCustomProperty: any;
  myCustomFunction: () => void;
}
 
declare let window: Window;

export {};
