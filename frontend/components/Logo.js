import { VStack, Heading, Link, Box } from '@chakra-ui/react'

const Logo = () => {
  return (
    <VStack alignItems={{ base: 'center', lg: 'stretch' }}>
      <Heading
        as="h1"
        fontSize={['xxl', 'xxxl']}
        color="primaryBlue.500"
        fontWeight="black"
      >
        <Link
          _hover={{
            textDecoration: 'none',
          }}
          href="/"
        >
          Leo
        </Link>
        <Box as="span" color="primaryYellow.500">
          .
        </Box>
      </Heading>
      <Heading as="h3" fontSize={['sm', 'm']} fontWeight="regular">
        Transcripciones en vivo
      </Heading>
    </VStack>
  )
}

export default Logo
