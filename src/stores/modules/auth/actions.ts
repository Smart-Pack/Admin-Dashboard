/**
 * @module stores/modules/auth/actions
 * @description Actions for managing authentication state.
 */

import { auth, twoFactor } from '@/api'
import { getMe } from '@/api/modules/users'
import type { AuthState } from './state'
import { ALLOWED_ACCOUNT_TYPES } from './constants'

export interface AuthActions {
  clearStore(): void
  createTwoFaToken(): Promise<void>
  fetchUser(): Promise<void>
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
    this.loggedInUser = null
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
  /**
   * Fetches the currently logged-in user's details using the API service.
   * On success, updates the user data in the store.
   *
   * @returns {Promise<void>}
   */
  async fetchUser(this: AuthStoreContext) {
    try {
      const loggedInUser = await getMe()
      this.loggedInUser = loggedInUser
    } catch (error) {
      this.clearStore()
      throw error
    }
  },

  /**
   * Validates the logged-in user's account type and requests a 2FA token.
   *
   * @returns {Promise<string>} The 2FA request confirmation message.
   * @throws {Error} If the user is not authenticated or is not allowed
   * to access the dashboard.
   */
  async createTwoFaToken(this: AuthStoreContext): Promise<void> {
    const accountType = this.loggedInUser?.account_type

    if (!accountType) {
      throw new Error('User is not authenticated.')
    }

    if (!ALLOWED_ACCOUNT_TYPES.includes(accountType)) {
      const dashboardMap = {
        internal: 'Admin',
        customer: 'Customer',
      }

      const dashboard = dashboardMap[accountType]

      throw new Error(
        dashboard
          ? `Your credentials are for accessing the ${dashboard} dashboard. Accessing the Admin dashboard is restricted for your account type.`
          : 'The provided credentials are not supposed to be used for this dashboard.',
      )
    }

    await twoFactor.request()
  },
}
