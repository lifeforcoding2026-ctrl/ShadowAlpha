'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, TrendingUp, DollarSign, Activity, Bell, Zap, ExternalLink, X, Mail, Lock, User } from 'lucide-react'

// Mock data
const mockTraders = [
  { rank: 1, address: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK', winRate: 78.5, avgProfit: 456, totalProfit: 2340000, trades: 89 },
  { rank: 2, address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', winRate: 74.2, avgProfit: 389, totalProfit: 1890000, trades: 124 },
  { rank: 3, address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH', winRate: 71.8, avgProfit: 342, totalProfit: 1560000, trades: 156 },
  { rank: 4, address: '9aUn5swQzUTRanaaTwmszxiv89cvFwUCjEBv1vZCoT1u', winRate: 68.9, avgProfit: 312, totalProfit: 1230000, trades: 98 },
  { rank: 5, address: '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT', winRate: 66.4, avgProfit: 298, totalProfit: 980000, trades: 145 },
]

const mockAlerts = [
  { id: '1', type: 'buy', token: 'BONK', amount: 125000, wallet: 'DYw8...NSKK', rank: 1, winRate: 78.5, time: '2 min ago' },
  { id: '2', type: 'sell', token: 'WIF', amount: 89000, wallet: '5Q54...4j1', rank: 2, winRate: 74.2, time: '8 min ago' },
  { id: '3', type: 'buy', token: 'POPCAT', amount: 56000, wallet: 'HN7c...WrH', rank: 3, winRate: 71.8, time: '15 min ago' },
]

// Auth Modal Component
function AuthModal({ isOpen, onClose, mode, setMode }: { 
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  setMode: (mode: 'login' | 'register') => void 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register'
      const body = mode === 'login' 
        ? { email, password }
        : { email, password, username: username || undefined, referral_code: referralCode || undefined }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.detail || 'Authentication failed')
      }

      const data = await response.json()

      // Save token
      localStorage.setItem('token', data.access_token)
      onClose()
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md p-6 relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-dark-400 text-sm mt-1">
            {mode === 'login' ? 'Sign in to access Elite Whale Tracker' : 'Start tracking Elite Traders today'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-dark-400 mb-2">Username (optional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-dark-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm text-dark-400 mb-2">Referral Code (optional)</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:border-primary-500 focus:outline-none"
              />
              <p className="text-xs text-dark-500 mt-1">Get 7 days free with a referral code!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-dark-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-primary-500 hover:text-primary-400 font-medium"
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard
export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalEliteWallets: 247,
    avgWinRate: 68.4,
    totalProfit: 12400000,
    activeToday: 89
  })

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    }

    // Try to fetch real stats
    fetchStats()

    // Connect WebSocket
    connectWebSocket()
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (err) {
      // 에러 무시 - 로그인 안 된 상태
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/elite/stats')
      if (response.ok) {
        const data = await response.json()
        if (data.total_elite_wallets > 0) {
          setStats({
            totalEliteWallets: data.total_elite_wallets,
            avgWinRate: data.avg_win_rate || 68.4,
            totalProfit: data.total_profit_tracked || 12400000,
            activeToday: data.active_wallets || 89
          })
        }
      }
    } catch (err) {
      // Mock 데이터 사용
    }
  }

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8000/api/v1/trades/realtime')
      ws.onopen = () => setIsConnected(true)
      ws.onclose = () => {
        setIsConnected(false)
        setTimeout(connectWebSocket, 5000)
      }
      ws.onerror = () => {
        setIsConnected(false)
      }
    } catch (err) {
      setIsConnected(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`
  const formatProfit = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`
  const getRankBadge = (r: number) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`

  return (
    <div className="min-h-screen">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal} 
        onClose={() => setAuthModal(false)} 
        mode={authMode}
        setMode={setAuthMode}
      />

      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Elite Whale Tracker</h1>
                <p className="text-xs text-dark-400">Track Smart Money on Solana</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm text-dark-400">{isConnected ? 'Live' : 'Offline'}</span>
              </div>
              <button className="relative p-2 hover:bg-dark-800 rounded-lg">
                <Bell className="w-5 h-5 text-dark-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-dark-400">{user.email}</span>
                  <button onClick={handleLogout} className="btn-secondary text-sm py-2">Logout</button>
                </div>
              ) : (
                <button 
                  onClick={() => { setAuthMode('login'); setAuthModal(true) }} 
                  className="btn-primary text-sm py-2"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Elite Traders', value: stats.totalEliteWallets, icon: Users, change: '+12' },
            { title: 'Avg Win Rate', value: `${stats.avgWinRate.toFixed(1)}%`, icon: TrendingUp, change: '+2.3%' },
            { title: 'Total Profit', value: formatProfit(stats.totalProfit), icon: DollarSign, change: '+$234K' },
            { title: 'Active Today', value: stats.activeToday, icon: Activity },
          ].map((stat, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-dark-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.change && <p className="text-sm text-green-500 mt-1">{stat.change}</p>}
                </div>
                <div className="p-3 bg-dark-800 rounded-lg text-primary-500">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Elite Leaderboard</h2>
                <p className="text-sm text-dark-400">Top traders (60%+ win rate, 300%+ profit)</p>
              </div>
              <select className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Wallet</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Win Rate</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Avg Profit</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Total Profit</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Trades</th>
                    <th className="text-center py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockTraders.map((t) => (
                    <tr key={t.rank} className="border-b border-dark-800/50 hover:bg-dark-800/30 cursor-pointer">
                      <td className="py-3 px-4 text-lg">{getRankBadge(t.rank)}</td>
                      <td className="py-3 px-4 font-mono text-primary-400">{truncate(t.address)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={t.winRate >= 70 ? 'text-green-400' : 'text-yellow-400'}>{t.winRate}%</span>
                      </td>
                      <td className="py-3 px-4 text-right text-green-400">+{t.avgProfit}%</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatProfit(t.totalProfit)}</td>
                      <td className="py-3 px-4 text-right text-dark-400">{t.trades}</td>
                      <td className="py-3 px-4 text-center">
                        <a href={`https://solscan.io/account/${t.address}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 text-dark-500 hover:text-white" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-white">Live Alerts</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border animate-slide-up ${alert.type === 'buy' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${alert.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {alert.type.toUpperCase()}
                      </span>
                      <span className="text-white font-bold">${(alert.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <span className="text-xs text-dark-500">{alert.time}</span>
                  </div>
                  <div className="text-white font-medium">{alert.token}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-dark-500">by</span>
                    <span className="font-mono text-primary-400">{alert.wallet}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">#{alert.rank}</span>
                    <span className="text-dark-500">({alert.winRate}% WR)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-dark-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-dark-500">
          © 2025 Elite Whale Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
