import { GraphQLObjectType } from 'graphql'
import { createAccountMutation } from '../mutations/createAccount.js'
import { createTransactionMutation } from '../mutations/createTransaction.js'

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createAccount: createAccountMutation,
    createTransaction: createTransactionMutation,
  }),
})

export { MutationType }
