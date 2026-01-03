import { useState, useRef } from 'react'
import { supabase } from '../utils/supabase'
import ImageCropModal from './ImageCropModal'

export default function EditProfileModal({ profile, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(profile?.avatar_url || null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
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

    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    // Read image and show crop modal
    const reader = new FileReader()
    reader.onload = (event) => {
      setTempImageSrc(event.target.result)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropSave = (blob) => {
    setSelectedImage(blob)
    setImagePreview(URL.createObjectURL(blob))
    setShowCropModal(false)
    setTempImageSrc(null)
    
    // Show success message
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setTempImageSrc(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError(null)
  }

  const uploadAvatar = async (userId) => {
    if (!selectedImage) return profile?.avatar_url

    setUploadStatus('Uploading image...')
    
    const fileName = `${userId}-${Date.now()}.jpg`
    const filePath = `${fileName}`

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedImage, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg'
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setUploadStatus('Image uploaded successfully!')
      return urlData.publicUrl
    } catch (err) {
      throw err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUploadStatus('')

    try {
      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url
      
      if (selectedImage) {
        avatarUrl = await uploadAvatar(profile.id)
      } else if (imagePreview === null) {
        avatarUrl = null
      }

      setUploadStatus('Saving profile...')

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

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      setUploadStatus('Profile updated!')
      setSuccess(true)
      
      onUpdate(data)
      
      // Wait for success animation
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
      setUploadStatus('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Crop Modal */}
      {showCropModal && tempImageSrc && (
        <ImageCropModal
          imageSrc={tempImageSrc}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

      {/* Edit Profile Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-lg border border-white/10 my-8 max-h-[90vh] overflow-y-auto">
          {/* Success Overlay */}
          {success && (
            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10 animate-fadeIn">
              <div className="bg-green-500 rounded-full p-6 animate-scaleIn">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/10 p-4 sm:p-6 rounded-t-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
            
            <div className="relative flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50"
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
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm flex items-center gap-2 animate-slideDown">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Status Message */}
            {uploadStatus && !error && (
              <div className="bg-blue-500/10 border border-blue-500/50 text-blue-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm flex items-center gap-2 animate-slideDown">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {uploadStatus}
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
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Avatar preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 hover:scale-110"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-4 border-gray-600 transition-transform hover:scale-105">
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
                    disabled={loading}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium cursor-pointer transition-all shadow-lg ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG or GIF. Max 10MB
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    ✓ Crop, rotate & zoom after upload
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10 text-sm sm:text-base disabled:opacity-50"
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
    </>
  )
}
