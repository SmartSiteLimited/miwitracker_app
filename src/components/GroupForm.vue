<script>
// import { Badge } from '@/widgets/ui/badge'
import { API_ENDPOINT } from "@/config"
import { useAppStore } from '@/stores/app'
// import { Group } from 'lucide-vue-next';
export default {
  name: "GroupForm",
  props: {
    modelValue: {
      type: [Object, Array],
      default: () => ([]),
    },
    emptyMessage: {
      type: String,
      default: 'No Item found',
    },
    groupOptions: {
      type: Array,
      default: () => [],
      // validator: (value) => Array.isArray(value) && value.every((item) => typeof item === 'string' || item === null),
    },
  },

  data() {
    const store = useAppStore();
    const val = this.modelValue;
    const cloned = (Array.isArray(val)
      ? JSON.parse(JSON.stringify(val))
      : (val && typeof val === 'object' ? [JSON.parse(JSON.stringify(val))] : []));
    return {
      store: store,
      entries: cloned,
      optionList: this.groupOptions || [],
    };
  },

  watch: {
    modelValue: {
      deep: true,
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.entries = JSON.parse(JSON.stringify(newVal));
        } else if (newVal && typeof newVal === 'object') {
          this.entries = [JSON.parse(JSON.stringify(newVal))];
        } else {
          this.entries = [];
        }
      },
    },
  },

  methods: {
    updateGroup(index, value) {
      this.entries[index].miwi_group_id = value.trim().replace(/\s*,\s*/g, ',');
      this.emitUpdate();
    },

    emitUpdate() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.entries)));
    },
    emitSave() {
      this.$emit('update');
    },  
  },
};
</script>

<!-- 
add the popup form with z-index 50
-->
<style scoped>
.popup {
  z-index: 50;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}
</style>

<template>
  <div class="settings-attribute-input popup">
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-2 py-1">Group List</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}`">
            <td class="px-2 py-1">
              <select v-if="optionList.length > 0"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.miwi_group_id" @change="updateGroup(index, $event.target.value)">
                <option value="" disabled>Select a Group option</option>
                <option v-for="option in optionList" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">{{ emptyMessage }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="p-2 justify-between flex">
        <button type="button" class="border-blue-500 text-blue-500" @click="saveGroup">
          <i class="fal fa-save"></i> Save Changes
        </button>
      </div> -->
      
    </div>
  </div>
</template>

