import { create } from 'zustand'
import { supabase } from '../utils/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
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
          data: { username }
        }
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            username
          })

        if (profileError) throw profileError
      }

      set({ user: data.user, session: data.session, loading: false })
      return { data, error: null }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { data: null, error }
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      set({ user: data.user, session: data.session, loading: false })
      return { data, error: null }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { data: null, error }
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true })
    try {
      await supabase.auth.signOut()
      set({ user: null, session: null, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Reset password
  resetPassword: async (email) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      set({ loading: false })
      return { error: null }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { error }
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}))
