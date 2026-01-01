/**
 * Calculate XP earned from a workout
 * @param {Object} workout - Workout data
 * @param {number} userLevel - User's current level
 * @returns {number} XP earned
 */
export function calculateXP(workout, userLevel = 1) {
  let baseXP = 0

  switch (workout.type) {
    case 'running':
      baseXP = (workout.distance || 0) * 10 // 10 XP per km
      baseXP += (workout.duration || 0) * 2  // 2 XP per minute
      break

    case 'cycling':
      baseXP = (workout.distance || 0) * 5   // Cycling is easier
      baseXP += (workout.duration || 0) * 2
      break

    case 'swimming':
      baseXP = (workout.distance || 0) * 15  // Swimming is harder
      baseXP += (workout.duration || 0) * 3
      break

    case 'walking':
      baseXP = (workout.distance || 0) * 5
      baseXP += (workout.duration || 0) * 1.5
      break

    case 'strength':
      baseXP = (workout.duration || 0) * 3   // 3 XP per minute
      if (workout.sets) {
        baseXP += workout.sets * 5           // Bonus for volume
      }
      break

    case 'yoga':
    case 'stretching':
      baseXP = (workout.duration || 0) * 2.5
      break

    case 'hiit':
      baseXP = (workout.duration || 0) * 4   // HIIT is intense
      break

    case 'sports':
      baseXP = (workout.duration || 0) * 2.5
      break

    default:
      baseXP = (workout.duration || 0) * 2
  }

  // Level multiplier (1% bonus per level)
  const levelMultiplier = 1 + (userLevel * 0.01)
  baseXP *= levelMultiplier

  // Personal record bonus
  if (workout.isPersonalRecord) {
    baseXP *= 1.5
  }

  return Math.round(baseXP)
}

/**
 * Calculate stats gained from a workout
 * @param {Object} workout - Workout data
 * @returns {Object} Stats gained
 */
export function calculateStatsGained(workout) {
  const stats = {
    strength: 0,
    cardio: 0,
    flexibility: 0,
    consistency: 1 // Everyone gets consistency point
  }

  switch (workout.type) {
    case 'running':
    case 'cycling':
    case 'swimming':
    case 'walking':
      stats.cardio = Math.round(
        (workout.distance || 0) * 0.3 + (workout.duration || 0) * 0.1
      )
      break

    case 'strength':
      stats.strength = Math.round((workout.duration || 0) * 0.5)
      if (workout.sets) {
        stats.strength += Math.round(workout.sets * 0.2)
      }
      break

    case 'yoga':
    case 'stretching':
      stats.flexibility = Math.round((workout.duration || 0) * 0.4)
      break

    case 'hiit':
      stats.cardio = Math.round((workout.duration || 0) * 0.3)
      stats.strength = Math.round((workout.duration || 0) * 0.2)
      break

    case 'sports':
      stats.cardio = Math.round((workout.duration || 0) * 0.2)
      stats.strength = Math.round((workout.duration || 0) * 0.1)
      break
  }

  return stats
}

/**
 * Calculate level from total XP
 * @param {number} xp - Total XP
 * @returns {number} Level
 */
export function calculateLevel(xp) {
  let level = 1
  let requiredXP = 0

  while (xp >= requiredXP) {
    level++
    requiredXP += xpForNextLevel(level - 1)
  }

  return level - 1
}

/**
 * Calculate XP required for next level
 * @param {number} currentLevel - Current level
 * @returns {number} XP required
 */
export function xpForNextLevel(currentLevel) {
  return Math.floor(100 * Math.pow(1.15, currentLevel))
}

/**
 * Get XP progress for current level
 * @param {number} currentXP - Current total XP
 * @param {number} currentLevel - Current level
 * @returns {Object} Progress info
 */
export function xpProgress(currentXP, currentLevel) {
  // Calculate XP at start of current level
  let levelStartXP = 0
  for (let i = 1; i < currentLevel; i++) {
    levelStartXP += xpForNextLevel(i)
  }

  const xpIntoLevel = currentXP - levelStartXP
  const xpNeeded = xpForNextLevel(currentLevel)

  return {
    current: xpIntoLevel,
    needed: xpNeeded,
    percentage: Math.min((xpIntoLevel / xpNeeded) * 100, 100)
  }
}

/**
 * Calculate tier based on level
 * @param {number} level - User level
 * @returns {string} Tier name
 */
export function calculateTier(level) {
  if (level >= 1 && level <= 10) return 'Beginner'
  if (level >= 11 && level <= 25) return 'Novice'
  if (level >= 26 && level <= 45) return 'Intermediate'
  if (level >= 46 && level <= 70) return 'Advanced'
  if (level >= 71 && level <= 100) return 'Elite'
  if (level >= 101 && level <= 150) return 'Master'
  if (level >= 151) return 'Legend'
  return 'Beginner'
}

/**
 * Get tier level range
 * @param {string} tier - Tier name
 * @returns {Object} Min and max levels
 */
export function getTierRange(tier) {
  const ranges = {
    'Beginner': { min: 1, max: 10 },
    'Novice': { min: 11, max: 25 },
    'Intermediate': { min: 26, max: 45 },
    'Advanced': { min: 46, max: 70 },
    'Elite': { min: 71, max: 100 },
    'Master': { min: 101, max: 150 },
    'Legend': { min: 151, max: Infinity }
  }
  
  return ranges[tier] || ranges['Beginner']
}

/**
 * Calculate total power from stats
 * @param {Object} stats - User stats
 * @returns {number} Total power
 */
export function calculateTotalPower(stats) {
  return (stats.strength || 0) + 
         (stats.cardio || 0) + 
         (stats.flexibility || 0) + 
         (stats.consistency || 0)
}
