import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Home() {
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
      {/* Background Slideshow - Using transform3d trick for mobile */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          transform: 'translateZ(0)', // Force GPU acceleration
          willChange: 'transform', // Optimize for animations
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
              backgroundRepeat: 'no-repeat',
              transform: 'translate3d(0, 0, 0)', // Force layer
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.9))',
            }} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation - Mobile Responsive */}
        <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={`${import.meta.env.BASE_URL}reprush-logo.png`} alt="RepRush" className="h-12 w-12 sm:h-16 sm:w-16" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">RepRush</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">Level Up Every Rep</p>
            </div>
          </div>
          <Link 
            to="/login"
            className="px-4 sm:px-6 py-2 sm:py-2.5 text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm font-medium tracking-wide"
          >
            Sign In
          </Link>
        </nav>

        {/* Hero Section - Mobile Responsive */}
        <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 sm:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 leading-none tracking-tighter">
              Rush Through
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Your Fitness Goals
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-2">
              Every rep counts. Earn XP, level up, and compete. Turn your workouts into an epic gaming experience.
            </p>

            {/* CTA Button - Mobile Responsive */}
            <div className="flex justify-center items-center mb-12 sm:mb-16">
              <Link
                to="/register"
                className="group relative px-8 sm:px-12 py-3.5 sm:py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-base sm:text-lg lg:text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
              >
                <span className="relative z-10">Start Free</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust Indicators - Mobile Responsive */}
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
                <span className="whitespace-nowrap">Real-Time Sync</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Privacy First</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Mobile Responsive */}
        <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-orange-500/50">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">Earn & Level Up</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Every rep, every mile, every second counts. Gain XP, climb tiers from Beginner to Legend, and unlock exclusive achievements.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-orange-500/50">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">Train Anywhere</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  GPS tracking works offline. No signal? No problem. Your progress syncs automatically when you're back online.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-orange-500/50">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">Compete & Connect</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Join global leaderboards, form teams, challenge friends. Rise through the ranks and prove your dedication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section - Mobile Responsive */}
        <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">How It Works</h2>
              <p className="text-base sm:text-xl text-gray-400">Start your journey in three simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-black text-xl sm:text-2xl mb-4 sm:mb-6">
                    1
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">Create Account</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Sign up free in seconds. No credit card needed. Start as a Beginner and work your way up.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-white font-black text-xl sm:text-2xl mb-4 sm:mb-6">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">Track Workouts</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Log your exercises, track with GPS, earn XP for every activity. Works offline, syncs when ready.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 text-center hover:bg-white/10 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-black text-xl sm:text-2xl mb-4 sm:mb-6">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">Level Up & Compete</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Climb leaderboards, unlock achievements, join teams. From Beginner to Legend — prove your dedication.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8 sm:mt-12 pb-24">
              <Link
                to="/register"
                className="inline-block px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-orange-500/50"
              >
                Start Your Journey Free
              </Link>
            </div>
          </div>
        </div>

        {/* Footer - Mobile Responsive */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}reprush-logo.png`} alt="RepRush" className="h-5 w-5 sm:h-6 sm:w-6 opacity-50" />
              <span>© 2026 RepRush. Built by Futurify Designs.</span>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Indicators - Completely FIXED using inline styles */}
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
              borderRadius: '9999px',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
