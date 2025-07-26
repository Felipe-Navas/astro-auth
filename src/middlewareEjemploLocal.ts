import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware((context, next: MiddlewareNext) => {
  const { pathname } = context.url

  const authHeader = context.request.headers.get('Authorization') ?? ''

  if (privateRoutes.includes(pathname)) {
    return checkLocalAuth(authHeader, next)
  }

  return next()
})

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (authHeaders) {
    const authValue = authHeaders.split(' ').at(-1) ?? 'user:password'

    const decodedValue = atob(authValue).split(':')
    const [username, password] = decodedValue

    if (username === 'admin' && password === 'admin') {
      return next()
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
