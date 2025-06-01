import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'


import { api } from "@routes/index";
import { ErrorHandler } from 'core/http';

// Rest of your server code

const app = new Hono()


app.use('*', logger(), prettyJSON())

app.route('', api)

app.onError((err, c) => {
    return ErrorHandler.error(c, (err as any)?.status || 500, err)
})

app.notFound((c) => {
    return ErrorHandler.notFound(c)
})


const port = 8004
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})