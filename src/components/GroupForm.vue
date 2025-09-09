<script>
import { Badge } from '@/widgets/ui/badge'
import Icon from '@/components/Icon.vue'
import { API_ENDPOINT } from "@/config"
import { useAppStore } from '@/stores/app'
export default {
  name: "GroupForm",
  components: { Icon, Badge },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      validator: (value) =>
        Array.isArray(value)
    },
    emptyMessage: {
      type: String,
      default: 'No Groups Found',
    },
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
    addRow() {
      this.entries.push({ id: '', name: '', url: '', miwi_group_id: '' });
      this.emitUpdate();
    },

    deleteItem(id) {
      confirm("Are you sure to delete this group?");

      fetch(API_ENDPOINT + '/devices/deletegroups/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(resp => {
        if (resp.ok) {
          // Handle successful response
          console.log(resp.data);
          this.$emit('delete');
        } else {
          // Handle error response
          console.log("Failed to delete group");
        }
      }).catch(error => {
        console.error('Error:', error);
        console.log("Error occurred while deleting group");
      });
    },

    // updateValue(index, value, field) {
    //   this.entries[index][field] = value.trim().replace(/\s*,\s*/g, ',');
    //   this.emitUpdate();
    // },

    // emitUpdate() {
    //   this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.entries)));
    // },

    // async saveProject() {
    //   // call the backend api to save the entries value 
    //   console.log(this.entries);
    //   const payload = {
    //     projects : this.entries, 
    //   }
    //   const response = await fetch(API_ENDPOINT + '/projects/saveProjects', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     // Handle successful response
    //     console.log("Attributes saved successfully");
    //     this.$emit('save');
    //   } else {
    //     // Handle error response
    //   }
    // }
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
            <th class="px-2 py-1">Group ID </th>
            <th class="px-2 py-1">Organ ID </th>
            <th class="px-2 py-1">Group Name </th>
            <th class="px-2 py-1">Description</th>
            <th class="px-2 py-1">Created</th>
            <th class="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}-${entry.key || ''}`">
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.GroupId" disabled/>
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.OrgId" disabled />
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.GroupName" disabled />
            </td>
            <td
             class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.Description" disabled/>
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.Created" disabled/>
            </td>
            <td class="px-2 py-1">
              <Badge class="bg-red-500 p-2 text-white rounded-md" color="text-white w-8 h-8" @click="deleteItem(entry.GroupId)">
                <Icon name="Trash" class="w-8 h-8" />
              </Badge>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">{{ emptyMessage }}</td>
          </tr>
          
        </tbody>
      </table>
      <!-- <div class="p-2 justify-between flex">
         <button type="button" class="border-blue-500 text-blue-500" @click="addRow">
          <i class="fal fa-plus"></i> {{ addButtonText }}
        </button> 
        <button type="button" class="border-blue-500 text-blue-500" @click="saveProject">
          <i class="fal fa-save"></i> Save Changes
        </button> 
      </div> -->
    </div>
  </div>
</template>

