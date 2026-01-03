import { useEffect, useState } from 'react'
import { getTierInfo } from '../utils/xpUtils'

export default function WorkoutComplete({ 
  totalXP, 
  exerciseCount, 
  leveledUp, 
  oldLevel, 
  newLevel, 
  onClose 
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  const newTier = getTierInfo(newLevel)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-white/10 transform transition-all duration-500 ${
        show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Confetti Effect */}
        {leveledUp && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-500 rounded-full animate-ping"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-scaleIn">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black text-white mb-2">
            {leveledUp ? '🎉 Level Up!' : 'Workout Complete!'}
          </h2>
          <p className="text-gray-400">
            {leveledUp 
              ? `Congratulations! You're now level ${newLevel}!`
              : 'Great job! Keep up the momentum!'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="px-8 pb-8">
          {/* XP Earned */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">
                  +{totalXP.toLocaleString()}
                </div>
                <div className="text-sm text-orange-400 font-medium">XP Earned</div>
              </div>
            </div>
          </div>

          {/* Level Up Info */}
          {leveledUp && (
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 mb-4 animate-slideDown">
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-2">
                  Level {oldLevel} → Level {newLevel}
                </div>
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${newTier.color} rounded-full`}>
                  <span className="text-sm font-bold text-white">{newTier.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exercise Count */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white mb-1">
                {exerciseCount}
              </div>
              <div className="text-xs text-gray-400">Exercises</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white mb-1">
                🔥
              </div>
              <div className="text-xs text-gray-400">You're on fire!</div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
