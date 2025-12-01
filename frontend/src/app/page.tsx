'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, Zap, X, Gift, Copy, Check, Flame, Eye, Crown, Sparkles, Send } from 'lucide-react'

const tokenImageCache: { [key: string]: string } = {}

const getTokenImage = async (symbol: string): Promise<string> => {
  if (tokenImageCache[symbol]) return tokenImageCache[symbol]
  try {
    const res = await fetch(`/api/v1/tokens/image/${symbol}`)
    const data = await res.json()
    if (data.image) {
      tokenImageCache[symbol] = data.image
      return data.image
    }
  } catch (e) {}
  return `https://ui-avatars.com/api/?name=${symbol}&background=6366f1&color=fff&size=64&bold=true`
}

function TokenImage({ symbol }: { symbol: string }) {
  const [src, setSrc] = useState(`https://ui-avatars.com/api/?name=${symbol}&background=6366f1&color=fff&size=64&bold=true`)
  useEffect(() => { getTokenImage(symbol).then(setSrc) }, [symbol])
  return <img src={src} alt={symbol} className="w-10 h-10 rounded-full bg-dark-700 ring-2 ring-green-500/30" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${symbol}&background=6366f1&color=fff&size=64` }} />
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

function PulseDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
  )
}

function ReferralModal({ isOpen, onClose, user, onSignIn }: { isOpen: boolean; onClose: () => void; user: any; onSignIn: () => void }) {
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ total_referrals: 0, converted_referrals: 0, total_earned_usd: 0 })
  
  const referralCode = user?.referral_code || ''
  const referralLink = referralCode ? `https://shadowalpha.net/?ref=${referralCode}` : ''

  useEffect(() => {
    if (user && isOpen) {
      fetch('/api/v1/referrals/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(r => r.json())
        .then(setStats)
        .catch(() => {})
    }
  }, [user, isOpen])

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900/95 border border-green-500/30 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl shadow-green-500/10">
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white neon-text">Referral Program</h2>
          <p className="text-green-400 mt-2">Earn 20% commission on every referral</p>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-white mb-3">💰 How it works</h3>
          <ul className="text-sm text-dark-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">1.</span>
              Share your unique referral link with friends
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">2.</span>
              They sign up and subscribe to ALPHA PRO
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">3.</span>
              You earn 20% of their subscription
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold">4.</span>
              Earn every month they stay subscribed!
            </li>
          </ul>
        </div>

        <div className="bg-dark-800/50 rounded-xl p-4 mb-6 border border-purple-500/20">
          <h3 className="font-semibold text-white mb-2">🚀 Earning Examples</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-dark-700/50 rounded-lg p-3 border border-green-500/20">
              <p className="text-dark-400">5 referrals</p>
              <p className="text-green-400 font-bold text-lg">$99/month</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 border border-green-500/20">
              <p className="text-dark-400">20 referrals</p>
              <p className="text-green-400 font-bold text-lg">$396/month</p>
            </div>
          </div>
        </div>

        {user ? (
          <>
            <div className="bg-dark-800 rounded-xl p-4 mb-6 border border-green-500/30">
              <p className="text-sm text-dark-400 mb-2">Your Referral Link</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <button 
                  onClick={copyLink}
                  className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors shadow-lg shadow-green-500/30"
                >
                  {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                </button>
              </div>
              <p className="text-xs text-dark-500 mt-2">Code: <span className="text-green-400 font-mono">{referralCode}</span></p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-purple-500/20">
                <p className="text-2xl font-bold text-white">{stats.total_referrals}</p>
                <p className="text-xs text-dark-400">Total Referrals</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-purple-500/20">
                <p className="text-2xl font-bold text-white">{stats.converted_referrals}</p>
                <p className="text-xs text-dark-400">Converted</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 text-center border border-green-500/20">
                <p className="text-2xl font-bold text-green-400">${stats.total_earned_usd.toFixed(2)}</p>
                <p className="text-xs text-dark-400">Earned</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-dark-400 mb-4">Sign in to get your unique referral link</p>
            <button 
              onClick={() => { onClose(); onSignIn(); }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-green-500/30 transition-all"
            >
              Sign In to Start Earning
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AuthModal({ isOpen, onClose, mode, setMode }: { isOpen: boolean; onClose: () => void; mode: 'login' | 'register'; setMode: (mode: 'login' | 'register') => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  if (!isOpen) return null
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register'
      const body = mode === 'login' ? { email, password } : { email, password, username: username || undefined, referral_code: referralCode || undefined }
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.detail || 'Authentication failed') }
      const data = await response.json()
      localStorage.setItem('token', data.access_token); onClose(); window.location.reload()
    } catch (err: any) { setError(err.message || 'Something went wrong') } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900/95 border border-purple-500/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl shadow-purple-500/10">
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white neon-text-purple">{mode === 'login' ? 'Welcome Back' : 'Join Shadow Alpha'}</h2>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (<div><label className="block text-sm text-dark-400 mb-2">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" /></div>)}
          <div><label className="block text-sm text-dark-400 mb-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" /></div>
          <div><label className="block text-sm text-dark-400 mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" /></div>
          {mode === 'register' && (<div><label className="block text-sm text-dark-400 mb-2">Referral Code (Optional)</label><input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="Enter referral code" className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" /></div>)}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/30 transition-all">{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div className="mt-6 text-center text-sm"><span className="text-dark-400">{mode === 'login' ? "Don't have an account? " : "Already have an account? "}</span><button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-purple-400 hover:text-purple-300">{mode === 'login' ? 'Sign Up' : 'Sign In'}</button></div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [referralModal, setReferralModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [stats, setStats] = useState({ totalEliteWallets: 5, avgWinRate: 100, totalProfit: 119000000 })
  const [viewerCount, setViewerCount] = useState(127)
  const [todayProfit, setTodayProfit] = useState(2340000)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(80, prev + Math.floor(Math.random() * 7) - 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetch('/api/v1/live/start-monitoring', { method: 'POST' })
      .then(() => setIsConnected(true))
      .catch(() => {})

    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/v1/live/alerts')
        const data = await res.json()
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts.slice(0, 15))
        }
      } catch (e) {}
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/v1/elite/leaderboard')
        const data = await res.json()
        if (data.leaderboard) {
          const formatted = data.leaderboard.map((w: any) => ({
            rank: w.elite_rank,
            address: w.wallet_address,
            winRate: w.win_rate,
            avgProfit: w.avg_profit_percent,
            totalProfit: w.total_profit_usd,
            trades: w.total_trades
          }))
          
          const avgWR = formatted.reduce((sum: number, t: any) => sum + t.winRate, 0) / formatted.length
          const totalProfit = formatted.reduce((sum: number, t: any) => sum + t.totalProfit, 0)
          setStats({
            totalEliteWallets: formatted.length,
            avgWinRate: Math.round(avgWR),
            totalProfit: totalProfit
          })
        }
      } catch (e) {}
    }
    fetchLeaderboard()
  }, [])

  useEffect(() => { const token = localStorage.getItem('token'); if (token) fetchUser(token) }, [])
  const fetchUser = async (token: string) => { try { const r = await fetch('/api/v1/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }); if (r.ok) setUser(await r.json()); else localStorage.removeItem('token') } catch {} }
  const handleLogout = () => { localStorage.removeItem('token'); setUser(null) }
  const formatProfit = (n: number) => n >= 1000000 ? '$' + (n / 1000000).toFixed(1) + 'M' : '$' + (n / 1000).toFixed(0) + 'K'

  const openSignIn = () => {
    setAuthMode('login')
    setAuthModal(true)
  }

  const handleFreePlan = () => {
    if (user) {
      return
    } else {
      setAuthMode('register')
      setAuthModal(true)
    }
  }

  const handleProPlan = () => {
    if (user) {
      window.location.href = '/api/v1/payments/checkout'
    } else {
      setAuthMode('register')
      setAuthModal(true)
    }
  }

  const handleTelegramConnect = () => {
    window.open('https://t.me/ShadowAlphaBot', '_blank')
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <style jsx global>{`
        .neon-text {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
        }
        .neon-text-purple {
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .neon-box {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(16, 185, 129, 0.05);
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-btn {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 25%, #f59e0b 50%, #fbbf24 75%, #f59e0b 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .logo-text {
          background: linear-gradient(135deg, #10b981 0%, #6366f1 50%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} mode={authMode} setMode={setAuthMode} />
      <ReferralModal isOpen={referralModal} onClose={() => setReferralModal(false)} user={user} onSignIn={openSignIn} />
      
      {/* Header */}
      <header className="border-b border-green-500/20 bg-dark-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg pulse-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight logo-text">Shadow Alpha</h1>
            </a>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400">{viewerCount} watching</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Today: +${(todayProfit / 1000000).toFixed(1)}M</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <PulseDot />
                <span className="text-sm text-green-400 font-medium">{isConnected ? 'LIVE' : 'Connecting...'}</span>
              </div>
              <button 
                onClick={() => setReferralModal(true)}
                className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/30"
              >
                <Gift className="w-4 h-4" />
                Referral
              </button>
              {/* ALPHA PRO Button - Special */}
              <button 
                onClick={handleProPlan}
                className="flex items-center gap-2 text-sm text-black font-bold px-4 py-2 rounded-lg shimmer-btn shadow-lg shadow-yellow-500/30 hover:scale-105 transition-transform"
              >
                <Crown className="w-4 h-4" />
                ALPHA PRO
                <Sparkles className="w-4 h-4" />
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-dark-400">{user.email}</span>
                  <button onClick={handleLogout} className="text-sm py-2 px-4 border border-dark-600 rounded-lg hover:bg-dark-800 text-white transition-colors">Logout</button>
                </div>
              ) : (
                <button onClick={() => { setAuthMode('login'); setAuthModal(true) }} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm py-2 px-4 rounded-lg font-semibold shadow-lg shadow-green-500/30 transition-all">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 - 3개만 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Elite Traders', value: stats.totalEliteWallets, icon: Users, change: '90%+ WR' },
            { title: 'Avg Win Rate', value: stats.avgWinRate, suffix: '%', icon: TrendingUp, change: 'Verified' },
            { title: 'Total Profit', value: stats.totalProfit, format: true, icon: DollarSign, change: 'All Time' }
          ].map((stat, i) => (
            <div key={i} className="bg-dark-900/50 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-dark-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">
                    {stat.format ? formatProfit(stat.value) : <><AnimatedNumber value={stat.value} />{stat.suffix}</>}
                  </p>
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Alerts */}
        <div className="bg-dark-900/50 border border-green-500/30 rounded-2xl p-8 mb-8 neon-box">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white neon-text">Live Alerts</h2>
                <p className="text-sm text-dark-400">Real-time trades from Elite Whales</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTelegramConnect}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/30"
              >
                <Send className="w-4 h-4" />
                Connect Telegram
              </button>
              <span className="text-sm text-dark-400 bg-dark-800 px-3 py-1 rounded-full">
                {alerts.length} alerts
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <PulseDot />
                <span className="ml-2">Live</span>
              </span>
            </div>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Waiting for Elite Trades...</h3>
              <p className="text-dark-400">Real-time alerts will appear when our elite whales make a move</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
              {alerts.map((alert, idx) => (
                <div 
                  key={alert.id || idx} 
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] cursor-pointer
                    ${alert.type === 'buy' 
                      ? 'bg-green-500/10 border-green-500/40 hover:border-green-500/60' 
                      : 'bg-red-500/10 border-red-500/40 hover:border-red-500/60'
                    } 
                    ${idx === 0 ? 'ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${alert.type === 'buy' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'}`}>
                        {alert.type.toUpperCase()}
                      </span>
                      <span className="text-white font-bold text-lg">${(alert.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <span className="text-xs text-dark-500 bg-dark-800 px-2 py-1 rounded flex items-center gap-1">
                      {idx === 0 && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                      {alert.time}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <TokenImage symbol={alert.token} />
                    <span className="neon-text">{alert.token}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-dark-500">by</span>
                    <span className="font-mono text-purple-400 bg-dark-800 px-2 py-1 rounded">{alert.wallet}</span>
                    <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">#{alert.rank}</span>
                    <span className="text-green-400 font-semibold">({alert.winRate}% WR)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white neon-text mb-2">Choose Your Plan</h2>
            <p className="text-dark-400">Start tracking elite whales today</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-dark-900/50 border border-dark-700 rounded-2xl p-8 hover:border-dark-600 transition-all">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-dark-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-dark-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-dark-400">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>View live alerts (delayed)</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Basic whale tracking</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Limited alerts per day</span>
                </li>
                <li className="flex items-center gap-3 text-dark-500">
                  <X className="w-5 h-5 text-dark-600" />
                  <span>Telegram notifications</span>
                </li>
                <li className="flex items-center gap-3 text-dark-500">
                  <X className="w-5 h-5 text-dark-600" />
                  <span>Priority alerts</span>
                </li>
              </ul>
              
              <button 
                onClick={handleFreePlan}
                className="w-full py-3 px-4 border border-dark-600 rounded-xl text-white font-semibold hover:bg-dark-800 transition-colors"
              >
                {user ? 'Current Plan' : 'Get Started Free'}
              </button>
            </div>

            {/* ALPHA PRO Plan */}
            <div className="bg-gradient-to-b from-yellow-500/10 to-dark-900/50 border-2 border-yellow-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="shimmer-btn text-black text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MOST POPULAR
                </span>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">ALPHA PRO</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-dark-400">/month</span>
                </div>
                <p className="text-sm text-yellow-400 mt-2">or $830/year (30% off)</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span>Real-time alerts (instant)</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span>All elite whales tracked</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span>Unlimited alerts</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span>Telegram notifications</span>
                </li>
                <li className="flex items-center gap-3 text-dark-300">
                  <Check className="w-5 h-5 text-yellow-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <button 
                onClick={handleProPlan}
                className="w-full py-3 px-4 shimmer-btn rounded-xl text-black font-bold shadow-lg shadow-yellow-500/30 hover:scale-105 transition-transform"
              >
                Upgrade to ALPHA PRO
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-dark-500">© 2025 Shadow Alpha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
