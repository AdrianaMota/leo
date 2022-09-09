import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import socketioJwt from 'socketio-jwt'

import { generateRandomString } from './utils/random'
import isAuth from './middlewares/isAuth'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
const prisma = new PrismaClient()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Sever health check
app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.post('/auth/login', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  })

  if (user) {
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    )

    if (isValidPassword) {
      // eslint-disable-next-line no-unused-vars
      const { password, ...userWithoutPassword } = user

      return res.status(200).json({ user: userWithoutPassword })
    }
  }

  if (!user) {
    return res.status(401).json({ message: 'user not found.' })
  }

  return res.status(401).json({ message: 'wrong credentials' })
})

app.get('/classes', isAuth, async (req, res) => {
  const { sub } = req.token

  const classes = await prisma.class.findMany({
    where: {
      OR: [
        {
          users: {
            some: {
              id: {
                equals: Number(sub),
              },
            },
          },
        },
        {
          admins: {
            some: {
              id: {
                equals: Number(sub),
              },
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  res.status(200).json({ classes })
})

app.patch('/classes/:code', isAuth, async (req, res) => {
  const { sub, roles } = req.token
  const { code } = req.params
  const { roomName } = req.body

  const classToUpdate = await prisma.class.findUnique({
    where: {
      code,
    },
    include: {
      admins: true,
    },
  })

  if (
    !classToUpdate.admins.find(admin => admin.id === Number(sub)) &&
    !roles.includes('Admin')
  ) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const updatedClass = await prisma.class.update({
    where: {
      code,
    },
    data: {
      name: roomName,
    },
  })

  res.status(200).json(updatedClass)
})

// Error handler
app.use(function(err, _req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  console.error(err)
  res.status(500)
  res.json({ message: 'Unexpected Error.' })
})

io.use(
  socketioJwt.authorize({
    secret: JSON.parse(process.env.JWT_PUBLIC_KEY).k,
    handshake: true,
  }),
)

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

  socket.on('room:join', async roomId => {
    const { sub } = socket.decoded_token
    const room = await prisma.class.findUnique({
      where: {
        code: roomId,
      },
      include: {
        admins: true,
        users: true,
      },
    })

    if (!room) return socket.emit('room:content', { status: 404 })

    const isOwner = !!room.admins.find(admin => admin.id === Number(sub))
    const userInRoom = !!room.users.find(user => user.id === Number(sub))

    if (!isOwner && !userInRoom) {
      await prisma.class.update({
        where: {
          code: roomId,
        },
        data: {
          users: {
            connect: {
              id: Number(sub),
            },
          },
        },
      })
    }

    safeJoin(roomId)
    // send existing content from room
    socket.emit('room:content', {
      ...room,
      status: 200,
      isOwner,
    })
  })

  socket.on('room:create', async () => {
    const { sub, roles } = socket.decoded_token

    // only admin or teacher can create room
    if (!roles.includes('Teacher') && !roles.includes('Admin')) {
      return console.error('Only an super admin or teacher can create the room')
    }

    const code = generateRandomString()
    const creator = await prisma.user.findUnique({
      where: {
        id: Number(sub),
      },
    })

    const room = await prisma.class.create({
      data: {
        code,
        name: `Clase ${code}`,
        content: '',
        admins: {
          connect: {
            id: Number(sub),
          },
        },
        university: {
          connect: {
            id: creator.universityId,
          },
        },
      },
    })

    socket.emit('room:create', { ...room, status: 200 })
  })

  socket.on('room:edit', async ({ id, content, name }) => {
    const { sub, roles } = socket.decoded_token
    const room = await prisma.class.findUnique({
      where: {
        code: id,
      },
      include: {
        admins: true,
      },
    })

    if (!room) {
      console.error('Room not found')
      return socket.emit('room:content', { status: 404 })
    }

    // only allow owner and admin to edit content
    if (
      !!room.admins.find(admin => admin.id !== Number(sub)) &&
      !roles.includes('Admin')
    ) {
      return console.error('Only an super admin or teacher can edit the room')
    }

    const updatedRoom = await prisma.class.update({
      where: {
        code: id,
      },
      data: {
        name,
        content,
      },
    })

    socket.broadcast.to(room.code).emit('room:content', {
      ...updatedRoom,
      status: 200,
    })
  })
})

// Start back-end server
server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`)
})

server.on('close', async () => {
  await prisma.$disconnect()
})
