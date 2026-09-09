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
