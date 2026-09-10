import type { AxiosError } from 'axios'

import { AUTH, TWO_FACTOR } from '../endpoints'
import { retryRequest, type RetryRequestConfig } from './retryRequest'

/**
 * Handles 401 Unauthorized responses.
 *
 * Authentication and two-factor endpoints are excluded from
 * the token refresh flow. Protected requests are retried once
 * after refreshing the access token.
 *
 * @param error - Axios error containing the failed request.
 * @returns The retried request or the rejected error.
 */
export async function handle401(error: AxiosError) {
  const originalRequest = error.config as RetryRequestConfig | undefined

  const url = originalRequest?.url ?? ''

  /**
   * Authentication endpoints must not trigger token refresh.
   */
  if (
    url.includes(AUTH.LOGIN) ||
    url.includes(AUTH.REFRESH) ||
    url.includes(AUTH.VERIFY) ||
    url.includes(TWO_FACTOR.REQUEST) ||
    url.includes(TWO_FACTOR.VERIFY)
  ) {
    return Promise.reject(error)
  }

  /**
   * Prevent an infinite refresh/retry loop.
   */
  if (originalRequest?._retry) {
    return Promise.reject(error)
  }

  /**
   * Refresh the access token and retry the original request.
   */
  return retryRequest(error)
}
