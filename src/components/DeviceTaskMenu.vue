<script setup lang="ts">
import { Button } from '@/widgets/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/widgets/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/widgets/ui/popover";
import { computed, ref } from 'vue';
import Icon from './Icon.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/widgets/ui/select';

const props = defineProps<{
  checkImeis: Set<string>;
}>();
const emits = defineEmits<{
  (e: 'execute', value: string): void,
  (e: 'update:filter-result', value: number): void
}>();
const curTask = ref('');
const isOpened = ref(false);
const filterResult = ref(-1);

const canStart = computed(() => {
  return curTask.value !== '' && props.checkImeis.size > 0;
});

const commandGroups = {
  "Commands": [
    {
      "value": "check_online",
      "text": "Check Online",
      "icon": "Wifi"
    },
    {
      "value": "locate",
      "text": "Locate",
      "icon": "Locate"
    },
    {
      "value": "power_off",
      "text": "Power off",
      "icon": "PowerOff"
    },
    {
      "value": "reboot",
      "text": "Reboot",
      "icon": "Power"
    },
  ],
  "Settings": [
    {
      "value": "set_sos",
      "text": "Set SOS",
      "icon": "Phone"
    },
    {
      "value": "set_phonebook",
      "text": "Set Phone Book",
      "icon": "CardSim"
    },
    {
      "value": "set_blockphone",
      "text": "Set Block Phone",
      "icon": "PhoneOff"
    },
    {
      "value": "set_health",
      "text": "Set Health",
      "icon": "HeartPulse"
    },
    {
      "value": "set_callcenter",
      "text": "Set Call Center",
      "icon": "Headset"
    },
    {
      "value": "set_fallalert",
      "text": "Set Fall Alert",
      "icon": "Siren"
    }
  ]
}

const selectedTask = computed(() => {
  return commandGroups["Commands"].concat(commandGroups["Settings"]).find(item => item.value === curTask.value);
});

const updateFilterResult = (value: number) => {
  filterResult.value = value;
  emits('update:filter-result', value);
}
</script>


<template>
  <div class="flex items-center justify-between gap-2">
    <div class="flex-grow">
      <Popover v-model:open="isOpened">
        <PopoverTrigger as-child>
          <Button type="button" size="sm" variant="outline" class="w-[160px] justify-start">
            <template v-if="selectedTask">
              <Icon :name="selectedTask['icon']" class="w-4 h-4" />
              {{ selectedTask['text'] }}
            </template>
            <template v-else>
              <Icon name="LayoutList" class="w-4 h-4" />
              {{ curTask !== '' ? curTask : 'Select Task' }}
            </template>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0" side="bottom" align="start">
          <Command class="text-sm">
            <CommandInput placeholder="Search Task" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup v-for="(items, key) in commandGroups" :key="key" :heading="key">
                <CommandItem v-for="item in items" :key="item.value" :value="item.text"
                  @select="curTask = item.value; isOpened = false" class="py-1">
                  <Icon :name="item.icon" class="w-4 h-4" />
                  {{ item.text }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button type="button" size="sm" variant="ghost" :class="{ 'text-green-500 hover:text-green-600': canStart }"
        :disabled="!canStart" @click="emits('execute', curTask)">
        <Icon name="Play" />
        Start
      </Button>
    </div>

    <Select :model-value="filterResult.toString()" @update:model-value="updateFilterResult($event ? parseInt($event.toString(), 10) : -1)">
      <SelectTrigger size="sm" class="w-[100px] border-0 justify-end text-sm bold">
        <SelectValue placeholder="Filter by Task Result" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="-1">
            All
          </SelectItem>
          <SelectItem value="1">
            Success
          </SelectItem>
          <SelectItem value="2">
            Failure
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>