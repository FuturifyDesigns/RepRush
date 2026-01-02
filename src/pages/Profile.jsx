import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import InstallPrompt from '../components/InstallPrompt'
import EditProfileModal from '../components/EditProfileModal'
import DeleteAccountModal from '../components/DeleteAccountModal'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile)
  }

  const getNextLevelXP = (level) => {
    return level * 100 // 100 XP per level
  }

  const getTierInfo = (level) => {
    if (level >= 50) return { name: 'Legend', color: 'from-purple-500 to-pink-500', ring: 'ring-purple-500' }
    if (level >= 25) return { name: 'Elite', color: 'from-yellow-500 to-orange-500', ring: 'ring-yellow-500' }
    if (level >= 10) return { name: 'Advanced', color: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500' }
    if (level >= 5) return { name: 'Intermediate', color: 'from-green-500 to-emerald-500', ring: 'ring-green-500' }
    return { name: 'Beginner', color: 'from-gray-500 to-gray-600', ring: 'ring-gray-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  const tier = getTierInfo(profile?.level || 1)
  const nextLevelXP = getNextLevelXP(profile?.level || 1)
  const progressPercent = ((profile?.current_xp || 0) / nextLevelXP) * 100

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Install Prompt for Mobile Users */}
      <InstallPrompt />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      
      {/* Hero Section with Background Image */}
      <div className="relative h-80 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
        </div>

        {/* Header */}
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}reprush-logo.png`} alt="RepRush" className="w-12 h-12" />
              <div>
                <h1 className="text-xl font-bold text-white">RepRush</h1>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium transition-all duration-300 text-sm"
              >
                Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-medium transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="relative z-10 container mx-auto px-4 mt-12">
          <div className="flex items-end gap-6">
            {/* Avatar with Level Badge at Bottom */}
            <div className="relative">
              <div className={`relative ring-4 ${tier.ring} rounded-full p-1 bg-gray-900`}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                    <span className="text-5xl font-black text-white">
                      {profile?.username?.[0]?.toUpperCase() || 'R'}
                    </span>
                  </div>
                )}
              </div>
              {/* Level Badge - Moved to Bottom */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full border-4 border-gray-900 shadow-lg">
                <span className="text-sm font-black text-white">LVL {profile?.level || 1}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-4">
              <h2 className="text-4xl font-black text-white mb-2">
                {profile?.username || 'Athlete'}
              </h2>
              {profile?.bio && (
                <p className="text-gray-400 text-sm mb-3 max-w-2xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 bg-gradient-to-r ${tier.color} rounded-full text-sm font-bold text-white`}>
                  {tier.name}
                </span>
                <span className="text-gray-400 text-sm">
                  Member since {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Progress Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Level Progress</h3>
                <span className="text-sm text-gray-400">{profile?.current_xp || 0} / {nextLevelXP} XP</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                {nextLevelXP - (profile?.current_xp || 0)} XP until level {(profile?.level || 1) + 1}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Total XP */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-transform">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {profile?.total_xp?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>

              {/* Workouts */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-transform">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-white mb-1">0</div>
                <div className="text-sm text-gray-400">Workouts</div>
              </div>

              {/* Streak */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 text-center group hover:scale-105 transition-transform">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-white mb-1">0</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-left hover:scale-105 transition-all">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">Start Workout</h4>
                    <p className="text-sm text-white/80">Log a new session</p>
                  </div>
                </button>

                <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-left hover:scale-105 transition-all">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">View History</h4>
                    <p className="text-sm text-white/80">Past workouts</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Achievements & Activity */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">Ready to Start!</div>
                    <div className="text-xs text-gray-400">Complete your first workout</div>
                  </div>
                  <div className="text-xs text-gray-500">Locked</div>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-sm">Start working out to unlock achievements</p>
                </div>
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Weekly Activity</h3>
              <div className="grid grid-cols-7 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{day}</div>
                    <div className="w-8 h-8 mx-auto bg-gray-700 rounded-lg" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                No activity this week. Start your first workout!
              </p>
            </div>

            {/* Account Settings */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Account</h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-medium transition-all text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
