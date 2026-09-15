import apiClient from '@/api/client'
import { USERS } from '../endpoints'

export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  profile_pic: string | null
  account_type: 'customer' | 'internal'
  role: 'staff' | 'admin'
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other'
  changed_password_after_initial_login: boolean
  created_at: string
  updated_at: string
  two_factor_enabled: boolean
  status: string
}

/**
 * Fetches information about the currently authenticated user.
 *
 * @returns The currently authenticated user's information.
 */
export const getMe = async () => {
  const response = await apiClient.get<User>(USERS.ME)
  return response.data
}
