import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // User & Auth
      user: null,
      githubToken: null,
      
      // Multiple Projects System
      projects: [], // Array of project objects
      currentProjectId: null, // ID of currently active project

      // Pet Memories - saved pets from past projects
      petMemories: [], // Array of completed pet memories

      // Processed commits tracking - prevent double XP
      processedCommitShas: [], // Array of commit SHAs we've already given XP for

      // Actions
      setUser: (user) => set({ user }),
      setGithubToken: (token) => set({ githubToken: token }),
      
      // Project Management
      addProject: (projectData) => set(state => {
        const newProject = {
          id: `project_${Date.now()}`,
          repo: projectData.repo,
          type: projectData.type || 'auto',
          pet: {
            species: projectData.species || 'commit_cat',
            name: projectData.name || 'Pixel',
            level: 1,
            xp: 0,
            xpToNext: 100,
            stage: 'egg',
            streak: 0,
            lastCommit: null,
            health: 100,
            happiness: 100,
          },
          recentCommits: [],
          processedCommitShas: [],
          createdAt: new Date().toISOString(),
        }
        return {
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id
        }
      }),

      setCurrentProject: (projectId) => set({ currentProjectId: projectId }),
      
      getCurrentProject: () => {
        const state = useStore.getState()
        return state.projects.find(p => p.id === state.currentProjectId) || null
      },

      updateProject: (projectId, updates) => set(state => ({
        projects: state.projects.map(project => 
          project.id === projectId ? { ...project, ...updates } : project
        )
      })),

      deleteProject: (projectId) => set(state => ({
        projects: state.projects.filter(project => project.id !== projectId),
        currentProjectId: state.currentProjectId === projectId ? 
          (state.projects.length > 1 ? state.projects.find(p => p.id !== projectId)?.id : null) : 
          state.currentProjectId
      })),
      
      setRecentCommits: (commits) => set({ recentCommits: commits }),
      
      setProjectType: (type, settings = null) => set({ 
        projectType: type,
        customSettings: settings 
      }),

      updatePet: (updates) => set(state => ({
        pet: { ...state.pet, ...updates }
      })),

      addXP: (amount) => set(state => {
        const newXP = state.pet.xp + amount
        const newLevel = Math.floor(newXP / 100) + 1
        const leveledUp = newLevel > state.pet.level
        
        return {
          pet: {
            ...state.pet,
            xp: newXP,
            level: newLevel,
            xpToNext: (newLevel * 100) - newXP,
          }
        }
      }),

      incrementStreak: () => set(state => ({
        pet: {
          ...state.pet,
          streak: state.pet.streak + 1,
          lastCommit: new Date().toISOString()
        }
      })),

      resetStreak: () => set(state => ({
        pet: {
          ...state.pet,
          streak: 0
        }
      })),

      // Pet Memory Actions
      savePetMemory: (projectName = null) => set(state => {
        const memoryId = `memory_${Date.now()}`
        const newMemory = {
          id: memoryId,
          pet: { ...state.pet },
          project: {
            name: projectName || state.currentProject?.repo?.split('/').slice(-1)[0] || 'Unknown Project',
            repo: state.currentProject?.repo,
            type: state.projectType
          },
          savedAt: new Date().toISOString(),
          totalCommits: state.recentCommits.length,
          achievements: [
            state.pet.level >= 100 ? 'Grand Master Achieved' : null,
            state.pet.level >= 50 ? 'Legendary Status' : null,
            state.pet.level >= 20 ? 'Adult Achievement' : null,
            state.pet.streak >= 30 ? '30 Day Streak Master' : null,
            state.pet.streak >= 7 ? 'Week Warrior' : null
          ].filter(Boolean)
        }
        
        return {
          petMemories: [...state.petMemories, newMemory]
        }
      }),

      deletePetMemory: (memoryId) => set(state => ({
        petMemories: state.petMemories.filter(memory => memory.id !== memoryId)
      })),

      clearAllMemories: () => set({ petMemories: [] }),

      // Processed commits management
      addProcessedCommits: (commitShas) => set(state => ({
        processedCommitShas: [...new Set([...state.processedCommitShas, ...commitShas])]
      })),

      isCommitProcessed: (sha) => {
        const state = useStore.getState()
        return state.processedCommitShas.includes(sha)
      },

      clearProcessedCommits: () => set({ processedCommitShas: [] }),

      // Individual Project Health & Happiness System
      updateHealth: (amount, projectId = null) => set(state => {
        const targetProjectId = projectId || state.currentProjectId
        if (!targetProjectId) return state
        
        return {
          projects: state.projects.map(project => 
            project.id === targetProjectId ? {
              ...project,
              pet: {
                ...project.pet,
                health: Math.max(0, Math.min(100, project.pet.health + amount))
              }
            } : project
          )
        }
      }),

      updateHappiness: (amount, projectId = null) => set(state => {
        const targetProjectId = projectId || state.currentProjectId
        if (!targetProjectId) return state
        
        return {
          projects: state.projects.map(project => 
            project.id === targetProjectId ? {
              ...project,
              pet: {
                ...project.pet,
                happiness: Math.max(0, Math.min(100, project.pet.happiness + amount))
              }
            } : project
          )
        }
      }),

      // Passive decay system - called periodically (applies to all projects)
      applyPassiveDecay: () => set(state => {
        const now = new Date()
        
        return {
          projects: state.projects.map(project => {
            const lastCommit = project.pet.lastCommit ? new Date(project.pet.lastCommit) : null
            const daysSinceLastCommit = lastCommit ? 
              (now - lastCommit) / (1000 * 60 * 60 * 24) : 0

            let healthDecay = 0
            let happinessDecay = 0

            // Health decreases faster, happiness decreases even more
            if (daysSinceLastCommit > 7) {
              healthDecay = -5
              happinessDecay = -8
            } else if (daysSinceLastCommit > 3) {
              healthDecay = -3
              happinessDecay = -5
            } else if (daysSinceLastCommit > 1) {
              healthDecay = -1
              happinessDecay = -2
            }

            // Pet gets sad if health is low
            if (project.pet.health < 30) {
              happinessDecay -= 2
            }

            return {
              ...project,
              pet: {
                ...project.pet,
                health: Math.max(0, Math.min(100, project.pet.health + healthDecay)),
                happiness: Math.max(0, Math.min(100, project.pet.happiness + happinessDecay))
              }
            }
          })
        }
      }),

      // Positive effects from commits (boosts current project)
      commitBoost: () => set(state => {
        if (!state.currentProjectId) return state
        
        return {
          projects: state.projects.map(project => 
            project.id === state.currentProjectId ? {
              ...project,
              pet: {
                ...project.pet,
                health: Math.min(100, project.pet.health + 5),
                happiness: Math.min(100, project.pet.happiness + 10)
              }
            } : project
          )
        }
      }),

      // Get average health/happiness for Pet Park display
      getAverageHealth: () => {
        const state = useStore.getState()
        if (state.projects.length === 0) return 100
        const totalHealth = state.projects.reduce((sum, project) => sum + project.pet.health, 0)
        return Math.round(totalHealth / state.projects.length)
      },

      getAverageHappiness: () => {
        const state = useStore.getState()
        if (state.projects.length === 0) return 100
        const totalHappiness = state.projects.reduce((sum, project) => sum + project.pet.happiness, 0)
        return Math.round(totalHappiness / state.projects.length)
      },
    }),
    {
      name: 'pixelpet-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export { useStore }