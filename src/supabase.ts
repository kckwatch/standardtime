import { createClient } from '@supabase/supabase-js'

// Use the new Supabase credentials
const supabaseUrl = 'https://rbhkzknwpzfuhccqybko.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaGt6a253cHpmdWhjY3F5YmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTU5MTYsImV4cCI6MjA2ODA3MTkxNn0.Su8k3P6Ao-rNz7TvZsUmy-t-HJlkauJHraV9_i4HaJE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          watch_id: number | null
          watch_brand: string | null
          watch_model: string | null
         
         
          price: string | null
         
          total: number | null
          currency: string
          payment_method: string | null
          customs_assistance: boolean
          
         
          order_date: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          watch_id?: number | null
          watch_brand?: string | null
          watch_model?: string | null
        
          price?: string | null
        
          total?: number | null
          currency?: string
          payment_method?: string | null
          customs_assistance?: boolean
          status?: string
          tracking_number?: string | null
          order_date?: string | null
          created_at?: string
          updated_at?: string
          payment_approved_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          watch_id?: number | null
          watch_brand?: string | null
          watch_model?: string | null
          watch_year?: string | null
          watch_condition?: string | null
          price?: string | null
          original_price?: string | null
          subtotal?: number | null
          shipping?: number
          discount?: number
          total?: number | null
          currency?: string
          payment_method?: string | null
          customs_assistance?: boolean
          status?: string
          tracking_number?: string | null
          order_date?: string | null
          created_at?: string
          updated_at?: string
          payment_approved_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          message: string
          sender: string
          customer_email: string | null
          customer_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          message: string
          sender: string
          customer_email?: string | null
          customer_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          message?: string
          sender?: string
          customer_email?: string | null
          customer_name?: string | null
          created_at?: string
        }
      }
    }
  }
}