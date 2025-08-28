import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import PixelSprite from './PixelSprite'
import { useState, useEffect } from 'react'

// Get current rank based on level
function getRankFromLevel(level) {
  if (level >= 100) return 'Grand Master Baiter 🎣'
  if (level >= 75) return 'Diamond Architect 💎'
  if (level >= 50) return 'Platinum Deployer 🔷'
  if (level >= 35) return 'Emerald Refactorer 💚'
  if (level >= 20) return 'Golden Committer 🥇'
  if (level >= 10) return 'Silver Stackover 🥈'
  if (level >= 5) return 'Bronze Debugger 🥉'
  return 'Unranked Scripter 📝'
}

// Motivational messages for the cat
const motivationalMessages = [
  "WOW!", "Keep coding!", "You're awesome!", "Great job!", "Don't give up!",
  "Code on!", "Amazing work!", "You got this!", "Stay strong!", "Build more!",
  "Fantastic!", "Never stop!", "Code magic!", "Super dev!", "Keep going!",
  "Epic coding!", "You rock!", "More commits!", "Stay focused!", "Dream big!",
  "Code dreams!", "Push harder!", "Debug life!", "Stay curious!", "Build cool stuff!",
  "Commit often!", "Test everything!", "Ship it!", "Code happy!", "You're brilliant!"
]

// Motivational Message Component
function MotivationalBubble({ message, isVisible, onComplete }) {
  return (
    <motion.div
      className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={isVisible ? { 
        opacity: 1, 
        scale: 1, 
        y: 0 
      } : { 
        opacity: 0, 
        scale: 0.5, 
        y: 20 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      onAnimationComplete={() => {
        if (!isVisible) onComplete();
      }}
    >
      {/* Speech bubble like in the reference image */}
      <div className="relative bg-white border-2 border-black px-3 py-2 text-sm font-bold text-black pixel-border">
        {message}
        {/* Bubble tail */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          <div className="w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-white absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
    </motion.div>
  )
}

function PetDisplay() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { species: 'commit_cat', name: 'Pixel', level: 1, xp: 0, stage: 'egg', health: 100, happiness: 100 }
  const petHealth = pet.health || 100
  const petHappiness = pet.happiness || 100
  const [currentMessage, setCurrentMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  
  // Show motivational messages periodically (but not when dead!)
  useEffect(() => {
    const showMotivationalMessage = () => {
      // Don't show messages if pet is dead (0% health and happiness)
      if (petHealth === 0 && petHappiness === 0) return
      
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      setCurrentMessage(randomMessage)
      setShowMessage(true)
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    }
    
    // Show first message after 2 seconds
    const initialTimeout = setTimeout(showMotivationalMessage, 2000)
    
    // Then show messages every 15-30 seconds randomly
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 15000 + 15000 // 15-30 seconds
      setTimeout(showMotivationalMessage, randomDelay)
    }, 30000)
    
    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [petHealth, petHappiness])
  
  
  const getStageMessage = () => {
    // Health and happiness status messages (using individual pet values)
    if (petHealth < 20) return `${pet.name} is very sick! 😵 Commit some code to help!`
    if (petHappiness < 20) return `${pet.name} is very sad... 😢 Code to cheer them up!`
    if (petHealth < 50) return `${pet.name} isn't feeling well... 🤒`
    if (petHappiness < 50) return `${pet.name} seems a bit down... 😐`
    
    // Normal stage messages
    switch (pet.stage) {
      case 'egg': return `${pet.name} is waiting to hatch...`
      case 'hatchling': return `${pet.name} just hatched!`
      case 'juvenile': return `${pet.name} is growing strong!`
      case 'adult': return `${pet.name} is fully grown!`
      case 'legendary': return `${pet.name} achieved legendary status!`
      default: return `Meet ${pet.name}!`
    }
  }

  const xpPercentage = ((pet.xp % 100) / 100) * 100

  return (
    <div className="pixel-card text-center">
      <div className="mb-4">
        <h2 className="text-xl mb-2">{pet.name}</h2>
        <div className="text-sm text-pixel-muted mb-1">Level {pet.level} • {pet.species.replace('_', ' ')}</div>
        <div className="text-xs font-bold text-pixel-accent">
          {getRankFromLevel(pet.level)}
        </div>
      </div>

      {/* Pet Display */}
      <div className="pet-container mx-auto mb-4 relative">
        <PixelSprite 
          species={pet.species} 
          stage={pet.stage} 
          size={200}
          health={petHealth}
          happiness={petHappiness}
        />
        {/* Motivational Message Bubble */}
        <MotivationalBubble 
          message={currentMessage}
          isVisible={showMessage}
          onComplete={() => setCurrentMessage('')}
        />
      </div>

      {/* Status Message */}
      <p className="text-sm text-pixel-muted mb-4">{getStageMessage()}</p>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>XP: {pet.xp}</span>
          <span>Next: {pet.level * 100}</span>
        </div>
        <div className="xp-bar">
          <motion.div 
            className="xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Health & Happiness */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span>❤️ Health</span>
            <span>{petHealth}%</span>
          </div>
          <div className="w-full bg-pixel-primary h-2 pixel-border">
            <div 
              className="bg-red-500 h-full transition-all"
              style={{ width: `${petHealth}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span>😊 Happy</span>
            <span>{petHappiness}%</span>
          </div>
          <div className="w-full bg-pixel-primary h-2 pixel-border">
            <div 
              className="bg-yellow-500 h-full transition-all"
              style={{ width: `${petHappiness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetDisplay