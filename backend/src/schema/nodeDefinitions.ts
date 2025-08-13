import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
import { Account, Transaction, LedgerEntry } from '../models/index.js'

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId: string) => {
    const { type, id } = fromGlobalId(globalId)

    switch (type) {
      case 'Account':
        return Account.findById(id)
      case 'Transaction':
        return Transaction.findById(id).populate('from to')
      case 'LedgerEntry':
        return LedgerEntry.findById(id).populate('account transaction')
      default:
        return null
    }
  },
  (obj: any): string | undefined => {
    if (obj.constructor?.modelName === 'Account') {
      return 'Account'
    }
    if (obj.constructor?.modelName === 'Transaction') {
      return 'Transaction'
    }
    if (obj.constructor?.modelName === 'LedgerEntry') {
      return 'LedgerEntry'
    }
    return undefined
  }
)

export { nodeInterface, nodeField }