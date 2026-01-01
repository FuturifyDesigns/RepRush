import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Mobile Responsive */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src="/reprush-logo.png" alt="RepRush" className="w-10 h-10 sm:w-12 sm:h-12" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">RepRush</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Level Up Every Rep</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 sm:px-6 py-2 sm:py-2.5 text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card - Mobile Responsive */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {user?.user_metadata?.username?.[0]?.toUpperCase() || 'R'}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                  Welcome, {user?.user_metadata?.username || 'Athlete'}! 🎉
                </h2>
                <p className="text-sm sm:text-lg text-gray-400">
                  Your RepRush journey begins now
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center">
              <div className="text-4xl sm:text-6xl font-black mb-1 sm:mb-2">1</div>
              <div className="text-xs sm:text-sm opacity-90 mb-1">Level</div>
              <div className="text-[10px] sm:text-xs opacity-75">Beginner I</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center">
              <div className="text-4xl sm:text-6xl font-black mb-1 sm:mb-2">0</div>
              <div className="text-xs sm:text-sm opacity-90 mb-1">Workouts</div>
              <div className="text-[10px] sm:text-xs opacity-75">Get started!</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center">
              <div className="text-4xl sm:text-6xl font-black mb-1 sm:mb-2">0</div>
              <div className="text-xs sm:text-sm opacity-90 mb-1">XP</div>
              <div className="text-[10px] sm:text-xs opacity-75">100 XP to Level 2</div>
            </div>
          </div>

          {/* Getting Started - Mobile Responsive */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Getting Started</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white text-base sm:text-lg">Track Your First Workout</div>
                  <div className="text-xs sm:text-sm text-gray-400">Start earning XP and leveling up</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white text-base sm:text-lg">Set Daily Goals</div>
                  <div className="text-xs sm:text-sm text-gray-400">Stay consistent and build habits</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-white text-base sm:text-lg">Join a Team</div>
                  <div className="text-xs sm:text-sm text-gray-400">Compete and stay motivated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps CTA - Mobile Responsive */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-400 mb-4 sm:mb-6 text-base sm:text-lg">Ready to start your fitness journey?</p>
            <button className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-orange-500/50">
              Start Your First Workout 🚀
            </button>
          </div>

          {/* Info Notice - Mobile Responsive */}
          <div className="mt-8 sm:mt-12 bg-blue-500/10 border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center backdrop-blur-sm">
            <h4 className="font-bold text-blue-400 mb-2 text-base sm:text-lg">🚧 Development Notice</h4>
            <p className="text-blue-300 text-xs sm:text-sm">
              RepRush is currently in development. More features coming soon!<br />
              Set up your Supabase database to enable full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
