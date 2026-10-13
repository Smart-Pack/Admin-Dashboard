import apiClient from '@/api/client'
import { GROUPS } from '../endpoints'
import type { ItemNotFoundError, PaginatedResponse, PaginationQueryParams } from '@/api/types'

export interface Group {
  id: number
  name: string
  total_users: number
  total_smartpacks: number
  created: string
  updated: string
}

export interface GroupMemberUser {
  id: number
  uuid: string
  full_name: string
  email: string
  phone: string
}

export interface GroupMember {
  id: number
  user: GroupMemberUser
  role: 'owner' | 'admin' | 'member'
  created: string
  updated: string
}

export interface GroupSmartPack {
  id: number
  device_uid: string
  hardware_model: string
  child_name: string
}

export interface GroupDetail {
  id: number
  name: string
  members: GroupMember[]
  smartpacks: GroupSmartPack[]
  created: string
  updated: string
}

export type GroupListResult = PaginatedResponse<Group>

export interface GroupQueryParams extends PaginationQueryParams {
  member?: number
  owner?: number
  role?: 'owner' | 'admin' | 'member'
  has_admin_access?: boolean
}

/**
 * Fetches a paginated list of groups available to the authenticated user.
 *
 * Customers can view groups where they are members, while internal admins
 * can view all groups.
 *
 * @param params - Optional query parameters for filtering and pagination.
 * @returns A promise resolving with the paginated list of groups.
 */
export const list = async (params?: GroupQueryParams): Promise<GroupListResult> => {
  const url = GROUPS.collectionWithQuery(params)
  const response = await apiClient.get<GroupListResult>(url)

  return response.data
}

/**
 * Fetches a single group by its ID.
 *
 * @param id - The ID of the group to fetch.
 * @returns A promise resolving with the requested group and its members and SmartPacks.
 * @throws The error is re-thrown after annotating a 404 response.
 */
export const getById = async ({ id }: { id: string | number }): Promise<GroupDetail> => {
  try {
    const response = await apiClient.get<GroupDetail>(GROUPS.detail(id))
    return response.data
  } catch (error) {
    const axiosError = error as ItemNotFoundError

    if (axiosError.response?.status === 404) {
      axiosError.message = `Group with ID ${id} not found. It may have been deleted.`
      axiosError.reload = true
    }

    throw axiosError
  }
}
