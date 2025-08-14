import mongoose from 'mongoose'
import { Account, Transaction, LedgerEntry } from '../src/models/index'
import { createTransactionMutation } from '../src/mutations/createTransaction'
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
      initialBalanceCents: 100000,
      balanceCents: 100000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initialBalanceCents: 50000,
      balanceCents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    const result = await (createTransactionMutation.resolve as any)(null, { input }, {}, {})

    expect(result.transaction).toBeDefined()
    expect(result.transaction.amountCents).toBe(20000)
    expect(result.transaction.from._id.toString()).toBe(fromAccount._id.toString())
    expect(result.transaction.to._id.toString()).toBe(toAccount._id.toString())

    const updatedFromAccount = await Account.findById(fromAccount._id)
    const updatedToAccount = await Account.findById(toAccount._id)

    expect(updatedFromAccount!.balanceCents).toBe(80000)
    expect(updatedToAccount!.balanceCents).toBe(70000)

    const ledgerEntries = await LedgerEntry.find({ transaction: result.transaction._id })
    expect(ledgerEntries).toHaveLength(2)

    const debitEntry = ledgerEntries.find((entry) => entry.amountCents < 0)
    const creditEntry = ledgerEntries.find((entry) => entry.amountCents > 0)

    expect(debitEntry!.amountCents).toBe(-20000)
    expect(debitEntry!.account.toString()).toBe(fromAccount._id.toString())

    expect(creditEntry!.amountCents).toBe(20000)
    expect(creditEntry!.account.toString()).toBe(toAccount._id.toString())
  })

  test('should fail when transferring to the same account', async () => {
    const account = await Account.create({
      name: 'John Doe',
      initialBalanceCents: 100000,
      balanceCents: 100000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', account._id),
      toAccountId: toGlobalId('Account', account._id),
      amountCents: 20000,
    }

    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Cannot transfer to the same account'
    )
  })

  test('should fail when amount is zero or negative', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initialBalanceCents: 100000,
      balanceCents: 100000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initialBalanceCents: 50000,
      balanceCents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 0,
    }

    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Amount must be greater than zero'
    )

    input.amountCents = -100
    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Amount must be greater than zero'
    )
  })

  test('should fail when source account has insufficient balance', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initialBalanceCents: 10000,
      balanceCents: 10000,
    })

    const toAccount = await Account.create({
      name: 'Jane Smith',
      initialBalanceCents: 50000,
      balanceCents: 50000,
    })

    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Insufficient balance'
    )
  })

  test('should fail when source account does not exist', async () => {
    const toAccount = await Account.create({
      name: 'Jane Smith',
      initialBalanceCents: 50000,
      balanceCents: 50000,
    })

    const fakeId = new mongoose.Types.ObjectId()
    const input = {
      fromAccountId: toGlobalId('Account', fakeId.toString()),
      toAccountId: toGlobalId('Account', toAccount._id),
      amountCents: 20000,
    }

    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Source account not found'
    )
  })

  test('should fail when destination account does not exist', async () => {
    const fromAccount = await Account.create({
      name: 'John Doe',
      initialBalanceCents: 100000,
      balanceCents: 100000,
    })

    const fakeId = new mongoose.Types.ObjectId()
    const input = {
      fromAccountId: toGlobalId('Account', fromAccount._id),
      toAccountId: toGlobalId('Account', fakeId.toString()),
      amountCents: 20000,
    }

    await expect((createTransactionMutation.resolve as any)(null, { input }, {}, {})).rejects.toThrow(
      'Destination account not found'
    )
  })
})
