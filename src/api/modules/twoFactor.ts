import apiClient from '@/api/client'
import type { ApiDetailResponse } from '@/api/types'
import { TWO_FACTOR } from '../endpoints'
import type { LoginResponse } from './auth'

export interface TwoFactorVerifyRequest {
  otp: string
}

/**
 * Requests a two-factor authentication code.
 *
 * @returns Confirmation message.
 */
export const request = async () => {
  const response = await apiClient.post<ApiDetailResponse>(TWO_FACTOR.REQUEST)
  return response.data
}

/**
 * Verifies a two-factor authentication code.
 *
 * @param data - One-time password verification payload.
 * @returns Authentication tokens.
 */
export const verify = async (data: TwoFactorVerifyRequest) => {
  const response = await apiClient.post<LoginResponse>(TWO_FACTOR.VERIFY, data)
  return response.data
}
