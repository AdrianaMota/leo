import { VStack, Heading, Box, Text } from '@chakra-ui/react'
import Link from 'next/link'
import Logo from '../components/Logo'
import Class from '../components/Class'

export default function History() {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Logo />
      <VStack alignItems="center" padding="0 1rem">
        <Heading
          fontFamily="main"
          fontWeight="light"
          marginBottom="4rem"
          fontSize={['s', 'm', 'l']}
          textAlign="center"
        >
          Todas las Clases
        </Heading>
        <VStack marginTop="2rem" spacing="6">
          <Class
            name="Historia Universal - Clase sobre los cavernícolas"
            date="09/08/2021"
          />
          <Class name="Español II - Historia de los comics" date="09/08/2021" />
        </VStack>
      </VStack>
    </VStack>
  )
}
