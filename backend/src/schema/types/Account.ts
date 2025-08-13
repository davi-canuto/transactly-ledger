import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { IAccount } from '../../models/index.js'

const AccountType = new GraphQLObjectType<IAccount>({
  name: 'Account',
  fields: () => ({
    id: globalIdField('Account'),
    name: {
      type: GraphQLString,
    },
    balance_cents: {
      type: GraphQLInt,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (account: IAccount) => account.createdAt.toISOString(),
    },
  }),
  interfaces: [],
})

export { AccountType }
