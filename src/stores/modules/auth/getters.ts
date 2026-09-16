import type { AuthState } from './state'

/**
 * Authentication state getters.
 */
export const getters = {
  /**
   * Returns whether an access token is currently available.
   */
  hasAccessToken: (state: AuthState) => Boolean(state.accessToken),
  /**
   * Indicates whether the user has completed OTP verification.
   */
  hasVerifiedOtp: (state: AuthState): boolean => Boolean(state.loggedInUser?.two_factor_enabled),
  /**
   * Indicates whether the user has changed their password after the initial login.
   */
  hasChangedPassword: (state: AuthState): boolean =>
    Boolean(state.loggedInUser?.changed_password_after_initial_login),
}
