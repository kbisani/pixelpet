import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import SpeciesSelector from './SpeciesSelector'

// Simplified setup - removed project type complexity

const PET_SPECIES = [
  { id: 'commit_cat', name: '🐱 Commit Cat', description: 'Grows with consistent commits' },
  { id: 'commit_corgi', name: '🐕 Code Corgi', description: 'Loyal companion for all projects' }
]

function ProjectSetup({ onComplete, onCancel }) {
  const [step, setStep] = useState(1)
  const [selectedPet, setSelectedPet] = useState('commit_cat')
  const [petName, setPetName] = useState('')
  const [repoUrl, setRepoUrl] = useState('')

  const { user, addProject, projects } = useStore()
  const hasExistingProjects = projects.length > 0

  // Auto-fill repo URL with user's GitHub username when user is available
  useEffect(() => {
    if (user?.login && !repoUrl) {
      setRepoUrl(`https://github.com/${user.login}/`)
    }
  }, [user?.login, repoUrl])

  const handleStart = () => {
    // Ensure repo URL is complete with a repository name
    const isValidRepo = repoUrl && repoUrl.includes('github.com/') && repoUrl.split('/').length >= 5
    if (petName && isValidRepo) {
      addProject({
        repo: repoUrl,
        type: 'general',
        species: selectedPet,
        name: petName
      })
      if (onComplete) onComplete()
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  return (
    <div className="pixel-card max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-center gap-4 mb-4">
          {[1, 2].map(i => (
            <div 
              key={i}
              className={`w-8 h-8 pixel-border flex items-center justify-center ${
                step >= i ? 'bg-pixel-accent' : 'bg-pixel-surface'
              }`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl mb-6">Choose Your Pet</h2>
          <div className="mb-6">
            <SpeciesSelector 
              selectedSpecies={selectedPet} 
              onSpeciesChange={setSelectedPet}
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Pet Name:</label>
            <input 
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full bg-pixel-surface pixel-border p-2 text-pixel-text"
              placeholder="Enter pet name..."
              maxLength={20}
            />
          </div>

          <button 
            className="pixel-button w-full"
            disabled={!petName}
            onClick={() => setStep(2)}
          >
            Continue to Repository Setup
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl mb-4">Connect Your Repository</h2>
          <div className="mb-6">
            <label className="block mb-2">GitHub Repository URL:</label>
            <input 
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-pixel-surface pixel-border p-2 text-pixel-text"
              placeholder={user?.login ? `https://github.com/${user.login}/your-repo-name` : "https://github.com/username/repo"}
            />
            <p className="text-xs text-pixel-muted mt-2">
              {user?.login ? `Just add your repository name after "${user.login}/"`  : 'We\'ll track your commits to this repository'}
            </p>
          </div>

          <div className="bg-pixel-surface pixel-border p-4 mb-6">
            <h3 className="mb-2">Summary:</h3>
            <p>Pet: {PET_SPECIES.find(p => p.id === selectedPet)?.name} named "{petName}"</p>
            <p>Repo: {repoUrl}</p>
          </div>

          <div className="flex space-x-2">
            {hasExistingProjects && (
              <button 
                className="pixel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
            <button 
              className="pixel-button flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="pixel-button flex-1 bg-pixel-accent"
              disabled={!petName || !(repoUrl && repoUrl.includes('github.com/') && repoUrl.split('/').length >= 5)}
              onClick={handleStart}
            >
              {hasExistingProjects ? 'Add Project! 🎉' : 'Start Adventure! 🚀'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectSetup