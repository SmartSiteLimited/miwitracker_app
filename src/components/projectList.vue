<script>
import { Badge } from '@/widgets/ui/badge'
import { API_ENDPOINT } from "@/config"
import { useAppStore } from '@/stores/app'
import Icon from '@/components/Icon.vue'
import { useToast } from 'vue-toastification';
export default {
  name: "ProjectList",
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
      default: 'No Project Found',
    },
    addButtonText: {
      type: String,
      default: 'Add',
    },
  },


  data() {
    return {
      entries: JSON.parse(JSON.stringify(this.modelValue || [])),
      store: useAppStore(),
      toast: useToast()
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

    deleteItem(project_name) {
      // if (!this.store.curProject) {
      //   alert("No project selected");
      //   return;
      // }
      confirm("Are you sure to delete this project?");

      fetch(API_ENDPOINT + '/projects/' + project_name, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(resp => {
        if (resp.ok) {
          // Handle successful response
          console.log(resp.data);
          this.$emit('delete');
          this.toast.success("Project deleted successfully");
        } else {
          // Handle error response
          console.log("Failed to delete project");
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    },
    async addGroup(project_name) {

      const response = await fetch(API_ENDPOINT + '/devices/addMiwiGroup/' + project_name, {
        method: 'GET',
      });
      const result = await response.json();
      if (result.success) {
        // alert("Group added successfully");
        this.$emit('save');
        this.toast.success("Group added successfully");
      } else {
        // alert("Failed to add group: " + (result.message || "Unknown error"));
      }
    },

    updateValue(index, value, field) {
      this.entries[index][field] = value.trim().replace(/\s*,\s*/g, ',');
      this.emitUpdate();
    },

    emitUpdate() {
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.entries)));
    },

    async saveProject() {
      // call the backend api to save the entries value 
      console.log(this.entries);
      const payload = {
        projects : this.entries, 
      }
      const response = await fetch(API_ENDPOINT + '/projects/saveProjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Attributes saved successfully");
        this.$emit('save');
        this.toast.success("Projects saved successfully");
      } else {
        // Handle error response
      }
    }
  },
};
</script>


<template>
  <div >
    <div class="relative overflow-x-auto">
      <Icon name="Plus" class="border-blue-500 text-blue-500 w-10 h-10" @click="addRow" />      
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
          <tr>
            <th hidden class="px-2 py-1">Project ID </th>
            <th class="px-2 py-1">Project Name </th>
            <th class="px-2 py-1">URL</th>
            <th class="px-2 py-1">Group ID</th>
            <th class="px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="`${index}-${entry.key || ''}`">
            <td class="px-2 py-1" hidden>
              <input type="text" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.id" disabled/>
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.name" @change="updateValue(index , $event.target.value , 'name')" />
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.url" @change="updateValue(index , $event.target.value , 'url')" />
            </td>
            <td class="px-2 py-1">
              <input type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :value="entry.miwi_group_id" disabled/>
                
            </td>
            <td class="px-2 py-1">
              <Badge v-if="entry.id && entry.miwi_group_id == null" variant="destructive" class="cursor-pointer w-8 h-8 bg-blue-500 ml-2" @click="addGroup(entry.name)">
                <Icon name="Plus" class="w-8 h-8" />
              </Badge>
              <Badge variant="destructive" class="cursor-pointer w-8 h-8 ml-2" @click="deleteItem(entry.name)">
                <Icon name="Trash" class="w-8 h-8" />
              </Badge>
            </td>
          </tr>
          <tr v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">{{ emptyMessage }}</td>
          </tr>
          
        </tbody>
      </table>
      <div class="p-2 justify-item flex">
         
         <div class="flex items-center gap-1 cursor-pointer" @click="saveProject">
           <Icon name="Save" class="border-blue-500 text-blue-500 w-6 h-6"  />
           <span>Save</span>
         </div>
      </div>
    </div>
  </div>
</template>
