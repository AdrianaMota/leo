import { Button, VStack, Heading } from '@chakra-ui/react'

import Link from 'next/link'
import Navigation from './Navigation'

const TeacherDashboard = () => {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Navigation />
      <VStack
        alignItems="center"
        justifyContent="center"
        flex="0.4"
        padding="0 1rem"
      >
        <Heading
          textAlign="center"
          as="h1"
          fontFamily="heading"
          fontSize={['l', 'xl', 'xxl']}
          alignItems="center"
        >
          ¡Bienvenido!
        </Heading>
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
          <Link href="/generator" passHref>
            <Button width="30rem" marginBottom="2rem" colorScheme="primaryBlue">
              Iniciar Clase
            </Button>
          </Link>
          <Link href="/class-history" passHref>
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

export default TeacherDashboard
