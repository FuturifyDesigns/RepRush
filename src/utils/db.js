import Dexie from 'dexie'

const db = new Dexie('UpFitDB')

// Database schema
db.version(1).stores({
  // User profile cache
  users: 'id, email, username, level, tier, last_synced',
  
  // Workouts (with sync status)
  workouts: 'id, user_id, type, completed_at, synced',
  
  // Achievements
  achievements: '[user_id+achievement_id], user_id, achievement_id, viewed, unlocked_at',
  
  // Daily goals
  dailyGoals: 'date, user_id, completed',
  
  // Cache for API responses
  cache: 'key, timestamp, data',
  
  // Teams
  teams: 'id, name, total_power',
  
  // Team members
  teamMembers: '[team_id+user_id], team_id, user_id'
})

// Helper functions
export const dbHelpers = {
  // Cache API response
  async cacheResponse(key, data, ttl = 300000) { // 5 min default
    await db.cache.put({
      key,
      data,
      timestamp: Date.now(),
      ttl
    })
  },
  
  // Get cached response
  async getCached(key) {
    const cached = await db.cache.get(key)
    if (!cached) return null
    
    const age = Date.now() - cached.timestamp
    if (age > cached.ttl) {
      await db.cache.delete(key)
      return null
    }
    
    return cached.data
  },
  
  // Get unsynced workouts
  async getUnsyncedWorkouts() {
    return await db.workouts
      .where('synced').equals(false)
      .toArray()
  },
  
  // Mark workout as synced
  async markWorkoutSynced(workoutId) {
    await db.workouts.update(workoutId, { synced: true })
  },
  
  // Save workout locally
  async saveWorkoutLocal(workout) {
    const id = crypto.randomUUID()
    await db.workouts.add({
      ...workout,
      id,
      synced: false,
      created_at: new Date().toISOString()
    })
    return id
  },
  
  // Get workout history with pagination
  async getWorkoutHistory(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit
    return await db.workouts
      .where('user_id').equals(userId)
      .reverse() // newest first
      .offset(offset)
      .limit(limit)
      .toArray()
  },
  
  // Update local user profile
  async updateUserLocal(userId, updates) {
    await db.users.update(userId, {
      ...updates,
      last_synced: Date.now()
    })
  },
  
  // Check and unlock achievements
  async checkAchievements(userId, achievements) {
    const newAchievements = []
    
    for (const achievement of achievements) {
      const exists = await db.achievements
        .where(['user_id', 'achievement_id'])
        .equals([userId, achievement.id])
        .count()
      
      if (exists === 0) {
        await db.achievements.add({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
          viewed: false
        })
        newAchievements.push(achievement)
      }
    }
    
    return newAchievements
  },
  
  // Get unviewed achievements count (for badge)
  async getUnviewedAchievementsCount(userId) {
    return await db.achievements
      .where({ user_id: userId, viewed: false })
      .count()
  }
}

export default db
