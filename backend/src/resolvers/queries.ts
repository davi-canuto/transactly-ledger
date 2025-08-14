import { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLID } from 'graphql'
import { connectionArgs, fromGlobalId, ConnectionArguments } from 'graphql-relay'
import { Account, Transaction, LedgerEntry, IAccount, ITransaction, ILedgerEntry } from '../models/index.js'
import {
  AccountConnection,
  TransactionConnection,
  LedgerEntryConnection,
} from '../schema/connections.js'
import { connectionFromMongooseQuery } from '../utils/connectionFromMongoose.js'
import { nodeField } from '../schema/nodeDefinitions.js'

interface AccountBalanceArgs {
  accountId: string
}

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,

    accounts: {
      type: AccountConnection,
      args: connectionArgs,
      resolve: async (_: any, args: ConnectionArguments) => {
        const query = Account.find().sort({ createdAt: -1 })
        return connectionFromMongooseQuery(query, args)
      },
    },

    transactions: {
      type: TransactionConnection,
      args: connectionArgs,
      resolve: async (_: any, args: ConnectionArguments) => {
        const query = Transaction.find().populate('from to').sort({ createdAt: -1 })
        return connectionFromMongooseQuery(query, args)
      },
    },

    ledgerEntries: {
      type: LedgerEntryConnection,
      args: connectionArgs,
      resolve: async (_: any, args: ConnectionArguments) => {
        const query = LedgerEntry.find().populate('account transaction').sort({ createdAt: -1 })
        return connectionFromMongooseQuery(query, args)
      },
    },

    accountBalance: {
      type: GraphQLInt,
      args: {
        accountId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { accountId }: AccountBalanceArgs): Promise<number> => {
        const { id } = fromGlobalId(accountId)

        const account = await Account.findById(id)
        if (!account) {
          throw new Error('Account not found')
        }

        const ledgerEntries = await LedgerEntry.find({ account: id })
        const calculatedBalance = ledgerEntries.reduce((sum, entry) => sum + entry.amountCents, 0)

        return calculatedBalance
      },
    },
  }),
})

export { QueryType }
