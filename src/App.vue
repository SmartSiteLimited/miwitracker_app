<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { RouterView, useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

store.initTheme()
</script>

<template>
  <RouterView v-slot="{ Component }" :key="$route.fullPath">
    <component :is="Component" />
  </RouterView>
  <!-- <Toaster /> -->
</template>
