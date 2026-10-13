// src/api/__tests__/groupMembers.spec.ts

import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AxiosInstance } from 'axios'

import apiClient from '@/api/client'
import { GROUP_MEMBERS } from '../endpoints'
import { list } from '../modules/groupMembers'
import type { GroupMemberListResult, GroupMemberQueryParams } from '../modules/groupMembers'
import type { GroupMember } from '../modules/groups'

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn<AxiosInstance['get']>(),
  },
}))

const mockGroupMembers: GroupMember[] = [
  {
    id: 1,
    user: {
      id: 1,
      uuid: '7b9f3c21-84d6-4a17-b2e8-51c7d9036f42',
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
    },
    role: 'owner',
    created: '2026-10-01T08:00:00Z',
    updated: '2026-10-01T08:00:00Z',
  },
  {
    id: 2,
    user: {
      id: 2,
      uuid: '8c0a4d32-95e7-4b28-a3f9-62d8e0147a53',
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+254723456789',
    },
    role: 'member',
    created: '2026-10-01T09:00:00Z',
    updated: '2026-10-01T09:00:00Z',
  },
]

const mockGroupMemberList: GroupMemberListResult = {
  count: mockGroupMembers.length,
  next: null,
  previous: null,
  results: mockGroupMembers,
}

describe('groupMembers API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('fetches group members without query parameters', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockGroupMemberList,
      } as never)

      const result = await list()

      expect(apiClient.get).toHaveBeenCalledExactlyOnceWith(
        GROUP_MEMBERS.collectionWithQuery(undefined),
      )
      expect(result).toEqual(mockGroupMemberList)
    })

    it('fetches group members with query parameters', async () => {
      const params: GroupMemberQueryParams = {
        page: 2,
        page_size: 10,
        group: 1,
        role: 'admin',
      }

      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockGroupMemberList,
      } as never)

      const result = await list(params)

      expect(apiClient.get).toHaveBeenCalledExactlyOnceWith(
        GROUP_MEMBERS.collectionWithQuery(params),
      )
      expect(result).toEqual(mockGroupMemberList)
    })

    it('propagates API errors', async () => {
      const error = new Error('Failed to fetch group members')

      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(list()).rejects.toThrow('Failed to fetch group members')
    })
  })
})
