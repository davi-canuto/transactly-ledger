import { useState, Suspense } from 'react'
import AccountList from './components/AccountList'
import CreateAccount from './components/CreateAccount'
import CreateTransaction from './components/CreateTransaction'
import './App.css'

type TabType = 'accounts' | 'create-account' | 'create-transaction'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('accounts')

  return (
    <div className="app">
      <header>
        <h1>Transactly Ledger</h1>
        <nav>
          <button 
            className={activeTab === 'accounts' ? 'active' : ''} 
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
          <button 
            className={activeTab === 'create-account' ? 'active' : ''} 
            onClick={() => setActiveTab('create-account')}
          >
            Create Account
          </button>
          <button 
            className={activeTab === 'create-transaction' ? 'active' : ''} 
            onClick={() => setActiveTab('create-transaction')}
          >
            Create Transaction
          </button>
        </nav>
      </header>
      
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          {activeTab === 'accounts' && <AccountList />}
          {activeTab === 'create-account' && <CreateAccount />}
          {activeTab === 'create-transaction' && <CreateTransaction />}
        </Suspense>
      </main>
    </div>
  )
}

export default App
