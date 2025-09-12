<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { RouterView, useRouter } from 'vue-router'
import { Toaster } from '@/widgets/ui/sonner'
import 'vue-sonner/style.css'

const store = useAppStore()
const router = useRouter()

store.initTheme()
</script>

<template>
  <RouterView v-slot="{ Component }" :key="$route.fullPath">
    <component :is="Component" />
  </RouterView>
  <Toaster :rich-colors="true" />
</template>
