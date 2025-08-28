import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGitHub } from '../hooks/useGitHub'

function GitHubAuth() {
  const [token, setToken] = useState('')
  const { loginWithGitHub, loading, error } = useGitHub()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (token.trim()) {
      await loginWithGitHub(token.trim())
    }
  }

  const handleDemoMode = () => {
    // Use a demo token (this would be handled differently in production)
    loginWithGitHub('demo_mode')
  }

  return (
    <motion.div 
      className="pixel-card max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl mb-4 text-center">Connect to GitHub</h2>
      
      {/* Step-by-step instructions */}
      <div className="mb-6 p-4 bg-pixel-surface/50 pixel-border">
        <h3 className="text-sm font-bold text-pixel-text mb-3">🔐 How to create your GitHub token:</h3>
        <ol className="text-xs text-pixel-muted space-y-2 list-decimal list-inside">
          <li>
            Go to{' '}
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pixel-accent font-medium hover:underline"
            >
              GitHub Settings → Personal Access Tokens
            </a>
          </li>
          <li><strong>IMPORTANT:</strong> Click "Tokens (classic)" - NOT "Fine-grained tokens"</li>
          <li>Click "Generate new token" → "Generate new token (classic)"</li>
          <li>Give it a name like "PixelPet Access"</li>
          <li>Set expiration (30-90 days recommended)</li>
          <li><strong>Check these permissions:</strong>
            <div className="ml-4 mt-1 space-y-1">
              <div>✅ <code className="bg-pixel-primary/20 px-1 pixel-border text-xs">repo</code> - Full repository access</div>
              <div>✅ <code className="bg-pixel-primary/20 px-1 pixel-border text-xs">user</code> - User profile access</div>
            </div>
          </li>
          <li>Click "Generate token" and copy it immediately!</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">GitHub Personal Access Token (Classic):</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-pixel-surface pixel-border p-3 text-pixel-text text-sm"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            disabled={loading}
          />
          <div className="mt-2 p-2 bg-pixel-warning/20 pixel-border text-xs text-pixel-warning">
            <strong>⚠️ Must be a Classic token</strong> - Fine-grained tokens don't work with this app yet.
          </div>
        </div>

        <div className="space-y-2">
          <button 
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full pixel-button"
          >
            {loading ? 'Connecting...' : 'Connect GitHub'}
          </button>
          
          <button 
            type="button"
            onClick={handleDemoMode}
            disabled={loading}
            className="w-full pixel-button bg-pixel-warning"
          >
            Try Demo Mode
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-pixel-error/20 pixel-border text-pixel-error text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 p-3 bg-pixel-surface/30 pixel-border">
        <h4 className="text-xs font-bold text-pixel-text mb-2">🛠️ Troubleshooting:</h4>
        <div className="text-xs text-pixel-muted space-y-1">
          <div><strong>Error 401/403:</strong> Make sure you selected "repo" and "user" permissions</div>
          <div><strong>Error 404:</strong> Check that the repository URL is correct and you have access</div>
          <div><strong>No commits found:</strong> Ensure your GitHub username matches the commit author</div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-pixel-muted">
        <p>🔒 Your token is stored locally and never sent to our servers</p>
      </div>
    </motion.div>
  )
}

export default GitHubAuth