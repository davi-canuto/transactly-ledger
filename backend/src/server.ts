import 'dotenv/config'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'
import { ApolloServer } from 'apollo-server-koa'
import schema from './schema/index.js'
import { connectDatabase } from './database.js'

async function startServer(): Promise<void> {
  await connectDatabase()

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({ ctx }: { ctx: any }) => ({
      request: ctx.request,
    }),
  })

  await server.start()

  const app = new Koa()

  app.use(cors())
  app.use(bodyParser())

  server.applyMiddleware({ app: app as any, path: '/graphql' })

  const port: string | number = process.env.PORT || 4000

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    console.log(`🎮 GraphQL Playground available at http://localhost:${port}${server.graphqlPath}`)
  })
}

startServer().catch((error: Error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
