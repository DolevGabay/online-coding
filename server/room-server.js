const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectToMongo, fetchCodeBlock } = require('./mongodbOperations');
const config = require('./config-back');

const port = process.argv[3]; // Port is passed as an argument from the "fork" call in server.js

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
        const codeBlock = await fetchCodeBlock(id);
        if (codeBlock) {
          socket.emit('load', { name: codeBlock.name, code: codeBlock.code, solution : codeBlock.solution , isMentor });
        }
      } catch (err) {
        console.error(err.message);
        socket.emit('error', 'Failed to load code block');
      }
  });

  socket.on('update', async (newCode, id) => {
    try {
        const codeBlock = await fetchCodeBlock(id);
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
    if (usersCount === 0) {
      console.log(`No users left, shutting down server on port ${port}`);
      io.close(() => {
        server.close(() => {
          process.send({ type: 'closed', port });
          process.exit(0);
        });
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Worker ${process.pid} started on port ${port}`);
  process.send({ type: 'started', port });
});
