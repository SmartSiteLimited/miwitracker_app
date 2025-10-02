<script setup lang="ts">
import Icon from './Icon.vue';

const props = defineProps<{
    taskName: string
    status?: 'pending' | 'running' | 'failed' | 'done'
    result?: boolean | null
}>()

</script>

<template>
    <div>
        <span v-if="status === 'pending'">
            <Icon name="Hourglass" :size="16" />
        </span>
        <span v-else-if="status === 'running'">
            <Icon name="Loader2" :size="16" class="animate-spin" />
        </span>
        <span v-else-if="status === 'failed'" class="text-red-500">
            <Icon name="AlertCircle" :size="16" class="inline" /> Task Failed
        </span>
        <span v-else-if="status === 'done'">
            <template v-if="props.taskName === 'check_online'">
                <span v-if="props.result === true" class="text-green-500">Online</span>
                <span v-else-if="props.result === false" class="text-red-500">Offline</span>
            </template>
            <template v-if="props.taskName === 'locate'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Locate</span>
            </template>
            <template v-if="props.taskName === 'set_phonebook'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set Phone Book</span>
            </template>
            <template v-if="props.taskName === 'set_blockphone'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set Block Phone</span>
            </template>
            <template v-if="props.taskName === 'set_health'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set Health</span>
            </template>
            <template v-if="props.taskName === 'set_callcenter'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set Call Center</span>
            </template>
            <template v-if="props.taskName === 'set_sos'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set SOS</span>
            </template>
            <template v-if="props.taskName === 'power_off'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Failed to Power Off</span>
            </template>
            <template v-if="props.taskName === 'reboot'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Failed to Reboot</span>
            </template>
            <template v-if="props.taskName === 'set_fallalert'">
                <span v-if="props.result === true" class="text-green-500">Success</span>
                <span v-else-if="props.result === false" class="text-red-500">Cannot Set Fall Alert</span>
            </template>
        </span>
    </div>
</template>