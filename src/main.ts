import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-tel-input/dist/vue-tel-input.css'
import './assets/css/main.css'

import App from './App.vue'
import api from './api'
import { setupValidation } from './helpers/validation'
import router from './router'
import VueTelInput from 'vue-tel-input'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueTelInput)
setupValidation()
/**
 * Registers the centralized API layer as a global property
 * so components can access it through `this.$api.*`.
 */
app.config.globalProperties.$api = api
app.mount('#app')
