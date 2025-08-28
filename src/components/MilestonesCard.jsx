import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'

const LEVEL_MILESTONES = [
  { level: 1, reward: 'Unranked Scripter 📝', description: 'Just getting started' },
  { level: 5, reward: 'Bronze Debugger 🥉', description: 'Bug squashing basics' },
  { level: 10, reward: 'Silver Stackover 🥈', description: 'Copy-paste master' },
  { level: 20, reward: 'Golden Committer 🥇', description: 'Git gud achieved' },
  { level: 35, reward: 'Emerald Refactorer 💚', description: 'Clean code crusader' },
  { level: 50, reward: 'Platinum Deployer 🔷', description: 'Production pusher' },
  { level: 75, reward: 'Diamond Architect 💎', description: 'System design sage' },
  { level: 100, reward: 'Grand Master Baiter 🎣', description: 'Ultimate code master' },
]

function MilestonesCard() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { level: 1 }

  // Show only relevant milestones (current + next few)
  const relevantMilestones = LEVEL_MILESTONES.filter(milestone => {
    return milestone.level <= pet.level + 30 || milestone.level <= 30
  }).slice(0, 6) // Show max 6 milestones

  return (
    <div className="pixel-card flex flex-col">
      <h3 className="text-lg mb-4">Level Milestones</h3>
      
      <div className="overflow-y-auto max-h-96 pr-2">
        <div className="grid grid-cols-1 gap-4">
        {relevantMilestones.map((milestone, index) => {
          const isCompleted = pet.level >= milestone.level
          const isNext = !isCompleted && (index === 0 || pet.level >= LEVEL_MILESTONES[index - 1]?.level)
          
          return (
            <motion.div
              key={milestone.level}
              className={`pixel-card relative min-h-[60px] flex flex-col group cursor-help ${
                isCompleted 
                  ? 'bg-pixel-success/20 border-pixel-success' 
                  : isNext 
                    ? 'bg-pixel-warning/20 border-pixel-warning animate-pixel-pulse' 
                    : 'bg-pixel-surface'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              title={milestone.description}
            >
              {isCompleted && (
                <div className="absolute top-1 right-1 text-pixel-success">✅</div>
              )}
              {isNext && (
                <div className="absolute top-1 right-1 text-pixel-warning">⏳</div>
              )}
              
              <div className="flex items-center p-3 flex-1 relative">
                <div className="text-lg font-bold mr-3 min-w-[40px] text-center">
                  {milestone.level}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-base font-bold break-words">
                    {milestone.reward}
                  </div>
                </div>
                
                {/* Custom hover tooltip */}
                <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 max-w-xs break-words">
                  {milestone.description}
                  <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              
              {isNext && (
                <div className="text-center p-3 border-t border-pixel-primary/50">
                  <div className="text-sm text-pixel-warning font-semibold">
                    {milestone.level - pet.level} levels to go
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-pixel-muted">
        <p className="mb-2">Write bigger commits to gain more XP and level up {pet.name}! 💪</p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-pixel-success">Small commits (5 lines)</span> = ~15 XP
          </div>
          <div>
            <span className="text-pixel-warning">Large commits (100+ lines)</span> = ~125 XP
          </div>
        </div>
        
        {pet.level >= 50 && (
          <div className="mt-2 text-pixel-accent">
            🎉 You've reached Platinum Deployer! Your pet achieved legendary status!
          </div>
        )}
        {pet.level >= 100 && (
          <div className="mt-2 text-pixel-warning animate-pulse">
            👑 GRAND MASTER BAITER ACHIEVED! You are the ultimate coder! 🎣
          </div>
        )}
      </div>
    </div>
  )
}

export default MilestonesCard