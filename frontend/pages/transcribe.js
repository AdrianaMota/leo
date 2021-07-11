import { Button, VStack, Stack, Heading, Box } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
    >
      <VStack
        alignItems={{ base: 'center', lg: 'stretch' }}
        padding={['1rem', '2rem 0 0 5rem']}
      >
        <Heading
          as="h1"
          fontSize={['xxl', 'xxxl']}
          color="primaryBlue.500"
          fontFamily="heading"
          fontWeight="black"
        >
          <Link href="/">Leo</Link>
          <Box as="span" color="primaryYellow.500">
            .
          </Box>
        </Heading>
        <Heading as="h3" fontSize="m" fontWeight="regular" fontFamily="heading">
          Transcripciones en vivo
        </Heading>
      </VStack>
    </VStack>
  );
}
