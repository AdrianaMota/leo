import { Button, VStack, Input, Flex, Image, Spacer } from '@chakra-ui/react'
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
      <Flex
        flex="1"
        padding={['0 2rem', '0 5rem']}
        alignItems="center"
        justifyContent={{ base: 'flex-end', lg: 'flex-start' }}
        direction={{ base: 'column', lg: 'row' }}
      >
        <VStack alignItems={{ md: 'right' }}>
          <Input
            isInvalid
            errorBorderColor="red"
            fontSize={['1.2rem', '1.7rem']}
            variant="flushed"
            placeholder="Entrar código"
            pr="20rem"
            size="lg"
            marginBottom="2rem"
          />
          <Button
            alignSelf={{ base: 'stretch', lg: 'flex-start' }}
            color="background.500"
            marginRight={{ lg: '2rem' }}
            colorScheme="primaryYellow"
          >
            <Link href="/transcribe">¡Empezar!</Link>
          </Button>
        </VStack>
        <Spacer display={{ base: 'none', lg: 'block' }} />
        <Image
          src="Characters.png"
          alt="Personajes"
          width={['50rem', '50rem', '50rem', '50rem', '70rem', '100rem']}
          objectFit="cover"
          margin={{ base: '5rem 0 -7rem 0', lg: '0' }}
        ></Image>
      </Flex>
    </VStack>
  )
}
