import { Button, VStack, Stack, Heading, Box } from '@chakra-ui/react'
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
        flex="0.5"
        padding="0 1rem"
      >
        <Heading
          textAlign="center"
          as="h1"
          fontFamily="heading"
          fontSize={['l', 'xl', 'xxxl']}
          alignItems="center"
        >
          ¡Bienvenido!
        </Heading>
        <Heading
          fontWeight="regular"
          fontSize={['m', 'l', 'xl']}
          textAlign="center"
        >
          ¿Cómo deseas iniciar?
        </Heading>
        <Stack padding="5rem 0" direction={['column', 'row']}>
          <Link href="/verification" passHref>
            <Button
              color="background.500"
              marginRight={{ base: '0', lg: '2rem' }}
              colorScheme="primaryYellow"
            >
              Soy estudiante
            </Button>
          </Link>
          <Link href="/generator" passHref>
            <Button colorScheme="primaryBlue">Soy maestro</Button>
          </Link>
        </Stack>
      </VStack>
    </VStack>
  )
}
