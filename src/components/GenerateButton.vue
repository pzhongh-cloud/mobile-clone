<template>
  <div class="mt-4">
    <button
      class="w-full py-3 rounded-lg font-medium text-sm transition-all"
      :class="buttonClass"
      :disabled="store.isGenerating || disabled"
      @click="handleClick"
    >{{ buttonText }}</button>
    <div v-if="store.status === 'error'" class="mt-2 text-sm text-red-500">
      {{ store.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  generate: []
  retry: []
}>()

const buttonText = computed(() => {
  switch (store.status) {
    case 'loading': return '生成中...'
    case 'error': return '重试'
    case 'success': return '重新生成'
    default: return '生成文案'
  }
})

const buttonClass = computed(() => {
  switch (store.status) {
    case 'loading':
      return 'bg-gray-300 text-gray-500 cursor-wait'
    case 'error':
      return 'bg-red-500 text-white hover:bg-red-600'
    default:
      return store.images.length === 0
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-wechat-green text-black hover:bg-green-400'
  }
})

const disabled = computed(() => {
  if (store.isGenerating) return true
  if (store.status === 'success') return props.disabled ?? false
  return store.images.length === 0
})

function handleClick() {
  if (store.status === 'error') {
    emit('retry')
  } else {
    emit('generate')
  }
}
</script>
