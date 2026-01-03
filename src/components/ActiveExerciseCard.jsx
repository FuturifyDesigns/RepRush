import { useState, useEffect } from 'react'
import { calculateExerciseXP } from '../utils/xpUtils'

export default function ActiveExerciseCard({ exercise, onUpdate, onRemove }) {
  const category = exercise.category?.toLowerCase()
  
  const [inputs, setInputs] = useState({
    sets: category === 'strength' ? 3 : 0,
    reps: category === 'strength' ? 10 : 0,
    weight: 0,
    duration: category === 'cardio' || category === 'flexibility' ? 30 : 0,
    distance: 0,
  })

  const [xp, setXp] = useState(0)

  useEffect(() => {
    const calculatedXP = calculateExerciseXP(exercise, inputs)
    setXp(calculatedXP)
    onUpdate(exercise.id, inputs, calculatedXP)
  }, [inputs]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }))
  }

  const isStrength = category === 'strength'
  const isCardio = category === 'cardio'
  const isFlexibility = category === 'flexibility'

  const getCategoryColor = () => {
    switch (category) {
      case 'strength': return 'from-orange-500 to-red-600'
      case 'cardio': return 'from-blue-500 to-cyan-600'
      case 'flexibility': return 'from-green-500 to-emerald-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{exercise.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor()} text-white text-xs font-bold rounded-full`}>
              {exercise.category}
            </span>
            <span className="text-xs text-gray-400 capitalize">{exercise.difficulty}</span>
          </div>
        </div>
        <button
          onClick={() => onRemove(exercise.id)}
          className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {/* Strength Inputs */}
        {isStrength && (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Sets</label>
              <input
                type="number"
                min="1"
                value={inputs.sets}
                onChange={(e) => handleChange('sets', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Reps</label>
              <input
                type="number"
                min="1"
                value={inputs.reps}
                onChange={(e) => handleChange('reps', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="2.5"
                value={inputs.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 outline-none"
              />
            </div>
          </div>
        )}

        {/* Cardio Inputs */}
        {isCardio && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={inputs.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Distance (km)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={inputs.distance}
                onChange={(e) => handleChange('distance', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
              />
            </div>
          </div>
        )}

        {/* Flexibility Inputs */}
        {isFlexibility && (
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Duration (min)</label>
            <input
              type="number"
              min="1"
              value={inputs.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-center font-bold focus:border-green-500 focus:ring-2 focus:ring-green-500/50 outline-none"
            />
          </div>
        )}
      </div>

      {/* XP Preview */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-sm text-gray-400">XP Earned</span>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xl font-black text-white">{xp.toLocaleString()}</span>
          <span className="text-sm text-orange-400">XP</span>
        </div>
      </div>
    </div>
  )
}
