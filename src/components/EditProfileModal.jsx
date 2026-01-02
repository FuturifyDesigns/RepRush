import { useState } from 'react'
import { supabase } from '../utils/supabase'

// Free avatar services
const AVATAR_SERVICES = [
  { name: 'DiceBear', url: (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` },
  { name: 'UI Avatars', url: (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=F97316&color=fff&bold=true` },
  { name: 'Gravatar', url: (email) => `https://www.gravatar.com/avatar/${email}?s=200&d=identicon` },
]

export default function EditProfileModal({ profile, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
  })
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || null)
  const [customAvatarUrl, setCustomAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateAvatars = () => {
    const seed = formData.username || profile?.username || 'user'
    return [
      {
        type: 'dicebear-1',
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        label: 'Style 1'
      },
      {
        type: 'dicebear-2',
        url: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
        label: 'Style 2'
      },
      {
        type: 'dicebear-3',
        url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`,
        label: 'Style 3'
      },
      {
        type: 'ui-avatars',
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.username || 'User')}&size=200&background=F97316&color=fff&bold=true`,
        label: 'Initial'
      },
      {
        type: 'dicebear-4',
        url: `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`,
        label: 'Style 4'
      },
      {
        type: 'dicebear-5',
        url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`,
        label: 'Style 5'
      },
    ]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use custom URL if provided, otherwise use selected
      const avatarUrl = customAvatarUrl.trim() || selectedAvatar

      // Update profile (no file upload needed!)
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) throw updateError

      onUpdate(data)
      onClose()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const avatars = generateAvatars()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-white/10 my-8">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
          
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-300">
              Choose Avatar (Free CDN - No Storage Used!)
            </label>
            
            {/* Current/Selected Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                {selectedAvatar || customAvatarUrl ? (
                  <img
                    src={customAvatarUrl || selectedAvatar}
                    alt="Selected avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-4 border-gray-600">
                    <span className="text-2xl font-black text-white">
                      {formData.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">Current Selection</p>
                <p className="text-xs text-gray-500">Hosted on free CDN</p>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {avatars.map((avatar) => (
                <button
                  key={avatar.type}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(avatar.url)
                    setCustomAvatarUrl('')
                  }}
                  className={`relative group p-2 rounded-xl border-2 transition-all ${
                    selectedAvatar === avatar.url && !customAvatarUrl
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 hover:border-orange-500/50'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.label}
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">{avatar.label}</p>
                </button>
              ))}
            </div>

            {/* Custom URL Option */}
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-400">
                Or paste your own image URL
              </label>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value)
                  if (e.target.value) setSelectedAvatar(null)
                }}
                className="input text-sm"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use imgur.com or any free image hosting
              </p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">
              3-20 characters
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input min-h-[80px] resize-none"
              placeholder="Tell us about yourself..."
              maxLength={150}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.bio?.length || 0}/150
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="px-6 pb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 <strong>Free Tier Optimized:</strong> Avatars are hosted on free CDNs (DiceBear, UI Avatars). No storage or bandwidth used!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
