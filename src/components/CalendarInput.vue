<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { formatDate, getNowStr, parseDateStr } from '@/lib/dateutils'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { useDateFormatter } from 'radix-vue'
import { createDecade, createYear, toDate } from 'radix-vue/date'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null ,
  placeholder?: string,
  showTime?: boolean,
  showClear?: boolean,
  localTime?: boolean,
  disabled?: boolean,
  maxDate?: string,
  minDate?: string
}>(), {
  placeholder: 'Select date',
  showTime: false,
  showClear: true,
  localTime: false,
  disabled: false
})
const emits = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const formatter = useDateFormatter('en')
const todayStr = getNowStr(props.showTime ? 'Y-m-d H:i:s' : "Y-m-d")

const dtValue = computed(() => {
  if (props.modelValue) {
    return parseDateStr(props.modelValue, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d')
  }

  return undefined;
})
const dtMax = computed(() =>
  props.maxDate ? parseDateStr(props.maxDate, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d') : undefined
)
const dtMin = computed(() =>
  props.minDate ? parseDateStr(props.minDate, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d') : undefined
)

const displayText = computed(() => {
  if (dtValue.value) {
    return formatDate(dtValue.value, props.localTime, props.showTime ? 'Y-m-d h:i a' : 'Y-m-d')
  }

  return props.placeholder || '-'
})

function changeDate(value: CalendarDate | undefined) {
  if (!value) {
    emits('update:modelValue', null)
    return
  }

  const newDt = new CalendarDateTime(
    value.year,
    value.month,
    value.day,
    dtValue.value?.hour || 0,
    dtValue.value?.minute || 0,
    dtValue.value?.second || 0
  )
  emits('update:modelValue', formatDate(newDt, props.localTime, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d'))
}

function changeMonth(month: number) {
  const newDt = new CalendarDateTime(
    dtValue.value?.year || today(getLocalTimeZone()).year,
    month,
    dtValue.value?.day || today(getLocalTimeZone()).day,
    dtValue.value?.hour || 0,
    dtValue.value?.minute || 0,
    dtValue.value?.second || 0
  )
  emits('update:modelValue', formatDate(newDt, props.localTime, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d'))
}

function changeYear(year: number) {
  const newDt = new CalendarDateTime(
    year,
    dtValue.value?.month || today(getLocalTimeZone()).month,
    dtValue.value?.day || today(getLocalTimeZone()).day,
    dtValue.value?.hour || 0,
    dtValue.value?.minute || 0,
    dtValue.value?.second || 0
  )
  emits('update:modelValue', formatDate(newDt, props.localTime, props.showTime ? 'Y-m-d H:i:s' : 'Y-m-d',))
}

function changeClock(part: 'hour' | 'minute' | 'second', value: string) {
  const now = new Date()

  const year = dtValue.value?.year || now.getFullYear()
  const month = dtValue.value?.month || now.getMonth()
  const day = dtValue.value?.day || now.getDate()
  const hour = part === 'hour' ? parseInt(value) : dtValue.value?.hour || 0
  const minute = part === 'minute' ? parseInt(value) : dtValue.value?.minute || 0
  const second = part === 'second' ? parseInt(value) : now.getSeconds()

  const newDt = new CalendarDateTime(year, month, day, hour, minute, second)

  emits('update:modelValue', formatDate(newDt, props.localTime, 'Y-m-d H:i:s'))
}
</script>

<template>
  <div>
    <Popover>
      <PopoverTrigger :disabled="disabled" as-child>
        <Button
          variant="outline"
          :class="cn(
            'text-start justify-start font-normal w-full',
            displayText !== '' && 'text-muted-foreground'
          )
            ">
          <Icon name="Calendar" class="me-2 h-4 w-4 opacity-50" />
          <span>{{ displayText }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto min-w-[300px] p-0 blue-500" align="start">
        <div class="p-2 flex w-full items-center justify-between gap-2">
          <Select
            :default-value="dtValue ? dtValue.year.toString() : today(getLocalTimeZone()).year.toString()"
            @update:model-value="(v) => {
              if (!v) return;
              changeYear(Number(v))
            }">
            <SelectTrigger aria-label="Select year" class="w-[40%]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent class="max-h-[200px] ">
              <SelectItem
                v-for="yearValue in createDecade({ dateObj: dtValue || today(getLocalTimeZone()), startIndex: -10, endIndex: 10 })"
                :key="yearValue.toString()" :value="yearValue.year.toString()">
                {{ yearValue.year }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            :default-value="dtValue ? dtValue.month.toString() : today(getLocalTimeZone()).month.toString()"
            @update:model-value="(v) => {
              if (!v) return;
              changeMonth(Number(v))
            }">
            <SelectTrigger aria-label="Select month" class="w-[60%]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent class="max-h-[200px]">
              <SelectItem
                v-for="month in createYear({ dateObj: dtValue || today(getLocalTimeZone()) })"
                :key="month.toString()" :value="month.month.toString()">
                {{ formatter.custom(toDate(month), { month: 'long' }) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          :model-value="dtValue"
          :calendar-label="placeholder"
          :min-value="dtMin"
          :max-value="dtMax"
          @update:model-value="changeDate($event ? $event as CalendarDate : undefined)">
        </Calendar>
        <div class="flex items-center gap-2 p-2 text-sm" v-if="$props.showTime">
          <Icon name="Clock" class="opacity-50 shrink-0" :size="20" />
          <Select :model-value="(dtValue?.hour || '')?.toString()" @update:model-value="changeClock('hour', $event)">
            <SelectTrigger>
              <SelectValue placeholder="Hour">
                {{ (dtValue?.hour || 0).toString().padStart(2, '0') }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>- Hour -</SelectLabel>
                <SelectItem v-for="hour in 24" :key="hour" :value="(hour - 1).toString()">
                  {{ (hour - 1).toString().padStart(2, '0') }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>:</span>
          <Select :model-value="(dtValue?.minute || '')?.toString()"
            @update:model-value="changeClock('minute', $event)">
            <SelectTrigger>
              <SelectValue placeholder="Minute">
                {{ (dtValue?.minute || 0).toString().padStart(2, '0') }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>- Minute -</SelectLabel>
                <SelectItem v-for="minute in 59" :key="minute" :value="(minute - 1).toString()">
                  {{ (minute - 1).toString().padStart(2, '0') }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-row">
          <Button variant="outline" class="w-full rounded-none border-x-0 border-r bg-gray-300"   
            @click="emits('update:modelValue', todayStr)">Today</Button>
          <Button variant="outline" class="w-full rounded-none border-x-0 bg-gray-300"  
            @click="emits('update:modelValue', null)"
            v-if="showClear">Clear</Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
