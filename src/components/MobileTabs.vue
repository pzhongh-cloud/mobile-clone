<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex gap-3 z-30">
    <button class="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50" @click="emit('openUpload')">📷 上传</button>
    <button class="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50" @click="emit('openSettings')">⚙️ 设置</button>
    <button class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all" :class="generateBtnClass" :disabled="isDisabled" @click="doGenerate">{{ generateBtnText }}</button>
  </div>
  <div v-if="chatStore.errorMessage && chatStore.status === 'error'" class="fixed bottom-16 left-4 right-4 z-30 bg-red-500 text-white px-4 py-2 rounded-lg text-sm text-center">{{ chatStore.errorMessage }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import { callVisionAPI } from '@/utils/api'
import { buildSystemPrompt, buildUserPrompt, buildJSONFormatHint } from '@/utils/prompt'
import { nextGeneration } from '@/utils/avatar'
import type { ChatMessage, AIResponse } from '@/types'

const props = defineProps<{ imagesCount: number; isGenerating: boolean; hasContent: boolean }>()
const emit = defineEmits<{ openUpload: []; openSettings: [] }>()
const chatStore = useChatStore()
const config = useConfigStore()

const generateBtnText = computed(() => {
  if (chatStore.isGenerating) return '生成中...'
  if (chatStore.status === 'error') return '重试'
  return '✨ 生成'
})

const generateBtnClass = computed(() => {
  if (chatStore.isGenerating) return 'bg-gray-300 text-gray-500 cursor-wait'
  if (chatStore.status === 'error') return 'bg-red-500 text-white'
  if (props.imagesCount === 0) return 'bg-gray-200 text-gray-400'
  return 'bg-wechat-green text-black'
})

const isDisabled = computed(() => chatStore.isGenerating || props.imagesCount === 0)

function applyResponse(res: AIResponse) {
  chatStore.setProduct(res.product)
  let imageIndex = 0
  const isDouble = config.chatMode === 'double'
  const messages: ChatMessage[] = res.messages.map((m, i) => {
    let role = m.role
    let content = m.content
    if (m.type === 'image') {
      content = chatStore.images.length > 0 ? chatStore.images[imageIndex % chatStore.images.length] : m.content
      imageIndex++
    }
    if (isDouble && m.speaker && m.type !== 'timestamp') {
      role = m.speaker === config.doubleNicknames[1] ? 'user' : 'assistant'
    }
    return { id: 'msg-' + Date.now() + '-' + i, role, type: m.type, content, speaker: m.speaker }
  })
  chatStore.setMessages(messages)
  chatStore.setStatus('success')
}

async function doGenerate() {
  if (chatStore.isGenerating) return
  nextGeneration()
  chatStore.setStatus('loading')
  try {
    const sys = buildSystemPrompt(config.chatMode, config.copyStyle)
      .replace('{nickname}', config.singleNickname)
      .replace('{nickname1}', config.doubleNicknames[0])
      .replace('{nickname2}', config.doubleNicknames[1])
    const userContent = buildUserPrompt(chatStore.images)
    const res = await callVisionAPI(sys + buildJSONFormatHint(), userContent)
    applyResponse(res)
  } catch (e: any) {
    chatStore.setError(e.message)
  }
}
</script>