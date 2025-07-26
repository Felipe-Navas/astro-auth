import { firebase } from '@/firebase/config'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth'

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string(),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, context) => {
    // Cookies
    if (remember_me) {
      context.cookies.set('email', email, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        path: '/',
      })
    } else {
      context.cookies.delete('email', {
        path: '/',
      })
    }

    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      return JSON.stringify(user)
    } catch (error) {
      console.log('error', error)

      const firebaseError = error as AuthError

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use')
      }

      throw new Error('Error login user')
    }
  },
})
