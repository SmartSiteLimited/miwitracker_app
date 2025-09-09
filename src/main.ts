import '@/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions } from "vue-toastification";
import App from './App.vue'
import "vue-toastification/dist/index.css";
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  // You can set your default options here
  position: "bottom-right",
  timeout: 3000,
} as PluginOptions)

app.mount('#app')
