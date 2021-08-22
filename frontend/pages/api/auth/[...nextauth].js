import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import jwt from 'jsonwebtoken'
import { externalClient } from '../../../utils/api-client'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text', placeholder: '00-0000' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const {
            data: { user },
          } = await externalClient.post(`/auth/login`, {
            username: credentials.username,
            password: credentials.password,
          })

          const payload = {
            email: user.email,
            id: user.id,
            roles: user.roles,
          }

          return payload
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],

  secret: process.env.HASH_SECRET,

  jwt: {
    secret: JSON.parse(process.env.JWT_PRIVATE_KEY).k,
    encode({ secret, token }) {
      return jwt.sign(token, secret, {
        algorithm: 'RS256',
      })
    },
    decode({ secret, token }) {
      const result = jwt.verify(token, secret, { algorithms: ['RS256'] })
      return { accessToken: token, ...result }
    },
  },

  callbacks: {
    async jwt(token, user) {
      if (user?.roles) {
        token.roles = user.roles
      }

      return token
    },

    async session(session, token) {
      session.roles = token.roles
      session.accessToken = token.accessToken

      return session
    },
  },

  session: {
    jwt: true,
  },

  pages: {
    signIn: '/auth/login',
  },
})
