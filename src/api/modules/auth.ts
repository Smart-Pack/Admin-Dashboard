import apiClient from '@/api/client'
import type { ApiDetailResponse } from '@/api/types'
import { AUTH } from '../endpoints'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface VerifyRequest {
  token: string
}

/**
 * Authenticates a user with their email and password.
 *
 * The API returns access and refresh tokens and sets the corresponding
 * authentication cookies.
 *
 * @param data - User login credentials.
 * @returns Authentication tokens.
 */
export const login = async (data: LoginRequest) => {
  const response = await apiClient.post<LoginResponse>(AUTH.LOGIN, data)
  return response.data
}

/**
 * Logs out the current user by clearing the authentication cookies.
 *
 * @returns Logout confirmation.
 */
export const logout = async () => {
  const response = await apiClient.post<ApiDetailResponse>(AUTH.LOGOUT)
  return response.data
}

/**
 * Refreshes the authentication tokens using the refresh token
 * stored in the authentication cookie.
 *
 * @returns Refreshed authentication tokens.
 */
export const refresh = async () => {
  const response = await apiClient.post<LoginResponse>(AUTH.REFRESH)
  return response.data
}

/**
 * Verifies the authentication token.
 *
 * @param data - Token verification payload.
 * @returns Verification confirmation.
 */
export const verify = async (data: VerifyRequest) => {
  const response = await apiClient.post<ApiDetailResponse>(AUTH.VERIFY, data)
  return response.data
}
