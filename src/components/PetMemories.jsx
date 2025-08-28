import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import PixelSprite from './PixelSprite'

function PetMemories() {
  const { petMemories, deletePetMemory, clearAllMemories } = useStore()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProjectTypeIcon = (type) => {
    const icons = {
      'learning': '📚',
      'side-hustle': '💰',
      'experiment': '🧪',
      'portfolio': '🎨'
    }
    return icons[type] || '📁'
  }

  const getRankFromLevel = (level) => {
    if (level >= 100) return 'Grand Master Baiter 🎣'
    if (level >= 75) return 'Diamond Architect 💎'
    if (level >= 50) return 'Platinum Deployer 🔷'
    if (level >= 35) return 'Emerald Refactorer 💚'
    if (level >= 20) return 'Golden Committer 🥇'
    if (level >= 10) return 'Silver Stackover 🥈'
    if (level >= 5) return 'Bronze Debugger 🥉'
    return 'Unranked Scripter 📝'
  }

  if (petMemories.length === 0) {
    return (
      <div className="pixel-card text-center py-8">
        <div className="text-pixel-muted mb-4">
          <div className="text-4xl mb-2">📸</div>
          <h3 className="text-lg mb-2">No Pet Memories Yet</h3>
          <p className="text-sm">Complete projects to save your pet companions as memories!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pixel-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg">Pet Memory Book 📖</h3>
        <div className="flex gap-2">
          <span className="text-xs text-pixel-muted">{petMemories.length} memories</span>
          {petMemories.length > 0 && (
            <button 
              onClick={() => {
                if (confirm('Clear all pet memories? This cannot be undone!')) {
                  clearAllMemories()
                }
              }}
              className="text-xs text-pixel-error hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {petMemories.map((memory, index) => (
          <motion.div
            key={memory.id}
            className="pixel-card relative bg-pixel-surface/50 min-h-[280px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Delete button */}
            <button
              onClick={() => {
                if (confirm(`Delete memory of ${memory.pet.name}?`)) {
                  deletePetMemory(memory.id)
                }
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-pixel-error text-white text-xs rounded-full hover:bg-red-600 transition-colors"
            >
              ×
            </button>
            
            {/* Pet display */}
            <div className="text-center mb-3">
              <div className="mb-2">
                <PixelSprite 
                  species={memory.pet.species} 
                  stage={memory.pet.stage} 
                  size={50} 
                />
              </div>
              <h4 className="font-bold text-sm mb-1">{memory.pet.name}</h4>
              <div className="text-xs text-pixel-accent mb-1">
                {getRankFromLevel(memory.pet.level).split(' ').slice(0, 2).join(' ')}
              </div>
            </div>
            
            {/* Project info */}
            <div className="text-xs space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <span>{getProjectTypeIcon(memory.project.type)}</span>
                <span className="font-medium truncate">{memory.project.name}</span>
              </div>
              <div className="text-pixel-muted">Saved: {formatDate(memory.savedAt)}</div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-pixel-primary/20 p-2 rounded pixel-border">
                <div className="text-pixel-muted">Level</div>
                <div className="font-bold">{memory.pet.level}</div>
              </div>
              <div className="bg-pixel-primary/20 p-2 rounded pixel-border">
                <div className="text-pixel-muted">XP</div>
                <div className="font-bold">{memory.pet.xp}</div>
              </div>
              <div className="bg-pixel-primary/20 p-2 rounded pixel-border">
                <div className="text-pixel-muted">Streak</div>
                <div className="font-bold">{memory.pet.streak}</div>
              </div>
              <div className="bg-pixel-primary/20 p-2 rounded pixel-border">
                <div className="text-pixel-muted">Commits</div>
                <div className="font-bold">{memory.totalCommits}</div>
              </div>
            </div>
            
            {/* Achievements */}
            {memory.achievements.length > 0 && (
              <div className="text-xs">
                <div className="text-pixel-muted mb-1">Achievements:</div>
                <div className="space-y-1">
                  {memory.achievements.slice(0, 2).map((achievement, i) => (
                    <div key={i} className="bg-pixel-warning/20 px-2 py-1 rounded text-pixel-warning">
                      🏆 {achievement}
                    </div>
                  ))}
                  {memory.achievements.length > 2 && (
                    <div className="text-pixel-muted">+{memory.achievements.length - 2} more...</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-xs text-pixel-muted">
        <p>💡 Your pet memories are saved locally and will persist between sessions</p>
      </div>
    </div>
  )
}

export default PetMemories