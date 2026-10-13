<template>
  <div class="w-full px-4 py-10">
    <!-- Group Details -->
    <div class="grid gap-6 lg:grid-cols-[28%_72%] mx-auto max-w-6xl">
      <!-- Summary Card -->
      <header class="main-card p-6">
        <div class="flex flex-col items-center justify-center gap-4">
          <div
            class="flex h-32 w-32 lg:w-36 lg:h-36 items-center justify-center rounded-full border-2 card-base"
          >
            <UserGroupIcon class="h-24 w-24 lg:h-28 lg:w-28 primary-text" />
          </div>

          <h2 class="main-heading text-xl lg:text-2xl">
            {{ group.name || 'Group' }}
          </h2>

          <!-- Total Users -->
          <div class="flex secondary-text justify-start w-full" title="Total Users">
            <UserIcon class="secondary-text text-left" />
            <span>
              {{ group.members?.length ?? 0 }}
              {{ group.members?.length === 1 ? 'User' : 'Users' }}
            </span>
          </div>

          <!-- Total SmartPacks -->
          <div class="flex secondary-text justify-start w-full" title="Total SmartPacks">
            <BackPackIcon class="secondary-text text-left" />
            <span>
              {{ group.smartpacks?.length ?? 0 }}
              {{ group.smartpacks?.length === 1 ? 'SmartPack' : 'SmartPacks' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Group Details Card -->
      <section class="main-card grid gap-6 p-6">
        <h3 class="sub-heading text-xl text-left">Details</h3>

        <div
          class="card-base bg-page dark:bg-page-dark grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:text-lg"
        >
          <div>
            <!-- Group Name -->
            <div>
              <dt class="mt-1 primary-text">Group Name</dt>
              <dd class="mt-1 secondary-text break-words">
                {{ group.name }}
              </dd>
            </div>

            <!-- Group Owner -->
            <div>
              <dt class="mt-1 primary-text">Owner</dt>
              <dd class="mt-1 secondary-text break-words">
                {{ owner?.user.full_name || 'No owner assigned' }}
              </dd>
            </div>
          </div>

          <div>
            <!-- Created -->
            <div>
              <dt class="mt-1 primary-text">Created</dt>
              <dd class="mt-1 secondary-text">
                {{ group.created ? $filters.dateTime(group.created) : '—' }}
              </dd>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Group Assets -->
    <GroupAssets
      v-if="group.id"
      class="mt-8"
      :group-id="group.id"
      :group-name="group.name"
      :refresh-key="group.updated"
    />
  </div>
</template>

<script lang="ts">
/**
 * @module views/Groups/details
 * @description Displays read-only group metadata and its associated assets,
 * including members and SmartPacks.
 */
import { defineComponent } from 'vue'
import type { GroupDetail } from '@/api/modules/groups'
import type { ItemNotFoundError } from '@/api/types'
import UserGroupIcon from '@/components/Icons/UserGroupIcon.vue'
import UserIcon from '@/components/Icons/UserIcon.vue'
import BackPackIcon from '@/components/Icons/BackPackIcon.vue'
import GroupAssets from '@/components/Groups/Assets.vue'

export default defineComponent({
  name: 'GroupDetails',

  components: {
    UserGroupIcon,
    UserIcon,
    BackPackIcon,
    GroupAssets,
  },

  data() {
    return {
      group: {} as GroupDetail,
    }
  },

  computed: {
    groupId(): { id: string } {
      const id = this.$route.params.id

      return {
        id: typeof id === 'string' ? id : '',
      }
    },

    owner() {
      return this.group.members?.find((member) => member.role === 'owner')
    },
  },

  /**
   * Fetches the group details when the component is mounted.
   */
  async mounted() {
    await this.getGroup()
  },

  methods: {
    /**
     * Fetches the details for a single group using its route parameter ID.
     */
    async getGroup(): Promise<void> {
      try {
        this.group = await this.$api.groups.getById(this.groupId)
      } catch (error) {
        const itemError = error as ItemNotFoundError

        this.$notifyError(itemError.message)

        if (itemError.reload) {
          this.$router.push({ name: 'groups' })
        }
      }
    },
  },
})
</script>

<style scoped></style>
