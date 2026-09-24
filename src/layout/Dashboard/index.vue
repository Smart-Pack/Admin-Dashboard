<template>
  <div
    class="w-full min-h-screen relative flex flex-col bg-page-light dark:bg-auth-gradient-dark font-sans lg:flex-row"
  >
    <!-- Backdrop for notification -->
    <div
      v-if="uiStore.swalBackdrop"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1040]"
      aria-hidden="true"
    ></div>

    <!-- Navbar -->
    <TopBar />

    <div
      class="relative w-full min-h-[calc(100vh-3rem)] mt-12 lg:flex lg:mt-16 lg:min-h-[calc(100vh-4rem)]"
    >
      <!-- Backdrop for Side Nav on mobile -->
      <div
        v-if="uiStore.isSideNavOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden"
        aria-hidden="true"
      ></div>

      <!-- Side Navigation -->
      <SideNav />

      <!-- Main Content -->
      <main
        class="overflow-y-auto flex flex-col gap-4 flex-1 h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] p-4 lg:p-10 bg-page dark:bg-auth-gradient-dark"
      >
        <ContentHeader />

        <div class="w-full">
          <router-view />
        </div>

        <ContentFooter />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

import ContentFooter from './ContentFooter.vue'
import ContentHeader from './ContentHeader.vue'
import TopBar from './TopBar.vue'
import SideNav from './SideNav.vue'
import { useUiStore } from '@/stores'

/**
 * Main dashboard layout for authenticated users.
 *
 * Coordinates the dashboard navigation, side navigation, content header,
 * routed page content, footer, notification backdrop, and chatbot.
 */
defineOptions({
  name: 'DashboardLayout',
})

const uiStore = useUiStore()

/**
 * Synchronizes the document theme with the active UI theme.
 *
 * @param isLightMode - Whether light mode is currently active.
 */
function syncTheme(isLightMode: boolean): void {
  document.documentElement.classList.toggle('dark', !isLightMode)
}

/**
 * Initializes the dashboard UI state after the layout is mounted.
 *
 * Resets the notification backdrop and side navigation state, then
 * synchronizes the document theme with the current UI store state.
 */
onMounted(() => {
  uiStore.updateSwalBackdrop(false)
  uiStore.updateIsSideNavOpen(false)

  syncTheme(uiStore.isLightMode)
})

/**
 * Keeps the document theme synchronized with changes to the UI store.
 */
watch(
  () => uiStore.isLightMode,
  (isLightMode) => {
    syncTheme(isLightMode)
  },
)
</script>

<style scoped></style>
