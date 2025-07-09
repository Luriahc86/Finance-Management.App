import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useFinancialData } from './hooks/useFinancialData'
import { AuthForm } from './components/AuthForm'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { TransactionList } from './components/TransactionList'
import { TransactionForm } from './components/TransactionForm'
import { BudgetManager } from './components/BudgetManager'
import { Plus } from 'lucide-react'

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const {
    transactions,
    budgets,
    dashboardData,
    loading: dataLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget
  } = useFinancialData(user?.id || null)

  const [currentTab, setCurrentTab] = useState('dashboard')
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />
  }

  const handleAddTransaction = async (transactionData: any) => {
    await addTransaction({
      ...transactionData,
      user_id: user.id
    })
  }

  const handleAddBudget = async (budgetData: any) => {
    await addBudget({
      ...budgetData,
      user_id: user.id
    })
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return dashboardData ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Welcome back!</h2>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
            <Dashboard data={dashboardData} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No data available</div>
        )
      
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
              <button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
            <TransactionList
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        )
      
      case 'budget':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Budget Management</h2>
            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onAddBudget={handleAddBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onSignOut={signOut}
    >
      {renderContent()}
      
      {showTransactionForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}
    </Layout>
  )
}

export default App