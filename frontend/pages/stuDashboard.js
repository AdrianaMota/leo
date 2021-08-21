import { Button, VStack, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Logo />
      <VStack
        alignItems="center"
        justifyContent="center"
        flex="0.4"
        padding="0 1rem"
      >
        <Heading
          fontFamily="main"
          fontWeight="light"
          marginBottom="4rem"
          fontSize={['s', 'm', 'l']}
          textAlign="center"
        >
          ¿Qué deseas hacer?
        </Heading>
        <VStack padding="5rem 0">
          <Link href="/verification" passHref>
            <Button width="30rem" marginBottom="2rem" colorScheme="primaryBlue">
              Entrar a Clase
            </Button>
          </Link>
          <Link href="/history" passHref>
            <Button
              width="30rem"
              colorScheme="primaryYellow"
              textColor="gray.700"
            >
              Historial de Clases
            </Button>
          </Link>
        </VStack>
      </VStack>
    </VStack>
  )
}
