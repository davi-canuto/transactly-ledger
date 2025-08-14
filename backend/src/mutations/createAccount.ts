import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { Account, IdempotencyKey, IAccount } from '../models/index.js'
import { AccountType } from '../schema/types/Account.js'

interface CreateAccountInput {
  name: string
  initialBalanceCents?: number
  idempotencyKey: string
}

interface CreateAccountPayload {
  account: IAccount
}

const createAccountMutation = mutationWithClientMutationId<CreateAccountInput, CreateAccountPayload>({
  name: 'CreateAccount',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    initialBalanceCents: {
      type: GraphQLInt,
      defaultValue: 0,
    },
    idempotencyKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },

  outputFields: {
    account: {
      type: AccountType,
      resolve: (payload: CreateAccountPayload) => payload.account,
    },
  },

  mutateAndGetPayload: async ({ name, initialBalanceCents = 0, idempotencyKey }: CreateAccountInput): Promise<CreateAccountPayload> => {
    const existingKey = await IdempotencyKey.findOne({ key: idempotencyKey })
    if (existingKey) {
      return existingKey.result
    }

    const account = new Account({
      name,
      initialBalanceCents: initialBalanceCents,
      balanceCents: initialBalanceCents,
    })

    await account.save()

    const result = { account }

    await IdempotencyKey.create({
      key: idempotencyKey,
      result,
    })

    return result
  },
})

export { createAccountMutation }
