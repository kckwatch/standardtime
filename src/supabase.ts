import { createClient } from '@supabase/supabase-js'

// Use the provided Supabase credentials
const supabaseUrl = 'https://bwnqyyhzandwvitxsnje.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnF5eWh6YW5kd3ZpdHhzbmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzIwMzMsImV4cCI6MjA2NzQ0ODAzM30.5QS5gycTxW1r6tqRz61TMLK-x_nTesEV0Fe958Bv58E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string
          username: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          email: string
          address: string | null
          order_number: string | null
          orders: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          address?: string | null
          order_number?: string | null
          orders?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          address?: string | null
          order_number?: string | null
          orders?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}