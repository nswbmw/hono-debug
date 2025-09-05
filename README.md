## hono-debug

A Hono middleware making it easy to debug.

### Install

```sh
$ npm i hono-debug --save
```

### Usage

```js
debug(app, {
  trigger?: (ctx: Context) => boolean | Promise<boolean>
})
```

```js
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { debug } from 'hono-debug'
import { serve } from '@hono/node-server'

const app = new Hono()
debug(app) // Put it before all middlewares

// debug(app, {
//   trigger: (ctx) => ctx.req.query('debug') === 'true' // This is triggered only when the querystring contains debug=true
// })

app.use(cors())
app.use(requestId())

app.all('/', function indexRouter (c) {
  return c.json({ message: 'Hello, hono-debug!' })
})

serve(app)

```

Visit `/?key=value` to see the output:

```js
GET / --> cors --> request: {
  "url": "/?key=value",
  "headers": {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "cache-control": "no-cache",
    "connection": "keep-alive",
    "host": "localhost:3000",
    "user-agent": "PostmanRuntime/7.45.0"
  },
  "text": ""
}
GET / --> requestId --> request: {
  "url": "/?key=value",
  "headers": {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "cache-control": "no-cache",
    "connection": "keep-alive",
    "host": "localhost:3000",
    "user-agent": "PostmanRuntime/7.45.0"
  },
  "text": ""
}
GET / --> indexRouter --> request: {
  "url": "/?key=value",
  "headers": {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "cache-control": "no-cache",
    "connection": "keep-alive",
    "host": "localhost:3000",
    "user-agent": "PostmanRuntime/7.45.0"
  },
  "text": ""
}
GET / <-- indexRouter <-- response: {
  "url": "/?key=value",
  "status": 200,
  "headers": {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "x-request-id": "7912499f-47f7-463a-82f2-772e83a3f649"
  },
  "text": "{\"message\":\"Hello, hono-debug!\"}"
}
GET / <-- requestId <-- response: {
  "url": "/?key=value",
  "status": 200,
  "headers": {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "x-request-id": "7912499f-47f7-463a-82f2-772e83a3f649"
  },
  "text": "{\"message\":\"Hello, hono-debug!\"}"
}
GET / <-- cors <-- response: {
  "url": "/?key=value",
  "status": 200,
  "headers": {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    "x-request-id": "7912499f-47f7-463a-82f2-772e83a3f649"
  },
  "text": "{\"message\":\"Hello, hono-debug!\"}"
}
```

**Note**: 
1. Try to use it only locally. If you want to use it in a production environment, be sure to configure the `trigger` parameter.
2. Try to name each middleware (including routing functions).

### License

MIT
