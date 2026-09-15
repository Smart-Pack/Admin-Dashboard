// src/apis/endpoints.js

/**
 * Endpoints for user authentication.
 */
export const AUTH = {
  FORGOT: '/v1/users/reset_password/request/',
  RESET: '/v1/users/reset_password/confirm/',
  LOGIN: 'v1/users/auth/login/',
  LOGOUT: 'v1/users/auth/logout/',
  REFRESH: 'v1/users/auth/refresh/',
  VERIFY: 'v1/users/auth/verify/',
} as const

export const TWO_FACTOR = {
  REQUEST: 'v1/users/2fa/',
  VERIFY: 'v1/users/2fa/verify/',
} as const

export const USERS = {
  ME: 'v1/users/me/',
} as const
