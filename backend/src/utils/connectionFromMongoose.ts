import { connectionFromArray, ConnectionArguments, Connection } from 'graphql-relay'
import { Query } from 'mongoose'

async function connectionFromMongooseQuery<T>(
  query: Query<T[], T>,
  args: ConnectionArguments
): Promise<Connection<T>> {
  const results = await query.exec()
  return connectionFromArray(results, args)
}

export { connectionFromMongooseQuery }
