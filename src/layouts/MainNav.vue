<script setup lang="ts">
import ProjectSelector from '@/components/ProjectSelector.vue';
import { cn } from '@/lib/utils';

const appTitle = import.meta.env.VITE_APP_TITLE || 'Device Manager'
</script>

<template>
    <div class="flex gap-6">
        <ProjectSelector />
        <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
            <router-link to="/devices" class="text-sm font-bold transition-colors hover:text-primary"
                :class="{ 'text-green-500': $route.path === '/devices' }">
                Devices
            </router-link>
            <router-link to="/settings"  class="text-sm font-bold transition-colors hover:text-primary"
                :class="{ 'text-green-500': $route.path === '/settings' }">
                Settings
            </router-link>
            <router-link to="/projects"  class="text-sm font-bold transition-colors hover:text-primary"
                :class="{ 'text-green-500': $route.path === '/projects' }">
                Projects
            </router-link>
            <router-link to="/groups"  class="text-sm font-bold transition-colors hover:text-primary"
                :class="{ 'text-green-500': $route.path === '/groups' }">
                Groups
            </router-link>
        </nav>
    </div>
</template>