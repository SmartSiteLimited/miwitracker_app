<script lang="ts" setup>
import Icon from '@/components/Icon.vue'
import type { Project } from '@/composables/project'
import { API_ENDPOINT } from '@/config'
import { Button } from '@/widgets/ui/button'
import { Input } from '@/widgets/ui/input'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/widgets/ui/table'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'


const entries = ref<Project[]>([])

async function fetchProjectList() {
  try {
    const response = await fetch(API_ENDPOINT + `/projects/`);
    const data = await response.json();

    entries.value = data.data || []
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};

function addRow() {
  entries.value.push({ id: 0, name: '', url: '', miwi_group_id: 0 } as Project)
}

async function saveProject() {
  const payload = { projects: entries.value }
  try {
    const response = await fetch(API_ENDPOINT + '/projects/saveProjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      toast.success('Projects saved successfully')
    } else {
      console.error('Failed to save projects')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function deleteItem(project: Project) {
  if (project.id === 0) {
    entries.value = entries.value.filter(p => p !== project)
    return
  }

  if (!confirm('Are you sure to delete this project?')) return

  try {
    const res = await fetch(API_ENDPOINT + '/projects/' + project.name, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await res.json()
    if (response?.success) {
      toast.success('Project deleted successfully')
    } else {
      toast.error('Failed to delete project: ' + (response?.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Error deleting project: ' + error)
  }
}

async function addGroup(project: string) {
  try {
    const res = await fetch(API_ENDPOINT + '/devices/addMiwiGroup/' + project)
    const response = await res.json()
    if (response?.success) {
      toast.success('Group added successfully')
    } else {
      toast.error('Failed to add group: ' + (response?.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Error:', error)
    toast.error('Error adding group: ' + error)
  }
}

onMounted(() => {
  fetchProjectList();
});
</script>

<template>
  <div>
    <div class="justify-between flex mb-2">
      <Button type="button" variant="outline" @click="addRow">
        <Icon name="Plus" /> Add
      </Button>
      <Button type="button" variant="outline" @click="saveProject">
        <Icon name="Save" /> Save
      </Button>
    </div>

    <div class="relative overflow-x-auto">
      <Table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHeader class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableRow>
            <TableHead class="px-2 py-1">#</TableHead>
            <TableHead class="px-2 py-1">Project Name </TableHead>
            <TableHead class="px-2 py-1">URL</TableHead>
            <TableHead class="px-2 py-1">Group ID</TableHead>
            <TableHead class="px-2 py-1">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(entry, index) in entries" :key="`row-${index}`">
            <td class="px-2 py-1">
              {{ entry.id }}
            </td>
            <td class="px-2 py-1">
              <Input type="text" v-model="entry.name" />
            </td>
            <td class="px-2 py-1">
              <Input type="text" v-model="entry.url" />
            </td>
            <td class="px-2 py-1">
              {{ entry.miwi_group_id }}
              <Button type="button" v-if="entry.id && entry.miwi_group_id == null" variant="outline"
                @click="addGroup(entry.name)">
                Create Group
              </Button>
            </td>
            <td class="px-2 py-1">
              <Button type="button" variant="ghost" class="text-red-500" @click="deleteItem(entry)">
                <Icon name="Trash" :size="16" />
              </Button>
            </td>
          </TableRow>
          <TableRow v-if="entries.length === 0">
            <td class="px-2 py-4 text-center" colspan="3">No Projects</td>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colspan="4" />
            <TableCell>
              <Button type="button" variant="outline" @click="addRow">
                <Icon name="Plus" /> Add
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

    </div>
  </div>
</template>
