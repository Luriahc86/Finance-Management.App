import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Transaction, Budget, DashboardData } from '../types'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

export const useFinancialData = (userId: string | null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setLoading(true)
      
      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      // Fetch budgets
      const { data: budgetsData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)

      if (transactionsData) setTransactions(transactionsData)
      if (budgetsData) setBudgets(budgetsData)

      // Calculate dashboard data
      if (transactionsData) {
        const now = new Date()
        const currentMonth = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)

        const totalIncome = transactionsData
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = transactionsData
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)

        const monthlyTransactions = transactionsData.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate >= currentMonth && transactionDate <= currentMonthEnd
        })

        const monthlyIncome = monthlyTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)

        const monthlyExpenses = monthlyTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)

        const expensesByCategory = transactionsData
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          }, {} as Record<string, number>)

        const monthlySpending = Array.from({ length: 6 }, (_, i) => {
          const month = subMonths(now, 5 - i)
          const monthStart = startOfMonth(month)
          const monthEnd = endOfMonth(month)
          
          const monthTransactions = transactionsData.filter(t => {
            const date = new Date(t.date)
            return date >= monthStart && date <= monthEnd && t.type === 'expense'
          })
          
          return {
            month: format(month, 'MMM'),
            amount: monthTransactions.reduce((sum, t) => sum + t.amount, 0)
          }
        })

        setDashboardData({
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          monthlyIncome,
          monthlyExpenses,
          recentTransactions: transactionsData.slice(0, 5),
          expensesByCategory: Object.entries(expensesByCategory).map(([category, amount]) => ({
            category,
            amount
          })),
          monthlySpending
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [userId])

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (data && !error) {
      setTransactions(prev => [data, ...prev])
    }
    return { data, error }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (data && !error) {
      setTransactions(prev => prev.map(t => t.id === id ? data : t))
    }
    return { data, error }
  }

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
    return { error }
  }

  const addBudget = async (budget: Omit<Budget, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('budgets')
      .insert([budget])
      .select()
      .single()

    if (data && !error) {
      setBudgets(prev => [...prev, data])
    }
    return { data, error }
  }

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (data && !error) {
      setBudgets(prev => prev.map(b => b.id === id ? data : b))
    }
    return { data, error }
  }

  const deleteBudget = async (id: string) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)

    if (!error) {
      setBudgets(prev => prev.filter(b => b.id !== id))
    }
    return { error }
  }

  return {
    transactions,
    budgets,
    dashboardData,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget
  }
}