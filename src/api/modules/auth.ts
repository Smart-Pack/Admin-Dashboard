import apiClient from '@/api/client'
import type { ApiDetailResponse } from '@/api/types'
import { AUTH } from '../endpoints'

export interface ForgotPasswordRequest {
  email: string
}

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

/**
 * Sends a password reset link to the user's email.
 *
 * @param data - User email address.
 * @returns A success message when the request succeeds.
 * @throws An error containing the API error message when the request fails.
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<string> => {
  try {
    await apiClient.post(AUTH.FORGOT, data)

    return 'Password reset link has been sent to your email. Click on the link to reset your password.'
  } catch (error: unknown) {
    const e = error as {
      response?: {
        data?: {
          detail?: string
          email?: string
        }
      }
      message: string
    }

    const responseData = e.response?.data

    if (responseData?.detail) {
      e.message = responseData.detail
    } else if (responseData?.email) {
      e.message = responseData.email
    }

    throw e
  }
}
