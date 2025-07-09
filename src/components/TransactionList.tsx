import React, { useState } from 'react'
import { Transaction } from '../types'
import { TrendingUp, TrendingDown, Edit2, Trash2, Filter } from 'lucide-react'
import { format } from 'date-fns'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const filteredTransactions = transactions
    .filter(transaction => filter === 'all' || transaction.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.amount - a.amount
      }
    })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}