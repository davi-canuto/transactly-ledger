import { useState } from 'react'
import { graphql, useLazyLoadQuery, useMutation } from 'react-relay'
import type { CreateTransactionQuery } from '../__generated__/CreateTransactionQuery.graphql'
import type { CreateTransactionCreateMutation } from '../__generated__/CreateTransactionCreateMutation.graphql'

const AccountsForTransactionQueryGraphQL = graphql`
  query CreateTransactionQuery($first: Int!) {
    accounts(first: $first) {
      edges {
        node {
          id
          name
          balance_cents
        }
      }
    }
  }
`

const CreateTransactionMutationGraphQL = graphql`
  mutation CreateTransactionCreateMutation($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      transaction {
        id
        from {
          id
          name
        }
        to {
          id
          name
        }
        amount_cents
        createdAt
      }
      clientMutationId
    }
  }
`

export default function CreateTransaction() {
  const [fromAccountId, setFromAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const data = useLazyLoadQuery<CreateTransactionQuery>(AccountsForTransactionQueryGraphQL, { first: 100 })
  const [commitMutation] = useMutation<CreateTransactionCreateMutation>(CreateTransactionMutationGraphQL)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fromAccountId || !toAccountId || !amount) {
      setMessage('All fields are required')
      return
    }

    if (fromAccountId === toAccountId) {
      setMessage('From and To accounts must be different')
      return
    }

    const amountFloat = parseFloat(amount)
    if (amountFloat <= 0) {
      setMessage('Amount must be greater than 0')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    const amountCents = Math.round(amountFloat * 100)

    commitMutation({
      variables: {
        input: {
          fromAccountId,
          toAccountId,
          amountCents,
        },
      },
      onCompleted: (response) => {
        setIsSubmitting(false)
        if (response.createTransaction?.transaction) {
          const tx = response.createTransaction.transaction
          setMessage(
            `Transaction created! $${((tx.amount_cents || 0) / 100).toFixed(2)} transferred from "${tx.from?.name}" to "${tx.to?.name}"`
          )
          setFromAccountId('')
          setToAccountId('')
          setAmount('')
        } else {
          setMessage('Failed to create transaction')
        }
      },
      onError: (error) => {
        setIsSubmitting(false)
        setMessage(`Error: ${error.message}`)
      },
    })
  }

  const accounts = data.accounts?.edges?.filter(edge => edge?.node) || []

  return (
    <div className="create-transaction">
      <h2>Create New Transaction</h2>
      
      {accounts.length < 2 ? (
        <div className="insufficient-accounts">
          <p>You need at least 2 accounts to create a transaction.</p>
          <p>Current accounts: {accounts.length}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="create-transaction-form">
          <div className="form-group">
            <label htmlFor="from-account">From Account *</label>
            <select
              id="from-account"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">Select source account</option>
              {accounts.map((edge) => 
                edge?.node && (
                  <option key={edge.node.id} value={edge.node.id}>
                    {edge.node.name} - ${((edge.node.balance_cents || 0) / 100).toFixed(2)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="to-account">To Account *</label>
            <select
              id="to-account"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">Select destination account</option>
              {accounts.map((edge) => 
                edge?.node && edge.node.id !== fromAccountId && (
                  <option key={edge.node.id} value={edge.node.id}>
                    {edge.node.name} - ${((edge.node.balance_cents || 0) / 100).toFixed(2)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (USD) *</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isSubmitting}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting || !fromAccountId || !toAccountId || !amount}>
            {isSubmitting ? 'Processing...' : 'Create Transaction'}
          </button>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  )
}