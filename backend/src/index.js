import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// SQLite setup
let db;
(async () => {
  db = await open({
    filename: './db.sqlite',
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    publicKey TEXT NOT NULL,
    role TEXT NOT NULL
  );`);
  await db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    senderId TEXT NOT NULL,
    chatRoomId TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    selfDestructAt INTEGER,
    fileUrl TEXT
  );`);
  // Self-destruct cleanup: delete expired messages every minute
  setInterval(async () => {
    const now = Date.now();
    await db.run('DELETE FROM messages WHERE selfDestructAt IS NOT NULL AND selfDestructAt < ?', now);
  }, 60 * 1000);
})();

// REST endpoint: get user profile
app.get('/api/user/:id', async (req, res) => {
  const user = await db.get('SELECT * FROM users WHERE id = ?', req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// REST endpoint: register user
app.post('/api/user', async (req, res) => {
  const { id, username, publicKey, role } = req.body;
  try {
    await db.run('INSERT INTO users (id, username, publicKey, role) VALUES (?, ?, ?, ?)', id, username, publicKey, role);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// REST endpoint: get messages for chat room
app.get('/api/messages/:chatRoomId', async (req, res) => {
  const messages = await db.all('SELECT * FROM messages WHERE chatRoomId = ? ORDER BY timestamp ASC', req.params.chatRoomId);
  res.json(messages);
});

// WebSocket: real-time messaging
io.on('connection', (socket) => {
  socket.on('join', ({ chatRoomId, userId }) => {
    socket.join(chatRoomId);
  });

  socket.on('message', async (msg) => {
    // msg: { id, senderId, chatRoomId, content, timestamp, selfDestructAt, fileUrl }
    await db.run(
      'INSERT INTO messages (id, senderId, chatRoomId, content, timestamp, selfDestructAt, fileUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      msg.id, msg.senderId, msg.chatRoomId, msg.content, msg.timestamp, msg.selfDestructAt, msg.fileUrl
    );
    io.to(msg.chatRoomId).emit('message', msg);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
