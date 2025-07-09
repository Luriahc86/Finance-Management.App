import React from 'react'
import { DashboardData } from '../types'
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

interface DashboardProps {
  data: DashboardData
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(data.balance),
      icon: DollarSign,
      color: data.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.balance >= 0 ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(data.monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(data.monthlyExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Net Monthly',
      value: formatCurrency(data.monthlyIncome - data.monthlyExpenses),
      icon: CreditCard,
      color: data.monthlyIncome - data.monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.monthlyIncome - data.monthlyExpenses >= 0 ? 'bg-green-50' : 'bg-red-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {data.recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}