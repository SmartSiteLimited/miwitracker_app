<script setup lang="ts">
import { API_ENDPOINT } from "@/config";
import { useAppStore } from "@/stores/app";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/widgets/ui/select";
import { onMounted, ref } from "vue";

const store = useAppStore();
const projectOptions = ref<{ id: string; name: string; }[]>([]);

const fetchData = async () => {
  fetch(API_ENDPOINT + "/projects")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        projectOptions.value = data.data || [];
        store.setCache("types.projects", projectOptions.value);
      }
    });
};
  
function onChangeLocation(value: string) {
  store.changeProject(value === "-" ? null : value);
}

onMounted(() => {
  const options = store.getCache("types.projects", []);
  if (options.length) {
    projectOptions.value = options || [];
  } else {
    fetchData();
  }
});
</script>

<template>
  <Select :model-value="store.curProject ?? '-'" @update:model-value="onChangeLocation($event?.toString() || '-')">
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder=" - Select Project - " />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="-">
        - Select Project -
      </SelectItem>
      <SelectGroup>
        <SelectItem v-for="opt in projectOptions" :key="opt.id" :value="opt.name">
          {{ opt.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
