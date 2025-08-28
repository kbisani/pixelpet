import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CommitFeed({ commits = [], isVisible = false, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedCommits, setDisplayedCommits] = useState([])

  useEffect(() => {
    if (!isVisible || commits.length === 0) {
      setDisplayedCommits([])
      setCurrentIndex(0)
      return
    }

    // Process commits one by one with delay
    const processCommits = async () => {
      for (let i = 0; i < Math.min(commits.length, 10); i++) { // Show max 10 commits
        await new Promise(resolve => setTimeout(resolve, 800)) // 800ms delay between commits
        
        const commit = commits[i]
        const commitData = {
          id: commit.sha,
          message: commit.commit.message.split('\n')[0].slice(0, 50) + (commit.commit.message.length > 50 ? '...' : ''),
          lines: commit.stats?.total || 0,
          xp: calculateCommitXP(commit),
          date: new Date(commit.commit.author.date).toLocaleDateString(),
          hasStats: !!commit.stats
        }

        setDisplayedCommits(prev => [...prev.slice(-4), commitData]) // Keep last 5 commits visible
        setCurrentIndex(i + 1)
      }

      // Auto-hide after completion
      setTimeout(() => {
        onComplete?.()
      }, 2000)
    }

    processCommits()
  }, [isVisible, commits, onComplete])

  const calculateCommitXP = (commit) => {
    if (!commit.stats) return 30 // Estimated XP
    const { total } = commit.stats
    
    if (total <= 5) return 15
    if (total <= 20) return 35
    if (total <= 50) return 65
    if (total <= 100) return 100
    if (total <= 200) return 150
    return 200
  }

  if (!isVisible || displayedCommits.length === 0) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="pixel-card max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl text-pixel-accent mb-2">📈 ANALYZING COMMIT HISTORY</h2>
          <div className="text-sm text-pixel-muted">
            Processing {currentIndex}/{Math.min(commits.length, 10)} commits...
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-pixel-primary h-2 pixel-border mt-4">
            <motion.div 
              className="bg-pixel-success h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / Math.min(commits.length, 10)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Commit feed */}
        <div className="space-y-2 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {displayedCommits.map((commit, index) => (
              <motion.div
                key={commit.id}
                className="pixel-card bg-pixel-surface/50 p-3"
                initial={{ x: 300, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -300, opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300,
                  delay: index * 0.1 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono text-pixel-text truncate">
                      {commit.message}
                    </div>
                    <div className="text-xs text-pixel-muted mt-1">
                      {commit.date} • 
                      {commit.hasStats ? (
                        <span className="text-pixel-success"> {commit.lines} lines changed</span>
                      ) : (
                        <span className="text-pixel-warning"> estimated</span>
                      )}
                    </div>
                  </div>
                  
                  <motion.div 
                    className="ml-4 text-right"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="text-lg font-bold text-pixel-accent">
                      +{commit.xp} XP
                    </div>
                    <div className="text-xs text-pixel-success">
                      💎
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {displayedCommits.length === 0 && (
            <div className="text-center text-pixel-muted py-8">
              <div className="animate-pulse text-2xl mb-2">⚡</div>
              <div>Analyzing your commits...</div>
            </div>
          )}
        </div>

        {/* Summary */}
        {currentIndex === Math.min(commits.length, 10) && (
          <motion.div
            className="mt-6 p-4 bg-pixel-success/20 pixel-border text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-lg text-pixel-success mb-2">🎉 History Sync Complete!</div>
            <div className="text-sm text-pixel-muted">
              Processed {currentIndex} commits • Total XP awarded based on actual code changes
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default CommitFeed