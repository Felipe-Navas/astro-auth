import { firebase } from '@/firebase/config'
import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials, context) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials)

    if (!credential) {
      throw new Error('Error login user')
    }

    await signInWithCredential(firebase.auth, credential!)

    return JSON.stringify({ ok: true })
  },
})
