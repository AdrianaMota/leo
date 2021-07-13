import { useEffect, useState } from 'react'
import { Button, VStack, Heading, Stack, HStack } from '@chakra-ui/react'
import Link from 'next/link'

import { useSocket } from '../utils/common/socket'
import Copy from '../components/Copy'
import Logo from '../components/Logo'

export default function Home() {
  const socket = useSocket()
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    socket.emit('room:create')
    socket.on('room:create', data => {
      setRoomId(data.id)
    })
  }, [socket])

  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Logo />
      <VStack justifyContent="center" flex="0.8">
        <Heading as="h2" fontSize="l" fontFamily="main" fontWeight="regular">
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
              {Boolean(roomId) ? roomId : 'Cargando...'}
            </Heading>
            <Copy code={roomId} />
          </HStack>
        </VStack>
        <Stack padding="5rem 0" direction={['column', 'row']}>
          <Link href={`/transcribe?roomId=${roomId}`} passHref>
            <Button
              isDisabled={!roomId}
              marginRight={{ base: '0', lg: '2rem' }}
              colorScheme="blue"
            >
              Ir a la sala
            </Button>
          </Link>
        </Stack>
      </VStack>
    </VStack>
  )
}
