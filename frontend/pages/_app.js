import { useEffect, useRef, useState } from 'react'
import { ChakraProvider, Spinner } from '@chakra-ui/react'
import { Provider, signIn, useSession } from 'next-auth/client'
import { QueryClient, QueryClientProvider } from 'react-query'

import defaultTheme from '../utils/chakra/theme'
import { SocketProvider, getSocket } from '../utils/socket'

import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/700.css'
import '@fontsource/merriweather/900.css'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'

import 'regenerator-runtime/runtime'

function MyApp({ Component, pageProps }) {
  return (
    <AppProviders pageProps={pageProps}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </AppProviders>
  )
}

const Auth = ({ children }) => {
  const [session, isLoading] = useSession()
  const isUser = !!session?.user

  useEffect(() => {
    if (isLoading) return
    if (!isUser) signIn()
  }, [isUser, isLoading])

  if (isUser) {
    return <AuthenticatedSocketProvider>{children}</AuthenticatedSocketProvider>
  }

  return (
    <Spinner color="primaryBlue.500" size="xl">
      Loading...
    </Spinner>
  )
}

const AuthenticatedSocketProvider = ({ children }) => {
  const socket = useRef()
  const [session] = useSession()

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    if (session?.accessToken && !socket.current) {
      socket.current = getSocket(session?.accessToken)
      setLoading(false)
    }
  }, [session?.accessToken])

  if (isLoading) {
    return (
      <Spinner color="primaryBlue.500" size="xl">
        Loading...
      </Spinner>
    )
  }

  return <SocketProvider value={socket.current}>{children}</SocketProvider>
}

const queryClient = new QueryClient()

const AppProviders = ({ children, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider session={pageProps.session}>
        <ChakraProvider theme={defaultTheme}>{children}</ChakraProvider>
      </Provider>
    </QueryClientProvider>
  )
}

export default MyApp
