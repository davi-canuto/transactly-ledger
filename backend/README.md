# Transactly-Ledger

A simple banking system with double-entry ledger using GraphQL and Relay.

## Features

- **Account Management**: Create and manage bank accounts
- **Double-Entry Ledger**: Every transaction creates corresponding debit and credit entries
- **GraphQL API**: Full GraphQL API with Relay support
- **MongoDB Transactions**: Atomic operations using MongoDB transactions
- **Balance Validation**: Ensures accounts have sufficient balance before debiting
- **Relay Connections**: Pagination support for all list queries

## Tech Stack

- Node.js
- Koa.js
- MongoDB (Mongoose)
- GraphQL with graphql-relay
- Jest (for testing)

## Models

### Account
- `name`: Account holder name
- `initialBalance`: Initial balance when account was created
- `balance`: Current account balance (cached)

### Transaction
- `from`: Source account ID
- `to`: Destination account ID
- `amount`: Transaction amount
- `entries`: Array of associated ledger entries

### LedgerEntry
- `account`: Account ID
- `amount`: Amount (positive for credit, negative for debit)
- `transaction`: Associated transaction ID
- `meta`: Additional metadata

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB connection string.

3. **Start MongoDB:**
   Make sure MongoDB is running locally or update `MONGODB_URI` in `.env`

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Access GraphQL Playground:**
   Open http://localhost:4000/graphql in your browser

## Example Queries

### Create an Account
```graphql
mutation {
  createAccount(input: {
    name: "John Doe"
    initialBalance: 1000
    clientMutationId: "1"
  }) {
    account {
      id
      name
      balance
    }
  }
}
```

### Create a Transaction
```graphql
mutation {
  createTransaction(input: {
    fromAccountId: "QWNjb3VudDo2NTQ..."
    toAccountId: "QWNjb3VudDo2NTU..."
    amount: 250
    clientMutationId: "2"
  }) {
    transaction {
      id
      amount
      from {
        name
        balance
      }
      to {
        name
        balance
      }
    }
  }
}
```

### Query Accounts with Pagination
```graphql
query {
  accounts(first: 10) {
    edges {
      node {
        id
        name
        balance
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Query Transactions
```graphql
query {
  transactions(first: 10) {
    edges {
      node {
        id
        amount
        from {
          name
        }
        to {
          name
        }
        createdAt
      }
    }
  }
}
```

### Query Ledger Entries
```graphql
query {
  ledgerEntries(first: 10) {
    edges {
      node {
        id
        amount
        account {
          name
        }
        transaction {
          amount
        }
        createdAt
      }
    }
  }
}
```

### Get Account Balance
```graphql
query {
  accountBalance(accountId: "QWNjb3VudDo2NTQ...")
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── models/           # Mongoose models
│   ├── Account.js
│   ├── Transaction.js
│   ├── LedgerEntry.js
│   └── index.js
├── schema/           # GraphQL schema definitions
│   ├── types/        # GraphQL type definitions
│   ├── nodeDefinitions.js
│   ├── connections.js
│   └── index.js
├── mutations/        # GraphQL mutations
│   ├── createAccount.js
│   └── createTransaction.js
├── resolvers/        # GraphQL resolvers
│   ├── queries.js
│   └── mutations.js
├── utils/            # Utility functions
│   └── connectionFromMongoose.js
├── database.js       # Database connection
└── server.js         # Main server file
__tests__/            # Test files
└── createTransaction.test.js
```

## Deployment

### Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
4. Deploy

### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add MongoDB service or use external MongoDB
4. Set environment variables
5. Deploy

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/transactly-ledger)
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

## Double-Entry Ledger Rules

1. Every transaction creates exactly two ledger entries
2. One debit entry (negative amount) for the source account
3. One credit entry (positive amount) for the destination account
4. The sum of all ledger entries for any transaction equals zero
5. Account balances are updated atomically with ledger entries
6. All operations are wrapped in MongoDB transactions for consistency
