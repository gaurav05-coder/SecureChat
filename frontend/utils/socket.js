// Socket.IO client logic
import { io } from 'socket.io-client';
let socket;

// Accepts a callback for received messages
export function initSocket(onMessage) {
  socket = io('http://localhost:4000');
  socket.on('message', (msg) => {
    if (onMessage) onMessage(msg);
  });
  return socket;
}

export function sendMessage(msg) {
  if (socket) {
    socket.emit('message', msg);
  }
}
