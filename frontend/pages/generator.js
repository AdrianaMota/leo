import { useEffect, useState } from 'react'
import { Button, VStack, Heading, Stack, HStack } from '@chakra-ui/react'
import Link from 'next/link'

import { useSocket } from '../utils/socket'
import Copy from '../components/Copy'
import Navigation from '../components/Navigation'

export default function Generator() {
  const socket = useSocket()
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    socket.emit('room:create')
    socket.on('room:create', data => {
      setRoomId(data.code)
    })
  }, [socket])

  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Navigation />
      <VStack justifyContent="center" flex="0.8">
        <Heading
          as="h2"
          fontSize={{ base: 'm', lg: 'l' }}
          fontFamily="main"
          fontWeight="regular"
        >
          Copie el código para invitar estudiantes a la sala.
        </Heading>
        <VStack paddingTop="5rem" alignItems="center">
          <HStack>
            <Heading
              as="h1"
              fontSize="xl"
              color="primaryYellow.500"
              marginRight="1rem"
              id="1"
            >
              {roomId ? roomId : 'Cargando...'}
            </Heading>
            <Copy code={roomId} size={'l'} color={'primaryYellow.500'} />
          </HStack>
        </VStack>
        <Stack padding="5rem 0" direction={['column', 'row']}>
          <Link href={`/transcribe?roomId=${roomId}`} passHref>
            <Button
              isDisabled={!roomId}
              marginRight={{ base: '0', lg: '2rem' }}
              colorScheme="primaryBlue"
            >
              Ir a la sala
            </Button>
          </Link>
        </Stack>
      </VStack>
    </VStack>
  )
}

Generator.auth = true
