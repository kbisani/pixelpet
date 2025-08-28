import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../stores/gameStore'

function CommitCalendar() {
  const { projects, currentProjectId } = useStore()
  const project = projects.find(p => p.id === currentProjectId) || null
  const pet = project?.pet || { level: 1, streak: 0 }
  const recentCommits = project?.recentCommits || []
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  // Create a map of dates to commit counts from real data
  const commitsByDate = useMemo(() => {
    const dateMap = {}
    
    recentCommits.forEach(commit => {
      const date = new Date(commit.commit.author.date).toDateString()
      dateMap[date] = (dateMap[date] || 0) + 1
    })
    
    return dateMap
  }, [recentCommits])

  // Generate calendar data for the current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday
    
    // Generate days array
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toDateString()
      const commitCount = commitsByDate[dateString] || 0
      const hasCommit = commitCount > 0
      const isToday = date.toDateString() === new Date().toDateString()
      const isInFuture = date > new Date()
      
      days.push({
        day,
        date,
        hasCommit,
        commitCount,
        isToday,
        isInFuture
      })
    }
    
    return {
      days,
      monthName: firstDay.toLocaleDateString('en', { month: 'long', year: 'numeric' })
    }
  }, [currentDate, commitsByDate])

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getCommitIntensity = (commitCount) => {
    if (commitCount === 0) return 'bg-pixel-surface border-pixel-primary'
    if (commitCount === 1) return 'bg-pixel-success/30 border-pixel-success'
    if (commitCount <= 2) return 'bg-pixel-success/50 border-pixel-success'
    if (commitCount <= 4) return 'bg-pixel-success/70 border-pixel-success'
    return 'bg-pixel-success border-pixel-success'
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="pixel-card min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Commit Calendar</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-pixel-accent">
            {pet.streak} 🔥
          </div>
          <div className="text-xs text-pixel-muted">current streak</div>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth(-1)}
          className="pixel-button text-sm px-2"
        >
          ←
        </button>
        <h4 className="text-sm font-bold">{calendarData.monthName}</h4>
        <button 
          onClick={() => navigateMonth(1)}
          className="pixel-button text-sm px-2"
          disabled={currentDate.getMonth() >= new Date().getMonth() && currentDate.getFullYear() >= new Date().getFullYear()}
        >
          →
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-pixel-muted p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />
          }

          return (
            <motion.div
              key={day.day}
              className={`
                aspect-square pixel-border cursor-pointer relative text-xs flex items-center justify-center
                ${day.isInFuture 
                  ? 'bg-pixel-surface/30 border-pixel-surface text-pixel-muted' 
                  : getCommitIntensity(day.commitCount)
                }
                ${day.isToday ? 'ring-2 ring-pixel-accent' : ''}
              `}
              whileHover={{ scale: day.isInFuture ? 1 : 1.1 }}
              whileTap={{ scale: day.isInFuture ? 1 : 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => !day.isInFuture && setSelectedDay(day)}
              title={
                day.isInFuture 
                  ? `${day.date.toLocaleDateString()}` 
                  : `${day.date.toLocaleDateString()}: ${day.commitCount} commits`
              }
            >
              <span className="text-[10px] font-mono">
                {day.day}
              </span>
              
              {/* Commit indicators */}
              {day.commitCount > 0 && !day.isInFuture && (
                <div className="absolute bottom-0 right-0 text-[6px] text-pixel-text">
                  {'●'.repeat(Math.min(day.commitCount, 3))}
                  {day.commitCount > 3 && '+'}
                </div>
              )}
              
              {day.isToday && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pixel-accent rounded-full animate-pulse" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-pixel-muted">Less</span>
          <div className="w-3 h-3 pixel-border bg-pixel-surface" />
          <div className="w-3 h-3 pixel-border bg-pixel-success/30" />
          <div className="w-3 h-3 pixel-border bg-pixel-success/50" />
          <div className="w-3 h-3 pixel-border bg-pixel-success/70" />
          <div className="w-3 h-3 pixel-border bg-pixel-success" />
          <span className="text-pixel-muted">More</span>
        </div>
        
        <div className="text-pixel-muted">
          Click days for details
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-3 border-t-2 border-pixel-primary grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-pixel-muted">This month</div>
          <div className="font-bold">
            {calendarData.days.filter(day => day?.hasCommit).length} active days
          </div>
        </div>
        <div>
          <div className="text-pixel-muted">Total commits</div>
          <div className="font-bold text-pixel-success">
            {Object.values(commitsByDate).reduce((sum, count) => sum + count, 0)}
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDay(null)}>
          <div className="pixel-card max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{selectedDay.date.toLocaleDateString()}</h3>
              <button onClick={() => setSelectedDay(null)} className="text-pixel-muted hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              <p><strong>Commits:</strong> {selectedDay.commitCount}</p>
              <p><strong>Activity:</strong> {selectedDay.commitCount > 0 ? '✅ Active day' : '❌ No commits'}</p>
              {selectedDay.isToday && <p className="text-pixel-accent"><strong>📅 Today!</strong></p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommitCalendar