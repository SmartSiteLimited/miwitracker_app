<script setup lang="ts">
import DeviceTaskMenu from '@/components/DeviceTaskMenu.vue'
import DeviceTaskResult from '@/components/DeviceTaskResult.vue'
import Icon from '@/components/Icon.vue'
import ImeisInput from '@/components/ImeisInput.vue'
import SearchBox from '@/components/SearchBox.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { IRequestResponse } from '@/composables/backend'
import { type Device } from '@/composables/device'
import { API_ENDPOINT } from '@/config'
import { useAppStore } from '@/stores/app'
import { useDeviceTaskStore } from '@/stores/devicetask'
import { Checkbox } from '@/widgets/ui/checkbox'
import { Skeleton } from '@/widgets/ui/skeleton'
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/widgets/ui/table'
import { computed, onMounted, ref, watch } from 'vue'


const store = useAppStore()

const taskStores = [
  useDeviceTaskStore('0'),
  useDeviceTaskStore('1'),
  useDeviceTaskStore('2'),
]
const devices = ref<Device[]>([])
const userImeis = ref<Set<string>>(new Set())
const checkImeis = ref<Set<string>>(new Set())
const filterImeis = ref<Set<string>>(new Set())
const filterTaskImeis = ref<Map<string, string[]>>(new Map())
const loading = ref(false)
const keyword = ref('')
const displayImeis = computed(() => {
  let founds = devices.value
  if (filterImeis.value.size > 0) {
    founds = devices.value.filter(device => filterImeis.value.has(device.imei))
  } else {
    const search = keyword.value.trim().toLowerCase()
    if (search !== '') {
      founds = devices.value.filter(device =>
        device.imei.toLowerCase().includes(search) ||
        device.iccid?.toLowerCase().includes(search) ||
        device.phone_number?.toLowerCase().includes(search)
      )
    }
  }

  for (let [_, imeis] of filterTaskImeis.value.entries()) {
    founds = founds.filter(device => imeis.includes(device.imei))
  }

  return founds
})


async function fetchData() {
  loading.value = true
  let url = `${API_ENDPOINT}/devices/` + (store.curProject || '')
  let options: RequestInit = {}

  if (store.curProject === null) {
    options.method = "POST"
    options.headers = {
      "Content-Type": "application/json"
    }
    options.body = JSON.stringify({
      filters: {
        imeis: Array.from(userImeis.value)
      }
    })
  }

  fetch(url, options)
    .then(response => response.json())
    .then((res: IRequestResponse<Device[]>) => {
      if (res.success) {
        devices.value = res.data || []
      }
      loading.value = false
    })
}

// Use Set for fast lookup and deduplication
function checkAll(checked: boolean) {
  if (checked) {
    checkImeis.value = new Set(displayImeis.value.map(device => device.imei))
  } else {
    checkImeis.value = new Set()
  }
}

function toggleCheck(imei: string, checked: boolean) {
  if (checked) {
    checkImeis.value.add(imei)
  } else {
    checkImeis.value.delete(imei)
  }
  // Trigger reactivity by creating a new Set only when needed
  checkImeis.value = new Set(checkImeis.value)
}

async function executeTask(storeId: number, taskName: string) {
  const taskStore = taskStores[storeId]
  if (taskStore) {
    await taskStore.startTask(taskName, Array.from(checkImeis.value))
  }
}

function updateFilterResult(storeId: number, result: number) {
  const taskStore = taskStores[storeId]
  if (taskStore) {
    if (result === -1) {
      filterTaskImeis.value.delete(taskStore.taskName)
    } else {
      const imeis = Array.from(taskStore.result.entries())
        .filter(([_, res]) => {
          if (result === 0) return res === null
          if (result === 1) return res === true
          if (result === 2) return res === false
          return false
        })
        .map(([imei, _]) => imei)
      filterTaskImeis.value.set(taskStore.taskName, imeis)
    }
    // Trigger reactivity by creating a new Map
    filterTaskImeis.value = new Map(filterTaskImeis.value)
  }
}

async function fetchNewDevices(storeProject: string | null, signal?: AbortSignal) {
  if (storeProject === null) return;

  let url = `${API_ENDPOINT}/devices/fetchNewDevices/` + (store.curProject || '')
  try {
    const resp = await fetch(url, {
      signal,
      headers: {
        "Content-Type": "application/json"
      }
    })

    const response = await resp.json();
    if (response && response.success) {
      fetchData();
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was cancelled')
    } else {
      console.error("Error fetching IMEIs:", error);
    }
  }
}

async function updateGroupId(storeProject: string | null, signal?: AbortSignal) {
  if (storeProject === null) return;

  try {
    const res = await fetch(API_ENDPOINT + `/devices/addupdateGroupId/${storeProject}`, {
      method: "GET",
      signal,
      headers: {
        "Content-Type": "application/json"
      }
    })

    const response = await res.json();
    if (response.success) {
      fetchData();
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was cancelled')
    } else {
      console.error("Error updating Group IDs:", error);
    }
  }
}

watch(keyword, () => {
  checkImeis.value.clear()
})

watch(() => store.curProject, () => {
  checkImeis.value.clear()
  filterImeis.value.clear()
  filterTaskImeis.value.clear()
  keyword.value = ''
  devices.value = []
  // console.log(store.curProject)
  fetchData()
})

