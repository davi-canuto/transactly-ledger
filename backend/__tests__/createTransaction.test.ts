import mongoose from 'mongoose'
import { Account, Transaction, LedgerEntry } from '../src/models/index.js'
import { createTransactionMutation } from '../src/mutations/createTransaction.js'
import { toGlobalId } from 'graphql-relay'

describe('createTransaction mutation', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/transactly-ledger-test')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await Account.deleteMany({})
    await Transaction.deleteMany({})
    await LedgerEntry.deleteMany({})
  })

  test('should create a transaction between two accounts', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initial_balance_cents: 100000,
      balance_cents: 100000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initial_balance_cents: 50000,
      balance_cents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    const result = await createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})

    expect(result.transaction).toBeDefined()
    expect(result.transaction.amount_cents).toBe(20000)
    expect(result.transaction.from.toString()).toBe(fromAccount._id.toString())
    expect(result.transaction.to.toString()).toBe(toAccount._id.toString())

    const updatedFromAccount = await Account.findById(fromAccount._id)
    const updatedToAccount = await Account.findById(toAccount._id)

    expect(updatedFromAccount.balance_cents).toBe(80000)
    expect(updatedToAccount.balance_cents).toBe(70000)

    const ledgerEntries = await LedgerEntry.find({ transaction: result.transaction._id })
    expect(ledgerEntries).toHaveLength(2)

    const debitEntry = ledgerEntries.find((entry) => entry.amount_cents < 0)
    const creditEntry = ledgerEntries.find((entry) => entry.amount_cents > 0)

    expect(debitEntry.amount_cents).toBe(-20000)
    expect(debitEntry.account.toString()).toBe(fromAccount._id.toString())

    expect(creditEntry.amount_cents).toBe(20000)
    expect(creditEntry.account.toString()).toBe(toAccount._id.toString())
  })

  test('should fail when transferring to the same account', async () => {
    const account = await Account.create({
      name: 'John Doe',
      initial_balance_cents: 100000,
      balance_cents: 100000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', account._id),
      toAccountId: toGlobalId('Account', account._id),
      amountCents: 20000,
    }

    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Cannot transfer to the same account'
    )
  })

  test('should fail when amount is zero or negative', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initial_balance_cents: 100000,
      balance_cents: 100000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initial_balance_cents: 50000,
      balance_cents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 0,
    }

    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Amount must be greater than zero'
    )

    input.amountCents = -100
    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Amount must be greater than zero'
    )
  })

  test('should fail when source account has insufficient balance', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initial_balance_cents: 10000,
      balance_cents: 10000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initial_balance_cents: 50000,
      balance_cents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Insufficient balance'
    )
  })

  test('should fail when source account does not exist', async () => {
    const toAccount = await Account.create({
      name: 'Jane Smith',
      initial_balance_cents: 50000,
      balance_cents: 50000,
    })

    const fakeId = new mongoose.Types.ObjectId()
    const input = {
      fromAccountId: toGlobalId('Account', fakeId),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Source account not found'
    )
  })

  test('should fail when destination account does not exist', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initial_balance_cents: 100000,
      balance_cents: 100000,
    })

    const fakeId = new mongoose.Types.ObjectId()
    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', fakeId),
      amountCents: 20000,
    }

    await expect(createTransactionMutation.mutateAndGetPayload(input, {}, {}, {})).rejects.toThrow(
      'Destination account not found'
    )
  })
})
