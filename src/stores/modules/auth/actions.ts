/**
 * @module stores/modules/auth/actions
 * @description Actions for managing authentication state.
 */

import { auth } from '@/api'
import type { AuthState } from './state'

interface AuthActions {
  clearStore(): void
  refreshToken(): Promise<void>
}

type AuthStoreContext = AuthState & AuthActions

/**
 * Authentication store actions.
 */
export const actions: AuthActions = {
  /**
   * Clears all authentication data from the store.
   */
  clearStore(this: AuthStoreContext) {
    this.accessToken = null
  },

  /**
   * Refreshes the authentication token using the refresh token.
   *
   * @throws The error returned by the refresh request.
   */
  async refreshToken(this: AuthStoreContext) {
    this.accessToken = null

    try {
      const { access } = await auth.refresh()

      this.accessToken = access
    } catch (error) {
      this.clearStore()
      throw error
    }
  },
}
