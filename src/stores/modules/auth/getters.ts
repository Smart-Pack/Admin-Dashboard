import type { AuthState } from './state'

/**
 * Authentication state getters.
 */
export const getters = {
  /**
   * Returns whether an access token is currently available.
   */
  hasAccessToken: (state: AuthState) => Boolean(state.accessToken),
}
