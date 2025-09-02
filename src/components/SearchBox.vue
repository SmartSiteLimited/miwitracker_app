<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import { Button } from '@/widgets/ui/button';
import { Input } from '@/widgets/ui/input';
import type { HTMLAttributes } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string,
  placeholder?: string
} & { class?: HTMLAttributes['class'] }>(), {
  placeholder: 'Search...'
})
const emits = defineEmits<{
  'update:modelValue': [value: string],
  'clear': [],
}>()
</script>

<template>
  <div class="relative items-center">
    <Input
      type="text"
      :class="props.class"
      :model-value="props.modelValue"
      @update:model-value="emits('update:modelValue', $event.toString())"
      :placeholder="placeholder"
      class="pl-10" />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
      <Icon name="Search" :size="16" class="text-muted-foreground" />
    </span>

    <Button
      variant="ghost"
      type="button"
      @click="emits('clear')"
      v-if="props.modelValue && props.modelValue !== ''"
      class="absolute right-0 inset-y-0 flex items-center justify-center px-3">
      <Icon name="X" :size="16" class="text-muted-foreground" />
    </Button>
  </div>
</template>
