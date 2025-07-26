import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, context) => {
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

    return {ok: true, msg: 'User registered successfully'}
  },
})
