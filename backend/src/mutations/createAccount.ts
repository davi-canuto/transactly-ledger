import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { Account, IAccount } from '../models/index'
import { AccountType } from '../schema/types/Account'

interface CreateAccountInput {
  name: string
  initialBalanceCents?: number
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
  },

  outputFields: {
    account: {
      type: AccountType,
      resolve: (payload: CreateAccountPayload) => payload.account,
    },
  },

  mutateAndGetPayload: async ({ name, initialBalanceCents = 0 }: CreateAccountInput): Promise<CreateAccountPayload> => {
    const account = new Account({
      name,
      initial_balance_cents: initialBalanceCents,
      balance_cents: initialBalanceCents,
    })

    await account.save()

    return { account }
  },
})

export { createAccountMutation }
