import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      // Only set user if email is confirmed
      if (session?.user?.email_confirmed_at) {
        set({ user: session.user })
      } else {
        set({ user: null })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  },

  // Sign up
  signup: async (email, password, username) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: 'https://futurifydesigns.github.io/RepRush/email-confirmed',
        },
      })

      if (error) throw error

      // Don't set user - they need to verify email first
      set({ loading: false })
      return { user: data.user, error: null }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { user: null, error: error.message }
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        set({ 
          error: 'Please verify your email before logging in. Check your inbox for the verification link.', 
          loading: false,
          user: null
        })
        return { user: null, error: 'Email not verified' }
      }

      set({ user: data.user, loading: false })
      return { user: data.user, error: null }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { user: null, error: error.message }
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({ user: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
