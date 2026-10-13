import apiClient from '@/api/client'
import { GROUP_MEMBERS } from '../endpoints'
import type { PaginatedResponse, PaginationQueryParams } from '@/api/types'
import type { GroupMember } from './groups'

export type GroupMemberListResult = PaginatedResponse<GroupMember>

export interface GroupMemberQueryParams extends PaginationQueryParams {
  group?: number
  has_admin_access?: boolean
  role?: 'owner' | 'admin' | 'member'
}

/**
 * Fetches a paginated list of group members.
 *
 * @param params - Optional query parameters for filtering and pagination.
 * @param params.group - Filter members by group ID.
 * @param params.role - Filter members by group role.
 * @returns A promise resolving with the paginated list of group members.
 */
export const list = async (params?: GroupMemberQueryParams): Promise<GroupMemberListResult> => {
  const url = GROUP_MEMBERS.collectionWithQuery(params)
  const response = await apiClient.get<GroupMemberListResult>(url)

  return response.data
}
