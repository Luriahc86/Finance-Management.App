import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          period: 'monthly' | 'yearly'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          period: 'monthly' | 'yearly'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          amount?: number
          period?: 'monthly' | 'yearly'
          created_at?: string
        }
      }
    }
  }
}