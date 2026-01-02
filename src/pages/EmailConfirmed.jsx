export default function EmailConfirmed() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-green-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="glass rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Email Verified! 🎉
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-6">
              Your email has been successfully verified.
            </p>

            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-8">
              <p className="text-base sm:text-lg text-green-300 font-semibold">
                You can now close this tab
              </p>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-gray-400">
              <p>Return to the RepRush app and log in to start your fitness journey!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
