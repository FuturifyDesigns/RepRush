import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null })
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
        },
      })

      if (error) throw error

      set({ user: data.user, loading: false })
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
