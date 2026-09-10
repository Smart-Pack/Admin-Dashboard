import type { AuthState } from './state'

/**
 * Authentication state getters.
 */
export const getters = {
  /**
   * Returns the current access token.
   */
  accessToken: (state: AuthState) => state.accessToken,
}
