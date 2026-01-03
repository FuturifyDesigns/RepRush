import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../stores/authStore'

export default function ActiveSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  
  const { mode, exercises, goalTime, exerciseData } = location.state || {}
  
  const [elapsed, setElapsed] = useState(0) // seconds
  const [isPaused, setIsPaused] = useState(false)
  const [completedExercises, setCompletedExercises] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const pauseTimeRef = useRef(0)
  
  // Helper function - defined before use
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Calculate remaining time for challenge mode
  const remaining = mode === 'challenge' ? Math.max(0, (goalTime || 0) - elapsed) : null
  const isTimeUp = mode === 'challenge' && elapsed >= (goalTime || 0)
  const progress = exercises ? (completedExercises.length / exercises.length) * 100 : 0
  
  // Redirect if no exercises
  useEffect(() => {
    if (!exercises || exercises.length === 0) {
      navigate('/workout')
    }
  }, [exercises, navigate])
  
  // Create session in database
  useEffect(() => {
    const createSession = async () => {
      if (!user || sessionId || !exercises) return
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          mode,
          goal_time: goalTime || 0,
          exercises: exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            category: ex.category,
            difficulty: ex.difficulty
          })),
          status: 'active'
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating session:', error)
      } else {
        setSessionId(data.id)
        // Store in localStorage for recovery
        localStorage.setItem('activeSessionId', data.id)
        localStorage.setItem('sessionStartTime', Date.now().toString())
      }
    }
    
    createSession()
  }, [user, mode, goalTime, exercises, sessionId])
  
  // Timer logic
  useEffect(() => {
    if (isPaused) return
    
    // Check for existing session start time
    const storedStartTime = localStorage.getItem('sessionStartTime')
    if (storedStartTime) {
      startTimeRef.current = parseInt(storedStartTime)
    }
    
    timerRef.current = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(newElapsed)
      
      // Check if challenge time exceeded
      if (mode === 'challenge' && goalTime && newElapsed >= goalTime) {
        // Timer finished!
        playTimerSound()
      }
    }, 1000)
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused, mode, goalTime])
  
  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      const message = mode === 'challenge' 
        ? `⏱️ Your ${Math.floor(goalTime / 60)}-minute challenge is still running! Timer: ${formatTime(remaining || elapsed)}. Leave anyway?`
        : `⏱️ Your workout session is active! Timer: ${formatTime(elapsed)}. Leave anyway?`
      e.returnValue = message
      return e.returnValue
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [mode, elapsed, goalTime, remaining])
  
  const playTimerSound = () => {
    // Play notification sound (optional)
    const audio = new Audio('/notification.mp3')
    audio.play().catch(() => {}) // Ignore errors if no sound file
  }
  
  const togglePause = () => {
    if (isPaused) {
      // Resume: adjust start time
      const pauseDuration = Date.now() - pauseTimeRef.current
      startTimeRef.current += pauseDuration
      localStorage.setItem('sessionStartTime', startTimeRef.current.toString())
    } else {
      // Pause: store current time
      pauseTimeRef.current = Date.now()
    }
    setIsPaused(!isPaused)
  }
  
  const handleFinishSession = async () => {
    // Update session status
    if (sessionId) {
      await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId)
    }
    
    // Clear localStorage
    localStorage.removeItem('activeSessionId')
    localStorage.removeItem('sessionStartTime')
    
    // Calculate total XP from exercise data
    const totalXP = Object.values(exerciseData || {}).reduce((sum, data) => sum + (data.xp || 0), 0)
    
    // Calculate results
    const completedInTime = mode === 'challenge' ? elapsed <= goalTime : false
    const bonusMultiplier = completedInTime ? 1.2 : 1.0
    
    // Navigate back to workout tracker with session data
    navigate('/workout', {
      state: {
        sessionCompleted: true,
        sessionData: {
          mode,
          elapsed,
          goalTime,
          completedInTime,
          bonusMultiplier,
          totalXP,
          exercises
        }
      }
    })
  }
  
  const toggleExerciseComplete = (exerciseId) => {
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId))
    } else {
      setCompletedExercises([...completedExercises, exerciseId])
    }
  }
  
  if (!exercises) return null
  
  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Timer Display */}
      <div className={`${
        mode === 'challenge' 
          ? 'bg-gradient-to-br from-orange-600 to-red-700' 
          : 'bg-gradient-to-br from-blue-600 to-cyan-700'
      } ${isTimeUp ? 'animate-pulse' : ''}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">
              {mode === 'challenge' ? '🎯 Challenge Mode' : '⏱️ Free Session'}
            </h1>
            <button
              onClick={() => navigate('/workout')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              End Session
            </button>
          </div>
          
          {/* Big Timer */}
          <div className="text-center mb-6">
            <div className="text-7xl md:text-9xl font-black text-white mb-2 font-mono">
              {mode === 'challenge' ? formatTime(remaining) : formatTime(elapsed)}
            </div>
            <div className="text-lg md:text-xl text-white/80">
              {mode === 'challenge' 
                ? (isTimeUp ? "TIME'S UP!" : 'REMAINING')
                : 'ELAPSED'
              }
            </div>
            {mode === 'challenge' && !isTimeUp && (
              <div className="mt-2 text-sm text-white/60">
                Goal: {formatTime(goalTime)}
              </div>
            )}
          </div>
          
          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePause}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold transition-all"
            >
              {isPaused ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Resume
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Pause
                </span>
              )}
            </button>
          </div>
          
          {isPaused && (
            <div className="mt-4 text-center text-white/80 text-sm">
              Timer Paused
            </div>
          )}
          
        </div>
      </div>
      
      {/* Exercise Checklist */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-400 mb-1">How to Complete Your Session</h4>
              <ol className="text-xs text-gray-400 space-y-1">
                <li>1. Go do your workout now (leave this page open)</li>
                <li>2. When you finish an exercise, come back and check it off ✓</li>
                <li>3. Move to the next exercise and repeat</li>
                <li>4. When all exercises are done, click "Finish Session"</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">
              Progress: {completedExercises.length}/{exercises.length} Exercises
            </span>
            <span className="text-sm font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Exercise List */}
        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id)
            const exData = exerciseData?.[exercise.id]
            const xp = exData?.xp || 0
            
            return (
              <div
                key={exercise.id}
                onClick={() => toggleExerciseComplete(exercise.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isCompleted
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted
                      ? 'border-green-500 bg-green-500'
                      : 'border-white/30'
                  }`}>
                    {isCompleted && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Exercise Info */}
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${isCompleted ? 'text-white line-through' : 'text-white'}`}>
                      {exercise.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className="px-2 py-1 bg-white/10 rounded-full text-gray-400">
                        {exercise.category}
                      </span>
                      <span className="text-gray-500 capitalize">{exercise.difficulty}</span>
                    </div>
                    {/* Show logged data */}
                    {exData?.inputs && (
                      <div className="text-xs text-gray-500">
                        {exData.inputs.sets > 0 && <span>{exData.inputs.sets} sets × {exData.inputs.reps} reps</span>}
                        {exData.inputs.weight > 0 && <span> × {exData.inputs.weight}kg</span>}
                        {exData.inputs.duration > 0 && <span>{exData.inputs.duration} min</span>}
                        {exData.inputs.distance > 0 && <span> • {exData.inputs.distance}km</span>}
                      </div>
                    )}
                  </div>
                  
                  {/* XP & Status */}
                  <div className="text-right flex-shrink-0">
                    {xp > 0 && (
                      <div className="text-orange-400 font-bold mb-1">
                        {xp} XP
                      </div>
                    )}
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full inline-block">
                        ✓ DONE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Finish Button */}
        <div className="mt-8 space-y-3">
          {mode === 'challenge' && isTimeUp && completedExercises.length < exercises.length && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400 text-center">
                ⏱️ Time's up! You can still finish the remaining exercises.
              </p>
            </div>
          )}
          
          <button
            onClick={handleFinishSession}
            disabled={completedExercises.length === 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-green-500/50"
          >
            {completedExercises.length === exercises.length ? (
              <span>🎉 Finish Session - All Done!</span>
            ) : (
              <span>Finish Session ({completedExercises.length}/{exercises.length})</span>
            )}
          </button>
          
          {mode === 'challenge' && !isTimeUp && (
            <p className="text-xs text-gray-500 text-center">
              💡 Complete all exercises before {formatTime(goalTime)} for bonus XP!
            </p>
          )}
        </div>
        
      </div>
    </div>
  )
}
