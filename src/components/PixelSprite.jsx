import { motion } from 'framer-motion'

// 8-bit pixel art sprites as CSS-in-JS - Updated to match reference style
const PixelSprite = ({ species, stage, size = 64, health = 100, happiness = 100 }) => {
  
  // Calculate health state based on weighted average
  const getHealthState = () => {
    const averageWellbeing = (health + happiness) / 2
    if (averageWellbeing >= 66) return 'healthy'
    if (averageWellbeing >= 33) return 'sick'
    if (averageWellbeing > 0) return 'very_sick'
    return 'dead'
  }
  
  // Apply visual effects based on health state
  const applyHealthEffects = (sprite, healthState) => {
    if (healthState === 'healthy') return sprite
    
    // Clone the sprite element to add health effects
    const sickEffects = {
      sick: {
        filter: 'brightness(0.8) saturate(0.7)',
        opacity: 0.85,
        overlay: (
          <>
            {/* Sweat drops for slightly sick */}
            <div className="absolute w-2 h-3 bg-blue-300 border border-blue-500" 
                 style={{ left: '25%', top: '35%', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', opacity: 0.8 }} />
            <div className="absolute w-1 h-2 bg-blue-300 border border-blue-500" 
                 style={{ right: '30%', top: '40%', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', opacity: 0.6 }} />
            {/* Sad mouth overlay */}
            <div className="absolute bg-gray-800 border border-gray-900" 
                 style={{ 
                   width: '8%', height: '2%',
                   left: '50%', top: '58%',
                   transform: 'translateX(-50%)',
                   clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                   borderRadius: '0 0 4px 4px'
                 }} />
          </>
        )
      },
      very_sick: {
        filter: 'brightness(0.6) saturate(0.4) hue-rotate(20deg)',
        opacity: 0.7,
        overlay: (
          <>
            {/* Multiple sweat drops + X eyes for very sick */}
            <div className="absolute w-2 h-3 bg-blue-300 border border-blue-500" 
                 style={{ left: '20%', top: '30%', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
            <div className="absolute w-2 h-3 bg-blue-300 border border-blue-500" 
                 style={{ right: '25%', top: '35%', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
            <div className="absolute w-1 h-2 bg-blue-300 border border-blue-500" 
                 style={{ left: '40%', top: '25%', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
            {/* Dizzy stars */}
            <div className="absolute text-yellow-400 text-xs animate-spin" style={{ left: '15%', top: '15%' }}>⭐</div>
            <div className="absolute text-yellow-300 text-xs animate-spin" style={{ right: '20%', top: '10%', animationDirection: 'reverse' }}>⭐</div>
            {/* Very sad mouth overlay */}
            <div className="absolute bg-gray-900 border border-black" 
                 style={{ 
                   width: '10%', height: '3%',
                   left: '50%', top: '60%',
                   transform: 'translateX(-50%)',
                   clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                   borderRadius: '0 0 6px 6px'
                 }} />
            {/* Droopy eyebrows */}
            <div className="absolute bg-gray-700" 
                 style={{ width: '4%', height: '1%', left: '30%', top: '36%', transform: 'rotate(15deg)' }} />
            <div className="absolute bg-gray-700" 
                 style={{ width: '4%', height: '1%', right: '30%', top: '36%', transform: 'rotate(-15deg)' }} />
          </>
        )
      },
      dead: {
        filter: 'brightness(0.3) saturate(0.1) grayscale(0.8)',
        opacity: 0.5,
        overlay: (
          <>
            {/* X eyes for dead state - bigger and more visible */}
            <div className="absolute w-4 h-1 bg-red-600 border border-red-800 transform rotate-45" style={{ left: '30%', top: '40%', zIndex: 10 }} />
            <div className="absolute w-4 h-1 bg-red-600 border border-red-800 transform -rotate-45" style={{ left: '30%', top: '40%', zIndex: 10 }} />
            <div className="absolute w-4 h-1 bg-red-600 border border-red-800 transform rotate-45" style={{ right: '30%', top: '40%', zIndex: 10 }} />
            <div className="absolute w-4 h-1 bg-red-600 border border-red-800 transform -rotate-45" style={{ right: '30%', top: '40%', zIndex: 10 }} />
            {/* Cover original eyes with neutral overlay */}
            <div className="absolute bg-gray-300 border border-gray-400" style={{ 
              width: '12%', height: '8%', 
              left: '30%', top: '38%',
              borderRadius: '50%',
              zIndex: 9
            }} />
            <div className="absolute bg-gray-300 border border-gray-400" style={{ 
              width: '12%', height: '8%', 
              right: '30%', top: '38%',
              borderRadius: '50%',
              zIndex: 9
            }} />
            {/* Hide original mouth with overlay */}
            <div className="absolute bg-gray-200" 
                 style={{ 
                   width: '12%', height: '8%',
                   left: '50%', top: '55%',
                   transform: 'translateX(-50%)',
                   borderRadius: '4px'
                 }} />
            {/* Floating spirit */}
            <div className="absolute text-white text-lg animate-bounce opacity-60" 
                 style={{ left: '50%', top: '5%', transform: 'translateX(-50%)', animationDuration: '2s' }}>👻</div>
          </>
        )
      }
    }
    
    const effect = sickEffects[healthState]
    if (!effect) return sprite
    
    return (
      <div className="relative" style={{ filter: effect.filter, opacity: effect.opacity }}>
        {sprite}
        {effect.overlay}
      </div>
    )
  }

  const getPixelArt = () => {
    const healthState = getHealthState()
    const sprites = {
      commit_cat: {
        egg: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ 
              width: `200px`, 
              height: `200px`,
              imageRendering: 'pixelated'
            }}
          >
            {/* Adorable BIG egg shell */}
            <div 
              className="absolute bg-white border-4 border-black"
              style={{
                width: '140px',
                height: '160px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                clipPath: 'polygon(20% 10%, 80% 10%, 90% 40%, 90% 80%, 70% 90%, 30% 90%, 10% 80%, 10% 40%)',
                borderRadius: '20px'
              }}
            />
            {/* Cute BIG pixel spots */}
            <div className="absolute bg-pink-400 border-2 border-pink-600" style={{ width: '12px', height: '12px', top: '25%', left: '30%', borderRadius: '50%' }} />
            <div className="absolute bg-gray-400 border-2 border-gray-600" style={{ width: '10px', height: '10px', top: '45%', right: '25%', borderRadius: '6px' }} />
            <div className="absolute bg-blue-400 border-2 border-blue-600" style={{ width: '8px', height: '8px', bottom: '30%', left: '25%', borderRadius: '4px' }} />
            <div className="absolute bg-purple-400 border-2 border-purple-600" style={{ width: '6px', height: '6px', top: '55%', left: '40%', borderRadius: '50%' }} />
            {/* Cute crack lines showing it's about to hatch */}
            <div className="absolute w-1 h-6 bg-gray-700" style={{ top: '20%', left: '45%', transform: 'rotate(15deg)', borderRadius: '2px' }} />
            <div className="absolute w-1 h-4 bg-gray-700" style={{ top: '60%', right: '40%', transform: 'rotate(-20deg)', borderRadius: '2px' }} />
            <div className="absolute w-1 h-3 bg-gray-700" style={{ top: '40%', left: '60%', transform: 'rotate(45deg)', borderRadius: '2px' }} />
          </div>
        ),
        
        hatchling: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Adorable BIG cat body */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '120px', height: '100px', 
              left: '50%', top: '55%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '25px'
            }} />
            
            {/* Cute BIG triangular ears with pink inside */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '25px', height: '25px',
              left: '28%', top: '25%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '12px', height: '12px',
              left: '30%', top: '30%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '25px', height: '25px',
              right: '28%', top: '25%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '12px', height: '12px',
              right: '30%', top: '30%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            
            {/* Big sparkly eyes with highlights */}
            <div className="absolute bg-black border-3 border-gray-600" style={{ width: '18px', height: '18px', left: '34%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '6px', left: '36%', top: '42%', borderRadius: '50%' }} />
            <div className="absolute bg-black border-3 border-gray-600" style={{ width: '18px', height: '18px', right: '34%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '6px', right: '36%', top: '42%', borderRadius: '50%' }} />
            
            {/* Adorable pink blush */}
            <div className="absolute bg-pink-400 opacity-80" style={{ width: '12px', height: '8px', left: '22%', top: '48%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-400 opacity-80" style={{ width: '12px', height: '8px', right: '22%', top: '48%', borderRadius: '8px' }} />
            
            {/* Tiny pink nose */}
            <div className="absolute bg-pink-500 border-2 border-pink-600" style={{ 
              width: '4px', height: '4px',
              left: '50%', top: '52%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Cute mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '8px', height: '4px',
              left: '50%', top: '55%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)'
            }} />
            
            {/* Fluffy tail with curve */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '12px', height: '28px',
              right: '12%', top: '43%',
              transform: 'rotate(20deg)',
              borderRadius: '12px'
            }} />
            <div className="absolute bg-gray-400" style={{ 
              width: '4px', height: '8px',
              right: '13%', top: '46%',
              transform: 'rotate(20deg)'
            }} />
            
            {/* Tiny paws with toe beans */}
            <div className="absolute bg-gray-400 border-2 border-black" style={{ width: '12px', height: '12px', left: '28%', bottom: '22%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-400" style={{ width: '4px', height: '4px', left: '29%', bottom: '23%' }} />
            <div className="absolute bg-gray-400 border-2 border-black" style={{ width: '12px', height: '12px', right: '28%', bottom: '22%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-400" style={{ width: '4px', height: '4px', right: '29%', bottom: '23%' }} />
          </div>
        ),
        
        juvenile: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Playful BIG teen cat body with rounded edges */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '130px', height: '110px', 
              left: '50%', top: '52%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '30px'
            }} />
            
            {/* Perky BIG pointed ears */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '30px', height: '30px',
              left: '26%', top: '20%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '15px', height: '15px',
              left: '28%', top: '25%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '30px', height: '30px',
              right: '26%', top: '20%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '15px', height: '15px',
              right: '28%', top: '25%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            
            {/* Expressive BIG oval eyes with sparkles */}
            <div className="absolute bg-black border-3 border-gray-600" style={{ width: '22px', height: '18px', left: '32%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '8px', height: '8px', left: '34%', top: '39%', borderRadius: '50%' }} />
            <div className="absolute bg-cyan-200" style={{ width: '3px', height: '3px', left: '36%', top: '41%' }} />
            <div className="absolute bg-black border-3 border-gray-600" style={{ width: '22px', height: '18px', right: '32%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '8px', height: '8px', right: '34%', top: '39%', borderRadius: '50%' }} />
            <div className="absolute bg-cyan-200" style={{ width: '3px', height: '3px', right: '36%', top: '41%' }} />
            
            {/* Enhanced BIG blush with gradient effect */}
            <div className="absolute bg-pink-400 opacity-70" style={{ width: '20px', height: '12px', left: '18%', top: '45%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-500 opacity-50" style={{ width: '12px', height: '6px', left: '20%', top: '46%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-400 opacity-70" style={{ width: '20px', height: '12px', right: '18%', top: '45%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-500 opacity-50" style={{ width: '12px', height: '6px', right: '20%', top: '46%', borderRadius: '8px' }} />
            
            {/* BIG Button nose */}
            <div className="absolute bg-pink-500 border-2 border-pink-600" style={{ 
              width: '8px', height: '8px',
              left: '50%', top: '50%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Happy BIG mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '16px', height: '6px',
              left: '50%', top: '53%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 25% 100%, 75% 100%, 100% 0%)'
            }} />
            
            {/* Cute BIG stripes */}
            <div className="absolute bg-gray-500 opacity-60" style={{ width: '6px', height: '25px', left: '36%', top: '30%', borderRadius: '6px' }} />
            <div className="absolute bg-gray-500 opacity-60" style={{ width: '6px', height: '25px', left: '46%', top: '30%', borderRadius: '6px' }} />
            <div className="absolute bg-gray-500 opacity-60" style={{ width: '6px', height: '25px', right: '36%', top: '30%', borderRadius: '6px' }} />
            
            {/* Fluffy BIG curved tail */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '18px', height: '40px',
              right: '8%', top: '38%',
              transform: 'rotate(25deg)',
              borderRadius: '18px'
            }} />
            <div className="absolute bg-gray-400" style={{ 
              width: '6px', height: '15px',
              right: '9.5%', top: '42%',
              transform: 'rotate(25deg)',
              borderRadius: '6px'
            }} />
            
            {/* BIG Paws with toe beans */}
            <div className="absolute bg-gray-400 border-3 border-black" style={{ width: '20px', height: '20px', left: '24%', bottom: '18%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-400" style={{ width: '8px', height: '8px', left: '26%', bottom: '20%', borderRadius: '50%' }} />
            <div className="absolute bg-pink-500" style={{ width: '3px', height: '3px', left: '25%', bottom: '21%' }} />
            <div className="absolute bg-pink-500" style={{ width: '3px', height: '3px', left: '28%', bottom: '21%' }} />
            <div className="absolute bg-gray-400 border-3 border-black" style={{ width: '20px', height: '20px', right: '24%', bottom: '18%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-400" style={{ width: '8px', height: '8px', right: '26%', bottom: '20%', borderRadius: '50%' }} />
            <div className="absolute bg-pink-500" style={{ width: '3px', height: '3px', right: '25%', bottom: '21%' }} />
            <div className="absolute bg-pink-500" style={{ width: '3px', height: '3px', right: '28%', bottom: '21%' }} />
          </div>
        ),
        
        adult: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Elegant BIG adult cat body */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '140px', height: '120px', 
              left: '50%', top: '48%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '35px'
            }} />
            
            {/* Sophisticated BIG ears with tufts */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '35px', height: '35px',
              left: '24%', top: '16%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '18px', height: '18px',
              left: '26%', top: '21%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '12px', left: '25%', top: '18%' }} />
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '35px', height: '35px',
              right: '24%', top: '16%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '18px', height: '18px',
              right: '26%', top: '21%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '12px', right: '25%', top: '18%' }} />
            
            {/* Wise, gentle BIG eyes (forward-facing) */}
            <div className="absolute bg-emerald-400 border-3 border-gray-600" style={{ width: '26px', height: '22px', left: '30%', top: '34%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '12px', height: '16px', left: '32%', top: '36%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '6px', left: '33%', top: '36%', borderRadius: '50%' }} />
            <div className="absolute bg-emerald-200" style={{ width: '3px', height: '3px', left: '34%', top: '38%' }} />
            <div className="absolute bg-emerald-400 border-3 border-gray-600" style={{ width: '26px', height: '22px', right: '30%', top: '34%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '12px', height: '16px', right: '32%', top: '36%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '6px', right: '33%', top: '36%', borderRadius: '50%' }} />
            <div className="absolute bg-emerald-200" style={{ width: '3px', height: '3px', right: '34%', top: '38%' }} />
            
            {/* Elegant BIG blush */}
            <div className="absolute bg-pink-400 opacity-60" style={{ width: '25px', height: '15px', left: '16%', top: '42%', borderRadius: '16px' }} />
            <div className="absolute bg-pink-500 opacity-40" style={{ width: '16px', height: '8px', left: '18%', top: '43%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-400 opacity-60" style={{ width: '25px', height: '15px', right: '16%', top: '42%', borderRadius: '16px' }} />
            <div className="absolute bg-pink-500 opacity-40" style={{ width: '16px', height: '8px', right: '18%', top: '43%', borderRadius: '12px' }} />
            
            {/* Heart-shaped BIG nose */}
            <div className="absolute bg-pink-500 border-3 border-pink-600" style={{ 
              width: '12px', height: '12px',
              left: '50%', top: '48%', 
              transform: 'translateX(-50%)',
              clipPath: 'polygon(50% 20%, 85% 0%, 100% 35%, 100% 70%, 50% 100%, 0% 70%, 0% 35%, 15% 0%)'
            }} />
            
            {/* Content BIG smile */}
            <div className="absolute bg-pink-600" style={{ 
              width: '20px', height: '6px',
              left: '50%', top: '52%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 20% 100%, 80% 100%, 100% 0%)',
              borderRadius: '4px'
            }} />
            
            {/* Beautiful BIG fur patterns */}
            <div className="absolute bg-gray-500 opacity-50" style={{ width: '8px', height: '35px', left: '34%', top: '28%', borderRadius: '8px' }} />
            <div className="absolute bg-gray-500 opacity-50" style={{ width: '8px', height: '35px', left: '44%', top: '28%', borderRadius: '8px' }} />
            <div className="absolute bg-gray-500 opacity-50" style={{ width: '8px', height: '35px', right: '34%', top: '28%', borderRadius: '8px' }} />
            
            {/* Stylish BIG collar with bell */}
            <div className="absolute bg-red-600 border-4 border-black" style={{ 
              width: '50px', height: '12px',
              left: '50%', bottom: '15%',
              transform: 'translateX(-50%)',
              borderRadius: '8px'
            }} />
            <div className="absolute bg-yellow-400 border-3 border-black" style={{ 
              width: '16px', height: '16px',
              left: '50%', bottom: '13%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            <div className="absolute bg-yellow-200" style={{ 
              width: '6px', height: '6px',
              left: '50%', bottom: '15%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Majestic BIG tail */}
            <div className="absolute bg-gray-300 border-4 border-black" style={{ 
              width: '22px', height: '50px',
              right: '6%', top: '34%',
              transform: 'rotate(30deg)',
              borderRadius: '22px'
            }} />
            <div className="absolute bg-gray-400" style={{ 
              width: '10px', height: '20px',
              right: '7.5%', top: '39%',
              transform: 'rotate(30deg)',
              borderRadius: '10px'
            }} />
            
            {/* Refined BIG paws with details */}
            <div className="absolute bg-gray-400 border-4 border-black" style={{ width: '25px', height: '25px', left: '22%', bottom: '13%', borderRadius: '16px' }} />
            <div className="absolute bg-pink-400" style={{ width: '12px', height: '12px', left: '24%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', left: '22%', bottom: '16%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', left: '28%', bottom: '16%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', left: '25%', bottom: '18%' }} />
            <div className="absolute bg-gray-400 border-4 border-black" style={{ width: '25px', height: '25px', right: '22%', bottom: '13%', borderRadius: '16px' }} />
            <div className="absolute bg-pink-400" style={{ width: '12px', height: '12px', right: '24%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', right: '22%', bottom: '16%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', right: '28%', bottom: '16%' }} />
            <div className="absolute bg-pink-500" style={{ width: '4px', height: '4px', right: '25%', bottom: '18%' }} />
          </div>
        ),
        
        legendary: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Divine legendary cat body with rainbow glow */}
            <div className="absolute bg-gray-200 border-6 border-black" style={{ 
              width: '150px', height: '130px', 
              left: '50%', top: '46%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '40px',
              boxShadow: '0 0 20px rgba(255, 215, 0, 1), 0 0 35px rgba(147, 51, 234, 0.8)'
            }} />
            
            {/* Majestic BIGGER jeweled crown */}
            <div className="absolute bg-yellow-400 border-4 border-black" style={{ 
              width: '60px', height: '30px',
              left: '50%', top: '3%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 100%, 15% 25%, 25% 0%, 35% 45%, 50% 0%, 65% 45%, 75% 0%, 85% 25%, 100% 100%)',
              borderRadius: '6px'
            }} />
            <div className="absolute bg-blue-500 border-2 border-black" style={{ width: '12px', height: '12px', left: '44%', top: '8%', borderRadius: '50%' }} />
            <div className="absolute bg-red-500 border-2 border-black" style={{ width: '8px', height: '8px', left: '40%', top: '11%', borderRadius: '50%' }} />
            <div className="absolute bg-green-500 border-2 border-black" style={{ width: '8px', height: '8px', right: '40%', top: '11%', borderRadius: '50%' }} />
            <div className="absolute bg-purple-400 border-2 border-black" style={{ width: '10px', height: '10px', left: '50%', top: '5%', transform: 'translateX(-50%)', borderRadius: '50%' }} />
            
            {/* Celestial BIGGER ears with aura */}
            <div className="absolute bg-gray-200 border-4 border-black" style={{ 
              width: '35px', height: '35px',
              left: '22%', top: '13%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              boxShadow: '0 0 12px rgba(147, 51, 234, 0.8), inset -2px -2px 0px rgba(0, 0, 0, 0.3)'
            }} />
            <div className="absolute bg-gray-400 opacity-40" style={{ 
              width: '30px', height: '30px',
              left: '21%', top: '13%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '18px', height: '18px',
              left: '24%', top: '17%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '12px', left: '23%', top: '15%' }} />
            <div className="absolute bg-gray-200 border-4 border-black" style={{ 
              width: '35px', height: '35px',
              right: '22%', top: '13%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              boxShadow: '0 0 12px rgba(147, 51, 234, 0.8), inset 2px -2px 0px rgba(0, 0, 0, 0.3)'
            }} />
            <div className="absolute bg-gray-400 opacity-40" style={{ 
              width: '30px', height: '30px',
              right: '21%', top: '13%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '18px', height: '18px',
              right: '24%', top: '17%',
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)'
            }} />
            <div className="absolute bg-white" style={{ width: '6px', height: '12px', right: '23%', top: '15%' }} />
            
            {/* Cosmic HUGE galaxy eyes (forward-facing) */}
            <div className="absolute bg-gradient-to-br from-cyan-300 to-purple-500 border-4 border-black" style={{ 
              width: '30px', height: '25px',
              left: '28%', top: '31%',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(59, 130, 246, 1)'
            }} />
            <div className="absolute bg-black" style={{ width: '15px', height: '18px', left: '30%', top: '33%', borderRadius: '50%' }} />
            <div className="absolute bg-white animate-pulse" style={{ width: '6px', height: '6px', left: '31%', top: '33%', borderRadius: '50%' }} />
            <div className="absolute bg-cyan-200" style={{ width: '3px', height: '3px', left: '33%', top: '35%' }} />
            <div className="absolute bg-purple-300" style={{ width: '3px', height: '3px', left: '31%', top: '36%' }} />
            <div className="absolute bg-gradient-to-br from-cyan-300 to-purple-500 border-4 border-black" style={{ 
              width: '30px', height: '25px',
              right: '28%', top: '31%',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(59, 130, 246, 1)'
            }} />
            <div className="absolute bg-black" style={{ width: '15px', height: '18px', right: '30%', top: '33%', borderRadius: '50%' }} />
            <div className="absolute bg-white animate-pulse" style={{ width: '6px', height: '6px', right: '31%', top: '33%', borderRadius: '50%' }} />
            <div className="absolute bg-cyan-200" style={{ width: '3px', height: '3px', right: '33%', top: '35%' }} />
            <div className="absolute bg-purple-300" style={{ width: '3px', height: '3px', right: '31%', top: '36%' }} />
            
            {/* Magical rainbow blush */}
            <div className="absolute w-6 h-3 bg-pink-400 opacity-70" style={{ left: '16%', top: '42%', borderRadius: '10px' }} />
            <div className="absolute w-4 h-1 bg-purple-400 opacity-50" style={{ left: '17%', top: '43%', borderRadius: '6px' }} />
            <div className="absolute w-2 h-1 bg-cyan-400 opacity-60" style={{ left: '18%', top: '44%', borderRadius: '4px' }} />
            <div className="absolute w-6 h-3 bg-pink-400 opacity-70" style={{ right: '16%', top: '42%', borderRadius: '10px' }} />
            <div className="absolute w-4 h-1 bg-purple-400 opacity-50" style={{ right: '17%', top: '43%', borderRadius: '6px' }} />
            <div className="absolute w-2 h-1 bg-cyan-400 opacity-60" style={{ right: '18%', top: '44%', borderRadius: '4px' }} />
            
            {/* Divine diamond nose */}
            <div className="absolute w-2 h-2 bg-cyan-300 border border-cyan-500" style={{ 
              left: '50%', top: '46%', 
              transform: 'translateX(-50%) rotate(45deg)',
              boxShadow: '0 0 4px rgba(59, 130, 246, 0.8)'
            }} />
            
            {/* Ethereal fur patterns */}
            <div className="absolute bg-purple-400 w-2 h-8 opacity-70" style={{ left: '20%', top: '50%', borderRadius: '6px' }} />
            <div className="absolute bg-purple-400 w-2 h-8 opacity-70" style={{ right: '20%', top: '50%', borderRadius: '6px' }} />
            <div className="absolute bg-yellow-400 w-1 h-3 opacity-60" style={{ left: '36%', top: '29%', borderRadius: '2px' }} />
            <div className="absolute bg-pink-400 w-1 h-3 opacity-60" style={{ right: '36%', top: '29%', borderRadius: '2px' }} />
            
            {/* Celestial collar with cosmic gem */}
            <div className="absolute bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 border-2 border-black w-12 h-4" style={{ 
              left: '50%', bottom: '13%',
              transform: 'translateX(-50%)',
              borderRadius: '6px',
              boxShadow: '0 0 8px rgba(147, 51, 234, 0.8)'
            }} />
            <div className="absolute bg-gradient-to-br from-cyan-200 to-purple-400 border border-black w-4 h-4" style={{ 
              left: '50%', bottom: '12%',
              transform: 'translateX(-50%) rotate(45deg)',
              boxShadow: '0 0 12px rgba(59, 130, 246, 1)'
            }} />
            <div className="absolute w-2 h-2 bg-white animate-pulse" style={{ 
              left: '50%', bottom: '13%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Majestic flowing tail */}
            <div className="absolute bg-gray-200 border-2 border-black w-6 h-14" style={{ 
              right: '6%', top: '33%',
              transform: 'rotate(35deg)',
              borderRadius: '12px',
              boxShadow: '0 0 6px rgba(255, 215, 0, 0.7)'
            }} />
            <div className="absolute bg-gray-300 w-2 h-5" style={{ 
              right: '7%', top: '37%',
              transform: 'rotate(35deg)',
              borderRadius: '6px'
            }} />
            <div className="absolute bg-purple-400 w-1 h-3 opacity-80" style={{ 
              right: '7.5%', top: '39%',
              transform: 'rotate(35deg)',
              borderRadius: '2px'
            }} />
            
            {/* Divine paws with celestial beans */}
            <div className="absolute w-6 h-6 bg-gray-300 border-2 border-black" style={{ left: '22%', bottom: '13%', borderRadius: '10px' }} />
            <div className="absolute w-3 h-3 bg-pink-400" style={{ left: '23.5%', bottom: '14%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-purple-400" style={{ left: '23%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-cyan-400" style={{ left: '25%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-yellow-400" style={{ left: '24%', bottom: '16.5%', borderRadius: '50%' }} />
            <div className="absolute w-6 h-6 bg-gray-300 border-2 border-black" style={{ right: '22%', bottom: '13%', borderRadius: '10px' }} />
            <div className="absolute w-3 h-3 bg-pink-400" style={{ right: '23.5%', bottom: '14%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-purple-400" style={{ right: '23%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-cyan-400" style={{ right: '25%', bottom: '15%', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-yellow-400" style={{ right: '24%', bottom: '16.5%', borderRadius: '50%' }} />
            
            {/* Floating magical sparkles */}
            <div className="absolute w-2 h-2 bg-yellow-300 border border-yellow-500 animate-bounce" style={{ left: '8%', top: '18%', animationDelay: '0s', animationDuration: '2s', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-purple-400 border border-purple-600 animate-bounce" style={{ right: '8%', top: '15%', animationDelay: '0.3s', animationDuration: '1.8s', borderRadius: '50%' }} />
            <div className="absolute w-2 h-2 bg-cyan-300 border border-cyan-500 animate-bounce" style={{ left: '10%', bottom: '18%', animationDelay: '0.6s', animationDuration: '2.2s', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-pink-400 border border-pink-600 animate-bounce" style={{ right: '15%', bottom: '25%', animationDelay: '0.9s', animationDuration: '1.6s', borderRadius: '50%' }} />
            <div className="absolute w-1 h-1 bg-green-300 border border-green-500 animate-bounce" style={{ left: '6%', top: '55%', animationDelay: '1.2s', animationDuration: '2.4s', borderRadius: '50%' }} />
          </div>
        )
      },
      
      // Adorable corgi species for variety!
      commit_corgi: {
        egg: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ 
              width: `${size}px`, 
              height: `${size}px`,
              imageRendering: 'pixelated'
            }}
          >
            {/* Cozy egg shell */}
            <div 
              className="absolute inset-0 bg-orange-100 border-2 border-black"
              style={{
                clipPath: 'polygon(20% 10%, 80% 10%, 90% 40%, 90% 80%, 70% 90%, 30% 90%, 10% 80%, 10% 40%)',
                borderRadius: '8px'
              }}
            />
            {/* Cute corgi-colored spots */}
            <div className="absolute w-3 h-2 bg-orange-400 border border-orange-600" style={{ 
              top: '28%', left: '25%',
              borderRadius: '4px'
            }} />
            <div className="absolute w-2 h-2 bg-orange-500 border border-orange-700" style={{ top: '48%', right: '28%', borderRadius: '50%' }} />
            <div className="absolute w-2 h-1 bg-white border border-gray-400" style={{ bottom: '32%', left: '35%', borderRadius: '2px' }} />
            {/* Tiny crack hints */}
            <div className="absolute w-px h-3 bg-gray-600" style={{ top: '22%', left: '45%', transform: 'rotate(10deg)' }} />
            <div className="absolute w-px h-2 bg-gray-600" style={{ top: '58%', right: '38%', transform: 'rotate(-15deg)' }} />
          </div>
        ),
        
        hatchling: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Cute baby corgi head */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              width: '60%', height: '50%', 
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '20px'
            }} />
            
            {/* Baby floppy ears */}
            <div className="absolute bg-orange-300 border-3 border-black" style={{ 
              width: '15%', height: '18%',
              left: '22%', top: '25%',
              borderRadius: '12px',
              transform: 'rotate(-20deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '8%', height: '10%',
              left: '24%', top: '30%',
              borderRadius: '6px',
              transform: 'rotate(-20deg)'
            }} />
            <div className="absolute bg-orange-300 border-3 border-black" style={{ 
              right: '22%', top: '25%',
              width: '15%', height: '18%',
              borderRadius: '12px',
              transform: 'rotate(20deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '8%', height: '10%',
              right: '24%', top: '30%',
              borderRadius: '6px',
              transform: 'rotate(20deg)'
            }} />
            
            {/* Big sparkly baby eyes */}
            <div className="absolute bg-black border-2 border-black" style={{ width: '12%', height: '10%', left: '32%', top: '42%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '4%', left: '34%', top: '43%', borderRadius: '50%' }} />
            <div className="absolute bg-black border-2 border-black" style={{ width: '12%', height: '10%', right: '32%', top: '42%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '4%', right: '34%', top: '43%', borderRadius: '50%' }} />
            
            {/* Baby blush */}
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '12%', height: '6%', left: '15%', top: '48%', borderRadius: '8px' }} />
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '12%', height: '6%', right: '15%', top: '48%', borderRadius: '8px' }} />
            
            {/* Tiny nose */}
            <div className="absolute bg-black" style={{ 
              width: '4%', height: '3%',
              left: '50%', top: '52%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Happy baby mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '8%', height: '3%',
              left: '50%', top: '56%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
              borderRadius: '2px'
            }} />
            
            {/* Tiny waggy tail */}
            <div className="absolute bg-orange-300 border-2 border-black" style={{ 
              width: '8%', height: '12%',
              right: '12%', top: '45%',
              borderRadius: '8px',
              transform: 'rotate(20deg)'
            }} />
            <div className="absolute bg-white" style={{ 
              width: '4%', height: '6%',
              right: '13%', top: '47%',
              borderRadius: '4px',
              transform: 'rotate(20deg)'
            }} />
            
            {/* Tiny paws */}
            <div className="absolute bg-orange-400 border-2 border-black" style={{ width: '10%', height: '8%', left: '25%', bottom: '20%', borderRadius: '6px' }} />
            <div className="absolute bg-pink-400" style={{ width: '5%', height: '4%', left: '27%', bottom: '22%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-400 border-2 border-black" style={{ width: '10%', height: '8%', right: '25%', bottom: '20%', borderRadius: '6px' }} />
            <div className="absolute bg-pink-400" style={{ width: '5%', height: '4%', right: '27%', bottom: '22%', borderRadius: '50%' }} />
          </div>
        ),
        
        juvenile: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Growing corgi head - between baby and adult */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              width: '65%', height: '55%', 
              left: '50%', top: '47%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '22px'
            }} />
            
            {/* Semi-floppy ears - transitioning */}
            <div className="absolute bg-orange-300 border-3 border-black" style={{ 
              width: '16%', height: '20%',
              left: '24%', top: '22%',
              borderRadius: '13px',
              transform: 'rotate(-12deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '9%', height: '11%',
              left: '26%', top: '27%',
              borderRadius: '7px',
              transform: 'rotate(-12deg)'
            }} />
            <div className="absolute bg-orange-300 border-3 border-black" style={{ 
              right: '24%', top: '22%',
              width: '16%', height: '20%',
              borderRadius: '13px',
              transform: 'rotate(12deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '9%', height: '11%',
              right: '26%', top: '27%',
              borderRadius: '7px',
              transform: 'rotate(12deg)'
            }} />
            
            {/* Bright curious eyes - bigger than baby */}
            <div className="absolute bg-amber-600 border-3 border-black" style={{ width: '14%', height: '11%', left: '30%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '7%', height: '8%', left: '32%', top: '41%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '3%', height: '3%', left: '33%', top: '41%', borderRadius: '50%' }} />
            <div className="absolute bg-amber-300" style={{ width: '2%', height: '2%', left: '33%', top: '43%' }} />
            <div className="absolute bg-amber-600 border-3 border-black" style={{ width: '14%', height: '11%', right: '30%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '7%', height: '8%', right: '32%', top: '41%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '3%', height: '3%', right: '33%', top: '41%', borderRadius: '50%' }} />
            <div className="absolute bg-amber-300" style={{ width: '2%', height: '2%', right: '33%', top: '43%' }} />
            
            {/* Growing blush */}
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '13%', height: '7%', left: '14%', top: '46%', borderRadius: '9px' }} />
            <div className="absolute bg-orange-500 opacity-40" style={{ width: '9%', height: '4%', left: '16%', top: '47%', borderRadius: '6px' }} />
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '13%', height: '7%', right: '14%', top: '46%', borderRadius: '9px' }} />
            <div className="absolute bg-orange-500 opacity-40" style={{ width: '9%', height: '4%', right: '16%', top: '47%', borderRadius: '6px' }} />
            
            {/* Playful nose */}
            <div className="absolute bg-black border-2 border-black" style={{ 
              width: '5%', height: '4%',
              left: '50%', top: '52%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Excited mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '10%', height: '4%',
              left: '50%', top: '57%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 40% 100%, 60% 100%, 100% 0%)',
              borderRadius: '2px'
            }} />
            
            {/* Growing fur patterns */}
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '4%', height: '16%', left: '33%', top: '34%', borderRadius: '4px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '4%', height: '16%', right: '33%', top: '34%', borderRadius: '4px' }} />
            
            {/* Basic collar - blue instead of red */}
            <div className="absolute bg-blue-600 border-3 border-black" style={{ 
              width: '28%', height: '5%',
              left: '50%', bottom: '17%',
              transform: 'translateX(-50%)',
              borderRadius: '4px'
            }} />
            <div className="absolute bg-silver-400 border-2 border-black" style={{ 
              width: '8%', height: '8%',
              left: '50%', bottom: '15%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Energetic tail */}
            <div className="absolute bg-orange-300 border-3 border-black" style={{ 
              width: '10%', height: '20%',
              right: '10%', top: '42%',
              borderRadius: '12px',
              transform: 'rotate(25deg)'
            }} />
            <div className="absolute bg-white" style={{ 
              width: '5%', height: '10%',
              right: '11%', top: '45%',
              borderRadius: '6px',
              transform: 'rotate(25deg)'
            }} />
            
            {/* Growing paws */}
            <div className="absolute bg-orange-400 border-3 border-black" style={{ width: '13%', height: '12%', left: '22%', bottom: '16%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-500" style={{ width: '7%', height: '6%', left: '24%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-500" style={{ width: '2%', height: '2%', left: '22%', bottom: '19%' }} />
            <div className="absolute bg-orange-500" style={{ width: '2%', height: '2%', left: '26%', bottom: '19%' }} />
            <div className="absolute bg-orange-400 border-3 border-black" style={{ width: '13%', height: '12%', right: '22%', bottom: '16%', borderRadius: '8px' }} />
            <div className="absolute bg-pink-500" style={{ width: '7%', height: '6%', right: '24%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-500" style={{ width: '2%', height: '2%', right: '22%', bottom: '19%' }} />
            <div className="absolute bg-orange-500" style={{ width: '2%', height: '2%', right: '26%', bottom: '19%' }} />
          </div>
        ),
        
        adult: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Simple corgi head - like cat but rounder */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              width: '70%', height: '60%', 
              left: '50%', top: '45%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '25px'
            }} />
            
            {/* Simple droopy ears */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              width: '18%', height: '22%',
              left: '20%', top: '20%',
              borderRadius: '15px',
              transform: 'rotate(-15deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '10%', height: '12%',
              left: '22%', top: '26%',
              borderRadius: '8px',
              transform: 'rotate(-15deg)'
            }} />
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              right: '20%', top: '20%',
              width: '18%', height: '22%',
              borderRadius: '15px',
              transform: 'rotate(15deg)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '10%', height: '12%',
              right: '22%', top: '26%',
              borderRadius: '8px',
              transform: 'rotate(15deg)'
            }} />
            
            {/* Big friendly eyes like cat */}
            <div className="absolute bg-amber-600 border-3 border-black" style={{ width: '15%', height: '12%', left: '28%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '8%', height: '9%', left: '30%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '4%', left: '31%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-amber-300" style={{ width: '2%', height: '2%', left: '32%', top: '42%' }} />
            <div className="absolute bg-amber-600 border-3 border-black" style={{ width: '15%', height: '12%', right: '28%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-black" style={{ width: '8%', height: '9%', right: '30%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '4%', right: '31%', top: '40%', borderRadius: '50%' }} />
            <div className="absolute bg-amber-300" style={{ width: '2%', height: '2%', right: '32%', top: '42%' }} />
            
            {/* Simple blush */}
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '15%', height: '8%', left: '12%', top: '45%', borderRadius: '10px' }} />
            <div className="absolute bg-orange-500 opacity-40" style={{ width: '10%', height: '4%', left: '14%', top: '46%', borderRadius: '6px' }} />
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '15%', height: '8%', right: '12%', top: '45%', borderRadius: '10px' }} />
            <div className="absolute bg-orange-500 opacity-40" style={{ width: '10%', height: '4%', right: '14%', top: '46%', borderRadius: '6px' }} />
            
            {/* Simple round nose */}
            <div className="absolute bg-black border-2 border-black" style={{ 
              width: '6%', height: '5%',
              left: '50%', top: '52%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Simple happy mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '12%', height: '4%',
              left: '50%', top: '58%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 30% 100%, 70% 100%, 100% 0%)',
              borderRadius: '2px'
            }} />
            
            {/* Simple fur stripes */}
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '5%', height: '20%', left: '32%', top: '32%', borderRadius: '4px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '5%', height: '20%', left: '42%', top: '32%', borderRadius: '4px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '5%', height: '20%', right: '32%', top: '32%', borderRadius: '4px' }} />
            
            {/* Simple collar like cat */}
            <div className="absolute bg-red-600 border-4 border-black" style={{ 
              width: '30%', height: '6%',
              left: '50%', bottom: '18%',
              transform: 'translateX(-50%)',
              borderRadius: '4px'
            }} />
            <div className="absolute bg-yellow-400 border-3 border-black" style={{ 
              width: '10%', height: '10%',
              left: '50%', bottom: '16%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            <div className="absolute bg-yellow-200" style={{ 
              width: '4%', height: '4%',
              left: '50%', bottom: '18%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Simple tail */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ 
              width: '12%', height: '25%',
              right: '8%', top: '40%',
              borderRadius: '15px',
              transform: 'rotate(25deg)'
            }} />
            <div className="absolute bg-white" style={{ 
              width: '6%', height: '12%',
              right: '9%', top: '44%',
              borderRadius: '8px',
              transform: 'rotate(25deg)'
            }} />
            
            {/* Simple paws like cat */}
            <div className="absolute bg-orange-400 border-4 border-black" style={{ width: '15%', height: '15%', left: '20%', bottom: '15%', borderRadius: '10px' }} />
            <div className="absolute bg-pink-400" style={{ width: '8%', height: '8%', left: '22%', bottom: '17%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', left: '20%', bottom: '18%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', left: '26%', bottom: '18%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', left: '23%', bottom: '20%' }} />
            <div className="absolute bg-orange-400 border-4 border-black" style={{ width: '15%', height: '15%', right: '20%', bottom: '15%', borderRadius: '10px' }} />
            <div className="absolute bg-pink-400" style={{ width: '8%', height: '8%', right: '22%', bottom: '17%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', right: '20%', bottom: '18%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', right: '26%', bottom: '18%' }} />
            <div className="absolute bg-orange-500" style={{ width: '3%', height: '3%', right: '23%', bottom: '20%' }} />
          </div>
        ),
        
        legendary: (
          <div 
            className="pixel-art relative mx-auto"
            style={{ width: `200px`, height: `200px` }}
          >
            {/* Divine legendary corgi head */}
            <div className="absolute bg-orange-200 border-6 border-black" style={{ 
              width: '75%', height: '65%', 
              left: '50%', top: '45%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '30px',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.9), 0 0 35px rgba(255, 165, 0, 0.6)'
            }} />
            
            {/* Majestic crown */}
            <div className="absolute bg-yellow-400 border-4 border-black" style={{ 
              width: '30%', height: '12%',
              left: '50%', top: '8%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 100%, 15% 30%, 25% 0%, 35% 50%, 50% 0%, 65% 50%, 75% 0%, 85% 30%, 100% 100%)',
              borderRadius: '6px'
            }} />
            <div className="absolute bg-red-500 border-2 border-black" style={{ width: '6%', height: '6%', left: '47%', top: '12%', borderRadius: '50%' }} />
            <div className="absolute bg-green-500 border-2 border-black" style={{ width: '4%', height: '4%', left: '42%', top: '14%', borderRadius: '50%' }} />
            <div className="absolute bg-blue-500 border-2 border-black" style={{ width: '4%', height: '4%', right: '42%', top: '14%', borderRadius: '50%' }} />
            
            {/* Divine floppy ears */}
            <div className="absolute bg-orange-200 border-4 border-black" style={{ 
              width: '20%', height: '25%',
              left: '18%', top: '18%',
              borderRadius: '15px',
              transform: 'rotate(-10deg)',
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.7)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '12%', height: '15%',
              left: '20%', top: '24%',
              borderRadius: '10px',
              transform: 'rotate(-10deg)'
            }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '8%', left: '19%', top: '20%', borderRadius: '4px', transform: 'rotate(-10deg)' }} />
            <div className="absolute bg-orange-200 border-4 border-black" style={{ 
              right: '18%', top: '18%',
              width: '20%', height: '25%',
              borderRadius: '15px',
              transform: 'rotate(10deg)',
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.7)'
            }} />
            <div className="absolute bg-pink-300" style={{ 
              width: '12%', height: '15%',
              right: '20%', top: '24%',
              borderRadius: '10px',
              transform: 'rotate(10deg)'
            }} />
            <div className="absolute bg-white" style={{ width: '4%', height: '8%', right: '19%', top: '20%', borderRadius: '4px', transform: 'rotate(10deg)' }} />
            
            {/* Celestial golden eyes */}
            <div className="absolute bg-gradient-to-br from-yellow-300 to-amber-600 border-4 border-black" style={{ 
              width: '16%', height: '13%',
              left: '28%', top: '36%',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(255, 215, 0, 1)'
            }} />
            <div className="absolute bg-black" style={{ width: '8%', height: '9%', left: '30%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-white animate-pulse" style={{ width: '4%', height: '4%', left: '31%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-yellow-200" style={{ width: '2%', height: '2%', left: '32%', top: '40%' }} />
            <div className="absolute bg-gradient-to-br from-yellow-300 to-amber-600 border-4 border-black" style={{ 
              width: '16%', height: '13%',
              right: '28%', top: '36%',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(255, 215, 0, 1)'
            }} />
            <div className="absolute bg-black" style={{ width: '8%', height: '9%', right: '30%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-white animate-pulse" style={{ width: '4%', height: '4%', right: '31%', top: '38%', borderRadius: '50%' }} />
            <div className="absolute bg-yellow-200" style={{ width: '2%', height: '2%', right: '32%', top: '40%' }} />
            
            {/* Legendary blush */}
            <div className="absolute bg-gold-400 opacity-70" style={{ width: '16%', height: '8%', left: '12%', top: '44%', borderRadius: '12px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '12%', height: '5%', left: '14%', top: '45%', borderRadius: '8px' }} />
            <div className="absolute bg-gold-400 opacity-70" style={{ width: '16%', height: '8%', right: '12%', top: '44%', borderRadius: '12px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '12%', height: '5%', right: '14%', top: '45%', borderRadius: '8px' }} />
            
            {/* Divine nose */}
            <div className="absolute bg-black border-3 border-gray-700" style={{ 
              width: '7%', height: '5%',
              left: '50%', top: '50%', 
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.8)'
            }} />
            
            {/* Happy divine mouth */}
            <div className="absolute bg-pink-600" style={{ 
              width: '12%', height: '4%',
              left: '50%', top: '56%',
              transform: 'translateX(-50%)',
              clipPath: 'polygon(0% 0%, 30% 100%, 70% 100%, 100% 0%)',
              borderRadius: '3px'
            }} />
            
            {/* Mystical fur patterns */}
            <div className="absolute bg-gold-400 opacity-60" style={{ width: '5%', height: '18%', left: '30%', top: '30%', borderRadius: '6px' }} />
            <div className="absolute bg-orange-400 opacity-60" style={{ width: '5%', height: '18%', right: '30%', top: '30%', borderRadius: '6px' }} />
            <div className="absolute bg-gold-500 opacity-50" style={{ width: '3%', height: '10%', left: '42%', top: '32%', borderRadius: '4px' }} />
            <div className="absolute bg-orange-500 opacity-50" style={{ width: '3%', height: '10%', right: '42%', top: '32%', borderRadius: '4px' }} />
            
            {/* Divine collar with cosmic gem */}
            <div className="absolute bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 border-4 border-black" style={{ 
              width: '35%', height: '8%',
              left: '50%', bottom: '16%',
              transform: 'translateX(-50%)',
              borderRadius: '10px',
              boxShadow: '0 0 15px rgba(147, 51, 234, 0.8)'
            }} />
            <div className="absolute bg-gradient-to-br from-cyan-200 to-purple-400 border-2 border-black" style={{ 
              width: '12%', height: '12%',
              left: '50%', bottom: '14%',
              transform: 'translateX(-50%) rotate(45deg)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 1)'
            }} />
            <div className="absolute bg-white animate-pulse" style={{ 
              width: '5%', height: '5%',
              left: '50%', bottom: '16%',
              transform: 'translateX(-50%)',
              borderRadius: '50%'
            }} />
            
            {/* Legendary tail */}
            <div className="absolute bg-orange-200 border-4 border-black" style={{ 
              width: '12%', height: '25%',
              right: '8%', top: '38%',
              borderRadius: '15px',
              transform: 'rotate(30deg)',
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.8)'
            }} />
            <div className="absolute bg-white" style={{ 
              width: '6%', height: '12%',
              right: '9.5%', top: '42%',
              borderRadius: '10px',
              transform: 'rotate(30deg)'
            }} />
            <div className="absolute bg-gold-400" style={{ 
              width: '3%', height: '8%',
              right: '10%', top: '44%',
              borderRadius: '4px',
              transform: 'rotate(30deg)'
            }} />
            
            {/* Divine paws */}
            <div className="absolute bg-orange-300 border-4 border-black" style={{ width: '16%', height: '16%', left: '20%', bottom: '15%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-400" style={{ width: '10%', height: '10%', left: '22%', bottom: '17%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', left: '20%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', left: '26%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', left: '23%', bottom: '20%', borderRadius: '50%' }} />
            <div className="absolute bg-orange-300 border-4 border-black" style={{ width: '16%', height: '16%', right: '20%', bottom: '15%', borderRadius: '12px' }} />
            <div className="absolute bg-pink-400" style={{ width: '10%', height: '10%', right: '22%', bottom: '17%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', right: '20%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', right: '26%', bottom: '18%', borderRadius: '50%' }} />
            <div className="absolute bg-gold-400" style={{ width: '3%', height: '3%', right: '23%', bottom: '20%', borderRadius: '50%' }} />
            
            {/* Magical sparkles */}
            <div className="absolute bg-gold-300 border-2 border-gold-500 animate-bounce" style={{ width: '6%', height: '6%', left: '6%', top: '20%', animationDelay: '0s', animationDuration: '2s', borderRadius: '50%' }} />
            <div className="absolute bg-orange-400 border border-orange-600 animate-bounce" style={{ width: '4%', height: '4%', right: '8%', top: '25%', animationDelay: '0.4s', animationDuration: '1.8s', borderRadius: '50%' }} />
            <div className="absolute bg-yellow-300 border-2 border-yellow-500 animate-bounce" style={{ width: '5%', height: '5%', left: '8%', bottom: '18%', animationDelay: '0.8s', animationDuration: '2.2s', borderRadius: '50%' }} />
            <div className="absolute bg-pink-400 border border-pink-600 animate-bounce" style={{ width: '4%', height: '4%', right: '12%', bottom: '25%', animationDelay: '1.2s', animationDuration: '1.6s', borderRadius: '50%' }} />
          </div>
        )
      }
    }
    
    // Add different species support in the future
    const selectedSprite = sprites[species] || sprites.commit_cat
    const baseSprite = selectedSprite[stage] || selectedSprite.egg
    
    // Apply health state visual modifications
    return applyHealthEffects(baseSprite, healthState)
  }

  // Add personality-based idle animations
  const getIdleAnimation = () => {
    switch(stage) {
      case 'egg':
        return {
          y: [0, -3, 0],
          rotate: [0, 1, -1, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      case 'hatchling':
        return {
          y: [0, -4, 0],
          x: [0, 1, -1, 0],
          transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      case 'juvenile':
        return {
          y: [0, -6, 0],
          rotate: [0, 2, -2, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      case 'adult':
        return {
          y: [0, -5, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
      case 'legendary':
        return {
          y: [0, -8, 0],
          rotate: [0, 3, -3, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
      default:
        return { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity } }
    }
  }

  return (
    <motion.div
      animate={getIdleAnimation()}
    >
      {getPixelArt()}
      
      {/* Special effects for each stage */}
      {stage === 'hatchling' && (
        <motion.div
          className="absolute -top-2 -right-2 text-yellow-400 text-xs"
          animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          ✨
        </motion.div>
      )}
      
      {stage === 'juvenile' && (
        <>
          <motion.div
            className="absolute -top-1 -left-1 text-orange-400 text-xs"
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            💫
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -right-1 text-green-400 text-xs"
            animate={{ opacity: [0, 0.8, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          >
            🌟
          </motion.div>
        </>
      )}
      
      {stage === 'adult' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            boxShadow: [
              '0 0 0px rgba(255, 215, 0, 0)',
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 0px rgba(255, 215, 0, 0)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
      
      {stage === 'legendary' && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              boxShadow: [
                '0 0 0px rgba(147, 51, 234, 0)',
                '0 0 30px rgba(147, 51, 234, 0.6)',
                '0 0 0px rgba(147, 51, 234, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-purple-400 text-sm"
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -15, -30],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            👑
          </motion.div>
          <motion.div
            className="absolute top-1/2 -right-4 text-cyan-400 text-xs"
            animate={{ 
              opacity: [0, 1, 0],
              x: [0, 10, 20],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
          >
            ⭐
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default PixelSprite