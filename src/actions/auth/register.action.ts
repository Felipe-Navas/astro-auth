import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  type AuthError,
} from 'firebase/auth'
import { firebase } from '@/firebase/config'

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, context) => {
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

    // Firebase user creation
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      // Update user displayName
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,
      })

      // Verify user email
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: 'http://localhost:4321/protected?emailVerified=true',
      })

      return JSON.stringify(user)
    } catch (error) {
      console.log('error', error)

      const firebaseError = error as AuthError

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use')
      }

      throw new Error('Error registering user')
    }
  },
})
