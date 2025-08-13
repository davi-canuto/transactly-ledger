import { GraphQLSchema } from 'graphql'
import { QueryType } from '../resolvers/queries.js'
import { MutationType } from '../resolvers/mutations.js'

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})

export default schema
