import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import App from '@/App.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/mikitracker',
      name: 'mikitracker',
      component: Index
    }
  ]
})

