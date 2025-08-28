import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import { useGitHub } from '../hooks/useGitHub'
import PetDisplay from './PetDisplay'
import StatsCard from './StatsCard'
import CommitCalendar from './CommitCalendar'
import RecentCommitsCard from './RecentCommitsCard'
import MilestonesCard from './MilestonesCard'
import CommitFeed from './CommitFeed'
import PetMemories from './PetMemories'

function PetDashboard({ onBackToPark }) {
  const { projects, currentProjectId, setCurrentProject, savePetMemory, updateHealth, updateHappiness, applyPassiveDecay, deleteProject } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet
  const currentProject = project // For backward compatibility with existing code
  
  // Safety check - if no project, go back to park
  if (!project || !pet) {
    return (
      <div className="pixel-card text-center">
        <h2 className="text-xl mb-4">Project Not Found</h2>
        <p className="text-pixel-muted mb-4">The selected project could not be loaded.</p>
        <button 
          onClick={onBackToPark}
          className="pixel-button bg-pixel-accent text-white"
        >
          🏞️ Back to Pet Park
        </button>
      </div>
    )
  }
  const { syncRepository, simulateCommit, testCommitBoost, loading } = useGitHub()
  const [showCommitFeed, setShowCommitFeed] = useState(false)
  const [commitFeedData, setCommitFeedData] = useState([])
  const [hasAutoSynced, setHasAutoSynced] = useState(false)

  const handleSync = async () => {
    const result = await syncRepository()
    if (result && result.streakData.commits.length > 0) {
      console.log('Sync complete:', result)
      
      // Update recent commits in RecentCommitsCard (we'll pass this via context later)
      // For now, show the commit feed animation
      setCommitFeedData(result.streakData.commits)
      setShowCommitFeed(true)
    } else if (result) {
      // No commits found
      alert('No commits found in the selected repository. Make sure the repo URL is correct and you have access.')
    }
  }

  const handleCommitFeedComplete = () => {
    setShowCommitFeed(false)
    
    // Show final summary
    setTimeout(() => {
      const finalState = useStore.getState()
      const finalProject = finalState.projects.find(p => p.id === finalState.currentProjectId)
      const finalPet = finalProject?.pet || pet
      const message = [
        `🎉 Sync Complete!`,
        `📈 Pet Level: ${finalPet.level}`,
        `🐱 Stage: ${finalPet.stage}`,
        `🔥 Streak: ${finalPet.streak} days`,
        ``,
        `Your pet has evolved based on your real coding history!`
      ].join('\n')
      
      alert(message)
    }, 500)
  }

  const handleSimulateCommit = () => {
    const result = simulateCommit()
    console.log('Simulated commit:', result)
    
    // Get current rank for celebration
    const getCurrentRank = (level) => {
      if (level >= 100) return 'Grand Master Baiter 🎣'
      if (level >= 75) return 'Diamond Architect 💎'
      if (level >= 50) return 'Platinum Deployer 🔷'
      if (level >= 35) return 'Emerald Refactorer 💚'
      if (level >= 20) return 'Golden Committer 🥇'
      if (level >= 10) return 'Silver Stackover 🥈'
      if (level >= 5) return 'Bronze Debugger 🥉'
      return 'Unranked Scripter 📝'
    }
    
    const currentState = useStore.getState()
    const currentProject = currentState.projects.find(p => p.id === currentState.currentProjectId)
    const currentPet = currentProject?.pet || pet
    const currentRank = getCurrentRank(currentPet.level)
    
    // Removed popup - just log to console for testing
    console.log(`${result.commitDesc} | ${result.lines} lines | +${result.xpGained} XP | Streak: ${result.newStreak} | Rank: ${currentRank}`)
  }

  const handleDeleteProject = () => {
    const projectName = project?.repo?.split('/').slice(-1)[0] || 'this project'
    if (confirm(`Delete ${projectName} and ${pet?.name || 'your pet'}? This cannot be undone!`)) {
      deleteProject(currentProjectId)
      if (onBackToPark) onBackToPark()
    }
  }

  const handleReset = () => {
    if (confirm('Reset your project? This will clear all progress.')) {
      // For now just go back to park - could implement project reset later
      if (onBackToPark) onBackToPark()
    }
  }

  const handleClearStorage = () => {
    if (confirm('Clear all local storage? This will reset everything including your pet, tokens, and all progress. This cannot be undone!')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleSavePetMemory = () => {
    const projectName = prompt('Enter a name for this project memory:', project?.repo?.split('/').slice(-1)[0] || 'My Project')
    if (projectName) {
      savePetMemory(projectName)
      alert(`${pet?.name || 'Your pet'} has been saved to your memory book! 📖✨`)
    }
  }

  // Auto-sync on first load
  useEffect(() => {
    if (project && !hasAutoSynced && !loading) {
      console.log('Auto-syncing repository on dashboard load...')
      setHasAutoSynced(true)
      handleSync()
    }
  }, [project, hasAutoSynced, loading])

  return (
    <>
      <CommitFeed 
        commits={commitFeedData}
        isVisible={showCommitFeed}
        onComplete={handleCommitFeedComplete}
      />
      
      {/* Auto-sync loading message */}
      {loading && !hasAutoSynced && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="pixel-card text-center">
            <div className="text-2xl mb-2">🐣</div>
            <h3 className="text-lg mb-2">Hatching Your Pet...</h3>
            <p className="text-pixel-muted mb-4">Syncing your commits to calculate pet growth</p>
            <div className="pixel-loading"></div>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Main Pet Display */}
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <PetDisplay />
      </motion.div>

      {/* Stats Panel */}
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatsCard />
      </motion.div>

      {/* Recent Commits Feed */}
      <motion.div 
        className="xl:col-span-1 lg:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentCommitsCard />
      </motion.div>

      {/* Monthly Commit Calendar */}
      <motion.div 
        className="lg:col-span-2 xl:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CommitCalendar />
      </motion.div>

      {/* Milestones */}
      <motion.div 
        className="lg:col-span-2 xl:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MilestonesCard />
      </motion.div>

      {/* Settings */}
      <motion.div 
        className="lg:col-span-2 xl:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="pixel-card">
          <h3 className="text-lg mb-4">Project Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-pixel-muted">Repository:</span>
              <p>{project?.repo?.split('/').slice(-2).join('/')}</p>
            </div>
            <div>
              <span className="text-pixel-muted">Pet Species:</span>
              <p className="capitalize">{pet?.species?.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              onClick={handleSync}
              disabled={loading}
              className="pixel-button text-sm"
            >
              {loading ? 'Syncing...' : '🔄 Re-sync'}
            </button>
            <button 
              onClick={handleSimulateCommit}
              className="pixel-button text-sm bg-pixel-success"
            >
              Demo Commit
            </button>
            <button 
              onClick={() => updateHealth(-10)}
              className="pixel-button text-sm bg-red-500 text-white"
            >
              Test -Health
            </button>
            <button 
              onClick={() => updateHappiness(-10)}
              className="pixel-button text-sm bg-yellow-500 text-white"
            >
              Test -Happy
            </button>
            <button 
              onClick={() => {
                // Temporarily set lastCommit to 8 days ago to force decay
                const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
                updatePet({ lastCommit: eightDaysAgo })
                setTimeout(() => applyPassiveDecay(), 100)
              }}
              className="pixel-button text-sm bg-gray-500 text-white"
            >
              Force Decay
            </button>
            <button 
              onClick={testCommitBoost}
              className="pixel-button text-sm bg-green-500 text-white"
            >
              Test Boost
            </button>
            <button 
              onClick={handleSavePetMemory}
              className="pixel-button text-sm bg-purple-600 text-white"
            >
              💾 Save Pet Memory
            </button>
            <button className="pixel-button text-sm">
              Settings
            </button>
            <button 
              onClick={handleReset}
              className="pixel-button text-sm text-pixel-error"
            >
              Reset Project
            </button>
            <button 
              onClick={handleDeleteProject}
              className="pixel-button text-sm bg-orange-600 text-white"
            >
              🗑️ Delete Project
            </button>
            <button 
              onClick={handleClearStorage}
              className="pixel-button text-sm bg-red-600 text-white"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pet Memories */}
      <motion.div 
        className="lg:col-span-2 xl:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <PetMemories />
      </motion.div>
      
      </div>
    </>
  )
}

export default PetDashboard