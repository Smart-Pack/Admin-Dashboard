// src/apis/endpoints.js

/**
 * Endpoints for user authentication.
 */
export const AUTH = {
  LOGIN: 'v1/users/auth/login/',
  LOGOUT: 'v1/users/auth/logout/',
  REFRESH: 'v1/users/auth/refresh/',
  VERIFY: 'v1/users/auth/verify/',
} as const

export const TWO_FACTOR = {
  REQUEST: 'v1/users/2fa/',
  VERIFY: 'v1/users/2fa/verify/',
} as const
