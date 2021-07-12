import { ChakraProvider } from '@chakra-ui/react';
import defaultTheme from '../utils/chakra/theme';
import socket, { SocketProvider } from '../utils/common/socket';
import '../styles/globals.css';

import 'regenerator-runtime/runtime';

function MyApp({ Component, pageProps }) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}

const AppProviders = ({ children }) => {
  return (
    <ChakraProvider theme={defaultTheme}>
      <SocketProvider value={socket}>{children}</SocketProvider>
    </ChakraProvider>
  );
};

export default MyApp;
