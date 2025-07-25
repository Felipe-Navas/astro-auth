import type { MiddlewareNext } from 'astro'
import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware((context, next: MiddlewareNext) => {
  return next()
})
