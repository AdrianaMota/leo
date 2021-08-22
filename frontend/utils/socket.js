import io from 'socket.io-client'
import { createContext } from '@chakra-ui/react-utils'

export const getSocket = token => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    extraHeaders: { Authorization: `Bearer ${token}` },
  })
}

export const [SocketProvider, useSocket] = createContext({
  name: 'Socket Provider',
})
