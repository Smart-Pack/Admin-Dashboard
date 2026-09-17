import { defineStore } from 'pinia'

export interface Breadcrumb {
  name: string
  breadcrumb: string
}

/**
 * UI state store.
 *
 * Manages global UI state such as SweetAlert2 backdrop visibility
 * and the current light/dark theme state.
 */
export const useUiStore = defineStore('ui', {
  state: () => ({
    /**
     * Controls the visibility of the global SweetAlert2 backdrop.
     */
    swalBackdrop: false,

    /**
     * Tracks whether light mode is currently active.
     */
    isLightMode: window.matchMedia('(prefers-color-scheme: light)').matches,
    /**
     * Stores the breadcrumb entries for the current dashboard route.
     *
     * Each entry contains the route name and the label displayed in the
     * breadcrumb navigation.
     */
    breadcrumbs: [] as Breadcrumb[],
  }),

  getters: {
    /**
     * Get the current SweetAlert2 backdrop visibility state.
     */
    getSwalBackdrop: (state) => state.swalBackdrop,

    /**
     * Get the current light/dark mode state.
     */
    getIsLightMode: (state) => state.isLightMode,
  },

  actions: {
    /**
     * Update the SweetAlert2 backdrop visibility state.
     */
    updateSwalBackdrop(value: boolean) {
      this.swalBackdrop = value
    },

    /**
     * Update the current light/dark mode state.
     */
    updateIsLightMode(value: boolean) {
      this.isLightMode = value
    },
    /**
     * Update the current dashboard breadcrumb entries.
     */
    updateBreadcrumbs(value: Breadcrumb[]) {
      this.breadcrumbs = value
    },
  },
})

export type UiStore = ReturnType<typeof useUiStore>
