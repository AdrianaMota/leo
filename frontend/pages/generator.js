import {
  Button,
  VStack,
  Heading,
  Box,
  Stack,
  HStack,
  useClipboard,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Copy from '../utils/chakra/components/Copy';

export default function Home() {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
    >
      <VStack
        alignItems={{ base: 'center', lg: 'stretch' }}
        padding={{ base: '1rem', lg: '2rem 0 0 5rem' }}
      >
        <Heading
          as="h1"
          fontSize={['xxl', 'xxxl']}
          color="primaryBlue.500"
          fontWeight="black"
        >
          <Link href="/">Leo</Link>
          <Box as="span" color="primaryYellow.500">
            .
          </Box>
        </Heading>
        <Heading as="h3" fontSize={['m', 'l']} fontWeight="regular">
          Transcripciones en vivo
        </Heading>
      </VStack>
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
              M95a23
            </Heading>
            <Copy />
          </HStack>
        </VStack>
        <Stack padding="5rem 0" direction={['column', 'row']}>
          <Button marginRight={{ base: '0', lg: '2rem' }} colorScheme="blue">
            <Link href="/transcribe">Ir a la sala</Link>
          </Button>
        </Stack>
      </VStack>
    </VStack>
  );
}
