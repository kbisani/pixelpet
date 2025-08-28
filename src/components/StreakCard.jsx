import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'

function StreakCard() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { streak: 0 }
  
  // Generate last 14 days for visual
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return {
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      day: date.getDate(),
      hasCommit: i >= (14 - pet.streak) // Simple simulation
    }
  })

  return (
    <div className="pixel-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Streak Visualization</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-pixel-accent">
            {pet.streak} 🔥
          </div>
          <div className="text-xs text-pixel-muted">days</div>
        </div>
      </div>

      {/* Commit Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {last14Days.slice(-7).map((day, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-xs text-pixel-muted mb-1">{day.date}</div>
            <div 
              className={`w-8 h-8 pixel-border mx-auto ${
                day.hasCommit 
                  ? 'bg-pixel-success' 
                  : 'bg-pixel-surface'
              }`}
            >
              {day.hasCommit && (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>
            <div className="text-xs mt-1">{day.day}</div>
          </motion.div>
        ))}
      </div>

      {/* Streak Messages */}
      <div className="text-center text-sm">
        {pet.streak === 0 && (
          <p className="text-pixel-muted">Make your first commit to start your streak! 🚀</p>
        )}
        {pet.streak > 0 && pet.streak < 7 && (
          <p className="text-pixel-success">Great start! Keep it up! 💪</p>
        )}
        {pet.streak >= 7 && pet.streak < 30 && (
          <p className="text-pixel-success">You're on fire! 🔥 Amazing consistency!</p>
        )}
        {pet.streak >= 30 && (
          <p className="text-pixel-warning">Legendary dedication! 👑 You're unstoppable!</p>
        )}
      </div>
    </div>
  )
}

export default StreakCard