import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import { XPCalculator } from '../lib/github'

function RecentCommitsCard() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { level: 1, xp: 0 }
  const recentCommits = project?.recentCommits || []
  const projectType = project?.type || 'general'

  // Process real commits from sync
  const processedCommits = useMemo(() => {
    return recentCommits.slice(0, 5).map(commit => ({
      id: commit.sha,
      message: commit.commit.message.split('\n')[0].slice(0, 60) + (commit.commit.message.length > 60 ? '...' : ''),
      lines: commit.stats?.total || 0,
      xp: XPCalculator.calculateCommitXP(commit, projectType || 'learning'),
      date: new Date(commit.commit.author.date).toLocaleDateString(),
      hasStats: !!commit.stats,
      branch: commit.branch || 'main'
    }))
  }, [recentCommits, projectType])

  return (
    <div className="pixel-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Recent Commits</h3>
        <div className="text-xs text-pixel-muted">
          Last synced: {pet.lastCommit ? new Date(pet.lastCommit).toLocaleString() : 'Never'}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {processedCommits.map((commit, index) => (
            <motion.div
              key={commit.id}
              className="pixel-card bg-pixel-surface/30 p-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-pixel-text truncate mb-1">
                    {commit.message}
                  </div>
                  <div className="flex items-center text-xs text-pixel-muted space-x-3">
                    <span>{commit.date}</span>
                    <span className="text-pixel-warning">#{commit.branch}</span>
                    {commit.hasStats ? (
                      <span className="text-pixel-success">
                        📝 {commit.lines} lines
                      </span>
                    ) : (
                      <span className="text-pixel-muted">
                        📝 estimated
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-3 text-right flex-shrink-0">
                  <div className="text-sm font-bold text-pixel-accent">
                    +{commit.xp} XP
                  </div>
                  <div className="text-xs text-pixel-success">
                    💎
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {processedCommits.length === 0 && (
          <div className="text-center text-pixel-muted py-8">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm">No recent commits</div>
            <div className="text-xs mt-1">Sync your repository to see commit history</div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-pixel-primary text-center">
        <div className="text-xs text-pixel-muted">
          Commits show actual XP earned based on lines changed
        </div>
      </div>
    </div>
  )
}

export default RecentCommitsCard