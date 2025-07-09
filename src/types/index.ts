export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  period: 'monthly' | 'yearly'
  created_at: string
}

export interface User {
  id: string
  email: string
}

export interface DashboardData {
  totalIncome: number
  totalExpenses: number
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  recentTransactions: Transaction[]
  expensesByCategory: { category: string; amount: number }[]
  monthlySpending: { month: string; amount: number }[]
}