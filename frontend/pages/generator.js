import { Button, VStack, Heading, Box, Stack, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import Copy from '../components/Copy';
import Logo from '../components/Logo';
import { useSocket } from '../utils/common/socket';

export default function Home() {
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
