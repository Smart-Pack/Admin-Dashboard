import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import api from './api'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
/**
 * Registers the centralized API layer as a global property
 * so components can access it through `this.$api.*`.
 */
app.config.globalProperties.$api = api
app.mount('#app')
