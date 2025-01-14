import { useEffect, useState } from "react";
import { EcctrlJoystick } from "ecctrl";

export default function Joystick() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);
  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
  }, []);
  return isTouchScreen && <EcctrlJoystick buttonNumber={5} />;
}
