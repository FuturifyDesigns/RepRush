import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Multiple checks to detect if app is installed
    const isInstalled = () => {
      // Check 1: Display mode standalone (most reliable)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true
      }

      // Check 2: iOS standalone mode
      if (window.navigator.standalone === true) {
        return true
      }

      // Check 3: Android app referrer
      if (document.referrer.includes('android-app://')) {
        return true
      }

      // Check 4: Window size check (installed PWAs often have different dimensions)
      // PWAs don't have browser chrome, so window.innerHeight === screen.height
      if (window.innerHeight === window.screen.height && window.innerWidth === window.screen.width) {
        return true
      }

      return false
    }

    // Check if already dismissed permanently
    const dismissed = localStorage.getItem('installPromptDismissed')
    
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Check if installed
    const installed = isInstalled()

    console.log('Install Prompt Debug:', {
      isMobile,
      installed,
      dismissed,
      displayMode: window.matchMedia('(display-mode: standalone)').matches,
      standalone: window.navigator.standalone,
      windowHeight: window.innerHeight,
      screenHeight: window.screen.height
    })

    // Only show if: mobile device, NOT installed, and NOT permanently dismissed
    if (isMobile && !installed && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissed', 'true')
  }

  const handleRemindLater = () => {
    setShowPrompt(false)
    // Don't set dismissed flag, so it shows again next session
  }

  // Don't render if not showing
  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-white/10 transform transition-all duration-300 animate-slideUp">
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
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">Install RepRush</h3>
                <p className="text-sm text-gray-400">Get the full app experience</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Install RepRush on your home screen for quick access and offline workouts!
            </p>

            {/* Features */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>GPS Tracking - Track runs & outdoor activities</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Works Offline - Log workouts without internet</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Quick Access - Launch from home screen</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Full Screen Mode - Distraction-free tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="px-6 pb-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 font-medium mb-2">How to install:</p>
            <div className="space-y-1 text-xs text-blue-200">
              <p><strong>iOS:</strong> Tap <span className="inline-flex items-center px-1 bg-blue-500/20 rounded">Share</span> → <span className="inline-flex items-center px-1 bg-blue-500/20 rounded">Add to Home Screen</span></p>
              <p><strong>Android:</strong> Tap <span className="inline-flex items-center px-1 bg-blue-500/20 rounded">Menu</span> → <span className="inline-flex items-center px-1 bg-blue-500/20 rounded">Install App</span></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={handleRemindLater}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-all text-sm"
          >
            Later
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 text-white rounded-xl font-bold transition-all duration-300 text-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
