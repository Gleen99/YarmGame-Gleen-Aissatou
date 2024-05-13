import React from "react";
import { Platform } from 'react-native';
import io from "socket.io-client";

console.log('Emulation OS Platform: ', Platform.OS);
// Also usable : "http://10.0.2.2:3000"
<<<<<<< HEAD
export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : "http://192.168.1.64:3000";
=======
export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : "http://172.20.10.2:3000";
>>>>>>> 1dca791134075e4a38946f58fd18a28782181e23

export const socket = io(socketEndpoint, {
  transports: ["websocket"],
});;

export let hasConnection = false;

socket.on("connect", () => {
  console.log("connect: ", socket.id);
  hasConnection = true;
});

socket.on("disconnect", () => {
  hasConnection = false;
  console.log("disconnected from server"); // undefined
  socket.removeAllListeners();
});

export const SocketContext = React.createContext();