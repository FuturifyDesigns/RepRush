import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }
    checkMobile()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Check if user has already dismissed the prompt
      const dismissed = localStorage.getItem('installPromptDismissed')
      const installed = localStorage.getItem('appInstalled')
      
      if (!dismissed && !installed && isMobile) {
        // Show prompt after 3 seconds
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem('appInstalled', 'true')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [isMobile])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      localStorage.setItem('appInstalled', 'true')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissed', 'true')
  }

  const handleRemindLater = () => {
    setShowPrompt(false)
    // Will show again next session
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-white/10 animate-slideUp">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Install RepRush</h3>
                <p className="text-sm text-gray-400">Get the full experience</p>
              </div>
            </div>

            <p className="text-base text-gray-300 leading-relaxed mb-4">
              Track outdoor runs, cycling, and gym sessions with ease. Install RepRush for:
            </p>

            {/* Benefits List */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">GPS Tracking</p>
                  <p className="text-xs text-gray-400">Track runs, walks, and outdoor activities</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Works Offline</p>
                  <p className="text-xs text-gray-400">Log workouts without internet</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Quick Access</p>
                  <p className="text-xs text-gray-400">Launch from your home screen</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Full Screen Mode</p>
                  <p className="text-xs text-gray-400">Distraction-free workout tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 space-y-3">
          <button
            onClick={handleInstall}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50"
          >
            Install Now
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRemindLater}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10"
            >
              Remind Later
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10"
            >
              No Thanks
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Installing adds a shortcut to your home screen. You can uninstall anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
