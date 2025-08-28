import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'

function StatsCard() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { level: 1, xp: 0, streak: 0, stage: 'egg', lastCommit: null }
  
  const stats = [
    { label: 'Current Streak', value: `${pet.streak} days`, icon: '🔥' },
    { label: 'Level', value: pet.level, icon: '⭐' },
    { label: 'Total XP', value: pet.xp, icon: '💎' },
    { label: 'Stage', value: pet.stage, icon: '🌱' },
  ]

  return (
    <div className="pixel-card">
      <h3 className="text-lg mb-4">Stats</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <span className="mr-2">{stat.icon}</span>
              <span className="text-sm">{stat.label}</span>
            </div>
            <span className="font-bold">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-pixel-primary">
        <div className="text-sm text-pixel-muted">
          {pet.lastCommit ? (
            <p>Last commit: {new Date(pet.lastCommit).toLocaleDateString()}</p>
          ) : (
            <p>No commits yet - make your first one!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard