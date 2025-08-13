import { GraphQLObjectType } from 'graphql'
import { createAccountMutation } from '../mutations/createAccount'
import { createTransactionMutation } from '../mutations/createTransaction'

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAccount: createAccountMutation,
    createTransaction: createTransactionMutation,
  }),
})

export { MutationType }
