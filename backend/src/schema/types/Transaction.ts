import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { AccountType } from './Account'
import { ITransaction } from '../../models/index'

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
    amount_cents: {
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
