<script setup lang="ts">
import { Badge } from '@/widgets/ui/badge';
import { Button } from '@/widgets/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/widgets/ui/dialog';
import { Textarea } from '@/widgets/ui/textarea';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: Array<string>,
    text?: string
  }>(),
  {
    text: "Enter IMEIs"
  })
const emits = defineEmits<{
  'update:modelValue': [value: Array<string>],
  'clear': [],
}>()
const modalOpened = ref(false)

const inputImeis = ref<Array<string>>(props.modelValue || [])
const onInputUpdated = (value: string) => {
  const imeis = value.split('\n').map(i => i.trim()).filter(i => i !== '')
  inputImeis.value = imeis
}
</script>

<template>
  <div class="relative">
    <Dialog v-model:open="modalOpened">
      <DialogTrigger as-child>
        <Button variant="outline">
          {{ props.text }} <Badge v-if="props.modelValue.length > 0" class="ml-2">{{ props.modelValue.length }}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ props.text }}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter IMEIs to filter, one per line.
        </DialogDescription>
        <div class="grid gap-4 py-4">
          <Textarea :model-value="props.modelValue.join('\n')" @update:model-value="onInputUpdated($event.toString())"
            class="h-[300px]" />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost"
            @click="onInputUpdated(''); emits('update:modelValue', inputImeis); modalOpened = false">
            Clear
          </Button>
          <Button type="button" @click="emits('update:modelValue', inputImeis); modalOpened = false">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
