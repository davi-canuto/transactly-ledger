import { useState } from 'react'
import { graphql, useMutation } from 'react-relay'
import type { CreateAccountMutation } from '../__generated__/CreateAccountMutation.graphql'

const CreateAccountMutationGraphQL = graphql`
  mutation CreateAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      account {
        id
        name
        balanceCents
        createdAt
      }
      clientMutationId
    }
  }
`

export default function CreateAccount() {
  const [name, setName] = useState('')
  const [initialBalance, setInitialBalance] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const [commitMutation] = useMutation<CreateAccountMutation>(CreateAccountMutationGraphQL)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setMessage('Account name is required')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    const initialBalanceCents = initialBalance ? Math.round(parseFloat(initialBalance) * 100) : 0

    commitMutation({
      variables: {
        input: {
          name: name.trim(),
          initialBalanceCents,
        },
      },
      onCompleted: (response) => {
        setIsSubmitting(false)
        if (response.createAccount?.account) {
          setMessage(`Account "${response.createAccount.account.name}" created successfully!`)
          setName('')
          setInitialBalance('')
        } else {
          setMessage('Failed to create account')
        }
      },
      onError: (error) => {
        setIsSubmitting(false)
        setMessage(`Error: ${error.message}`)
      },
      updater: (store) => {
        const payload = store.getRootField('createAccount')
        const newAccount = payload?.getLinkedRecord('account')
        
        if (newAccount) {
          const root = store.getRoot()
          const accounts = root.getLinkedRecord('accounts', { first: 100 })
          const edges = accounts?.getLinkedRecords('edges') || []
          
          const newEdge = store.create(`client:newEdge:${newAccount.getValue('id')}`, 'AccountEdge')
          newEdge.setLinkedRecord(newAccount, 'node')
          newEdge.setValue('cursor', `cursor:${newAccount.getValue('id')}`)
          
          accounts?.setLinkedRecords([newEdge, ...edges], 'edges')
        }
      }
    })
  }

  return (
    <div className="create-account">
      <h2>Create New Account</h2>
      
      <form onSubmit={handleSubmit} className="create-account-form">
        <div className="form-group">
          <label htmlFor="account-name">Account Name *</label>
          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter account name"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="initial-balance">Initial Balance (USD)</label>
          <input
            id="initial-balance"
            type="number"
            step="0.01"
            min="0"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting || !name.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}