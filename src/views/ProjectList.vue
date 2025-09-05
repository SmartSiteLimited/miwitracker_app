<script setup lang="ts">
import {ref , watch , onMounted} from 'vue'
import ProjectList from '@/components/projectList.vue'
import { useAppStore } from '@/stores/app'
import { API_ENDPOINT } from '@/config';
import  { Button } from '@/widgets/ui/button'
const projectList = ref<{ key: string; value: any }[]>([]);

const store = useAppStore();

const fetchProjectList = async () => {
  try {
    // if (!store.curProject) {
    //   return;
    // }
    const response = await fetch(API_ENDPOINT + `/projects/`);
    const data = await response.json();
    console.log("Fetched projects:", data);
    // if (data.data && Array.isArray(data.data)) {
    //   projectList.value = (data.data as any[]).map(p => ({
    //     key: String(p.id ?? p.name ?? ''),
    //     value: p
    //   }));
    //   return;
    // }

    // console.log("Fetched settings:", data);
    if (data.data) {
      projectList.value = data.data; 
    } else {
      projectList.value = [];
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};

const addGroup = async () => {
  if (!store.curProject) {
    alert("No project selected");
    return;
  }
  // const newGroupId = prompt("Enter new Group Name:");
  // if (newGroupId && newGroupId.trim() !== "") {
  //   const payload = {
  //     GroupName: newGroupId.trim(),
  //   };
    const response = await fetch(API_ENDPOINT + '/devices/addMiwiGroup/' + store.curProject, {
      method: 'GET',
    });
    const result = await response.json();
    if (result.success) {
      // alert("Group added successfully");
      fetchProjectList();
    } else {
      // alert("Failed to add group: " + (result.message || "Unknown error"));
    }
  }


onMounted(async () => {
 await fetchProjectList()
  console.log("Projects fetched successfully" , projectList.value ) ;
  
});

// watch(() => store.curProject, () => {
//   fetchProjectList().then(() => {
//     console.log("Projects fetched successfully" , projectList.value ) ;
//   });
  
// });

</script>

<template>
  <div>
    <h1>Setting Panel</h1>
    <div class="flex justify-between mb-2">
        <div class="w-full flex justify-end gap-2">
      <Button class="bg-blue-500" @click="addGroup()">Add Group</Button>
      </div>
    </div>
    <ProjectList :modelValue="projectList" 
    @save="fetchProjectList"
    />
  </div>
</template>
    
  