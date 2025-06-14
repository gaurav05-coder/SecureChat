import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

export const messages = writable([]);
export const user = writable(null);
export const chatRoomId = writable('main');

let socket;

export function connectSocket(userId) {
  socket = io('http://localhost:4000');
  socket.emit('join', { chatRoomId: 'main', userId });

  socket.on('message', (msg) => {
    messages.update((m) => [...m, msg]);
  });
}

export function sendMessage(msg) {
  if (socket) {
    socket.emit('message', msg);
  }
}
