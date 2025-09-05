<script setup lang="ts">
import {ref , watch , onMounted, computed} from 'vue'
import { useAppStore } from '@/stores/app'
import { API_ENDPOINT } from '@/config';
import { type Device } from '@/composables/device'
import ImeisInput from '@/components/ImeisInput.vue'
import type { IRequestResponse } from '@/composables/backend';
import SearchBox from '@/components/SearchBox.vue'
import { Skeleton } from '@/widgets/ui/skeleton'
import GroupForm from '@/components/GroupForm.vue'
import { Button } from '@/widgets/ui/button'
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/widgets/ui/table'
// const settingsAttributes = ref<{ key: string; value: any }[]>([]);

const store = useAppStore();
const devices = ref<Device[]>([])
const userImeis = ref<Set<string>>(new Set())
const filterImeis = ref<Set<string>>(new Set())
const keyword = ref<string>("")
const loading = ref<boolean>(false)
const groupOption = ref<(string | null)[]>([])
const editIndex = ref<number | null>(null);
function fetchData() {
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
        // console.log("Fetched devices:", devices.value);
      }
      loading.value = false
    })
}

const addGroup = async () => {
  if (!store.curProject) {
    alert("No project selected");
    return;
  }
  const newGroupId = prompt("Enter new Group ID:");
  if (newGroupId && newGroupId.trim() !== "") {
    const payload = {
      GroupName: newGroupId.trim(),
    };
    const response = await fetch(API_ENDPOINT + '/devices/addMiwiGroup/' + store.curProject, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.success) {
      alert("Group added successfully");
      fetchData();
    } else {
      alert("Failed to add group: " + (result.message || "Unknown error"));
    }
  }
};

const fetchGroupOptions = async () => {
  const url = `${API_ENDPOINT}/devices/groupsList/options`;
  const response = await fetch(url);
  const result = await response.json();
  if (result.success) {
    const item = result.data
    groupOption.value = Array.from(new Set(item.map((d:any) => d.GroupId)))

    // console.log("Fetched group options:", groupOption.value);
  } else {
    alert("Failed to fetch group options: " + (result.message || "Unknown error"));
  
}
}
const showEditForm = (index: number) => {
  return index === editIndex.value;
}

const openEditForm = (index: number) => {
  // toggle edit form for the given index
  if (editIndex.value === index) {
    editIndex.value = null;
  } else {
    editIndex.value = index;
  }
}

watch(() => store.curProject, () => {
  filterImeis.value.clear()
  keyword.value = ''
  devices.value = []
  // console.log(store.curProject)
  fetchData()
})

onMounted(async () => {
  await fetchData();
  console.log("Data fetched successfully", devices.value);
  await fetchGroupOptions();
});



const displayImeis = computed(() => {
  let founds = devices.value
  if (filterImeis.value.size > 0) {
    founds = founds.filter(d => filterImeis.value.has(d.imei))
  } else {
    const search = keyword.value.trim().toLocaleLowerCase();
    if (search !== '') {
      founds = devices.value.filter(d =>
        d.imei.toLocaleLowerCase().includes(search)
      )
    }
  }
  loading.value = false 
  return founds
})


</script>

<template>
  <div>
    <h1>Group Panel</h1>
    <div>
      <div class="flex justify-between mb-2">
        <div class="w-full flex justify-end gap-2">
          <ImeisInput v-if="store.curProject === null" :model-value="Array.from(userImeis)"
            @update:model-value="userImeis = new Set($event); fetchData()" />
          <ImeisInput v-else :model-value="Array.from(filterImeis)" @update:model-value="filterImeis = new Set($event);"
            text="Filter by IMEIs" @clear="filterImeis = new Set()" />
          <SearchBox class="w-[300px]" v-model="keyword" @clear="keyword = ''" />
          <!-- <Button class="bg-blue-500" @click="addGroup()">Add Group</Button> -->
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
        <div v-if="displayImeis.length === 0" class="text-center p-4">No devices found</div>
        
        <table class="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow class="sticky bg-white dark:bg-gray-900 top-0 z-10">
              <TableHead class="w-[160px] border-t border-r border-b-2">
                IMEI
              </TableHead>
              <TableHead class="w-[200px] border-t border-r border-b-2">
                Group ID
              </TableHead>
              <TableHead class="w-[160px] border-t border-r border-b-2">
                Edit Group ID 
              </TableHead>
              <TableHead class="w-[160px] border-t border-r border-b-2" v-if="editIndex !== null">
                Edit Form                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableRow class="w-full" 
          v-for="(item, index) in displayImeis" :key="item.id" >
          
            <TableCell class="border-r">
              {{ item.imei }}
            </TableCell>
            <TableCell class="border-r">
              {{ item.miwi_group_id }}
            </TableCell>
            <TableCell>
              <button class="btn btn-secondary btn-sm" @click="openEditForm(index)">
                <i class="fal fa-edit"></i> Edit
              </button>
            </TableCell>
            <GroupForm :model-value="item" :group-options="groupOption" @update="fetchData" v-if="showEditForm(index) "/>
            <!-- <TableCell v-if="showEditForm(index)" class="border-r">
              
            </TableCell> -->
          </TableRow>
        </table>
      </div>
    </div>
  </div>  
</template>
    
  