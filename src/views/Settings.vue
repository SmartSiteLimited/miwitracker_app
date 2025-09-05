<script setup lang="ts">
import {ref , watch , onMounted} from 'vue'
import SettingAttributeInput from "@/components/settingAttributes.vue";
import { useAppStore } from '@/stores/app'
import { API_ENDPOINT } from '@/config';
const settingsAttributes = ref<{ key: string; value: any }[]>([]);

const store = useAppStore();

const fetchSettingbyProject = async () => {
  try {
    if (!store.curProject) {
      return;
    }
    const response = await fetch(API_ENDPOINT + `/settings/${store.curProject}`);
    const data = await response.json();
    console.log("Fetched settings:", data);
    if (data.data && Object.keys(data.data).length > 0) {
      settingsAttributes.value = Object.entries(data.data).map(([key, val]) => ({
        key,
        value: Array.isArray(val) ? val.join(',') : String(val ?? '')  // Join without spaces
      }));
    } else {
      settingsAttributes.value = [];
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};

const attrOptions = ref<string[]>(["call_center_number", "phone_number"]);

watch(() => store.curProject, () => {
  fetchSettingbyProject().then(() => {
    console.log("Settings fetched successfully" , settingsAttributes.value ) ;
  });
  
});

</script>

<template>
  <div>
    <h1>Setting Panel</h1>
    <SettingAttributeInput :modelValue="settingsAttributes" :attrOptions="attrOptions"
    @save="fetchSettingbyProject"
    />
  </div>
</template>
    
  