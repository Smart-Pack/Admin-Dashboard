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
 * @returns Axios response containing a confirmation message.
 */
export const request = () => {
  return apiClient.post<ApiDetailResponse>(TWO_FACTOR.REQUEST)
}

/**
 * Verifies a two-factor authentication code.
 *
 * @param data - One-time password verification payload.
 * @returns Axios response containing the authentication tokens.
 */
export const verify = (data: TwoFactorVerifyRequest) => {
  return apiClient.post<LoginResponse>(TWO_FACTOR.VERIFY, data)
}
