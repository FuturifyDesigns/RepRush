import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running as installed app
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone || 
                      document.referrer.includes('android-app://')
    
    setIsStandalone(standalone)

    // Check if already dismissed
    const dismissed = localStorage.getItem('installPromptDismissed')
    
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Show prompt after 5 seconds if mobile, not installed, and not dismissed
    if (isMobile && !standalone && !dismissed) {
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
  }

  if (!showPrompt || isStandalone) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm">
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
              <div>
                <h3 className="text-xl font-bold text-white">Install RepRush</h3>
                <p className="text-sm text-gray-400">For the best experience</p>
              </div>
            </div>

            <p className="text-base text-gray-300 leading-relaxed mb-4">
              Add RepRush to your home screen for easy access and better performance when tracking outdoor activities!
            </p>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Track runs & outdoor workouts with GPS</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Works offline - no internet needed</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Quick launch from home screen</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-orange-300 mb-2">How to install:</p>
              <div className="space-y-1 text-xs text-orange-200">
                <p>📱 <strong>iOS:</strong> Tap Share → Add to Home Screen</p>
                <p>📱 <strong>Android:</strong> Tap Menu → Install App</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRemindLater}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10"
            >
              Later
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all border border-white/10"
            >
              Don't Show Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
