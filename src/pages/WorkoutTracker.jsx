import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuthStore } from '../stores/authStore'
import { calculateLevel, checkLevelUp } from '../utils/xpUtils'
import ExerciseSelector from '../components/ExerciseSelector'
import ActiveExerciseCard from '../components/ActiveExerciseCard'
import WorkoutComplete from '../components/WorkoutComplete'
import ConfirmDialog from '../components/ConfirmDialog'
import SessionModeSelector from '../components/SessionModeSelector'

export default function WorkoutTracker() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [showExerciseSelector, setShowExerciseSelector] = useState(false)
  const [showSessionModeSelector, setShowSessionModeSelector] = useState(false)
  const [activeExercises, setActiveExercises] = useState([])
  const [exerciseData, setExerciseData] = useState({}) // { exerciseId: { inputs, xp } }
  const [totalXP, setTotalXP] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [workoutResult, setWorkoutResult] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [sessionData, setSessionData] = useState(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  useEffect(() => {
    calculateTotalXP()
  }, [exerciseData])

  // Handle session completion from ActiveSession
  useEffect(() => {
    if (location.state?.sessionCompleted) {
      const data = location.state.sessionData
      setSessionData(data)
      // Auto-fill exercises from session
      setActiveExercises(data.exercises)
      // Show session completion banner
    }
  }, [location])

  // Warn before leaving page with unsaved workout
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeExercises.length > 0 && !showComplete) {
        e.preventDefault()
        e.returnValue = 'You have an unsaved workout. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [activeExercises, showComplete])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const calculateTotalXP = () => {
    const total = Object.values(exerciseData).reduce((sum, data) => sum + (data.xp || 0), 0)
    setTotalXP(total)
  }

  const handleAddExercise = (exercise) => {
    if (!activeExercises.find(ex => ex.id === exercise.id)) {
      setActiveExercises([...activeExercises, exercise])
    }
  }

  const handleDoneSelectingExercises = () => {
    setShowExerciseSelector(false)
    if (activeExercises.length > 0) {
      // Show session mode selector
      setShowSessionModeSelector(true)
    }
  }

  const handleSkipSession = () => {
    setShowSessionModeSelector(false)
    // Continue with quick log mode
  }

  const handleRemoveExercise = (exerciseId) => {
    setActiveExercises(activeExercises.filter(ex => ex.id !== exerciseId))
    const newData = { ...exerciseData }
    delete newData[exerciseId]
    setExerciseData(newData)
  }

  const handleUpdateExercise = (exerciseId, inputs, xp) => {
    setExerciseData({
      ...exerciseData,
      [exerciseId]: { inputs, xp }
    })
  }

  const handleCompleteWorkout = async () => {
    if (activeExercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    // Check if session has XP or local exercises have XP
    const baseXP = sessionData?.totalXP || totalXP
    if (baseXP === 0) {
      alert('Please log some activity for your exercises')
      return
    }

    setLoading(true)

    try {
      // Calculate final XP with session bonus
      const bonusMultiplier = sessionData?.bonusMultiplier || 1.0
      const finalXP = Math.round(baseXP * bonusMultiplier)
      
      // Create workout record
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          total_xp: finalXP,
          duration: sessionData?.elapsed || 0,
          session_mode: sessionData?.mode || 'quick',
          goal_time: sessionData?.goalTime || 0,
          completed_in_time: sessionData?.completedInTime || false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (workoutError) throw workoutError

      // Create workout_exercises records
      const workoutExercises = activeExercises.map(exercise => {
        const data = exerciseData[exercise.id] || {}
        return {
          workout_id: workout.id,
          exercise_id: exercise.id,
          sets: data.inputs?.sets || 0,
          reps: data.inputs?.reps || 0,
          weight: data.inputs?.weight || 0,
          duration: data.inputs?.duration || 0,
          distance: data.inputs?.distance || 0,
          xp_earned: data.xp || 0
        }
      })

      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises)

      if (exercisesError) throw exercisesError

      // Update profile XP
      const newTotalXP = profile.total_xp + finalXP
      const newCurrentXP = profile.current_xp + finalXP
      const oldLevel = profile.level
      const newLevel = calculateLevel(newTotalXP)
      const leveledUp = checkLevelUp(profile.total_xp, newTotalXP)

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXP,
          current_xp: newCurrentXP,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Check for achievements (first workout)
      const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)

      const hasFirstWorkout = existingAchievements?.some(a => a.achievement_id === 1)

      if (!hasFirstWorkout) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: 1, // "First Workout" achievement
            unlocked_at: new Date().toISOString()
          })
      }

      // Show completion modal
      setWorkoutResult({
        totalXP: finalXP,
        baseXP: sessionData?.totalXP || totalXP,
        bonusXP: finalXP - (sessionData?.totalXP || totalXP),
        exerciseCount: activeExercises.length,
        leveledUp,
        oldLevel,
        newLevel,
        sessionMode: sessionData?.mode,
        completedInTime: sessionData?.completedInTime
      })
      setShowComplete(true)
      
      // Clear session data after saving
      setSessionData(null)

    } catch (error) {
      console.error('Error completing workout:', error)
      alert('Failed to save workout: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseComplete = () => {
    setShowComplete(false)
    navigate('/profile')
  }

  const handleCancel = () => {
    if (activeExercises.length > 0) {
      setShowConfirmDialog(true)
    } else {
      navigate('/profile')
    }
  }

  const handleConfirmDiscard = () => {
    setShowConfirmDialog(false)
    navigate('/profile')
  }

  const handleCancelDiscard = () => {
    setShowConfirmDialog(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Modals */}
      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowExerciseSelector(false)}
          selectedExercises={activeExercises}
        />
      )}

      {showSessionModeSelector && (
        <SessionModeSelector
          exercises={activeExercises}
          exerciseData={exerciseData}
          onClose={() => setShowSessionModeSelector(false)}
          onSkip={handleSkipSession}
        />
      )}

      {showComplete && workoutResult && (
        <WorkoutComplete
          {...workoutResult}
          onClose={handleCloseComplete}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
        title="Discard Workout?"
        message="You have unsaved exercises. If you leave now, all your progress will be lost."
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          {/* Session Completion Banner */}
          {sessionData && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-400 mb-1">
                    {sessionData.mode === 'challenge' && sessionData.completedInTime
                      ? '🎉 Challenge Complete! You beat the timer!'
                      : sessionData.mode === 'challenge'
                      ? '⏱️ Challenge Complete'
                      : '✅ Session Complete'
                    }
                  </h3>
                  <div className="text-sm text-gray-400">
                    Time: {Math.floor(sessionData.elapsed / 60)}:{(sessionData.elapsed % 60).toString().padStart(2, '0')}
                    {' • '}
                    Base XP: {sessionData.totalXP}
                    {sessionData.bonusMultiplier > 1 && (
                      <span className="ml-2 text-orange-400 font-bold">
                        → {Math.round(sessionData.totalXP * sessionData.bonusMultiplier)} XP (+{Math.round((sessionData.bonusMultiplier - 1) * 100)}% Bonus!)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSessionData(null)}
                  className="text-gray-500 hover:text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-black text-white">Workout Tracker</h1>
                <p className="text-sm text-gray-400">Log your exercises and earn XP</p>
              </div>
            </div>

            {/* Total XP Badge */}
            {totalXP > 0 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg shadow-orange-500/50 animate-scaleIn">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-lg font-black text-white">{totalXP}</span>
                <span className="text-xs text-white/80">XP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Add Exercise Button */}
        {activeExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Start Your Workout</h2>
            <p className="text-gray-400 mb-6">Add exercises to begin tracking</p>
            <button
              onClick={() => setShowExerciseSelector(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/50"
            >
              Add Exercise
            </button>
          </div>
        ) : (
          <>
            {/* Active Exercises */}
            <div className="space-y-4 mb-6">
              {activeExercises.map(exercise => (
                <ActiveExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={handleUpdateExercise}
                  onRemove={handleRemoveExercise}
                />
              ))}
            </div>

            {/* Add More Button */}
            <button
              onClick={() => setShowExerciseSelector(true)}
              className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-orange-500/50 text-gray-300 hover:text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Exercise
            </button>
            
            {/* Start Session Button - Only show if exercises have data logged */}
            {totalXP > 0 && !sessionData && (
              <div className="mb-6">
                <button
                  onClick={() => setShowSessionModeSelector(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Session Timer
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  💡 Start a timed session to track your workout and earn bonus XP!
                </p>
              </div>
            )}
          </>
        )}

        {/* Complete Workout Button */}
        {activeExercises.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-white/10 shadow-2xl">
            <div className="max-w-4xl mx-auto p-4">
              {/* Helper message when session not completed */}
              {!sessionData && totalXP > 0 && (
                <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-xs text-orange-400 text-center">
                    ⚠️ Start a session timer to complete your workout and earn XP
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteWorkout}
                disabled={loading || !sessionData}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-orange-500/50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : sessionData ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Complete Workout</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                      +{Math.round(sessionData.totalXP * sessionData.bonusMultiplier)} XP
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span>Complete Session First</span>
                    <span className="text-xs opacity-70">Start a timed session to continue</span>
                  </div>
                )}
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
