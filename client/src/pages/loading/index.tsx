/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.less";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useModels } from "@/stores/models";

const total = 1;
// 模型加载时显示的页面
export default function Loading() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isLoad, setLoad] = useState(false);

  const [name, setName] = useState();

  const update = useModels((state) => state.update);

  useEffect(() => {
    console.log("progress", progress);
    if (progress >= 100) {
      setCurrent((prev) => prev + 1);
    }
  }, [progress]);

  useEffect(() => {
    if (current >= total) {
      setLoad(true);
      setTimeout(() => {
        setLoad(true);
      }, 300);
    }
  }, [current]);

  function start() {
    if (!isLoad) return;
    const canvas = document.querySelector("canvas");
    canvas?.requestPointerLock();
    setShow(false);
    //  (window as any).initSocketEvent();
    setTimeout(() => {
      update({ gameStart: true ,userName:name});
    }, 500);
  }

  function namechange(event: any) {
    console.log("namechange", event.target.value);
    setName(event.target.value);
  }

  return (
    show && (
      <div className={`loading`}>
        <div>{progress.toFixed()}%</div>
        <div className="tubeBox">
          <div className="tube" style={{ width: `${progress}%` }}></div>
        </div>
        <div>
          <input
            onChange={namechange}
            value={name}
            className="nameinput"
            type="text"
            
          />
        </div>

        {name && (
          <div className="start" onClick={start}>
            {isLoad ? "开始" : "loading..."}
          </div>
        )}

        {!name && <div className="start disable">{isLoad ? "请输入昵称" : "loading..."}</div>}
      </div>
    )
  );
}
