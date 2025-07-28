import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'
import { firebase } from './firebase/config'

const privateRoutes = ['/protected']
const notAutenticatedRoutes = ['/login', '/register']

export const onRequest = defineMiddleware((context, next: MiddlewareNext) => {
  const isLoggedIn = !!firebase.auth.currentUser

  const user = firebase.auth.currentUser

  if (user) {
    context.locals.user = {
      name: user.displayName ?? 'No Name',
      email: user.email!,
      avatar: user.photoURL ?? '',
      emailVerified: user.emailVerified,
    }
  }
  context.locals.isLoggedIn = isLoggedIn

  if (!isLoggedIn && privateRoutes.includes(context.url.pathname)) {
    return context.redirect('/')
  }

  if (isLoggedIn && notAutenticatedRoutes.includes(context.url.pathname)) {
    return context.redirect('/')
  }

  return next()
})
