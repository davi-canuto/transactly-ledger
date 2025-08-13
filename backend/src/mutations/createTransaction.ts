import { GraphQLInt, GraphQLID, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import mongoose from 'mongoose'
import { Account, Transaction, LedgerEntry, IAccount, ITransaction, ILedgerEntry } from '../models/index.js'
import { TransactionType } from '../schema/types/Transaction.js'

interface CreateTransactionInput {
  fromAccountId: string
  toAccountId: string
  amountCents: number
}

interface CreateTransactionPayload {
  transaction: ITransaction
}

const createTransactionMutation = mutationWithClientMutationId<CreateTransactionInput, CreateTransactionPayload>({
  name: 'CreateTransaction',

  inputFields: {
    fromAccountId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    toAccountId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    amountCents: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },

  outputFields: {
    transaction: {
      type: TransactionType,
      resolve: (payload: CreateTransactionPayload) => payload.transaction,
    },
  },

  mutateAndGetPayload: async ({ fromAccountId, toAccountId, amountCents }: CreateTransactionInput): Promise<CreateTransactionPayload> => {
    const { id: fromId } = fromGlobalId(fromAccountId)
    const { id: toId } = fromGlobalId(toAccountId)

    if (fromId === toId) {
      throw new Error('Cannot transfer to the same account')
    }

    if (amountCents <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    const session = await mongoose.startSession()

    try {
      const result = await session.withTransaction(async () => {
        const fromAccount = await Account.findById(fromId).session(session)
        const toAccount = await Account.findById(toId).session(session)

        if (!fromAccount) {
          throw new Error('Source account not found')
        }

        if (!toAccount) {
          throw new Error('Destination account not found')
        }

        if (fromAccount.balance_cents < amountCents) {
          throw new Error('Insufficient balance')
        }

        const transaction = new Transaction({
          from: fromId,
          to: toId,
          amount_cents: amountCents,
        })

        await transaction.save({ session })

        const debitEntry = new LedgerEntry({
          account: fromId,
          amount_cents: -amountCents,
          transaction: transaction._id,
          meta: { type: 'debit', description: `Transfer to ${toAccount.name}` },
        })

        const creditEntry = new LedgerEntry({
          account: toId,
          amount_cents: amountCents,
          transaction: transaction._id,
          meta: { type: 'credit', description: `Transfer from ${fromAccount.name}` },
        })

        await debitEntry.save({ session })
        await creditEntry.save({ session })

        transaction.entries = [debitEntry._id, creditEntry._id]
        await transaction.save({ session })

        fromAccount.balance_cents -= amountCents
        toAccount.balance_cents += amountCents

        await fromAccount.save({ session })
        await toAccount.save({ session })

        await transaction.populate('from to')

        return { transaction }
      })

      return result as CreateTransactionPayload
    } finally {
      await session.endSession()
    }
  },
})

export { createTransactionMutation }
