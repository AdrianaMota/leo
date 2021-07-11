import { useState } from 'react';
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
} from '@chakra-ui/react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import Logo from '../components/Logo';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';

export default function Transcribe() {
  const {
    transcript,
    listening: isListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [fontSize, setFontSize] = useState(18);

  const handleFontSizeChange = event => {
    setFontSize(event.target.value);
  };

  const increaseFontSize = () => {
    setFontSize(Number(fontSize) + 1);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize > 0 ? Number(fontSize) - 1 : Number(fontSize));
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'es-DO' });
  };

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
        <HStack spacing="10">
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
      </HStack>
      {browserSupportsSpeechRecognition ? (
        <Textarea
          readOnly
          variant="outline"
          flex="1"
          value={transcript}
          fontSize={`${fontSize}px`}
          padding="1rem 2rem"
        />
      ) : (
        <Text>Browser doesn't support speech recognition.</Text>
      )}
    </VStack>
  );
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
  );
};

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
  );
};
