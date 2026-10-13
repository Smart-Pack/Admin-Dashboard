<template>
  <div class="main-card w-full">
    <header class="flex gap-3 items-center justify-between p-4">
      <h3 class="sub-heading text-xl text-left">Assets</h3>

      <!-- Show Groups -->
      <button
        v-if="activePage === 'smartpacks'"
        type="button"
        class="px-4 py-2 rounded-full text-sm font-semibold form-submit"
        @click="activePage = 'groups'"
      >
        Show Groups
      </button>

      <!-- Show SmartPacks -->
      <button
        v-else
        type="button"
        class="px-4 py-2 rounded-full text-sm font-semibold form-submit"
        @click="activePage = 'smartpacks'"
      >
        Show SmartPacks
      </button>
    </header>

    <!-- User's SmartPacks -->
    <TablePageLayout
      v-if="activePage === 'smartpacks' && userId !== 0"
      :getter="$api.smartpacks.list"
      :page-description="smartPacksDescription"
      :tabs="smartPackTabs"
      name="SmartPacks"
      :item-headings="smartPackHeadings"
      :enable-search="true"
      nav-class="grid-cols-1 lg:text-base"
    />

    <!-- User's Groups -->
    <TablePageLayout
      v-else-if="activePage === 'groups' && userId !== 0"
      :getter="$api.groups.list"
      page-description="Groups associated with this user, including group ownership, membership, and assigned SmartPacks."
      :tabs="groupTabs"
      name="Groups"
      :item-headings="groupHeadings"
      :enable-search="true"
      nav-class="grid-cols-3 lg:text-base"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * @module components/Users/UserAssets
 * @description Displays a user's SmartPacks and groups, allowing internal admins
 * to switch between the two tables.
 */
import { computed, ref } from 'vue'

import TablePageLayout from '@/components/Base/TablePageLayout.vue'
import type { GroupQueryParams } from '@/api/modules/groups'
import type { SmartPackAssignedUser, SmartPackQueryParams } from '@/api/modules/smartpacks'
import Filters from '@/helpers/filters'

defineOptions({
  name: 'UserAssets',
})

const props = withDefaults(
  defineProps<{
    userId: number
    userName: string
  }>(),
  {
    userId: 0,
    userName: '',
  },
)

const activePage = ref<'smartpacks' | 'groups'>('smartpacks')

const smartPacksDescription = computed(
  () => `SmartPacks assigned to ${props.userName}, with their connectivity and firmware details.`,
)

/**
 * SmartPack table tabs.
 *
 * Each tab filters SmartPacks by the current user's ID.
 */
const smartPackTabs = computed<
  Array<{
    id: string
    caption: string
    label: string
    params: SmartPackQueryParams
  }>
>(() => [
  {
    id: 'all',
    caption: 'All SmartPacks',
    label: 'All',
    params: { assigned_to: props.userId },
  },
])

/**
 * Group table tabs.
 *
 * Each tab includes the current user's ID in the `member` parameter
 * so the results are scoped to the selected user's groups.
 *
 * - All: All groups the user belongs to.
 * - Admin: Groups where the user is an owner or administrator.
 * - Member: Groups where the user has the regular member role.
 */
const groupTabs = computed<
  Array<{
    id: string
    caption: string
    label: string
    params: GroupQueryParams
  }>
>(() => [
  {
    id: 'all',
    caption: 'All Groups',
    label: 'All',
    params: {
      member: props.userId,
    },
  },
  {
    id: 'owner',
    caption: 'Groups Owned by User',
    label: 'Owner',
    params: {
      member: props.userId,
      role: 'owner',
    },
  },
  {
    id: 'member',
    caption: 'Groups Where User Is a Member',
    label: 'Member',
    params: {
      member: props.userId,
      role: 'member',
    },
  },
])

/**
 * SmartPack table column configuration.
 */
const smartPackHeadings = [
  {
    key: 'imei',
    label: 'IMEI',
    sortable: true,
  },
  {
    key: 'hardware_model',
    label: 'Hardware Model',
    sortable: true,
    dataClass: 'primary-text font-bold',
  },
  {
    key: 'firmware_version',
    label: 'Firmware',
    sortable: true,
  },
  {
    key: 'is_online',
    label: 'Status',
    sortable: true,
    formatter: (value: unknown) => (value ? 'Online' : 'Offline'),
    dataClass: {
      fmt: (value: unknown) => Filters.activeClass(Boolean(value)),
    },
  },
  {
    key: 'assigned_to',
    label: 'Assigned To',
    sortable: true,
    formatter: (value: unknown) => {
      const assignedUser = value as SmartPackAssignedUser | null

      return assignedUser ? assignedUser.full_name : 'Unassigned'
    },
  },
  {
    key: 'created',
    label: 'Added',
    sortable: true,
    formatter: (value: unknown) => Filters.dateTime(value as string | null | undefined),
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    action: {
      name: 'View',
      route: 'smartpack-details',
    },
  },
]

/**
 * Group table column configuration.
 */
const groupHeadings = [
  {
    key: 'name',
    label: 'Group Name',
    sortable: true,
    dataClass: 'primary-text font-bold',
  },
  {
    key: 'total_users',
    label: 'Total Users',
    sortable: true,
  },
  {
    key: 'total_smartpacks',
    label: 'Total SmartPacks',
    sortable: true,
  },
  {
    key: 'created',
    label: 'Created',
    sortable: true,
    formatter: (value: unknown) => Filters.dateTime(value as string | null | undefined),
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    action: {
      name: 'View',
      route: 'group-details',
    },
  },
]
</script>
