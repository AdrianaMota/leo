import io from 'socket.io-client';
import { createContext } from '@chakra-ui/react-utils';

export const socket = io('localhost:3001');

export const [SocketProvider, useSocket] = createContext({
  name: 'Socket Provider',
});
