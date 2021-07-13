import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import { generateRandomString } from './utils/random'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

app.use(cors())

// Sever health check
app.get('/ping', (_req, res) => {
  res.send('pong')
})

// Text coming from speech-to-text by room id
const rooms = {}

io.on('connection', socket => {
  console.log(`Socket ${socket.id} has connected`)

  let previousId

  // We only want one connection in a room per user
  const safeJoin = currentId => {
    socket.leave(previousId)
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`),
    )
    previousId = currentId
  }

  socket.on('room:join', roomId => {
    const room = rooms[roomId]
    if (!room) return socket.emit('room:content', { status: 404 })

    safeJoin(roomId)
    // send existing content from room
    socket.emit('room:content', {
      ...room,
      status: 200,
      isOwner: room.owner === socket.id,
    })
  })

  socket.on('room:create', () => {
    const id = generateRandomString()
    const room = { id, owner: socket.id, content: '' }

    rooms[room.id] = room
    socket.emit('room:create', { ...room, status: 200 })
  })

  socket.on('room:editContent', ({ id, content }) => {
    const room = rooms[id]
    if (room.owner !== socket.id) return // only allow owner to edit content

    rooms[id] = { ...room, content }
    socket.to(room.id).emit('room:content', {
      ...room,
      status: 200,
      isOwner: room.owner === socket.id,
    })
  })
})

// Start back-end server
server.listen(3001, () => {
  console.log('listening on *:3001')
})
