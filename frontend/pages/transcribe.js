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
  Stack,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { MinusIcon, AddIcon, EditIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { throttle } from 'throttle-debounce'

import ClientOnly from '../components/ClientOnly'
import { useSocket } from '../utils/socket'
import Copy from '../components/Copy'
import { client, externalClient } from '../utils/api-client'
import Logo from '../components/Logo'
import { useMutation } from 'react-query'
import { useSession } from 'next-auth/client'
import { Form, Formik, Field } from 'formik'

export default function Transcribe() {
  const {
    transcript,
    listening: isListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const [isSpeechRecognitionLoading, setIsSpeechRecognitionLoading] = useState(
    true,
  )

  const socket = useSocket()
  const router = useRouter()
  const { roomId } = router.query

  const socketRef = useRef(socket)

  const [fontSize, setFontSize] = useState(70)
  const [content, setContent] = useState('')
  const [roomName, setRoomName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [isInRoom, setIsInRoom] = useState(false)

  const inputRef = useRef()
  const initialContent = useRef('')

  useEffect(() => {
    const loadSpeechRecognition = async () => {
      const {
        data: { token },
      } = await client
        .get('/api/azure/get-authorization-token')
        .catch(() => ({ data: { token: null } }))

      if (!token) {
        return setIsSpeechRecognitionLoading(false)
      }

      const createSpeechServicesPonyfill = require('web-speech-cognitive-services')
        .default

      const {
        SpeechRecognition: AzureSpeechRecognition,
      } = await createSpeechServicesPonyfill({
        credentials: {
          region: process.env.NEXT_PUBLIC_AZURE_REGION,
          authorizationToken: token,
        },
      })

      SpeechRecognition.applyPolyfill(AzureSpeechRecognition)
      setIsSpeechRecognitionLoading(false)
    }

    loadSpeechRecognition()
  }, [])

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    if (roomId && !isInRoom) socketRef.current.emit('room:join', roomId)
  }, [isInRoom, roomId])

  useEffect(() => {
    socketRef.current.on('room:content', room => {
      if (room.status === 404) return router.push('/') // redirect to main page if room is not found
      if (!isInRoom) {
        initialContent.current = room.content + ' '
        setIsInRoom(true)
      }

      setRoomName(room.name)
      setContent(room.content)
      setIsOwner(room.isOwner)
    })
  }, [socket, roomId, router, isInRoom])

  const sendContentToRoom = useMemo(
    () =>
      throttle(500, (roomId, content) => {
        socketRef.current.emit('room:edit', {
          id: roomId,
          content,
        })
      }),
    [],
  )

  useEffect(() => {
    const autoScroll = throttle(500, () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = inputRef.current.scrollHeight
      }
    })

    if (isOwner && transcript.length > 0) {
      const newContent = initialContent.current + transcript
      sendContentToRoom(roomId, newContent)
      setContent(newContent)
    }

    // scroll anytime there is new content
    autoScroll()
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
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
  }

  const handleDownloadClick = () => {
    const element = document.createElement('a')
    const file = new Blob([inputRef.current.value], {
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

        <Stack
          ml="0px !important"
          alignItems="center"
          spacing="8"
          paddingTop="3rem"
        >
          <Skeleton isLoaded={isInRoom}>
            {isOwner ? (
              <EditableRoomName
                roomId={roomId}
                roomName={roomName}
                setRoomName={setRoomName}
              />
            ) : (
              <Heading as="h2" color="primaryYellow.500">
                {roomName}
              </Heading>
            )}
          </Skeleton>

          <HStack>
            <Heading as="h3" fontSize="m" color="white" id="1">
              {roomId ? roomId : 'Cargando...'}
            </Heading>
            <Copy code={roomId} size={'m'} />
          </HStack>
        </Stack>

        <VStack>
          <HStack spacing="10">
            {isOwner && (
              <IconButton
                rounded="md"
                variant="unstyled"
                onClick={
                  isListening
                    ? SpeechRecognition.abortListening
                    : startListening
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
          isLoaded={isInRoom && !isSpeechRecognitionLoading}
        >
          {browserSupportsSpeechRecognition ? (
            <Textarea
              ref={inputRef}
              readOnly
              variant="outline"
              value={content}
              flex="1"
              fontFamily="heading"
              fontSize={`${fontSize}px`}
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

export function normalizeEventKey(event) {
  const { key, keyCode } = event

  const isArrowKey =
    keyCode >= 37 && keyCode <= 40 && key.indexOf('Arrow') !== 0

  const eventKey = isArrowKey ? `Arrow${key}` : key

  return eventKey
}

const EditableRoomName = ({ roomId, roomName, setRoomName }) => {
  const [session] = useSession()
  const socket = useSocket()

  const socketRef = useRef(socket)

  const updateClass = useMutation(({ roomName }) =>
    externalClient
      .patch(
        `/classes/${roomId}`,
        { roomName },
        { headers: { Authorization: `Bearer ${session.accessToken}` } },
      )
      .then(response => response.data),
  )

  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = values => {
    if (values.roomName === roomName) return setIsEditing(false)

    updateClass.mutate(
      {
        roomName: values.roomName,
      },
      {
        onSuccess: updatedClass => {
          setRoomName(updatedClass.name)
          setIsEditing(false)
          socketRef.current.emit('room:edit', {
            id: roomId,
            name: updatedClass.name,
          })
        },
      },
    )
  }

  const handleKeyDown = event => {
    const keyActions = {
      Escape: () => setIsEditing(false),
    }

    const eventKey = normalizeEventKey(event)

    if (eventKey === 'Enter' && event.shiftKey) {
      return
    }

    const action = keyActions[eventKey]
    if (action) {
      return action(event)
    }
  }

  if (isEditing) {
    return (
      <Formik
        initialValues={{ roomName }}
        validate={values => {
          const errors = {}

          if (!values.roomName) {
            errors.roomName = 'Este campo es requerido.'
          }

          return errors
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field name="roomName">
              {({ field, form }) => (
                <FormControl
                  width="full"
                  isInvalid={form.errors.roomName && form.touched.roomName}
                >
                  <Input
                    {...field}
                    disabled={updateClass.isLoading}
                    defaultValue={roomName}
                    placeholder="Nombre de la clase"
                    size="lg"
                    id="roomName"
                    fontSize="1.8rem"
                    py="8"
                    onKeyDown={handleKeyDown}
                    isDisabled={updateClass.isLoading}
                    autoFocus
                  />
                  <FormErrorMessage fontSize="lg">
                    {form.errors.username}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <HStack
      cursor="pointer"
      spacing="4"
      color="primaryYellow.500"
      onClick={() => setIsEditing(true)}
    >
      <Heading as="h2">{roomName}</Heading>
      <EditIcon fontSize={'m'} />
    </HStack>
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

Transcribe.auth = true
