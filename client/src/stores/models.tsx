import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export const useModels = /* @__PURE__ */ create(
  /* @__PURE__ */ subscribeWithSelector<ModelsState>((set) => {
  return {
    gameStart: false,
    userName:'',
    msgList:[],
    playerPos: undefined,
    players: new Map(),
    update: (payload: Partial<ModelsState>) => {
      set((state) => {
        return { ...state, ...payload };
      });
    }
  };
})
);

type ModelsState = {
  gameStart: boolean,
  userName:'',
  msgList:[],
  playerPos: THREE.Vector3 | undefined;
  players: Map<string, DataMsg>;
  update: (payload: Partial<ModelsState>) => void;
};

export type DataMsg = {
  pos: THREE.Vector3;
  sex:string
  // vel: THREE.Vector3;
};
