import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useUser = /* @__PURE__ */ create(
  /* @__PURE__ */ subscribeWithSelector<ModelsState>((set) => {
  return {
    user: { name: "test", avatar: "" },
    update: (payload: Partial<ModelsState>) => {
      set((state) => {
        return { ...state, ...payload };
      });
    }
  };
})
);

type ModelsState = {
  user: User,
  update: (payload: Partial<ModelsState>) => void;
};
type User = {
  name: string,
  avatar: string
}
