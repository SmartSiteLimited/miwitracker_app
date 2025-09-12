<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
import { Button } from '@/widgets/ui/button';

const props = withDefaults(defineProps<{
    promiseFunc: (signal: AbortSignal) => Promise<void>,
    canAbort?: boolean
}>(), {
    canAbort: true
})
const loading = ref(false)
const abortController = ref<AbortController | null>(null)

async function execute() {
    // Abort any ongoing request
    if (props.canAbort && abortController.value) {
        abortController.value.abort()
    }

    // Create new AbortController for this request
    abortController.value = new AbortController()
    const signal = abortController.value.signal

    loading.value = true
    try {
        await props.promiseFunc(signal)
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('Request was cancelled')
        } else {
            throw error
        }
    } finally {
        loading.value = false
        abortController.value = null
    }
}
</script>

<template>
    <Button variant="outline" @click="execute()" :class="{ 'opacity-50': loading }">
        <slot />
        <Icon name="Loader2" class="animate-spin" v-if="loading" />
    </Button>
</template>