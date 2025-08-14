import { graphql, useLazyLoadQuery } from 'react-relay'
import AccountListItem from './AccountListItem'
import type { AccountListQuery } from '../__generated__/AccountListQuery.graphql'

const AccountListQueryGraphQL = graphql`
  query AccountListQuery($first: Int!) {
    accounts(first: $first) {
      edges {
        node {
          id
          name
          balance_cents
          createdAt
        }
      }
    }
  }
`

export default function AccountList() {
  const data = useLazyLoadQuery<AccountListQuery>(AccountListQueryGraphQL, { first: 100 })

  return (
    <div className="account-list">
      <h2>Accounts</h2>
      {data.accounts?.edges?.length === 0 ? (
        <p>No accounts found. Create your first account!</p>
      ) : (
        <div className="accounts-grid">
          {data.accounts?.edges?.map((edge) => (
            edge?.node && (
              <AccountListItem key={edge.node.id} account={edge.node} />
            )
          ))}
        </div>
      )}
    </div>
  )
}