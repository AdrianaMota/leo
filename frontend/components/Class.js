import { VStack, Heading, Box, Text } from '@chakra-ui/react'
import Link from 'next/link'

const Class = ({ name, date }) => {
  return (
    <Link href="" passHref>
      <Box
        as="a"
        backgroundColor="transparent"
        borderRadius="1.5rem"
        borderWidth="1px"
        padding="2rem 3rem"
        width="70rem"
        borderColor="primaryBlue.500"
        _hover={{
          bg: 'primaryBlue.500',
          '& > .classTitle': { textColor: 'white' },
        }}
      >
        <Text
          fontSize="m"
          className="classTitle"
          fontWeight="bold"
          textColor="primaryBlue.500"
        >
          {name}
        </Text>
        <Text>{date}</Text>
      </Box>
    </Link>
  )
}
export default Class
