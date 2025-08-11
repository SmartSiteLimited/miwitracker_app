<script setup lang="ts">
import * as icons from 'lucide-vue-next';
import { computed } from 'vue';

type IconsType = Record<string, any>

const props = withDefaults(defineProps<{
  name: string,
  size?: number,
  color?: string,
  strokeWidth?: number,
  defaultClass?: string
}>(), {
  strokeWidth: 1.5
})

const icon = computed(() => (icons as IconsType)[props.name])
</script>

<template>
  <component
    :is="icon"
    :size="props.size"
    :color="props.color"
    :stroke-width="props.strokeWidth"
    :class="props.defaultClass"></component>
</template>
