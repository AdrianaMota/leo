import axios from 'axios'

export const client = axios.create()

export const externalClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL,
})
