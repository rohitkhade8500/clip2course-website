import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Zap, BookOpen, Loader2 } from 'lucide-react'
import { submitToWeb3Forms } from '../utils/web3forms'
import { sendWaitlistConfirmation } from '../utils/emailjs'

export default function Hero() {

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const subscriberEmail = email // capture before clearing

      await submitToWeb3Forms({
        subject: '🎉 New Waitlist Signup — Clip2Course',
        from_name: 'Waitlist Subscriber',
        email: subscriberEmail,
        message: `New waitlist signup from: ${subscriberEmail}`,
      })

      // Fire-and-forget: send confirmation email to subscriber
      // (doesn't block the success UI — errors are silently logged)
      sendWaitlistConfirmation(subscriberEmail)

      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center hero-grid overflow-hidden pt-20"
    >
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-8 fade-in-up">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Course Generation</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 fade-in-up text-slate-900 dark:text-white" style={{ animationDelay: '0.1s' }}>
          Turn Any Video Into a{' '}
          <span className="gradient-text">Complete Course</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
          Drop a YouTube link or upload a raw video. Clip2Course AI automatically generates
          structured modules, quizzes, summaries, and study notes — in minutes, not hours.
        </p>

        {/* Main CTA replaced by waitlist form below */}

        {/* Waitlist Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-12 fade-in-up"
          style={{ animationDelay: '0.3s' }}
          id="waitlist-form"
        >
          <input
            type="email"
            id="waitlist-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-white dark:bg-surface-light border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            id="waitlist-submit"
            disabled={status === 'loading' || status === 'success'}
            className="glow-btn pulse-glow w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Joining...
              </>
            ) : status === 'success' ? (
              <>
                <span>🎉</span> You're on the list!
              </>
            ) : status === 'error' ? (
              <>
                <span>⚠️</span> Try Again
              </>
            ) : (
              <>
                Join Waitlist <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {status === 'error' && errorMsg && (
          <p className="text-red-400 text-sm text-center -mt-8 mb-8 fade-in-up">{errorMsg}</p>
        )}

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-500 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-primary-light" />
            <span>Supports YouTube, Vimeo & raw uploads</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-light" />
            <span>Auto-generates modules, quizzes & notes</span>
          </div>
        </div>

      </div>
    </section>
  )
}
