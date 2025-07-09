import React, { useState } from 'react'
import { Budget, Transaction } from '../types'
import { Plus, Target, AlertCircle, CheckCircle } from 'lucide-react'

interface BudgetManagerProps {
  budgets: Budget[]
  transactions: Transaction[]
  onAddBudget: (budget: Omit<Budget, 'id' | 'created_at'>) => void
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void
  onDeleteBudget: (id: string) => void
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}) => {
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const calculateSpent = (budget: Budget) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date)
        const isExpense = transaction.type === 'expense'
        const isCategory = transaction.category === budget.category

        if (budget.period === 'monthly') {
          return isExpense && isCategory &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        } else {
          return isExpense && isCategory &&
            transactionDate.getFullYear() === currentYear
        }
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount) return

    onAddBudget({
      user_id: '', // Will be set in the hook
      category,
      amount: parseFloat(amount),
      period
    })

    setCategory('')
    setAmount('')
    setShowForm(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Budget Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Food, Transportation"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Budget
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No budgets set up yet
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = calculateSpent(budget)
            const percentage = (spent / budget.amount) * 100
            const isOverBudget = spent > budget.amount

            return (
              <div key={budget.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isOverBudget ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isOverBudget ? <AlertCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{budget.category}</h3>
                      <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </p>
                    <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {isOverBudget && (
                  <p className="text-sm text-red-600 mt-2">
                    Over budget by {formatCurrency(spent - budget.amount)}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}