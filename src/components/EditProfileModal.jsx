import { useState, useRef } from 'react'
import { supabase } from '../utils/supabase'

export default function EditProfileModal({ profile, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(profile?.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    // Read and preview image
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Compress and crop to square
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Target size: 200x200 (small for free tier)
        const targetSize = 200
        canvas.width = targetSize
        canvas.height = targetSize

        // Calculate crop dimensions (center square crop)
        const minDim = Math.min(img.width, img.height)
        const sx = (img.width - minDim) / 2
        const sy = (img.height - minDim) / 2

        // Draw cropped and resized image
        ctx.drawImage(
          img,
          sx, sy, minDim, minDim,  // Source crop
          0, 0, targetSize, targetSize  // Destination
        )

        // Convert to blob with compression (quality: 0.8 for ~10-20KB files)
        canvas.toBlob(
          (blob) => {
            setSelectedImage(blob)
            setImagePreview(URL.createObjectURL(blob))
            setError(null)
          },
          'image/jpeg',
          0.8  // Quality: 80%
        )
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadAvatar = async (userId) => {
    if (!selectedImage) return profile?.avatar_url

    const fileName = `${userId}-${Date.now()}.jpg`
    const filePath = `${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, selectedImage, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url
      if (selectedImage) {
        avatarUrl = await uploadAvatar(profile.id)
      } else if (imagePreview === null) {
        avatarUrl = null
      }

      // Update profile
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-lg border border-white/10 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/10 p-4 sm:p-6 rounded-t-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
          
          <div className="relative flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Profile</h2>
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-300">
              Profile Picture
            </label>
            
            {/* Preview */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Avatar preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-4 border-gray-600">
                    <span className="text-4xl font-black text-white">
                      {formData.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 text-white rounded-xl font-medium cursor-pointer transition-all shadow-lg"
                >
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG or GIF. Max 5MB
                </p>
              </div>
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
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
