import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { serve } from '@hono/node-server'

import { debug } from '../index.js'

const app = new Hono()
debug(app)

app.use(cors())
app.use(requestId())

app.all('/', function indexRouter (c) {
  return c.json({ message: 'Hello, hono-debug!' })
})

app.all('/error', function errorRouter (c) {
  throw new Error('error!!!')
})

serve(app)
