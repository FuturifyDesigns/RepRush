// XP Calculation Utilities for RepRush

/**
 * Calculate XP for a strength exercise
 * @param {number} sets - Number of sets
 * @param {number} reps - Reps per set
 * @param {number} weight - Weight in kg
 * @param {string} difficulty - 'beginner', 'intermediate', 'advanced'
 * @returns {number} XP earned
 */
export const calculateStrengthXP = (sets, reps, weight, difficulty = 'beginner') => {
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  }

  const multiplier = difficultyMultiplier[difficulty] || 1
  const baseXP = sets * reps * (weight * 0.1) // Weight contributes less to avoid inflation
  
  return Math.round(baseXP * multiplier)
}

/**
 * Calculate XP for a cardio exercise
 * @param {number} duration - Duration in minutes
 * @param {number} distance - Distance in km (optional)
 * @param {string} difficulty - 'beginner', 'intermediate', 'advanced'
 * @returns {number} XP earned
 */
export const calculateCardioXP = (duration, distance = 0, difficulty = 'beginner') => {
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  }

  const multiplier = difficultyMultiplier[difficulty] || 1
  const baseXP = (duration * 2) + (distance * 10) // Duration + distance bonus
  
  return Math.round(baseXP * multiplier)
}

/**
 * Calculate XP for a flexibility exercise
 * @param {number} duration - Duration in minutes
 * @param {string} difficulty - 'beginner', 'intermediate', 'advanced'
 * @returns {number} XP earned
 */
export const calculateFlexibilityXP = (duration, difficulty = 'beginner') => {
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2
  }

  const multiplier = difficultyMultiplier[difficulty] || 1
  const baseXP = duration * 3 // Flexibility gets moderate XP
  
  return Math.round(baseXP * multiplier)
}

/**
 * Calculate XP based on exercise type and inputs
 * @param {object} exercise - Exercise object with category and difficulty
 * @param {object} inputs - User inputs (sets, reps, weight, duration, distance)
 * @returns {number} XP earned
 */
export const calculateExerciseXP = (exercise, inputs) => {
  const category = exercise.category?.toLowerCase()
  const difficulty = exercise.difficulty?.toLowerCase() || 'beginner'

  switch (category) {
    case 'strength':
    case 'weightlifting':
      return calculateStrengthXP(
        inputs.sets || 0,
        inputs.reps || 0,
        inputs.weight || 0,
        difficulty
      )
    
    case 'cardio':
      return calculateCardioXP(
        inputs.duration || 0,
        inputs.distance || 0,
        difficulty
      )
    
    case 'flexibility':
    case 'stretching':
      return calculateFlexibilityXP(
        inputs.duration || 0,
        difficulty
      )
    
    default:
      // Generic calculation for other categories
      return Math.round(
        ((inputs.sets || 0) * (inputs.reps || 0) + (inputs.duration || 0) * 2) * 
        (difficulty === 'advanced' ? 2 : difficulty === 'intermediate' ? 1.5 : 1)
      )
  }
}

/**
 * Calculate level from total XP
 * @param {number} totalXP - Total XP accumulated
 * @returns {number} Current level
 */
export const calculateLevel = (totalXP) => {
  return Math.floor(totalXP / 100) + 1
}

/**
 * Calculate current level XP (XP within current level)
 * @param {number} totalXP - Total XP accumulated
 * @returns {number} XP in current level
 */
export const calculateCurrentLevelXP = (totalXP) => {
  return totalXP % 100
}

/**
 * Calculate XP needed for next level
 * @param {number} currentLevel - Current level
 * @returns {number} XP needed for next level
 */
export const calculateNextLevelXP = (currentLevel) => {
  return currentLevel * 100
}

/**
 * Check if user leveled up
 * @param {number} oldXP - XP before workout
 * @param {number} newXP - XP after workout
 * @returns {boolean} True if leveled up
 */
export const checkLevelUp = (oldXP, newXP) => {
  const oldLevel = calculateLevel(oldXP)
  const newLevel = calculateLevel(newXP)
  return newLevel > oldLevel
}

/**
 * Get tier info based on level
 * @param {number} level - User level
 * @returns {object} Tier information
 */
export const getTierInfo = (level) => {
  if (level >= 50) return { name: 'Legend', color: 'from-purple-500 to-pink-500', ring: 'ring-purple-500' }
  if (level >= 25) return { name: 'Elite', color: 'from-yellow-500 to-orange-500', ring: 'ring-yellow-500' }
  if (level >= 10) return { name: 'Advanced', color: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500' }
  if (level >= 5) return { name: 'Intermediate', color: 'from-green-500 to-emerald-500', ring: 'ring-green-500' }
  return { name: 'Beginner', color: 'from-gray-500 to-gray-600', ring: 'ring-gray-500' }
}
