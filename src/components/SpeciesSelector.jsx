import { motion } from 'framer-motion'
import PixelSprite from './PixelSprite'

const AVAILABLE_SPECIES = [
  {
    id: 'commit_cat',
    name: 'Commit Cat',
    description: 'A classic coding companion with feline charm',
    personality: 'Independent and clever'
  },
  {
    id: 'commit_corgi',
    name: 'Code Corgi',
    description: 'A loyal and energetic coding buddy',
    personality: 'Loyal and enthusiastic'
  }
]

function SpeciesSelector({ selectedSpecies, onSpeciesChange }) {
  return (
    <div className="pixel-card">
      <h3 className="text-lg mb-4 text-center">Choose Your Coding Companion</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_SPECIES.map((species) => (
          <motion.button
            key={species.id}
            className={`pixel-card relative p-4 transition-all ${
              selectedSpecies === species.id 
                ? 'bg-pixel-accent/20 border-pixel-accent' 
                : 'bg-pixel-surface hover:bg-pixel-primary/10'
            }`}
            onClick={() => onSpeciesChange(species.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedSpecies === species.id && (
              <div className="absolute top-2 right-2 text-pixel-accent">✓</div>
            )}
            
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <PixelSprite species={species.id} stage="adult" size={120} health={100} happiness={100} />
              </div>
              
              <h4 className="font-bold text-sm mb-1">{species.name}</h4>
              <p className="text-xs text-pixel-muted mb-2">{species.description}</p>
              <p className="text-xs text-pixel-accent italic">{species.personality}</p>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4 text-center text-xs text-pixel-muted">
        <p>Don't worry - your companion will start as an egg and grow based on your coding activity! 🥚➡️🐱</p>
      </div>
    </div>
  )
}

export default SpeciesSelector