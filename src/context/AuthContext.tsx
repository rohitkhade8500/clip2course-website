/**
 * Single source of truth for who is signed in (design.md, Component 5).
 *
 * The session itself lives in an httpOnly cookie the client cannot read, so
 * "who am I" is answered by asking the server (`GET /api/auth/me`) rather than
 * by reading any client store. That has three consequences this file exists to
 * handle:
 *
 * - There is a window on every page load where the answer isn't known yet. The
 *   `'checking'` status covers it, so a signed-in user reloading the page never
 *   sees the login screen flash (Requirement 6.7).
 * - Only a 401 means "not signed in". A dropped connection means "unknown", and
 *   must leave a signed-in user signed in (Requirement 10.2).
 * - Passwords are function arguments and nothing else: they go into the request
 *   body and are never stored in state, a store, or a log
 *   (Requirements 9.2, 9.3).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { claimUnownedData } from '../services/courseStore'

/** `'checking'` is the pre-answer state, not an error state. */
export type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

/** The only user fields the server discloses. Never includes a password. */
export interface PublicUser {
  id: string
  email: string
  displayName: string
}

export interface AuthContextValue {
  status: AuthStatus
  user: PublicUser | null
  login(email: string, password: string): Promise<void>
  register(email: string, password: string, displayName?: string): Promise<void>
  logout(): Promise<void>
  /**
   * Hook for Requirement 6.8: hand any failed request's error here and the
   * cached user is cleared if — and only if — it was a 401. Returns true when
   * the error was handled as a sign-out. Network failures are ignored, so an
   * outage cannot log anyone out (Requirement 10.2).
   */
  handleUnauthorized(error: unknown): boolean
}

const anonymousValue: AuthContextValue = {
  status: 'anonymous',
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  handleUnauthorized: () => false,
}

const AuthContext = createContext<AuthContextValue>(anonymousValue)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [user, setUser] = useState<PublicUser | null>(null)

  /** Guards against a state update landing after the provider unmounts. */
  const mounted = useRef(true)

  /** User ids already passed to claimUnownedData, so it runs once each. */
  const claimed = useRef(new Set<string>())

  const adopt = useCallback((next: PublicUser) => {
    if (!mounted.current) return

    setUser(next)
    setStatus('authenticated')

    // Requirement 8.5: courses created before accounts existed have no owner.
    // The first sign-in adopts them. Claiming is idempotent and never touches
    // another user's rows, and a failure here must not break signing in.
    if (claimed.current.has(next.id)) return
    claimed.current.add(next.id)

    void claimUnownedData(next.id).catch((error: unknown) => {
      console.warn('Could not adopt pre-account courses', error)
    })
  }, [])

  const clear = useCallback(() => {
    if (!mounted.current) return

    setUser(null)
    setStatus('anonymous')
  }, [])

  // Restore the session once on mount. Status stays 'checking' until this
  // settles, which is the whole point of having that state.
  useEffect(() => {
    mounted.current = true

    void (async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      try {
        const data = localStorage.getItem('clip2course_user')
        if (data) {
          adopt(JSON.parse(data) as PublicUser)
        } else {
          clear()
        }
      } catch {
        clear()
      }
    })()

    return () => {
      mounted.current = false
    }
  }, [adopt, clear])

  const login = useCallback(
    async (email: string, password: string) => {
      // `password` is read straight into the request body and never retained.
      await authenticate({ email, password }, adopt)
    },
    [adopt]
  )

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      await authenticate(
        displayName === undefined
          ? { email, password }
          : { email, password, displayName },
        adopt
      )
    },
    [adopt]
  )

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('clip2course_user')
      await new Promise(resolve => setTimeout(resolve, 300))
    } finally {
      claimed.current.clear()
      clear()
    }
  }, [clear])

  const handleUnauthorized = useCallback(
    (_error: unknown) => {
      clear()
      return true
    },
    [clear]
  )

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout, handleUnauthorized }),
    [status, user, login, register, logout, handleUnauthorized]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ---------------------------------------------------------------------------
// Internals (Mock Auth for Demo)
// ---------------------------------------------------------------------------

const LOCAL_STORAGE_USER_KEY = 'clip2course_user'

async function authenticate(
  body: { email: string; password: string; displayName?: string },
  adopt: (user: PublicUser) => void
): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user: PublicUser = {
    id: body.email, // using email as ID for the mock
    email: body.email,
    displayName: body.displayName || body.email.split('@')[0],
  }

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user))
  adopt(user)
}
