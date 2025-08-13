import 'dotenv/config'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import { getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL } from 'graphql-helix'
import schema from './schema/index.js'
import { connectDatabase } from './database.js'

async function startServer(): Promise<void> {
  await connectDatabase()

  const app = new Koa()

  app.use(cors())
  app.use(bodyParser())

  app.use(async (ctx) => {
    if (ctx.path !== '/graphql') {
      return
    }

    const request = {
      body: ctx.request.body,
      headers: ctx.headers,
      method: ctx.method,
      query: ctx.query,
    }

    if (shouldRenderGraphiQL(request)) {
      ctx.body = renderGraphiQL()
      ctx.type = 'text/html'
      return
    }

    const { operationName, query, variables } = getGraphQLParameters(request)

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => ({
        request: ctx.request,
      }),
    })

    if (result.type === 'RESPONSE') {
      ctx.status = result.status
      ctx.body = result.payload
      if (result.headers) {
        result.headers.forEach(({ name, value }: { name: string; value: string }) => {
          ctx.set(name, value)
        })
      }
    } else {
      ctx.status = 200
      ctx.type = 'text/event-stream'
      ctx.body = result
    }
  })

  const port: string | number = process.env.PORT || 4000

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
    console.log(`🎮 GraphiQL available at http://localhost:${port}/graphql`)
  })
}

startServer().catch((error: Error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
