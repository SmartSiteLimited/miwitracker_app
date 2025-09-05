<script>
import { Badge } from '@/widgets/ui/badge'
import { API_ENDPOINT } from "@/config"
import { useAppStore } from '@/stores/app'
export default {
  name: "SettingAttributeInput",
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      validator: (value) =>
        Array.isArray(value) &&
        value.every((item) => typeof item === 'object' && 'key' in item && 'value' in item),
    },
    attrOptions: {
      type: Array,
      default: () => [],
      validator: (value) => Array.isArray(value) && value.every((item) => typeof item === 'string'),
    },
    keyLabel: {
      type: String,
      default: 'Key',
    },
    valueLabel: {
      type: String,
      default: 'Value',
    },
    actionLabel: {
      type: String,
      default: 'Actions',
    },
    keyPlaceholder: {
      type: String,
      default: 'Enter key',
    },
    valuePlaceholder: {
      type: String,
      default: 'Enter value',
    },
    emptyMessage: {
      type: String,
      default: 'No attributes. Use + to add.',
    },
    addButtonText: {
      type: String,
      default: 'Add',
    },
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
    addRow() {
      this.entries.push({ key: '', value: '' });
      this.emitUpdate();
    },

    deleteRow(index) {
      this.entries.splice(index, 1);
      this.emitUpdate();
    },

    updateKey(index, value) {
      this.entries[index].value = value.trim().replace(/\s*,\s*/g, ',');
      this.emitUpdate();
    },

    updateValue(index, value) {
      this.entries[index].value = value;
      this.emitUpdate();
    },

    emitUpdate() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.entries)));
    },
    emitSave() {
      this.$emit('save');
    },  

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
            <th class="px-2 py-1">{{ keyLabel }}</th>
            <th class="px-2 py-1">{{ valueLabel }}</th>
            <th class="px-2 py-1">{{ actionLabel }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}-${entry.key || ''}`">
            <td class="px-2 py-1">
              <select v-if="attrOptions.length > 0"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.key" @change="updateKey(index, $event.target.value)">
                <option value="" disabled>Select an option</option>
                <option v-for="option in attrOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <input v-else type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.key" @input="updateKey(index, $event.target.value)" :placeholder="keyPlaceholder" />
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.value" @input="updateValue(index, $event.target.value)" :placeholder="valuePlaceholder" />
            </td>
            <td class="px-2 py-1">
              <Badge class="bg-red-500" color="text-white" @click="deleteRow(index)">Delete</Badge>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">{{ emptyMessage }}</td>
          </tr>
        </tbody>
      </table>
      <div class="p-2 justify-between flex">
        <button type="button" class="border-blue-500 text-blue-500" @click="addRow">
          <i class="fal fa-plus"></i> {{ addButtonText }}
        </button>
        <button type="button" class="border-blue-500 text-blue-500" @click="saveConfig">
          <i class="fal fa-save"></i> Save Changes
        </button>
      </div>
      
    </div>
  </div>
</template>

