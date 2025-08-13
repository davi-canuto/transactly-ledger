import { connectionDefinitions } from 'graphql-relay'
import { AccountType } from './types/Account.js'
import { TransactionType } from './types/Transaction.js'
import { LedgerEntryType } from './types/LedgerEntry.js'

const { connectionType: AccountConnection } = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
})

const { connectionType: TransactionConnection } = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
})

const { connectionType: LedgerEntryConnection } = connectionDefinitions({
  name: 'LedgerEntry',
  nodeType: LedgerEntryType,
})

export { AccountConnection, TransactionConnection, LedgerEntryConnection }
