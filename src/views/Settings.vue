<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { API_ENDPOINT } from '@/config'
import { useAppStore } from '@/stores/app'
import { Button } from '@/widgets/ui/button'
import { Input } from '@/widgets/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/widgets/ui/select'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/widgets/ui/table'
import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue-sonner'


const entries = ref<{ key: string; value: string }[]>([]);

const store = useAppStore();

const attrOptions = ref<Record<string, string>>({
  "sos_phone_number": "SOS Phone Number",
  "call_center_number": "Call Center Number",
})

function addRow() {
  entries.value.push({ key: '', value: '' })
}

function deleteRow(index: number) {
  entries.value.splice(index, 1)
}

const fetchSettings = async () => {
  if (!store.curProject) {
    return;
  }

  try {
    const res = await fetch(API_ENDPOINT + `/settings/${store.curProject}`);
    const response = await res.json();
    if (response.success && response.data) {
      entries.value = Object.entries(response.data).map(([key, val]) => ({
        key,
        value: Array.isArray(val) ? val.join(',') : String(val ?? '')  // Join without spaces
      }));
    } else {
      entries.value = [];
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};


async function saveConfig() {
  if (!store.curProject) {
    return
  }

  const payload = {
    project: store.curProject,
    attributes: entries.value,
  }

  try {
    const res = await fetch(`${API_ENDPOINT}/settings/saveConfig`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const response = await res.json()
    if (response.success) {
      toast.success('Settings saved successfully')
    } else {
      toast.error('Error saving settings: ' + (response.message || 'Unknown error'))
    }
  } catch (err) {
    console.error('Save error', err)
    toast.error('Error saving settings: ' + ((err as Error).message || 'Unknown error'))
  }
}

watch(() => store.curProject, () => {
  fetchSettings();
});

onMounted(() => {
  fetchSettings();
});

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
      <Table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHeader class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableRow>
            <TableHead class="px-2 py-1 w-[250px]">Key</TableHead>
            <TableHead class="px-2 py-1">Value</TableHead>
            <TableHead class="px-2 py-1 w-[50px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(entry, index) in entries" :key="`row-${index}`">
            <TableCell class="px-2 py-1">
              <Select v-if="attrOptions && Object.keys(attrOptions).length > 0" v-model="entry.key">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="- Setting -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="(label, value) in attrOptions" :key="value" :value="value">{{ label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input v-else type="text" v-model="entry.key" />
            </TableCell>
            <TableCell class="px-2 py-1">
              <Input type="text" v-model="entry.value" />
            </TableCell>
            <TableCell class="px-2 py-1">
              <Button type="button" variant="ghost" class="text-red-500" @click="() => deleteRow(index)">
                <Icon name="Trash2" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="entries.length === 0">
            <TableCell class="px-2 py-4 text-center" colspan="3">No attributes. Use + to add.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
