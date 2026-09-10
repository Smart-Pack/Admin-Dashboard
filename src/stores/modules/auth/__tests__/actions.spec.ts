import { beforeEach, describe, expect, it, vi } from 'vitest'

import { refresh } from '@/api/modules/auth'

import { actions } from '../actions'
import type { AuthState } from '../state'

interface AuthActions {
  clearStore(): void
  refreshToken(): Promise<void>
}

vi.mock('@/api/modules/auth', () => ({
  refresh: vi.fn<() => Promise<{ access: string; refresh: string }>>(),
}))

describe('auth store actions', () => {
  let state: AuthState
  let store: AuthState & AuthActions

  beforeEach(() => {
    state = {
      accessToken: 'old-access-token',
    }

    store = {
      ...state,
      ...actions,
    }

    vi.clearAllMocks()
  })

  describe('clearStore', () => {
    it('clears the access token', () => {
      store.clearStore()

      expect(store.accessToken).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('refreshes the access token successfully', async () => {
      vi.mocked(refresh).mockResolvedValue({
        access: 'new-access-token',
        refresh: 'refresh-token',
      })

      await store.refreshToken()

      expect(refresh).toHaveBeenCalledExactlyOnceWith()
      expect(store.accessToken).toBe('new-access-token')
    })

    it('clears the existing access token before refreshing', async () => {
      let tokenDuringRefresh: string | null | undefined

      vi.mocked(refresh).mockImplementation(async () => {
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

      vi.mocked(refresh).mockRejectedValue(error)

      await expect(store.refreshToken()).rejects.toThrow('Refresh failed')

      expect(store.accessToken).toBeNull()
    })
  })
})
