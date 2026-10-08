import { useState, useEffect } from 'react'
import { X, Key, Info } from 'lucide-react'

interface ApiKeysModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [hfKey, setHfKey] = useState('')
  const [groqKey, setGroqKey] = useState('')

  useEffect(() => {
    if (isOpen) {
      setHfKey(localStorage.getItem('clip2course_hf_key') || '')
      setGroqKey(localStorage.getItem('clip2course_groq_key') || '')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    if (hfKey) localStorage.setItem('clip2course_hf_key', hfKey)
    else localStorage.removeItem('clip2course_hf_key')

    if (groqKey) localStorage.setItem('clip2course_groq_key', groqKey)
    else localStorage.removeItem('clip2course_groq_key')

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-surface-light border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Keys</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Bring your own keys to bypass limits.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            <strong>Public Demo Mode:</strong> You can leave these blank! We provide a public key for testing, but if it reaches its rate limit, you can paste your own free keys here to continue generating courses instantly.
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Groq API Key (Required for fast generation)
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Get a free API key at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.groq.com</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              HuggingFace API Key (Fallback / Alternative)
            </label>
            <input
              type="password"
              value={hfKey}
              onChange={(e) => setHfKey(e.target.value)}
              placeholder="hf_..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Get a free API key at <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-primary hover:underline">huggingface.co</a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  )
}
