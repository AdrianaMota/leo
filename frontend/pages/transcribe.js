import { useState, useEffect, useRef, useMemo } from 'react'
import {
  VStack,
  Textarea,
  HStack,
  InputGroup,
  Input,
  InputLeftAddon,
  InputRightAddon,
  IconButton,
  Text,
  Icon,
  Skeleton,
  Heading,
  Button,
} from '@chakra-ui/react'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { throttle } from 'throttle-debounce'

import Logo from '../components/Logo'
import ClientOnly from '../components/ClientOnly'
import { useSocket } from '../utils/common/socket'
import Copy from '../components/Copy'

export default function Transcribe() {
  const {
    transcript,
    listening: isListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const socket = useSocket()
  const router = useRouter()
  const { roomId } = router.query

  const socketRef = useRef(socket)

  const [fontSize, setFontSize] = useState(70)
  const [content, setContent] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [isInRoom, setIsInRoom] = useState(false)

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    if (roomId && !isInRoom) socketRef.current.emit('room:join', roomId)
  }, [isInRoom, roomId])

  useEffect(() => {
    socketRef.current.on('room:content', room => {
      if (room.status === 404) return router.push('/') // redirect to main page if room is not found
      if (!isInRoom) setIsInRoom(true)

      // console.log('received data from room: ', room, socket.id)
      setContent(room.content)
      setIsOwner(room.owner === socket.id)
    })
  }, [socket, roomId, router, isInRoom])

  const sendContentToRoom = useMemo(
    () =>
      throttle(500, (roomId, content) => {
        socketRef.current.emit('room:editContent', {
          id: roomId,
          content,
        })
      }),
    [],
  )

  useEffect(() => {
    if (isOwner) {
      sendContentToRoom(roomId, transcript)
      setContent(transcript)
    }
  }, [content, isOwner, roomId, sendContentToRoom, socket, transcript])

  const handleFontSizeChange = event => {
    setFontSize(event.target.value)
  }

  const increaseFontSize = () => {
    setFontSize(Number(fontSize) + 1)
  }

  const decreaseFontSize = () => {
    setFontSize(fontSize > 0 ? Number(fontSize) - 1 : Number(fontSize))
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'es-DO' })
  }

  const autoScroll = () => {
    input.scrollTop = input.scrollHeight
  }

  const handleDownloadClick = event => {
    const element = document.createElement('a')
    const file = new Blob([document.getElementById('input').value], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'Transcripción.txt'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
      spacing="12"
    >
      <HStack alignItems="center" justifyContent="space-between" width="full">
        <Logo />

        <HStack paddingTop="1rem">
          <Heading as="h3" fontSize="m" color="white" id="1">
            {Boolean(roomId) ? roomId : 'Cargando...'}
          </Heading>
          <Copy code={roomId} size={'m'} />
        </HStack>
        <VStack>
          <HStack spacing="10">
            {isOwner && (
              <IconButton
                rounded="md"
                variant="unstyled"
                onClick={
                  isListening ? SpeechRecognition.stopListening : startListening
                }
                icon={
                  isListening ? (
                    <MicrophoneIcon color="red.500" w="2.5rem" h="2.5rem" />
                  ) : (
                    <MicrophoneOffIcon w="2.5rem" h="2.5rem" />
                  )
                }
              />
            )}
            <InputGroup width="auto" size="lg">
              <InputLeftAddon>
                <IconButton
                  onClick={decreaseFontSize}
                  icon={<MinusIcon />}
                  aria-label="Decrease font size"
                  color="black"
                />
              </InputLeftAddon>
              <Input
                value={fontSize}
                onChange={handleFontSizeChange}
                fontSize="18px"
                maxWidth="6rem"
                textAlign="center"
              />
              <InputRightAddon>
                <IconButton
                  onClick={increaseFontSize}
                  icon={<AddIcon />}
                  aria-label="Increase font size"
                  color="black"
                />
              </InputRightAddon>
            </InputGroup>
          </HStack>
        </VStack>
      </HStack>
      <ClientOnly display="flex" flexDirection="column" flex="1" width="100%">
        <Skeleton
          display="flex"
          flexDirection="column"
          flex="1"
          rounded="lg"
          isLoaded={isInRoom}
        >
          {browserSupportsSpeechRecognition ? (
            <Textarea
              id="input"
              readOnly
              variant="outline"
              value={content}
              flex="1"
              fontFamily="heading"
              fontSize={`${fontSize}px`}
              onChange={autoScroll}
              padding="10rem"
              placeholder="Aquí se mostrará el texto cuando el maestro empiece a hablar"
            />
          ) : (
            <Text>
              Este buscador no soporta reconocimiento de audio a texto.
            </Text>
          )}
        </Skeleton>
      </ClientOnly>
      <Button
        alignSelf={{ base: 'stretch', lg: 'flex-end' }}
        marginRight={{ lg: '2rem' }}
        colorScheme="primaryBlue"
        onClick={handleDownloadClick}
      >
        Descargar Clase
      </Button>
    </VStack>
  )
}

const MicrophoneIcon = props => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mic"
      {...props}
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </Icon>
  )
}

const MicrophoneOffIcon = props => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mic-off"
      {...props}
    >
      <line x1="1" y1="1" x2="23" y2="23"></line>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </Icon>
  )
}
