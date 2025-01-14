import { useEffect, useState } from "react";
import "./index.less";
import { useModels } from "@/stores/models";
import { useThrottle } from "@/utils";

let timer: number | undefined
export default function MiniMap() {
  const [showMap, setShowMap] = useState(false);
  const [style, setStyle] = useState({ top: '50%', left: '50%' });
  const playerPos = useModels((state) => state.playerPos);

  // 按键监听
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    updatePosition();
    return () => {
      clearTimeout(timer);
    };
  }, [playerPos]);

  // 定时更新位置
  function updatePosition() {
    if (!playerPos) return;
    const { x, z } = playerPos;
    setStyle(convertToPercentage(x, z))
    timer = setTimeout(() => {
      updatePosition();
    }, 1000);
  }

  // 响应事件应用节流函数
  const checkMap = useThrottle(() => { setShowMap((showMap) => !showMap); }, 300)

  // 响应按键事件
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    event.stopPropagation();
    event.preventDefault();
    checkMap();
  }

  // 坐标转换为以左上角为原点的百分比
  function convertToPercentage(x = 0, y = 0, boxWidth = 310, boxHeight = 310) {
    // 将原始坐标移动到盒子的左上角作为新的原点
    const newX = x + boxWidth / 2;
    const newY = y + boxHeight / 2;
    // 将坐标值转换为百分比
    const leftPercent = (newX / boxWidth) * 100;
    const topPercent = (newY / boxHeight) * 100;
    return { top: `${topPercent}%`, left: `${leftPercent}%` };
  }

  return (
    <div className={showMap ? "miniMap active" : "miniMap"} onClick={checkMap}>
      <div className="map">
        <img src="/img/map1.jpg" />
        <div className="player" style={style}>
          <div className="point" />
        </div>
      </div>
    </div>
  );
}
