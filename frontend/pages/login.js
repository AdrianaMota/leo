import { Button, VStack, Heading, Input } from '@chakra-ui/react'
import Link from 'next/link'
import { Formik, Form, ErrorMessage } from 'formik'
import Logo from '../components/Logo'

export default function Login() {
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
        <VStack
          padding="5rem 0"
          alignItems="center"
          justifyItems="center"
          direction={['column', 'row']}
        >
          <Formik
            initialValues={{ user: '', password: '' }}
            validate={values => {
              const errors = {}
              if (!values.user) {
                errors.user = 'Required'
              } else if (!/^([0-9]{6})?$/i.test(values.user)) {
                errors.user = 'Usuario Inválida'
              }
              console.log(errors)
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                setSubmitting(false)
              }, 400)
            }}
          >
            {({ isSubmitting }) => (
              <Form align="center">
                <Input
                  padding="2.5rem 2rem"
                  borderRadius="1rem"
                  marginBottom="2rem"
                  type="username"
                  name="user"
                  fontSize="1.5rem"
                  placeholder="Usuario"
                  max-width="50rem"
                />
                <ErrorMessage name="pin" component="div" />
                <Input
                  padding="2.5rem 2rem"
                  borderRadius="1rem"
                  marginBottom="2rem"
                  type="password"
                  name="password"
                  fontSize="1.5rem"
                  placeholder="Contraseña"
                  max-width="50rem"
                />
                <ErrorMessage name="password" component="div" />
                <Link href="" passHref>
                  <Button
                    marginRight={{ base: '0', lg: '2rem' }}
                    colorScheme="blue"
                    disabled={isSubmitting}
                  >
                    Iniciar
                  </Button>
                </Link>
              </Form>
            )}
          </Formik>
        </VStack>
      </VStack>
    </VStack>
  )
}
