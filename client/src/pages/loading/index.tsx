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
  const [selectedOption, setSelectedOption] = useState("men");

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
      update({ gameStart: true, userName: name });
    }, 500);
  }

  function namechange(event: any) {
    console.log("namechange", event.target.value);
    setName(event.target.value);
  }

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    show && (
      <div className={`loading`}>
        {/* <div>{progress.toFixed()}%</div>
        <div className="tubeBox">
          <div className="tube" style={{ width: `${progress}%` }}></div>
        </div> */}
        <div>
          <input
            onChange={namechange}
            value={name}
            className="nameinput"
            type="text"
          />
          {/* <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              width: "200px",
              textIndent: "20px",
            }}
          >
            <label>
              <input
                type="radio"
                value="men"
                checked={selectedOption === "men"}
                onChange={handleOptionChange}
              />{" "}
              男生
            </label>
            <label>
              <input
                type="radio"
                value="women"
                checked={selectedOption === "women"}
                onChange={handleOptionChange}
              />{" "}
              女生
            </label>
          </div> */}
        </div>

        {name && (
          <div className="start" onClick={start}>
            {isLoad ? "开始" : "加载中..."}
          </div>
        )}

        {!name && (
          <div className="start disable">
            {isLoad ? "请输入您的昵称" : "加载中..."}
          </div>
        )}
        <div>{progress.toFixed()}%</div>
        <div className="tubeBox">
          <div className="tube" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    )
  );
}
