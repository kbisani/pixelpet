import { useState, useEffect, useCallback } from 'react'
import { useStore } from '../stores/gameStore'
import { GitHubAPI, ProjectAnalyzer, XPCalculator } from '../lib/github'

// Helper function to calculate pet stage based on level
function calculateStageFromLevel(level) {
  if (level >= 50) return 'legendary'  // Level 50+ = Legendary (Platinum Deployer+)
  if (level >= 20) return 'adult'      // Level 20-49 = Adult (Golden Committer+)
  if (level >= 10) return 'juvenile'   // Level 10-19 = Juvenile (Silver Stackover+)  
  if (level >= 5) return 'hatchling'   // Level 5-9 = Hatchling (Bronze Debugger+)
  return 'egg'                         // Level 1-4 = Egg (Unranked Scripter)
}

export function useGitHub() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [github, setGithub] = useState(null)
  
  const { 
    githubToken, 
    user, 
    projects,
    currentProjectId,
    setUser,
    updateProject,
    commitBoost
  } = useStore()
  
  const currentProject = projects.find(p => p.id === currentProjectId) || null
  const projectType = currentProject?.type || 'general'

  // Initialize GitHub API
  useEffect(() => {
    if (githubToken) {
      const api = new GitHubAPI(githubToken)
      setGithub(api)
    }
  }, [githubToken])

  // OAuth login (simplified - would need proper OAuth flow)
  const loginWithGitHub = useCallback(async (token) => {
    try {
      setLoading(true)
      setError(null)
      
      const api = new GitHubAPI(token)
      const userData = await api.getUser()
      
      setUser(userData)
      useStore.getState().setGithubToken(token)
      
      return userData
    } catch (err) {
      setError('Failed to authenticate with GitHub')
      console.error('GitHub auth error:', err)
    } finally {
      setLoading(false)
    }
  }, [setUser])

  // Sync repository data and update pet
  const syncRepository = useCallback(async () => {
    if (!github || !currentProject || !user) {
      console.log('Missing dependencies:', { github: !!github, currentProject, user: user?.login })
      return
    }

    try {
      setLoading(true)
      setError(null)

      const repoInfo = GitHubAPI.parseRepoUrl(currentProject.repo)
      console.log('Parsed repo info:', repoInfo)
      if (!repoInfo) {
        throw new Error('Invalid repository URL')
      }

      console.log('Analyzing commits for:', `${repoInfo.owner}/${repoInfo.repo}`, 'by user:', user.login)
      
      const analyzer = new ProjectAnalyzer(github)
      
      // Get commit data for streak calculation
      const streakData = await analyzer.analyzeCommitPatterns(
        repoInfo.owner, 
        repoInfo.repo, 
        user.login,
        90 // Check last 90 days
      )

      console.log('Streak data received:', streakData)

      // Auto-detect project type if not set
      let detectedType = projectType
      if (!projectType || projectType === 'auto') {
        detectedType = await analyzer.detectProjectType(repoInfo.owner, repoInfo.repo)
      }

      // Update project with streak data and commits
      if (currentProject) {
        updateProject(currentProject.id, {
          type: detectedType,
          pet: {
            ...currentProject.pet,
            streak: streakData.streak,
            lastCommit: streakData.lastCommit
          },
          recentCommits: streakData.commits.slice(0, 50)
        })
      }

      // Calculate and add XP from NEW commits only (prevent double XP)
      if (streakData.commits.length > 0 && currentProject) {
        const processedShas = currentProject.processedCommitShas || []
        
        // Filter out commits we've already processed
        const newCommits = streakData.commits.filter(commit => 
          !processedShas.includes(commit.sha)
        )

        console.log(`Total commits: ${streakData.commits.length}, New commits: ${newCommits.length}`)

        if (newCommits.length > 0) {
          let totalNewXP = 0
          let detailedCommitsCount = 0
          let estimatedCommitsCount = 0
          const newCommitShas = []

          console.log(`Processing ${newCommits.length} NEW commits for XP calculation...`)

          // Process only new commits and calculate XP
          newCommits.forEach((commit, index) => {
            let xp
            
            if (commit.stats && commit.stats.total !== undefined) {
              // Use actual commit size for detailed commits
              xp = XPCalculator.calculateCommitXP(commit, detectedType)
              detailedCommitsCount++
              console.log(`NEW Commit ${index + 1}: ${commit.stats.total} lines = ${xp} XP (${commit.commit.message.slice(0, 40)}...)`)
            } else {
              // Estimate XP for commits without detailed stats (older commits)
              xp = 30 // Average of small-medium commit
              estimatedCommitsCount++
            }
            
            totalNewXP += xp
            newCommitShas.push(commit.sha)
          })

          console.log(`New XP breakdown:`)
          console.log(`- ${detailedCommitsCount} commits with detailed stats`)
          console.log(`- ${estimatedCommitsCount} commits with estimated XP`)
          console.log(`- Total NEW XP: ${totalNewXP}`)

          // No XP cap - give full XP for all commits!
          if (totalNewXP > 0 && currentProject) {
            // Update project pet with new XP and level
            const newXP = currentProject.pet.xp + totalNewXP
            const newLevel = Math.floor(newXP / 100) + 1
            const newStage = calculateStageFromLevel(newLevel)
            
            updateProject(currentProject.id, {
              pet: {
                ...currentProject.pet,
                xp: newXP,
                level: newLevel,
                stage: newStage,
                xpToNext: (newLevel * 100) - newXP
              },
              processedCommitShas: [...(currentProject.processedCommitShas || []), ...newCommitShas]
            })
            
            commitBoost() // Boost health and happiness on real commits
            
            console.log(`Pet evolved to level ${newLevel}, stage: ${newStage}`)
          }
        } else {
          console.log('No new commits to process - all commits already seen!')
        }
      }

      return { streakData, detectedType }
    } catch (err) {
      setError(`Sync failed: ${err.message}`)
      console.error('Sync error:', err)
    } finally {
      setLoading(false)
    }
  }, [github, currentProject, user, projectType, updateProject])

  // Manual commit check (for testing)
  const checkForNewCommits = useCallback(async () => {
    if (!github || !currentProject || !user) return []

    const repoInfo = GitHubAPI.parseRepoUrl(currentProject.repo)
    if (!repoInfo) return []

    try {
      const commits = await github.getCommits(repoInfo.owner, repoInfo.repo, {
        author: user.login,
        per_page: 10
      })

      return commits
    } catch (err) {
      console.error('Error checking commits:', err)
      return []
    }
  }, [github, currentProject, user])

  // Test function to simulate commit (for demo)
  const simulateCommit = useCallback(() => {
    // Simulate different commit sizes
    const commitSizes = [
      { lines: 5, xp: 15, desc: "Small fix" },
      { lines: 25, xp: 35, desc: "Feature work" },
      { lines: 75, xp: 90, desc: "Major feature" },
      { lines: 150, xp: 180, desc: "Big refactor" }
    ]
    
    const randomCommit = commitSizes[Math.floor(Math.random() * commitSizes.length)]
    const xpGained = randomCommit.xp + Math.floor(Math.random() * 20) - 10 // ±10 variation
    
    if (currentProject) {
      // Update project pet with demo XP
      const newXP = currentProject.pet.xp + xpGained
      const newLevel = Math.floor(newXP / 100) + 1
      const newStage = calculateStageFromLevel(newLevel)
      const newStreak = currentProject.pet.streak + 1
      
      updateProject(currentProject.id, {
        pet: {
          ...currentProject.pet,
          xp: newXP,
          level: newLevel,
          stage: newStage,
          xpToNext: (newLevel * 100) - newXP,
          streak: newStreak,
          lastCommit: new Date().toISOString()
        }
      })
      
      commitBoost() // Boost health and happiness on demo commits too
      
      console.log(`Demo commit: ${randomCommit.desc} (${randomCommit.lines} lines) = ${xpGained} XP`)
    }
    
    return { 
      xpGained, 
      commitDesc: randomCommit.desc,
      lines: randomCommit.lines,
      newStreak: currentProject ? currentProject.pet.streak + 1 : 1,
      message: `${randomCommit.desc}: +${xpGained} XP` 
    }
  }, [currentProject, updateProject, commitBoost])

  // Debug function to test commit boost directly
  const testCommitBoost = useCallback(() => {
    const store = useStore.getState()
    console.log('Before boost:', { health: store.pet.health, happiness: store.pet.happiness })
    store.commitBoost()
    console.log('After boost:', { health: store.pet.health, happiness: store.pet.happiness })
  }, [])

  return {
    github,
    loading,
    error,
    loginWithGitHub,
    syncRepository,
    checkForNewCommits,
    simulateCommit, // For testing
    testCommitBoost, // For testing
    isAuthenticated: !!github && !!user
  }
}