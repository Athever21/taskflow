import axios from 'axios'
import { client } from './client'
import type { User } from './types'

// Separate axios instance just for the CSRF cookie endpoint —
// it lives at /sanctum/csrf-cookie, not /api/sanctum/csrf-cookie
const sanctumClient = axios.create({
  baseURL: '/',
  withCredentials: true,
})

// Must be called before the first login/register request.
// Laravel sets an XSRF-TOKEN cookie. Axios reads it automatically
// and sends it as the X-XSRF-TOKEN header on subsequent requests.
// This is how Laravel knows the request came from your frontend, not a third party.
const getCsrfCookie = () => sanctumClient.get('sanctum/csrf-cookie')

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    await getCsrfCookie()
    const res = await client.post('/login', { email, password })
    return res.data.user
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await getCsrfCookie()
    const res = await client.post('/register', {
      name,
      email,
      password,
      password_confirmation: password,
    })
    return res.data.user
  },

  logout: async (): Promise<void> => {
    await client.post('/logout')
  },

  me: async (): Promise<User> => {
    const res = await client.get('/me')
    return res.data.user
  },
}