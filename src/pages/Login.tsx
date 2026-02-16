import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (login(email, password)) {
      navigate('/')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-safari-charcoal via-safari-brown to-safari-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://i.pinimg.com/736x/b7/4d/e4/b74de494b7a34e81af1cb59309b42b6f.jpg" 
            alt="WildWave Logo" 
            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-lg"
          />
          <h1 className="text-4xl font-display font-bold text-safari-gold mb-2">WildWave Admin</h1>
          <p className="text-safari-cream/60">Sign in to manage your safari business</p>
        </div>

        <div className="bg-white dark:bg-safari-charcoal rounded-2xl p-8 card-shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-safari-cream mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wildwave.com"
                className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 focus:ring-2 focus:ring-safari-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-safari-cream mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg dark:bg-safari-charcoal dark:border-gray-700 focus:ring-2 focus:ring-safari-gold focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full safari-gradient text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Demo credentials:</p>
            <p className="font-mono text-xs mt-1">admin@wildwave.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
