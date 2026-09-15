import { h } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const Placeholder = {
  render: () => h('h1', 'You did it!'),
}

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: Placeholder,
  },
]

export default routes
