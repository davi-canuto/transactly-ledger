import { useState } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import type { AccountListItemQuery } from '../__generated__/AccountListItemQuery.graphql'

type AccountListItemProps = {
  account: {
    id: string
    name: string | null | undefined
    balance_cents: number | null | undefined
    createdAt: string | null | undefined
  }
}

const AccountBalanceQueryGraphQL = graphql`
  query AccountListItemQuery($accountId: ID!) {
    accountBalance(accountId: $accountId)
    ledgerEntries(first: 10) {
      edges {
        node {
          id
          amount_cents
          createdAt
          transaction {
            id
            from {
              name
            }
            to {
              name
            }
          }
        }
      }
    }
  }
`

export default function AccountListItem({ account }: AccountListItemProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  const formatCurrency = (cents: number | null | undefined) => {
    if (cents === null || cents === undefined) return '$0.00'
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString()
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div className="account-item">
      <div className="account-header" onClick={toggleDetails}>
        <h3>{account.name || 'Unnamed Account'}</h3>
        <div className="account-balance">
          {formatCurrency(account.balance_cents)}
        </div>
        <small>Created: {formatDate(account.createdAt)}</small>
        <button className="details-toggle">
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {showDetails && <AccountDetails accountId={account.id} />}
    </div>
  )
}

function AccountDetails({ accountId }: { accountId: string }) {
  const data = useLazyLoadQuery<AccountListItemQuery>(AccountBalanceQueryGraphQL, { accountId })

  return (
    <div className="account-details">
      <div className="balance-info">
        <h4>Current Balance: {data.accountBalance ? `$${(data.accountBalance / 100).toFixed(2)}` : '$0.00'}</h4>
      </div>
      
      <div className="recent-transactions">
        <h4>Recent Transactions</h4>
        {data.ledgerEntries?.edges?.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="transaction-list">
            {data.ledgerEntries?.edges?.map((edge) => (
              edge?.node && (
                <div key={edge.node.id} className="transaction-item">
                  <div className="transaction-amount">
                    {edge.node.amount_cents && edge.node.amount_cents > 0 ? '+' : ''}
                    ${edge.node.amount_cents ? (edge.node.amount_cents / 100).toFixed(2) : '0.00'}
                  </div>
                  <div className="transaction-details">
                    <div>From: {edge.node.transaction?.from?.name || 'Unknown'}</div>
                    <div>To: {edge.node.transaction?.to?.name || 'Unknown'}</div>
                    <small>{new Date(edge.node.createdAt || '').toLocaleDateString()}</small>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}