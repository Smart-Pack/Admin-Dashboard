import type { Api } from '@/api/types'

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: Api
  }
}
