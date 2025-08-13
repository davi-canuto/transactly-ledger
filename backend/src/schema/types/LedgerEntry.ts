import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { AccountType } from './Account.js'
import { TransactionType } from './Transaction.js'
import { ILedgerEntry } from '../../models/index.js'

const LedgerEntryType = new GraphQLObjectType<ILedgerEntry>({
  name: 'LedgerEntry',
  fields: () => ({
    id: globalIdField('LedgerEntry'),
    account: {
      type: AccountType,
      resolve: (entry: ILedgerEntry) => entry.account,
    },
    amount_cents: {
      type: GraphQLInt,
    },
    transaction: {
      type: TransactionType,
      resolve: (entry: ILedgerEntry) => entry.transaction,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (entry: ILedgerEntry) => entry.createdAt.toISOString(),
    },
  }),
  interfaces: [],
})

export { LedgerEntryType }