watch(() => displayImeis.value, () => {
  checkImeis.value.clear()
})

onMounted(async () => {
  await fetchData()

})
</script>

<template>
  <div>
    <div>
      <div class="flex justify-end mb-2">
        <div class="w-full flex justify-start gap-2">
          <SearchBox class="w-[300px]" v-model="keyword" @clear="keyword = ''" />
          <ImeisInput v-if="store.curProject === null" :model-value="Array.from(userImeis)"
            @update:model-value="userImeis = new Set($event); fetchData()" />
          <ImeisInput v-else :model-value="Array.from(filterImeis)" @update:model-value="filterImeis = new Set($event);"
            text="Filter by IMEIs" @clear="filterImeis = new Set()" />

          <div class="flex-grow"></div>

          <TaskButton v-if="store.curProject !== null" variant="outline"
            :promise-func="(signal) => updateGroupId(store.curProject, signal)">
            <Icon name="CardSim" />
            Update ICCID / Group
          </TaskButton>

          <TaskButton v-if="store.curProject !== null" variant="outline"
            :promise-func="(signal) => fetchNewDevices(store.curProject, signal)">
            <Icon name="CloudDownload" />
            Fetch New Devices
          </TaskButton>
        </div>
      </div>

      <div class="flex justify-between text-sm mb-2">
        <div></div>
        <div><strong>{{ displayImeis.length }}</strong> / {{ devices.length }} devices</div>
      </div>

      <div v-if="loading">
        <Skeleton class="h-8 my-2 w-full" v-for="i in 15" :key="i" />
      </div>
      <div v-else data-slot="table-container" class="relative w-full">
        <table class="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow class="sticky bg-white dark:bg-gray-900 top-0 z-10">
              <TableHead class="w-[50px] text-center border border-b-2">
                <Checkbox class="border-gray-400 dark:border-gray-500"
                  @update:model-value="checkAll($event ? true : false)" />
              </TableHead>
              <TableHead class="w-[160px] border-t border-r border-b-2">
                IMEI
              </TableHead>
              <TableHead class="w-[200px] border-t border-r border-b-2">
                ICCID No.
              </TableHead>
              <TableHead class="bg-gray-50 dark:bg-gray-900 border-t border-r border-b-2">
                <DeviceTaskMenu :check-imeis="checkImeis" @execute="executeTask(0, $event)"
                  @update:filter-result="updateFilterResult(0, $event)" />
              </TableHead>
              <TableHead class="bg-gray-50 dark:bg-gray-900 border-t border-r border-b-2">
                <DeviceTaskMenu :check-imeis="checkImeis" @execute="executeTask(1, $event)"
                  @update:filter-result="updateFilterResult(1, $event)" />
              </TableHead>
              <TableHead class="bg-gray-50 dark:bg-gray-900 border-t border-r border-b-2">
                <DeviceTaskMenu :check-imeis="checkImeis" @execute="executeTask(2, $event)"
                  @update:filter-result="updateFilterResult(2, $event)" />
              </TableHead>
              <TableHead class="w-[100px] border-t border-r border-b-2">
                Group ID
              </TableHead>
              <TableHead class="w-[160px] border-t border-r border-b-2">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableRow class="w-full" v-for="item in displayImeis" :key="item.id">
            <TableCell class="border-r border-l text-center">
              <Checkbox class="border-gray-400 dark:border-gray-500" :value="item.id.toString()"
                :model-value="checkImeis.has(item.imei)"
                @update:model-value="toggleCheck(item.imei, $event ? true : false)" />
            </TableCell>
            <TableCell class="border-r">
              {{ item.imei }}
            </TableCell>
            <TableCell class="border-r">
              {{ item.iccid }}
            </TableCell>
            <TableCell class="border-r bg-gray-50 dark:bg-gray-900">
              <DeviceTaskResult v-if="taskStores[0].status.has(item.imei)" :task-name="taskStores[0].taskName"
                :status="taskStores[0].status.get(item.imei)" :result="taskStores[0].result.get(item.imei)" />
            </TableCell>
            <TableCell class="border-r bg-gray-50 dark:bg-gray-900">
              <DeviceTaskResult v-if="taskStores[1].status.has(item.imei)" :task-name="taskStores[1].taskName"
                :status="taskStores[1].status.get(item.imei)" :result="taskStores[1].result.get(item.imei)" />
            </TableCell>
            <TableCell class="border-r bg-gray-50 dark:bg-gray-900">
              <DeviceTaskResult v-if="taskStores[2].status.has(item.imei)" :task-name="taskStores[2].taskName"
                :status="taskStores[2].status.get(item.imei)" :result="taskStores[2].result.get(item.imei)" />
            </TableCell>
            <TableCell class="border-r">
              {{ item.miwi_group_id }}
            </TableCell>
            <TableCell class="border-r">
              {{ item.updated }}
            </TableCell>
          </TableRow>
        </table>

        <div v-if="store.curProject === null && devices.length === 0" class="p-4 flex flex-col space-y-3 text-center max-w-md mx-auto">
          <span>Select a project first</span>
           <span class="text-gray-700 dark:text-gray-400">or</span>
          <ImeisInput v-if="store.curProject === null" :model-value="Array.from(userImeis)"
            @update:model-value="userImeis = new Set($event); fetchData()" />
        </div>
      </div>
    </div>
  </div>
</template>