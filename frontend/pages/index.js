import { Button, VStack, Stack, Heading, Box } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <VStack
      alignItems={{ base: "center", lg: "stretch" }}
      minHeight="100vh"
      overflow="hidden"
    >
      <VStack
        alignItems={{ base: "center", lg: "stretch" }}
        padding={["1rem", "2rem 0 0 5rem"]}
      >
        <Heading
          as="h1"
          fontSize={["xxl", "xxxl"]}
          color="primaryBlue.500"
          fontFamily="heading"
          fontWeight="black"
        >
          <Link href="/">Leo</Link>
          <Box as="span" color="primaryYellow.500">
            .
          </Box>
        </Heading>
        <Heading as="h3" fontSize="m" fontWeight="regular" fontFamily="heading">
          Transcripciones en vivo
        </Heading>
      </VStack>
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
          fontSize={["l", "xl", "xxxl"]}
          alignItems="center"
        >
          ¡Bienvenido!
        </Heading>
        <Heading
          fontWeight="regular"
          fontSize={["m", "l", "xl"]}
          textAlign="center"
        >
          ¿Cómo deseas iniciar?
        </Heading>
        <Stack padding="5rem 0" direction={["column", "row"]}>
          <Button
            color="background.500"
            marginRight={{ base: "0", lg: "2rem" }}
            colorScheme="primaryYellow"
          >
            <Link href="/verification">Soy estudiante</Link>
          </Button>
          <Button colorScheme="primaryBlue">
            <Link href="/generator">Soy maestro</Link>
          </Button>
        </Stack>
      </VStack>
    </VStack>
  );
}
