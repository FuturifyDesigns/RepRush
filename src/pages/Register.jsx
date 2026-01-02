import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { signup, loading, error } = useAuthStore()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [formError, setFormError] = useState('')
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    
    const { error } = await signup(
      formData.email, 
      formData.password, 
      formData.username
    )
    
    if (!error) {
      // Show verification message instead of redirecting
      setShowVerificationMessage(true)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // If verification message should be shown
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center justify-center mb-8 sm:mb-12 group">
              <img 
                src={`${import.meta.env.BASE_URL}reprush-logo.png`}
                alt="RepRush" 
                className="h-24 w-24 sm:h-32 sm:w-32 group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4"
              />
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">RepRush</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Level Up Every Rep</p>
              </div>
            </Link>

            {/* Success Card */}
            <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Check Your Email!</h2>
                <p className="text-sm sm:text-base text-gray-400">
                  We sent a verification link to
                </p>
                <p className="text-base sm:text-lg text-orange-400 font-semibold mt-2">
                  {formData.email}
                </p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-300 text-center">
                  Click the link in the email to verify your account before logging in.
                </p>
              </div>

              <div className="space-y-3 text-center text-sm text-gray-400">
                <p>Didn't receive the email?</p>
                <ul className="space-y-2">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and check again</li>
                </ul>
              </div>

              <div className="mt-8 text-center">
                <Link 
                  to="/login" 
                  className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300"
                >
                  Go to Login
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6 sm:mt-8">
              <Link 
                to="/" 
                className="text-sm sm:text-base text-gray-500 hover:text-white transition-colors inline-flex items-center gap-2 group"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content - Mobile Responsive */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo - Mobile Responsive */}
          <Link to="/" className="flex flex-col items-center justify-center mb-8 sm:mb-12 group">
            <img 
              src={`${import.meta.env.BASE_URL}reprush-logo.png`}
              alt="RepRush" 
              className="h-24 w-24 sm:h-32 sm:w-32 group-hover:scale-110 transition-transform duration-300 mb-3 sm:mb-4"
            />
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">RepRush</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Level Up Every Rep</p>
            </div>
          </Link>

          {/* Register Card - Mobile Responsive */}
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Start Your Journey</h2>
              <p className="text-sm sm:text-base text-gray-400">Create your free account</p>
            </div>

            {/* Error Messages */}
            {(error || formError) && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error || formError}</span>
                </div>
              </div>
            )}

            {/* Register Form - Mobile Responsive */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input text-sm sm:text-base"
                  placeholder="athlete123"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  At least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-transparent text-gray-500">or</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6 sm:mt-8">
            <Link 
              to="/" 
              className="text-sm sm:text-base text-gray-500 hover:text-white transition-colors inline-flex items-center gap-2 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
