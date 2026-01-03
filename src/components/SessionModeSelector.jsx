import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SessionModeSelector({ exercises, onClose, onSkip }) {
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState(null)
  const [customTime, setCustomTime] = useState(15)
  
  const estimatedTime = Math.ceil(exercises.length * 5) // Rough estimate: 5 min per exercise
  
  const presetTimes = [10, 15, 20, 30, 45, 60]
  
  const handleStartChallenge = () => {
    const goalTime = customTime * 60 // Convert to seconds
    navigate('/workout/session', {
      state: {
        mode: 'challenge',
        exercises,
        goalTime
      }
    })
  }
  
  const handleStartFree = () => {
    navigate('/workout/session', {
      state: {
        mode: 'free',
        exercises
      }
    })
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Start Session</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>Est. {estimatedTime}-{estimatedTime + 5} min</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Challenge Mode */}
          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'challenge' 
                ? 'border-orange-500 bg-orange-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            }`}
            onClick={() => setSelectedMode('challenge')}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">🎯 Challenge Mode</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Race against the clock! Beat your time goal for bonus XP.
                </p>
                
                {selectedMode === 'challenge' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        Set Time Goal
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {presetTimes.map(time => (
                          <button
                            key={time}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCustomTime(time)
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              customTime === time
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {time} min
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={customTime}
                          onChange={(e) => setCustomTime(parseInt(e.target.value) || 15)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none"
                        />
                        <span className="text-sm text-gray-400">minutes</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-orange-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Beat {customTime} min = +20% Bonus XP!</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartChallenge()
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50"
                    >
                      Start {customTime} Min Challenge
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Free Mode */}
          <div 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'free' 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            }`}
            onClick={() => setSelectedMode('free')}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">⏱️ Free Session</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Track your time with no pressure. Perfect for steady training.
                </p>
                
                {selectedMode === 'free' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartFree()
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/50"
                  >
                    Start Free Session
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Log (Current Method) */}
          <div 
            className="p-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 cursor-pointer transition-all"
            onClick={onSkip}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">📝 Quick Log</h3>
                <p className="text-sm text-gray-400">
                  Skip timer and log your workout manually.
                </p>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Leave this page open during your workout. Timer continues running!
          </p>
        </div>
        
      </div>
    </div>
  )
}
