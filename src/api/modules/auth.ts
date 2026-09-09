import apiClient from '@/api/client'
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
 * @returns Axios response containing the access and refresh tokens.
 */
export const login = (data: LoginRequest) => {
  return apiClient.post<LoginResponse>(AUTH.LOGIN, data)
}

/**
 * Refreshes the authentication tokens using the refresh token
 * stored in the authentication cookie.
 *
 * @returns Axios response containing the new access and refresh tokens.
 */
export const refresh = () => {
  return apiClient.post<LoginResponse>(AUTH.REFRESH)
}

/**
 * Verifies the authentication token.
 *
 * @param data - Token verification payload.
 * @returns Axios response from the verification endpoint.
 */
export const verify = (data: VerifyRequest) => {
  return apiClient.post(AUTH.VERIFY, data)
}
