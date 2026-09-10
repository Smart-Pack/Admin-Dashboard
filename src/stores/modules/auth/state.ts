/**
 * Represents the authentication state.
 */
export interface AuthState {
  /** The current access token, or `null` when unavailable. */
  accessToken: string | null
}

/**
 * Initial authentication state.
 */
export const state: AuthState = {
  accessToken: null,
}
