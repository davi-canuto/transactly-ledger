import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { AccountType } from './Account.js'
import { ITransaction } from '../../models/index.js'

const TransactionType = new GraphQLObjectType<ITransaction>({
  name: 'Transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    from: {
      type: AccountType,
      resolve: (transaction: ITransaction) => transaction.from,
    },
    to: {
      type: AccountType,
      resolve: (transaction: ITransaction) => transaction.to,
    },
    amountCents: {
      type: GraphQLInt,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (transaction: ITransaction) => transaction.createdAt.toISOString(),
    },
  }),
  interfaces: [],
})

export { TransactionType }
