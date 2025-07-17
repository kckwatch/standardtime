import { createClient } from '@supabase/supabase-js'

// Load Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

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
         
          price?: string | null
          original_price?: string | null
          subtotal?: number | null
  

          total?: number | null
          currency?: string
          payment_method?: string | null
          customs_assistance?: boolean
  
        
        }
      }
      chat_messages: {
        Row: {
          message: string | null
          sender: string | null
          customer_email: string | null
          customer_name: string | null
          created_at: string
        }
        Insert: {

          message: string | null
          sender: string | null
          customer_email?: string | null
          customer_name?: string | null
          created_at?: string
        }
        Update: {
        
          message?: string | null
          sender?: string | null
          customer_email?: string | null
          customer_name?: string | null
          created_at?: string
        }
      }
    }
  }
}