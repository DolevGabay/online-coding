const express = require('express');
const http = require('http');
const { fork } = require('child_process');
const cors = require('cors');
const { connectToMongo, fetchCodeBlocks } = require('./mongodbOperations');
const config = require('./config');

const app = express();
const server = http.createServer(app);

const workers = {};
const roomPorts = {};

app.use(express.json());
app.use(cors({ origin: config.frontend.url }));

connectToMongo();

app.post('/create-room', (req, res) => {
  console.log('Creating room');
  const { roomId } = req.body;
  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }
  
  if (workers[roomId]) {
    // Room already exists, return the existing port
    return res.json({ roomId, port: roomPorts[roomId]});
  }

  const port = 3000 + parseInt(roomId);
  const worker = fork('room-server.js', [roomId, port]);
  workers[roomId] = worker;
  roomPorts[roomId] = port;

  worker.on('message', (message) => {
    if (message.type === 'started') {
      res.json({ roomId, port: message.port });
    }
  });
});

app.get('/rooms', (req, res) => {
  res.json(Object.keys(workers));
});

app.get('/code-blocks', async (req, res) => {
    try {
      const codeBlocks = await fetchCodeBlocks();
      res.json(codeBlocks);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

server.listen(config.backend.port, () => {
  console.log(`Master server listening on port ${config.backend.port}`);
});