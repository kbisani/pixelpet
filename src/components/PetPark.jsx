import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'
import PixelSprite from './PixelSprite'

function PetPark({ onSelectProject, onAddProject }) {
  const { projects, getAverageHealth, getAverageHappiness } = useStore()
  
  const averageHealth = getAverageHealth()
  const averageHappiness = getAverageHappiness()
  
  // Debug logging
  console.log('Pet Park - Projects:', projects.map(p => ({ id: p.id, name: p.pet?.name, species: p.pet?.species, health: p.pet?.health, happiness: p.pet?.happiness })))
  console.log('Average Health/Happiness:', averageHealth, averageHappiness)

  if (projects.length === 0) {
    return (
      <div className="pixel-card text-center">
        <h2 className="text-2xl mb-4">🏞️ Pet Park</h2>
        <p className="text-pixel-muted mb-4">No pets in your park yet!</p>
        <p className="text-sm mb-4">Add your first project to see pets here.</p>
        <button 
          onClick={onAddProject}
          className="pixel-button bg-green-600 text-white"
        >
          ➕ Add Your First Project
        </button>
      </div>
    )
  }

  return (
    <div className="pixel-card">
      <div className="text-center mb-6">
        <h2 className="text-2xl mb-2">🏞️ Pet Park</h2>
        <p className="text-pixel-muted text-sm">Click any pet to visit their project</p>
        
        {/* Global Health/Happiness Display */}
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span>❤️</span>
            <div className="w-20 bg-pixel-primary h-2 pixel-border">
              <div 
                className="bg-red-500 h-full transition-all"
                style={{ width: `${averageHealth}%` }}
              />
            </div>
            <span>{averageHealth}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>😊</span>
            <div className="w-20 bg-pixel-primary h-2 pixel-border">
              <div 
                className="bg-yellow-500 h-full transition-all"
                style={{ width: `${averageHappiness}%` }}
              />
            </div>
            <span>{averageHappiness}%</span>
          </div>
        </div>
      </div>

      {/* Park Environment */}
      <div className="relative bg-gradient-to-b from-sky-200 to-green-200 border-4 border-black pixel-border min-h-96 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-green-300 border-t-4 border-green-500"></div>
        
        {/* Trees */}
        <div className="absolute bottom-16 left-8 w-8 h-12 bg-amber-800 border-2 border-amber-900"></div>
        <div className="absolute bottom-20 left-4 w-16 h-16 bg-green-400 border-2 border-green-600 rounded-full"></div>
        
        <div className="absolute bottom-16 right-12 w-8 h-12 bg-amber-800 border-2 border-amber-900"></div>
        <div className="absolute bottom-20 right-8 w-16 h-16 bg-green-400 border-2 border-green-600 rounded-full"></div>
        
        {/* Clouds */}
        <div className="absolute top-4 left-16 w-12 h-6 bg-white border-2 border-gray-300 rounded-full opacity-80"></div>
        <div className="absolute top-8 right-20 w-16 h-8 bg-white border-2 border-gray-300 rounded-full opacity-70"></div>
        
        {/* Sun */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 border-3 border-yellow-600 rounded-full"></div>
        
        {/* Pets in the Park */}
        <div className="relative h-full pt-8">
          {projects.map((project, index) => {
            console.log(`Rendering pet ${index}:`, {
              id: project.id,
              name: project.pet?.name,
              species: project.pet?.species,
              stage: project.pet?.stage,
              position: { left: `${15 + (index * 150) % 400}px`, bottom: `${100 + (index % 2) * 80}px` }
            })
            return (
            <motion.div
              key={project.id}
              className="absolute cursor-pointer" // Removed debug styling
              style={{
                left: `${15 + (index * 120) % 350}px`,
                bottom: `${-340 + (index % 2) * 40}px`, // Perfect height on green grass
                zIndex: 10 + index
              }}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectProject(project.id)}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, -2, 0],
                x: [50, 250, -50, 300, 100, -100] // Shifted more to the right
              }}
              transition={{
                y: {
                  duration: 2 + (index * 0.3),
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 4 + (index * 0.5),
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                x: {
                  duration: 25 + (index * 3), // Much slower - 25-40 second cycles
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop"
                }
              }}
            >
              {/* Pet with name tag */}
              <div className="relative">
                <PixelSprite 
                  species={project.pet?.species || 'commit_cat'} 
                  stage={project.pet?.stage || 'egg'} 
                  size={80}
                  health={project.pet?.health || 100}
                  happiness={project.pet?.happiness || 100}
                />
                
                {/* Name tag */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black px-2 py-1 text-xs rounded shadow-md">
                  <span className="text-black font-bold">{project.pet?.name || 'Unknown'}</span>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
                  </div>
                </div>
                
                {/* Level indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded border border-black font-bold shadow-md">
                  Lv.{project.pet?.level || 1}
                </div>
              </div>
            </motion.div>
            )
          })}
        </div>

        {/* Park decorations */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Flowers */}
          <div className="w-3 h-3 bg-pink-400 border border-pink-600 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 rounded-full"></div>
          <div className="w-3 h-3 bg-purple-400 border border-purple-600 rounded-full"></div>
        </div>
      </div>

      {/* Park Controls */}
      <div className="mt-4 text-center">
        <p className="text-xs text-pixel-muted">
          🌱 All pets share the same health and happiness based on your overall coding activity
        </p>
      </div>
    </div>
  )
}

export default PetPark