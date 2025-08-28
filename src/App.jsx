import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ProjectSetup from './components/ProjectSetup'
import PetDashboard from './components/PetDashboard'
import PetPark from './components/PetPark'
import GitHubAuth from './components/GitHubAuth'
import { useStore } from './stores/gameStore'
import { useGitHub } from './hooks/useGitHub'

function App() {
  const { projects, currentProjectId, user, applyPassiveDecay, setCurrentProject } = useStore()
  const { isAuthenticated } = useGitHub()
  const [view, setView] = useState('park') // 'park', 'project', 'add-project'
  
  // Set initial view based on whether user has projects
  useEffect(() => {
    if (isAuthenticated && projects.length === 0 && view === 'park') {
      setView('add-project')
    }
  }, [isAuthenticated, projects.length, view])
  
  const currentProject = projects.find(p => p.id === currentProjectId) || null
  
  // Debug logging
  console.log('App state:', { 
    projects: projects.length, 
    currentProjectId, 
    currentProject: currentProject?.pet?.name,
    view 
  })

  // Passive decay system - check every hour
  useEffect(() => {
    // Apply decay on startup
    applyPassiveDecay()
    
    // Then apply every 30 seconds for testing (change back to 1 hour later)
    const interval = setInterval(() => {
      applyPassiveDecay()
    }, 30 * 1000) // 30 seconds for testing

    return () => clearInterval(interval)
  }, [applyPassiveDecay])

  const handleSelectProject = (projectId) => {
    setCurrentProject(projectId)
    setView('project')
  }

  const handleAddProject = () => {
    setView('add-project')
  }

  const handleBackToPark = () => {
    setView('park')
  }

  const renderContent = () => {
    if (!isAuthenticated) {
      return <GitHubAuth />
    }

    // If no projects exist, always show add-project
    if (projects.length === 0) {
      return <ProjectSetup onComplete={() => setView('park')} onCancel={() => setView('park')} />
    }

    switch (view) {
      case 'add-project':
        return <ProjectSetup onComplete={() => setView('park')} onCancel={() => setView('park')} />
      case 'project':
        return currentProject ? <PetDashboard onBackToPark={handleBackToPark} /> : <PetPark onSelectProject={handleSelectProject} />
      case 'park':
      default:
        return <PetPark onSelectProject={handleSelectProject} onAddProject={handleAddProject} />
    }
  }

  return (
    <div className="min-h-screen bg-pixel-bg p-4">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl text-pixel-accent mb-2">🐱 PIXELPET</h1>
          <p className="text-pixel-muted">Your Coding Companion</p>
          {user && (
            <p className="text-xs text-pixel-muted mt-2">
              Welcome, {user.login || user.name || 'Developer'}!
            </p>
          )}
          
          {/* Navigation */}
          {isAuthenticated && projects.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              <button 
                onClick={handleBackToPark}
                className={`pixel-button text-sm ${view === 'park' ? 'bg-pixel-accent text-white' : ''}`}
              >
                🏞️ Pet Park
              </button>
              <button 
                onClick={handleAddProject}
                className="pixel-button text-sm bg-green-600 text-white"
              >
                ➕ Add Project
              </button>
              {currentProject && view === 'project' && (
                <span className="pixel-button text-sm bg-blue-600 text-white">
                  📊 {currentProject.pet.name}'s Project
                </span>
              )}
            </div>
          )}
        </header>

        {renderContent()}
      </motion.div>
    </div>
  )
}

export default App