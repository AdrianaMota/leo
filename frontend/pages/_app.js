import { ChakraProvider } from "@chakra-ui/react";
import defaultTheme from "../utils/chakra/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
