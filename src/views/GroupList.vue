<script setup lang="ts">
import {ref , watch , onMounted, computed} from 'vue'
import { useAppStore } from '@/stores/app'
import { API_ENDPOINT } from '@/config';
import { type Device } from '@/composables/device'
import GroupForm from '@/components/GroupForm.vue'
import type { IRequestResponse } from '@/composables/backend';

// const settingsAttributes = ref<{ key: string; value: any }[]>([]);

const store = useAppStore();
const groupObjectList = ref<any[]>([])

function fetchData() {
  let url = `${API_ENDPOINT}/devices/groupList/list`
  let options: RequestInit = {}

  
    options.method = "GET"
    options.headers = {
      "Content-Type": "application/json"
    }

  fetch(url, options)
    .then(response => response.json())
    .then((res: IRequestResponse<Device[]>) => {
      if (res.success) {
        groupObjectList.value = res.data || []
        // console.log("Fetched devices:", devices.value);
      }
    })
}

onMounted(async () => {
  await fetchData();
  console.log("Data fetched successfully", groupObjectList.value);

});


</script>

<template>
  <div>
    <GroupForm v-model="groupObjectList" @delete="fetchData" />    
  </div>  
</template>
    
  