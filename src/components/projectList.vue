<script>
import { Badge } from '@/widgets/ui/badge'
import { API_ENDPOINT } from "@/config"
import { useAppStore } from '@/stores/app'
export default {
  name: "ProjectList",
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      validator: (value) =>
        Array.isArray(value)
    },
    emptyMessage: {
      type: String,
      default: 'No Project Found',
    },

    // keyLabel: {
    //   type: String,
    //   default: 'Key',
    // },
    // valueLabel: {
    //   type: String,
    //   default: 'Value',
    // },
    // actionLabel: {
    //   type: String,
    //   default: 'Actions',
    // },
    // keyPlaceholder: {
    //   type: String,
    //   default: 'Enter key',
    // },
    // valuePlaceholder: {
    //   type: String,
    //   default: 'Enter value',
    // },
    // addButtonText: {
    //   type: String,
    //   default: 'Add',
    // },
  },


  data() {
    return {
      entries: JSON.parse(JSON.stringify(this.modelValue || [])),
      store: useAppStore()
    };
  },

  watch: {
    modelValue: {
      deep: true,
      handler(newVal) {
        this.entries = JSON.parse(JSON.stringify(newVal || []));
      },
    },
  },

  methods: {
    // addRow() {
    //   // this.entries.push({ key: '', value: '' });
    //   this.emitUpdate();
    // },

    // deleteRow(index) {
    //   this.entries.splice(index, 1);
    //   this.emitUpdate();
    // },

    // updateKey(index, value) {
    //   this.entries[index].value = value.trim().replace(/\s*,\s*/g, ',');
    //   this.emitUpdate();
    // },

    // updateValue(index, value) {
    //   this.entries[index].value = value;
    //   this.emitUpdate();
    // },

    // emitUpdate() {
    //   this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.entries)));
    // },
    // emitSave() {
    //   this.$emit('save');
    // },  

    async saveConfig() {
      // call the backend api to save the entries value 
      if (!this.store.curProject) {
        alert("No project selected");
        return;
      }
      console.log(this.entries);
      const payload = {
        attributes : this.entries, 
        project : this.store.curProject
      }
      const response = await fetch(API_ENDPOINT + '/settings/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Attributes saved successfully");
        this.emitSave();
      } else {
        // Handle error response
      }
    }
  },
};
</script>

<style scoped>
.settings-attribute-input {
  @apply max-w-full;
}
</style>

<template>
  <div class="settings-attribute-input">
    <div class="relative overflow-x-auto">

      
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-2 py-1">Project ID </th>
            <th class="px-2 py-1">Project Name </th>
            <th class="px-2 py-1">URL</th>
            <th class="px-2 py-1">Group ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}-${entry.key || ''}`">
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.id" disabled />
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.name" disabled/>
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.url" disabled/>
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.miwi_group_id" disabled/>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">{{ emptyMessage }}</td>
          </tr>
        </tbody>
      </table>
      <!--<div class="p-2 justify-between flex">
         <button type="button" class="border-blue-500 text-blue-500" @click="addRow">
          <i class="fal fa-plus"></i> {{ addButtonText }}
        </button> 
        <button type="button" class="border-blue-500 text-blue-500" @click="saveConfig">
          <i class="fal fa-save"></i> Save Changes
        </button> 
      </div> -->      
    </div>
  </div>
</template>

