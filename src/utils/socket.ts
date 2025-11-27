import { io } from 'socket.io-client';
export const socket = io("wss://web-production-f310.up.railway.app");
//export const socket = io(); //	use the IP address of your machine