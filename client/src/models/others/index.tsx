/* eslint-disable @typescript-eslint/no-explicit-any */
import { SOCKET_ADDRESS, SocketEvents } from "@/config";
import { useModels } from "@/stores/models";
import { socket } from "@/utils";
import { useEffect, useState } from "react";
import * as THREE from "three";
import Actor from "./actor";

import axios from "axios"




export default function Others() {
  const players = useModels((state) => state.players);
  const [refresh, setFresh] = useState(false);
  const gameStart = useModels((state) => state.gameStart);
  useEffect(() => {
    // alert(gameStart)
    gameStart&&socket && initSocketEvent();
    
    // (window as any).initSocketEvent=initSocketEvent;
  }, [gameStart]);
  useEffect(() => {
    if (!refresh) return;
    setFresh(false);
  }, [refresh]);


  function setPlayer(data:any){
    const id = data.socketID;
    if(id===socket.id){
      return;
    }
    if (players.has(id)) {
        
      const player = players.get(id);

      console.log("id:更新位置",player);
      if (!player) return;
      player.pos = new THREE.Vector3(...data.position);
      // setFresh(true);
      // player.vel = new THREE.Vector3(...data[1])
   
    } else {
      console.log("新成员:", id);
      console.log('players0----',players)
     
      players.set(id, {
        pos: new THREE.Vector3(...data.position),
        // vel: new THREE.Vector3(...data[1])
      });
      const player = players.get(id);
      if(player){
        // data.position=[0.001, 5.510, 0.027]
        player.pos = new THREE.Vector3(...data.position);

      }
       
      console.log('players1---',players,player)
      console.log('refresh',refresh)
      setFresh(true);
    }
  }
  
  function initSocketEvent() {
    console.log('socket',socket.id);
    axios.get(`${SOCKET_ADDRESS}/userList`).then(res=>{
      console.log('haha',res);
      if(res.status==200&&res.data){
        for(const key in res.data){
          setPlayer(res.data[key]);
        }
      }
    })
  
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    socket.on(SocketEvents.MSG, (data: Array) => {
      console.log('SocketEvents.MSG',data)
      // const id = data.socketID;

      if(data.type=="position"){
        setPlayer(data);
      }
      
      
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    socket.on(SocketEvents.OFF, (id) => {
      console.log("离线成员", id);
     
      players.delete(id);
      console.log('players',players,refresh)
      setFresh(true);
    });
  }
  console.log('players--222',players)
  return [...players.keys()].map((vo) => <Actor key={vo} id={vo} />);
}
