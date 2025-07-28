import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'
import { firebase } from './firebase/config'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware((context, next: MiddlewareNext) => {
  const isLoggedIn = !!firebase.auth.currentUser

  const user = firebase.auth.currentUser

  context.locals.isLoggedIn = isLoggedIn
  // context.locals.user = user

  return next()
})
