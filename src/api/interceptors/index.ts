/**
 * @module api/interceptors
 * @description Configures Axios request and response interceptors.
 */
import { useAuthStore } from '@/stores'

import apiClient from '../client'
import { handle401 } from './handle401'

/**
 * Request Interceptor
 *
 * Adds the current access token to the Authorization header
 * before each API request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * Response Interceptor
 *
 * Handles successful responses and delegates 401 Unauthorized
 * responses to the 401 handler.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    return handle401(error)
  },
)
