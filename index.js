export function debug (app, options = {}) {
  const trigger = options.trigger
  if (trigger) {
    if (typeof trigger !== 'function') {
      throw new Error('trigger should be a function')
    }
  }

  function wrapMiddleware (fn) {
    return async function wrapDebug (ctx, next) {
      const method = ctx.req.method
      const path = ctx.req.path
      const url = new URL(ctx.req.url)

      const shouldTrigger = trigger ? (await trigger(ctx)) : true
      if (!shouldTrigger) {
        return fn(ctx, next)
      }

      // FIXME: fn.name
      console.log(`${method} ${path} --> ${fn.name?.replace(/2$/, '')} --> request: ${JSON.stringify({
        url: `${url.pathname}${url.search}`,
        headers: Object.fromEntries(ctx.req.raw.headers.entries()),
        text: await ctx.req.raw.clone().text()
      }, null, 2)}`)

      const result = await fn(ctx, next)
      const response = (result && (result instanceof Response))
        ? result
        : ctx.res

      // FIXME: fn.name
      console.log(`${method} ${path} <-- ${fn.name?.replace(/2$/, '')} <-- response: ${JSON.stringify({
        url: `${url.pathname}${url.search}`,
        status: response.status,
        headers: Object.fromEntries(response.headers),
        text: await response.clone().text()
      }, null, 2)}`)

      return result ?? new Response(null)
    }
  }

  ;[
    'use',
    'get',
    'post',
    'put',
    'delete',
    'all',
    'on',
  ].forEach(method => {
    const originalFn = app[method].bind(app)
    app[method] = function (...args) {
      const wrappedArgs = args.map(arg => {
        if (typeof arg === 'function') return wrapMiddleware(arg)
        return arg
      })
      return originalFn(...wrappedArgs)
    }
  })

  return app
}
