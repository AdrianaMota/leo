import { HStack, Button } from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/client'

import Logo from './Logo'

const Navigation = () => {
  const [session] = useSession()
  return (
    <HStack justifyContent="space-between">
      <Logo />
      {session && (
        <Button
          color="white"
          fontSize="1.6rem"
          variant="link"
          onClick={() => signOut()}
        >
          Cerrar Sesión
        </Button>
      )}
    </HStack>
  )
}

export default Navigation
