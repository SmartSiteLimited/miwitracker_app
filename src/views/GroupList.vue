<script setup lang="ts">
import type { MiwiGroup } from '@/composables/device'
import { API_ENDPOINT } from '@/config'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import Icon from '@/components/Icon.vue'
import { Button } from '@/widgets/ui/button'
import {
  Table, TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/widgets/ui/table'
import { onMounted } from 'vue'

const entries = ref<MiwiGroup[]>([])

async function fetchData() {
  const res = await fetch(`${API_ENDPOINT}/groups`)
  const data = await res.json()
  if (data.success) {
    entries.value = data.data || []
  } else {
    toast.error(data.message || 'Failed to fetch groups')
  }
}

async function createGroup() {
  const name = prompt('Enter group name:')
  if (!name) return

  const description = prompt('Enter description:')

  try {
    const resp = await fetch(`${API_ENDPOINT}/groups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_name: name, description }),
    })

    const result = await resp.json()
    if (result.success) {
      toast.success('Group created successfully')
      fetchData();
    } else {
      toast.error(result.message || 'Failed to create group')
    }
  } catch (error) {
    console.error('Error creating group:', error)
    toast.error('Error occurred while creating group')
  }
}



// confirm + delete request
async function deleteItem(groupId: number) {
  const ok = window.confirm('Are you sure to delete this group?')
  if (!ok) return

  try {
    const resp = await fetch(`${API_ENDPOINT}/groups/${groupId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await resp.json();
    if (result.success) {
      toast.success('Group deleted successfully');
      fetchData();
    } else {
      toast.error(result.message || 'Failed to delete group');
    }
  } catch (error) {
    console.error('Error deleting group:', error)
    toast.error('Error occurred while deleting group')
  }
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="justify-between flex mb-2">
      <Button type="button" variant="outline" @click="createGroup">
        <Icon name="Plus" /> Add
      </Button>
    </div>

    <div class="relative overflow-x-auto">
      <Table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <TableHeader class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <TableRow>
            <TableHead class="px-2 py-1 w-[100px]">Group ID </TableHead>
            <TableHead class="px-2 py-1">Group Name </TableHead>
            <TableHead class="px-2 py-1">Description</TableHead>
            <TableHead class="px-2 py-1 w-[50px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(entry, index) in entries" :key="`row-${index}`">
            <TableCell class="px-2 py-1">
              {{ entry.GroupId }}
            </TableCell>
            <TableCell class="px-2 py-1">
              {{ entry.GroupName }}
            </TableCell>
            <TableCell class="px-2 py-1">
              {{ entry.Description }}
            </TableCell>
            <TableCell class="px-2 py-1">
              <Button type="button" variant="ghost" class="text-red-500 p-2" @click="deleteItem(entry.GroupId)">
                <Icon name="Trash" :size="16" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow v-if="entries.length === 0">
            <TableCell class="px-2 py-4 text-center" colspan="6">No Groups Found</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>