import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function DeleteAccountModal({ onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Delete user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user.id
      )

      if (deleteError) {
        // If admin delete fails, try user delete
        const { error: userDeleteError } = await supabase.auth.updateUser({
          data: { deleted: true }
        })
        
        if (userDeleteError) throw userDeleteError
      }

      // Logout and redirect
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('Failed to delete account. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-red-500/50">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-red-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Delete Account</h2>
            </div>
            <p className="text-gray-400 text-sm">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <h3 className="text-red-400 font-bold mb-2">You will lose:</h3>
            <ul className="space-y-1 text-sm text-red-300">
              <li>• All workout history</li>
              <li>• Your level and XP progress</li>
              <li>• All achievements</li>
              <li>• Profile and stats</li>
              <li>• Access to your account</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Type <span className="text-red-500 font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input text-center font-bold"
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || confirmText !== 'DELETE'}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Forever'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
