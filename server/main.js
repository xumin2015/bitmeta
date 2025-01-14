const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
var io = new Server(server, { cors: true });

const PORT = 6868;
const user = new Set();

const userObj={};

const messageList=[
  {userName:'系统公告',message:'欢迎来到北理工元宇宙世界',msgId:'00000000'}
]

const SocketEvents = {
  OFF: 0,
  MSG: 1,
};

io.on("connection", (socket) => {
  console.log('connection')
  socket.on("disconnect", function () {
    socket.broadcast.emit(SocketEvents.OFF, socket.id);
    // user.delete(socket.id);
    delete userObj[socket.id];
    // userObj.delete(userObj[socket.id])
    console.log('connection-user',user);
    console.log(`玩家断开: ${socket.id} | 当前在线: ${user.size}`);
  });

  // 将收到的信息广播给所有用户
  socket.on(SocketEvents.MSG, function (data) {
   console.log('SocketEvents.MSG',data)
    const curData={...data[0],socketID:socket.id};

    if(curData.type=="position"){
      if (!userObj[socket.id]) connection(socket.id, curData);
      console.log('curData',curData)
      userObj[socket.id]=curData;
      socket.broadcast.emit(SocketEvents.MSG,  curData);

      console.log('position-emit')
    }
    else if(curData.type=="message"){
      messageList.push(curData);
      if(messageList.length>200){
        messageList=messageList.slice(messageList.length-200,messageList.length)
      }
      socket.broadcast.emit(SocketEvents.MSG,  curData);
      console.log('message-emit')
    }
   
  });
});
function connection(socketID, data) {
  // user.add(socketID);
  userObj[socketID]=data
  // userObj.delete(userObj[socket.id])
  console.log('connection-user',user);
  console.log(`玩家连接: ${socketID} | 当前在线: ${user.size}`);
}

app.use(cors());
// 设置响应头 & 跨域允许
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Headers", ["mytoken", "Content-Type"]);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  // res.header("Content-Type", "charset=utf-8");
  next();
});

app.get("/userList",function (req,res) {
  res.send(userObj);

});
app.get("/messageList",function (req,res) {
  res.send(messageList);

});

server.listen(PORT, () => {
  console.log("listening on: localhost:6868");
});
