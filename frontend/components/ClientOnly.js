import { Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

const ClientOnly = ({ children, ...props }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <Box {...props}>{children}</Box>
}

export default ClientOnly
