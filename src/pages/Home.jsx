import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export default function Home() {
  const { user } = useAuthStore()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Unsplash fitness images for background slideshow
  const backgroundImages = [
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
    'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=1920&q=80',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Background Slideshow */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 2s ease-in-out',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Slideshow Indicators */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: index === currentSlide ? '2rem' : '0.5rem',
              height: '0.5rem',
              borderRadius: '0.25rem',
              background: index === currentSlide ? '#F97316' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={`${import.meta.env.BASE_URL}reprush-logo.png`} alt="RepRush" className="h-12 w-12 sm:h-16 sm:w-16" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">RepRush</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Level Up Every Rep</p>
            </div>
          </div>
          
          {/* NAVIGATION BUTTONS - CONDITIONAL BASED ON AUTH */}
          {user ? (
            // LOGGED IN - Show Workout and Profile buttons
            <div className="flex items-center gap-2">
              <Link 
                to="/workout"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50 text-xs sm:text-sm font-bold tracking-wide"
              >
                Start Workout
              </Link>
              <Link 
                to="/profile"
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-wide"
              >
                Profile
              </Link>
            </div>
          ) : (
            // LOGGED OUT - Show Sign In button
            <Link 
              to="/login"
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-wide"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 sm:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 leading-none tracking-tighter">
              Rush Through
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Your Fitness Goals
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-2">
              Every rep counts. Earn XP, level up, and compete. Turn your workouts into an epic gaming experience.
            </p>

            {/* MAIN CTA BUTTON - ALWAYS SHOWS "START FREE" WHEN LOGGED OUT */}
            {!user && (
              <div className="flex justify-center items-center mb-12 sm:mb-16">
                <Link
                  to="/register"
                  className="group relative px-8 sm:px-12 py-3.5 sm:py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-base sm:text-lg lg:text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
                >
                  <span className="relative z-10">Start Free</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-400 px-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Works Offline</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Cross-Platform</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">100% Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center mb-8 sm:mb-16">
              Why <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">RepRush</span>?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Earn XP & Level Up</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Every rep, every set, every workout earns you XP. Watch your level rise as you progress through your fitness journey.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Track Everything</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Log your workouts, track your progress, and see your improvements over time. From strength to cardio, we've got you covered.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Compete & Share</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Join leaderboards, unlock achievements, and compete with friends. Make fitness a social adventure.
                </p>
              </div>
            </div>

            {/* BOTTOM CTA BUTTON - ONLY SHOWS IF LOGGED OUT */}
            {!user && (
              <div className="text-center mt-8 sm:mt-12 pb-24">
                <Link
                  to="/register"
                  className="inline-block px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-orange-500/50"
                >
                  Start Your Journey Free
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}reprush-favicon.png`} alt="RepRush" className="h-6 w-6" />
              <p>&copy; 2025 RepRush. All rights reserved.</p>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
