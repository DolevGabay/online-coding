const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectToMongo, fetchCodeBlocks } = require('./mongodbOperations');
const config = require('./config');


const port = process.argv[3];

connectToMongo();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontend.url,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: config.frontend.url
}));

let usersCount = 0;

io.on('connection', (socket) => {
  usersCount++;
  const isMentor = usersCount === 1;

  console.log('a user connected, mentor:', isMentor);
  console.log('users count:', usersCount);

  socket.on('load', async (id) => {
    try {
        const codeBlocks = await fetchCodeBlocks();
        const codeBlock = codeBlocks.find(block => block.id === id);
        if (codeBlock) {
          socket.emit('load', { name: codeBlock.name, code: codeBlock.code, isMentor });
        }
      } catch (err) {
        console.error(err.message);
        socket.emit('error', 'Failed to load code block');
      }
  });

  socket.on('update', async (newCode, id) => {
    try {
        const codeBlocks = await fetchCodeBlocks();
        const codeBlock = codeBlocks.find(block => block.id === id);
        if (codeBlock) {
          codeBlock.code = newCode;
          socket.broadcast.emit('update', newCode);
        }
      } catch (err) {
        console.error(err.message);
        socket.emit('error', 'Failed to update code block');
      }
  });

  socket.on('disconnect', () => {
    usersCount--;
    console.log('user disconnected, mentor:', isMentor);
    console.log('users count:', usersCount);
  });
});

server.listen(port, () => {
  console.log(`Worker ${process.pid} started on port ${port}`);
  process.send({ type: 'started', port });
});

