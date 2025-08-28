// GitHub API utilities for PixelPet

const GITHUB_API_BASE = 'https://api.github.com'

export class GitHubAPI {
  constructor(token = null) {
    this.token = token
  }

  setToken(token) {
    this.token = token
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PixelPet/1.0',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }), // Use Bearer for PATs
        ...options.headers,
      },
    }

    console.log('Making GitHub API request to:', url)
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API Error:', response.status, response.statusText, errorText)
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Get user info
  async getUser() {
    return this.request('/user')
  }

  // Get user's repositories
  async getUserRepos(username, page = 1, perPage = 30) {
    return this.request(`/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`)
  }

  // Get repository info
  async getRepo(owner, repo) {
    return this.request(`/repos/${owner}/${repo}`)
  }

  // Get commits for a repository
  async getCommits(owner, repo, options = {}) {
    const params = new URLSearchParams({
      per_page: options.perPage || 100,
      page: options.page || 1,
      ...(options.since && { since: options.since }),
      ...(options.until && { until: options.until }),
      ...(options.author && { author: options.author }),
      ...(options.sha && { sha: options.sha }), // Branch/commit SHA
    })

    return this.request(`/repos/${owner}/${repo}/commits?${params}`)
  }

  // Get detailed commit with stats and files
  async getCommitDetails(owner, repo, sha) {
    return this.request(`/repos/${owner}/${repo}/commits/${sha}`)
  }

  // Get repository branches
  async getRepoBranches(owner, repo) {
    return this.request(`/repos/${owner}/${repo}/branches`)
  }

  // Get repository languages
  async getRepoLanguages(owner, repo) {
    return this.request(`/repos/${owner}/${repo}/languages`)
  }

  // Get repository topics
  async getRepoTopics(owner, repo) {
    return this.request(`/repos/${owner}/${repo}/topics`, {
      headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
    })
  }

  // Get repository contents
  async getRepoContents(owner, repo, path = '') {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`)
  }

  // Parse repository URL to get owner and repo name
  static parseRepoUrl(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) return null
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    }
  }
}

// Project analysis utilities
export class ProjectAnalyzer {
  constructor(githubApi) {
    this.github = githubApi
  }

  // Detect project type based on repository data
  async detectProjectType(owner, repo) {
    try {
      const [repoData, languages, topics, contents] = await Promise.all([
        this.github.getRepo(owner, repo),
        this.github.getRepoLanguages(owner, repo).catch(() => ({})),
        this.github.getRepoTopics(owner, repo).catch(() => ({ names: [] })),
        this.github.getRepoContents(owner, repo).catch(() => [])
      ])

      const analysis = {
        description: repoData.description || '',
        topics: topics.names || [],
        languages: Object.keys(languages),
        hasReadme: contents.some(file => file.name.toLowerCase().includes('readme')),
        hasTests: contents.some(file => file.name.toLowerCase().includes('test')),
        hasPackageJson: contents.some(file => file.name === 'package.json'),
        size: repoData.size,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        isPrivate: repoData.private
      }

      return this.classifyProject(analysis)
    } catch (error) {
      console.error('Error detecting project type:', error)
      return 'learning' // Default fallback
    }
  }

  classifyProject(analysis) {
    const { description, topics, hasReadme, hasTests, isPrivate } = analysis
    const desc = description.toLowerCase()
    
    // Learning keywords
    const learningKeywords = ['learning', 'tutorial', 'practice', 'course', 'study', 'beginner', 'exercise']
    if (learningKeywords.some(keyword => desc.includes(keyword)) || 
        topics.some(topic => learningKeywords.includes(topic))) {
      return 'learning'
    }

    // Side hustle keywords
    const businessKeywords = ['startup', 'business', 'saas', 'app', 'product', 'launch', 'mvp']
    if (businessKeywords.some(keyword => desc.includes(keyword)) || 
        topics.some(topic => businessKeywords.includes(topic)) ||
        (hasReadme && hasTests && !isPrivate)) {
      return 'side-hustle'
    }

    // Experiment keywords
    const experimentKeywords = ['experiment', 'poc', 'prototype', 'try', 'test']
    if (experimentKeywords.some(keyword => desc.includes(keyword)) || 
        topics.some(topic => experimentKeywords.includes(topic))) {
      return 'experiment'
    }

    // Portfolio keywords
    const portfolioKeywords = ['portfolio', 'showcase', 'demo', 'project']
    if (portfolioKeywords.some(keyword => desc.includes(keyword)) || 
        topics.some(topic => portfolioKeywords.includes(topic)) ||
        (hasReadme && hasTests)) {
      return 'portfolio'
    }

    // Default to learning for new/small projects
    return 'learning'
  }

  // Analyze commit patterns for streak calculation
  async analyzeCommitPatterns(owner, repo, username, days = 90) {
    try {
      const since = new Date()
      since.setDate(since.getDate() - days)
      
      console.log(`Fetching commits since ${since.toISOString()} for ${username}`)
      
      // First, get all branches
      let branches = []
      try {
        branches = await this.github.getRepoBranches(owner, repo)
        console.log(`Found ${branches.length} branches:`, branches.map(b => b.name))
      } catch (error) {
        console.log('Could not fetch branches, will try default branch')
        branches = [{ name: 'main' }] // Fallback
      }
      
      // Fetch commits from all branches
      let allCommits = []
      
      for (const branch of branches.slice(0, 5)) { // Limit to 5 branches to avoid rate limits
        console.log(`Fetching commits from branch: ${branch.name}`)
        let page = 1
        const perPage = 50 // Smaller per page since we're checking multiple branches
        
        while (page <= 3) { // Max 3 pages per branch = 150 commits per branch
          try {
            const commits = await this.github.getCommits(owner, repo, {
              since: since.toISOString(),
              author: username,
              sha: branch.name,
              page,
              perPage
            })
            
            console.log(`Branch ${branch.name}, page ${page}: ${commits.length} commits`)
            
            if (commits.length === 0) break
            
            // Add branch info to commits and avoid duplicates
            const newCommits = commits.filter(commit => 
              !allCommits.some(existing => existing.sha === commit.sha)
            )
            
            allCommits = allCommits.concat(newCommits.map(commit => ({
              ...commit,
              branch: branch.name
            })))
            
            page++
            
            if (commits.length < perPage) break
          } catch (error) {
            console.log(`Error fetching from branch ${branch.name}:`, error.message)
            break
          }
        }
      }

      console.log(`Total unique commits found across all branches: ${allCommits.length}`)

      // If no commits found with author filter, try without it
      if (allCommits.length === 0) {
        console.log('No commits found with author filter, trying without...')
        const allRepoCommits = await this.github.getCommits(owner, repo, {
          since: since.toISOString(),
          per_page: 100
        })
        
        console.log(`Found ${allRepoCommits.length} total commits in repo`)
        
        // Filter commits by author manually
        allCommits = allRepoCommits.filter(commit => 
          commit.author?.login === username || 
          commit.commit?.author?.name?.includes(username) ||
          commit.commit?.author?.email?.includes(username)
        )
        
        console.log(`After manual filtering: ${allCommits.length} commits by ${username}`)
      }

      // Get detailed stats for each commit (limit to avoid rate limits)
      console.log('Fetching detailed stats for commits...')
      const detailedCommits = []
      const commitLimit = Math.min(allCommits.length, 50) // Get details for last 50 commits
      
      for (let i = 0; i < commitLimit; i++) {
        try {
          const commit = allCommits[i]
          const detailed = await this.github.getCommitDetails(owner, repo, commit.sha)
          detailedCommits.push({
            ...commit,
            stats: detailed.stats,
            files: detailed.files
          })
          console.log(`Commit ${i + 1}/${commitLimit}: ${detailed.stats?.total || 0} lines changed`)
          
          // Small delay to avoid hitting rate limits too hard
          if (i > 0 && i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.log(`Skipping commit details for ${allCommits[i].sha}:`, error.message)
          // Use original commit without detailed stats
          detailedCommits.push(allCommits[i])
        }
      }

      // Add remaining commits without detailed stats
      const remainingCommits = allCommits.slice(commitLimit)
      const finalCommits = [...detailedCommits, ...remainingCommits]

      console.log(`Got detailed stats for ${detailedCommits.length} commits`)

      return this.calculateStreakData(finalCommits)
    } catch (error) {
      console.error('Error analyzing commit patterns:', error)
      return { streak: 0, commits: [], lastCommit: null }
    }
  }

  calculateStreakData(commits) {
    if (!commits.length) return { streak: 0, commits: [], lastCommit: null }

    // Group commits by date
    const commitsByDate = {}
    commits.forEach(commit => {
      const date = commit.commit.author.date.split('T')[0]
      if (!commitsByDate[date]) commitsByDate[date] = []
      commitsByDate[date].push(commit)
    })

    // Calculate current streak
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    let currentDate = new Date()

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      if (commitsByDate[dateStr] && commitsByDate[dateStr].length > 0) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (dateStr === today) {
        // Allow for today to not have commits yet
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return {
      streak,
      commits: commits, // All commits for XP calculation
      lastCommit: commits[0]?.commit.author.date,
      commitsByDate
    }
  }
}

// XP calculation based on commit size and content
export class XPCalculator {
  static calculateCommitXP(commit, projectType = null, repoData = null) {
    const message = commit.commit.message.toLowerCase()
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 }
    const files = commit.files || []

    // Base XP from commit size
    let xp = this.calculateSizeBasedXP(stats)
    
    // File type bonuses
    xp += this.calculateFileTypeBonuses(files)
    
    // Special commit bonuses
    xp += this.calculateSpecialBonuses(message, files)

    return Math.max(xp, 5) // Minimum 5 XP
  }

  static calculateSizeBasedXP(stats) {
    const { additions, deletions, total } = stats
    
    // XP based on lines changed
    if (total <= 5) return 10        // Tiny: typos, config tweaks
    if (total <= 20) return 25       // Small: minor fixes, small features  
    if (total <= 50) return 50       // Medium: decent feature work
    if (total <= 100) return 75      // Large: significant changes
    if (total <= 200) return 125     // Very large: major features
    return 200                       // Massive: complete rewrites
  }

  static calculateFileTypeBonuses(files) {
    let bonus = 0
    
    files?.forEach(file => {
      const filename = file.filename.toLowerCase()
      
      // Documentation bonus
      if (filename.includes('readme') || filename.includes('.md')) {
        bonus += 20
      }
      // Test file bonus  
      if (filename.includes('test') || filename.includes('spec')) {
        bonus += 15
      }
      // Config files
      if (filename.includes('package.json') || filename.includes('config')) {
        bonus += 10
      }
      // New file creation
      if (file.status === 'added') {
        bonus += 10
      }
    })
    
    return bonus
  }

  // Removed project type complexity - keeping it simple!

  static calculateSpecialBonuses(message, files) {
    let bonus = 0
    
    // First commit bonus
    if (message.includes('initial') || message.includes('first')) bonus += 50
    
    // Major milestone bonus
    if (message.includes('deploy') || message.includes('release')) bonus += 100
    
    // Bug fix bonus
    if (message.includes('fix') || message.includes('bug')) bonus += 25
    
    // Feature completion bonus
    if (message.includes('complete') || message.includes('finish')) bonus += 40
    
    return bonus
  }

}