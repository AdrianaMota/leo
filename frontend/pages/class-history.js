import { VStack, Heading, Skeleton, Text } from '@chakra-ui/react'

import Navigation from '../components/Navigation'
import Class from '../components/Class'
import { externalClient } from '../utils/api-client'
import { useSession } from 'next-auth/client'
import { useQuery } from 'react-query'

export default function History() {
  return (
    <VStack
      alignItems={{ base: 'center', lg: 'stretch' }}
      minHeight="100vh"
      overflow="hidden"
      padding={{ base: '1rem', lg: '2rem 5rem' }}
    >
      <Navigation />
      <VStack alignItems="center" padding="0 1rem">
        <Heading
          fontFamily="main"
          fontWeight="600"
          marginBottom="4rem"
          fontSize={['s', 'm', 'l']}
          textAlign="center"
        >
          Todas las Clases
        </Heading>
        <ClassList />
      </VStack>
    </VStack>
  )
}

function ClassList() {
  const [session] = useSession()
  const { data, isLoading } = useQuery('classes', () =>
    externalClient
      .get('/classes', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      .then(response => response.data),
  )

  if (isLoading) {
    return (
      <VStack spacing="6">
        <Skeleton rounded="lg" width="700px" height="87px" />
        <Skeleton rounded="lg" width="700px" height="87px" />
        <Skeleton rounded="lg" width="700px" height="87px" />
      </VStack>
    )
  }

  if (!data?.classes?.length) {
    return <Text fontSize="1.4rem">No existen clases</Text>
  }

  return (
    <VStack marginTop="2rem" spacing="6">
      {data?.classes?.map(({ name, code, createdAt }) => {
        const createdDate = new Date(createdAt)
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }

        return (
          <Class
            key={code}
            code={code}
            name={name ?? code}
            date={createdDate.toLocaleDateString('en-US', options)}
          />
        )
      })}
    </VStack>
  )
}

History.auth = true
