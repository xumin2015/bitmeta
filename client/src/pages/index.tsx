import Loading from "./loading";
import Hub from "./hub";
import Joystick from "./joystick";
import Message from "./message";
import { div } from "three/examples/jsm/nodes/Nodes.js";

export default function Pages() {
  return (
    <div>
      <Message />
      <div
        style={{
          position: "absolute",
          inset: "0",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 9,
        }}
      >
        <Loading />
        <Joystick />
        <Hub />
      </div>
    </div>
  );
}
