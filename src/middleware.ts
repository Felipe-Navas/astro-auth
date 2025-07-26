import { defineMiddleware } from 'astro:middleware'

const privateRoutes = ['/protected']

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url


  const authHeader = context.request.headers.get('Authorization')
  console.log("🚀 ~ authHeader:", authHeader)

  if (privateRoutes.includes(pathname)) {

    if (authHeader) {
      return next()
    }


    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return next()
})
