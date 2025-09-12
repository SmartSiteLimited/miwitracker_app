<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import MainNav from './MainNav.vue';
import Icon from '@/components/Icon.vue';
import { Button } from '@/widgets/ui/button';

const store = useAppStore();
</script>

<template>
  <div class="hidden flex-col md:flex">
    <div class="border-b">
      <div class="flex h-16 items-center px-8">
        <MainNav />
        <div class="ml-auto flex items-center space-x-4">
          <Button variant="outline" class="border-0 p-[6px] ml-2" @click="store.toggleTheme()">
            <Icon :name="store.isDark ? 'Sun' : 'MoonStar'" />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex-1 space-y-4 p-8 pt-6">

      <RouterView v-slot="{ Component }">
        <main class="pb-10">
          <transition name="fade" mode="out-in">
            <component :is="Component"></component>
          </transition>
        </main>
      </RouterView>
    </div>
  </div>
</template>