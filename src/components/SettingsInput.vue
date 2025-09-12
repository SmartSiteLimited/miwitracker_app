<script lang="ts" setup>
import { API_ENDPOINT } from '@/config'
import { useAppStore } from '@/stores/app'
import { Button } from '@/widgets/ui/button'
import { ref, watch } from 'vue'
import Icon from './Icon.vue'
import { toast } from 'vue-sonner'
import { Select, SelectLabel, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/widgets/ui/select'
import { Input } from '@/widgets/ui/input'

interface Attribute {
  key: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: Attribute[]
  }>(),
  {
    modelValue: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Attribute[]): void
}>()

const store = useAppStore()

const attrOptions = ref<string[]>(["call_center_number", "phone_number"]);
const entries = ref<Attribute[]>(JSON.parse(JSON.stringify(props.modelValue ?? [])))

watch(
  () => props.modelValue,
  (newVal) => {
    entries.value = JSON.parse(JSON.stringify(newVal ?? []))
  },
  { deep: true }
)

function addRow() {
  entries.value.push({ key: '', value: '' })
  emitUpdate()
}

function deleteRow(index: number) {
  entries.value.splice(index, 1)
  emitUpdate()
}

function updateKey(index: number, value: string) {
  entries.value[index].key = value.trim().replace(/\s*,\s*/g, ',')
  emitUpdate()
}

function updateValue(index: number, value: string) {
  entries.value[index].value = value
  emitUpdate()
}

function emitUpdate() {
  // deep clone to avoid proxy leaks
  emit('update:modelValue', JSON.parse(JSON.stringify(entries.value)))
}


async function saveConfig() {
  if (!store.curProject) {
    alert('No project selected')
    return
  }

  const payload = {
    attributes: entries.value,
    project: store.curProject,
  }

  try {
    const res = await fetch(`${API_ENDPOINT}/settings/saveConfig`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const response = await res.json()
    if (response.success && response.data) {
      toast.success('Settings saved successfully')
    } else {
      toast.error('Error saving settings: ' + (response.message || 'Unknown error'))
    }
  } catch (err) {
    console.error('Save error', err)
    toast.error('Error saving settings: ' + ((err as Error).message || 'Unknown error'))
  }
}
</script>

<template>
  <div>
    <div class="justify-between flex mb-2">
      <Button type="button" variant="outline" @click="addRow">
        <Icon name="Plus" /> Add
      </Button>
      <Button type="button" variant="outline" @click="saveConfig">
        <Icon name="Save" /> Save Changes
      </Button>
    </div>

    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-2 py-1 w-[250px]">Key</th>
            <th class="px-2 py-1">Value</th>
            <th class="px-2 py-1 w-[50px]">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}-${entry.key || ''}`">
            <td class="px-2 py-1">
              <Select v-if="attrOptions && attrOptions.length > 0" @change="updateKey(index, $event)"
                :model-value="entry.key">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="- Setting -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="option in attrOptions" :key="option" :value="option">{{ option }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input v-else type="text" :value="entry.key" @change="updateKey(index, $event)" />
            </td>
            <td class="px-2 py-1">
              <Input type="text" :value="entry.value" @change="updateValue(index, $event)" />
            </td>
            <td class="px-2 py-1">
              <Button type="button" variant="ghost" class="text-red-500" @click="() => deleteRow(index)">
                <Icon name="Trash2" />
              </Button>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">No attributes. Use + to add.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
