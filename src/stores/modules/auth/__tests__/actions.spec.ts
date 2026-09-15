import { beforeEach, describe, expect, it, vi } from 'vitest'

import { auth, twoFactor } from '@/api'
import { getMe } from '@/api/modules/users'
import type { User } from '@/api/modules/users'

import { actions, type AuthActions } from '../actions'
import type { AuthState } from '../state'

vi.mock('@/api/modules/users', () => ({
  getMe: vi.fn<() => Promise<User>>(),
}))
vi.mock('@/api', () => ({
  auth: {
    refresh: vi.fn<() => Promise<{ access: string; refresh: string }>>(),
  },
  twoFactor: {
    request: vi.fn<() => Promise<{ detail: string }>>(),
  },
}))

describe('auth store actions', () => {
  let state: AuthState
  let store: AuthState & AuthActions

  beforeEach(() => {
    state = {
      accessToken: 'old-access-token',
      loggedInUser: null,
      loginBtn: 'Log In',
    }

    store = {
      ...state,
      ...actions,
    }

    vi.clearAllMocks()
  })

  describe('clearStore', () => {
    it('clears the access token and logged-in user', () => {
      store.loggedInUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        profile_pic: null,
        account_type: 'customer',
        role: 'staff',
        date_of_birth: '2000-01-01',
        gender: 'male',
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-15T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      store.clearStore()

      expect(store.accessToken).toBeNull()
      expect(store.loggedInUser).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('refreshes the access token successfully', async () => {
      vi.mocked(auth.refresh).mockResolvedValue({
        access: 'new-access-token',
        refresh: 'refresh-token',
      })

      await store.refreshToken()

      expect(auth.refresh).toHaveBeenCalledExactlyOnceWith()
      expect(store.accessToken).toBe('new-access-token')
    })

    it('clears the existing access token before refreshing', async () => {
      let tokenDuringRefresh: string | null | undefined

      vi.mocked(auth.refresh).mockImplementation(async () => {
        tokenDuringRefresh = store.accessToken

        return {
          access: 'new-access-token',
          refresh: 'refresh-token',
        }
      })

      await store.refreshToken()

      expect(tokenDuringRefresh).toBeNull()
      expect(store.accessToken).toBe('new-access-token')
    })

    it('clears the store and rethrows when refresh fails', async () => {
      const error = new Error('Refresh failed')

      vi.mocked(auth.refresh).mockRejectedValue(error)

      await expect(store.refreshToken()).rejects.toThrow('Refresh failed')

      expect(store.accessToken).toBeNull()
    })
  })

  describe('fetchUser', () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      profile_pic: null,
      account_type: 'customer',
      role: 'staff',
      date_of_birth: '2000-01-01',
      gender: 'male',
      changed_password_after_initial_login: true,
      created_at: '2026-09-15T12:33:13.497Z',
      updated_at: '2026-09-15T12:33:13.497Z',
      two_factor_enabled: true,
      status: 'active',
    }

    it('fetches and stores the currently logged-in user', async () => {
      vi.mocked(getMe).mockResolvedValue(user)

      await store.fetchUser()

      expect(getMe).toHaveBeenCalledExactlyOnceWith()
      expect(store.loggedInUser).toEqual(user)
    })

    it('clears the store and rethrows when fetching the user fails', async () => {
      const error = new Error('Failed to fetch user')

      vi.mocked(getMe).mockRejectedValue(error)

      await expect(store.fetchUser()).rejects.toThrow('Failed to fetch user')

      expect(store.accessToken).toBeNull()
      expect(store.loggedInUser).toBeNull()
    })
  })
  describe('createTwoFaToken', () => {
    it('requests a 2FA token for an allowed account type', async () => {
      store.loggedInUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        profile_pic: null,
        account_type: 'internal',
        role: 'staff',
        date_of_birth: '2000-01-01',
        gender: 'male',
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-15T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      vi.mocked(twoFactor.request).mockResolvedValue({
        detail: 'OTP sent successfully.',
      })

      await store.createTwoFaToken()

      expect(twoFactor.request).toHaveBeenCalledExactlyOnceWith()
    })

    it('throws when the user is not authenticated', async () => {
      store.loggedInUser = null

      await expect(store.createTwoFaToken()).rejects.toThrow('User is not authenticated.')

      expect(twoFactor.request).not.toHaveBeenCalled()
    })

    it('throws when the account type is not allowed', async () => {
      store.loggedInUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        profile_pic: null,
        account_type: 'customer',
        role: 'staff',
        date_of_birth: '2000-01-01',
        gender: 'male',
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-15T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      await expect(store.createTwoFaToken()).rejects.toThrow(
        'Your credentials are for accessing the Customer dashboard. Accessing the Admin dashboard is restricted for your account type.',
      )

      expect(twoFactor.request).not.toHaveBeenCalled()
    })

    it('propagates the 2FA request error', async () => {
      store.loggedInUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        profile_pic: null,
        account_type: 'internal',
        role: 'staff',
        date_of_birth: '2000-01-01',
        gender: 'male',
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-15T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      const error = new Error('Failed to request 2FA token')

      vi.mocked(twoFactor.request).mockRejectedValue(error)

      await expect(store.createTwoFaToken()).rejects.toThrow('Failed to request 2FA token')
    })
  })
})
