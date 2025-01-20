/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.less";
import { useEffect, useState } from "react";
import { useModels } from "@/stores/models";
import { generateUserId, socket } from "@/utils";
import { SOCKET_ADDRESS, SocketEvents } from "@/config";
import axios from "axios";

// 模型加载时显示的页面

export default function Message() {
  const [message, setMessage] = useState("");
  // const [msglist, setMsglist] = useState([]);
  const userName = useModels((state) => state.userName);

  const gameStart = useModels((state) => state.gameStart);

  const msgList = useModels((state) => state.msgList);
  const update = useModels((state) => state.update);

  // 按键监听
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    toBottom();
  }, [document.getElementById("message-list")]);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    event.stopPropagation();
    event.preventDefault();
  }
  // 按键监听
  useEffect(() => {
    // toBottom();
    if (gameStart) {
      // alert('success')
      socket && initSocketMessage();
    }
  }, [gameStart]);

  // (window as any).initSocketMessage = initSocketMessage;

  function initSocketMessage() {
    axios.get(`${SOCKET_ADDRESS}/messageList`).then((res) => {
      console.log("haha", res);
      if (res.status == 200 && res.data) {
        update({ msgList: res.data });
        // setMsglist(res.data);
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error

    socket.on(SocketEvents.MSG, (data: any) => {
      if (data.type == "message") {
        axios.get(`${SOCKET_ADDRESS}/messageList`).then((res) => {
          console.log("haha", res);
          if (res.status == 200 && res.data) {
            update({ msgList: res.data });
            setTimeout(() => {
              toBottom();
            }, 500);
            // setMsglist(res.data);
          }
        });
      }
    });
  }

  function setMsg(data: any) {
    console.log("SocketEvents.MSG2", msgList, data);
    const curData: any = [...msgList, data];
    console.log("curData", curData);
    update({ msgList: curData });
    // setMsglist(() => {
    //   // 在这里处理状态值的更新
    //   return curData; // 返回新的状态值
    // });
  }

  // // 响应按键事件
  // function handleKeyDown(event: KeyboardEvent) {
  //   if (event.key !== 'Tab') return
  //   event.stopPropagation();
  //   event.preventDefault();

  // }
  // function handleClick(event:any) {

  //   event.stopPropagation();
  //   event.preventDefault();

  // }

  function postMessage() {
    const userParams = { userId: "", userName: userName };
    if (localStorage.userParams) {
      const curParams = JSON.parse(localStorage.userParams);
      if (curParams) userParams.userId = curParams.userId;
    } else {
      userParams.userId = generateUserId();
    }
    userParams.userName = userName;
    localStorage.userParams = JSON.stringify(userParams);

    const messageContent = {
      type: "message",
      id: userParams.userId,
      userName: userParams.userName,
      message: message,
      msgId: generateUserId(),
    };

    // const curData:any=[...msglist,messageContent];
    setMsg(messageContent);

    socket.emit(String(SocketEvents.MSG), [messageContent]);
    setMessage("");
    setTimeout(() => {
      toBottom();
    }, 500);
  }

  function toBottom() {
    const messageDom = document.getElementById("message-list");
    if (messageDom) {
      messageDom.scrollTop = messageDom.scrollHeight;
    }
  }

  function messagechange(event: any) {
    console.log("namechange", event.target.value);
    setMessage(event.target.value);
  }

  return (
    <div className={`message`}>
      <div className="message-list" id="message-list">
        {msgList.map((item: any) => (
          <div key={item.msgId} className="message-item">
            <div className="message-name">{item.userName} :</div>

            <div className="message-content">{item.message}</div>
          </div>
        ))}
      </div>
      <div className="input-view">
        <textarea
          className="input-dom"
          // type="text"
          rows={2}
          onChange={messagechange}
          value={message}
          onKeyDown={(e) => e.key === "Enter" && postMessage()}
          placeholder="发送你想说的话吧~"
        />

        {message && (
          <span className="common-button" onClick={postMessage}>
            发送
          </span>
        )}
        {!message && <span className="disable-button">发送</span>}
      </div>
    </div>
  );
}
