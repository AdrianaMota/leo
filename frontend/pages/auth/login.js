import {
  Button,
  VStack,
  Heading,
  Input,
  FormErrorMessage,
  FormControl,
  Stack,
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import { getSession } from 'next-auth/client'

import Navigation from '../../components/Navigation'

export default function Login() {
  const router = useRouter()

  const handleSubmit = async (values, { setSubmitting }) => {
    const response = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    })

    if (!response.ok) {
      return alert('Credenciales incorrectas. Por favor intente de nuevo')
    }

    setSubmitting(false)
    router.push('/')
  }

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
        flex="0.5"
        padding="0 1rem"
      >
        <Heading
          textAlign="center"
          as="h1"
          fontSize={['m', 'l', 'xxl']}
          alignItems="center"
        >
          ¡Bienvenido!
        </Heading>
        <Heading
          fontFamily="main"
          fontWeight="light"
          fontSize={['s', 'm', 'l']}
          textAlign="center"
        >
          Ingrese sus datos
        </Heading>
        <Stack
          padding="5rem 0"
          width="full"
          maxWidth="2xl"
          alignItems="stretch"
          justifyItems="center"
        >
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={values => {
              const errors = {}

              if (!values.username) {
                errors.username = 'Este campo es requerido.'
              }

              if (!values.password) {
                errors.password = 'Este campo es requerido.'
              }

              return errors
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form align="center" style={{ width: '100%' }}>
                <Stack spacing="8" width="full">
                  <Field name="username">
                    {({ field, form }) => (
                      <FormControl
                        width="full"
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                      >
                        <Input
                          {...field}
                          padding="2.5rem 2rem"
                          borderRadius="1rem"
                          id="username"
                          fontSize="1.5rem"
                          placeholder="Usuario"
                        />
                        <FormErrorMessage fontSize="lg">
                          {form.errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <Input
                          {...field}
                          padding="2.5rem 2rem"
                          borderRadius="1rem"
                          type="password"
                          id="password"
                          fontSize="1.5rem"
                          placeholder="Contraseña"
                        />
                        <FormErrorMessage fontSize="lg">
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button
                    alignSelf="center"
                    type="submit"
                    colorScheme="blue"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Iniciar
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </VStack>
    </VStack>
  )
}

function isValidURL(string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
  )
  return res !== null
}

export async function getServerSideProps(ctx) {
  if (await getSession(ctx)) {
    return {
      redirect: {
        destination: isValidURL(ctx.query.callbackUrl)
          ? ctx.query.callbackUrl
          : '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
