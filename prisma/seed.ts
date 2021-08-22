import { PrismaClient, Role } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const unibe = await prisma.university.upsert({
    where: {
      name: 'Universidad Iberoamericana (UNIBE)',
    },
    update: {},
    create: {
      name: 'Universidad Iberoamericana (UNIBE)',
      address: {
        create: {
          city: 'Santo Domingo',
          country: 'Republica Dominicana',
          street: 'Av. Francia 129',
        },
      },
    },
  })

  const student1 = await prisma.user.upsert({
    where: { username: '18-0413' },
    update: {},
    create: {
      email: 'lishamota@hotmail.com',
      username: '18-0413',
      password: '$2a$10$jSRPL1ypCvuXuG0XAhXSTO4aa4V0hTeTVAheRXnlRTwtTuGAhJ3pm', // password
      university: {
        connect: {
          name: 'Universidad Iberoamericana (UNIBE)',
        },
      },
      roles: [Role.Student],
    },
  })

  const teacher1 = await prisma.user.upsert({
    where: { username: 'teacher1' },
    update: {},
    create: {
      email: 'teacher1@unibe.edu.do',
      username: 'teacher1',
      password: '$2a$10$jSRPL1ypCvuXuG0XAhXSTO4aa4V0hTeTVAheRXnlRTwtTuGAhJ3pm', // password
      university: {
        connect: {
          name: 'Universidad Iberoamericana (UNIBE)',
        },
      },
      roles: [Role.Teacher],
    },
  })

  const admin1 = await prisma.user.upsert({
    where: { username: 'admin1' },
    update: {},
    create: {
      email: 'admin1@unibe.edu.do',
      username: 'admin1',
      password: '$2a$10$jSRPL1ypCvuXuG0XAhXSTO4aa4V0hTeTVAheRXnlRTwtTuGAhJ3pm', // password
      university: {
        connect: {
          name: 'Universidad Iberoamericana (UNIBE)',
        },
      },
      roles: [Role.Admin],
    },
  })

  console.log({ user1: student1, teacher1, unibe, admin1 })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
