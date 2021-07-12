import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(cors());

// Sever health check
app.get('/ping', (_req, res) => {
  res.send('pong');
});

// Text coming from speech-to-text by room id
const rooms = {};

io.on('connection', socket => {
  console.log(`Socket ${socket.id} has connected`);

  let previousId;

  // We only want one connection in a room per user
  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`),
    );
    previousId = currentId;
  };

  socket.on('join', roomId => {
    safeJoin(roomId);
    // send existing content from room
    socket.emit('content', rooms[roomId]);
  });

  socket.on('createRoom', room => {
    rooms[room.id] = room;
    safeJoin(room.id);
    socket.emit('content', room);
  });

  socket.on('editRoomContent', room => {
    rooms[room.id] = room;
    socket.to(room.id).emit('content', room);
  });
});

// Start back-end server
server.listen(3001, () => {
  console.log('listening on *:3001');
});
