<template>
  <div class="w-[360px] flex-shrink-0 bg-white rounded-xl shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">图文带货生成器</h2>
      <button
        class="text-sm text-wechat-gray hover:text-black transition-colors"
        @click="showSettings = true"
      >设置</button>
    </div>

    <ImageUploader />

    <div class="mt-4 flex-1 overflow-y-auto">
      <ConfigSelector />
      <GenerateButton
        :disabled="store.images.length === 0"
        @generate="handleGenerate"
        @retry="handleRetry"
      />
    </div>

    <div v-if="!store.hasContent" class="mt-4 pt-3 border-t text-xs text-wechat-gray">
      <p>1. 上传商品图片</p>
      <p>2. 选择模型和风格</p>
      <p>3. 点击生成，等待 AI 创作</p>
      <p>4. 在右侧预览，不满意可追加指令</p>
      <p>5. 导出或截图保存</p>
    </div>

    <SettingsModal :visible="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import { callVisionAPI, callChatAPI } from '@/utils/api'
import { buildSystemPrompt, buildUserPrompt, buildFollowUpPrompt, buildJSONFormatHint } from '@/utils/prompt'
import { nextGeneration } from '@/utils/avatar'
import ImageUploader from './ImageUploader.vue'
import ConfigSelector from './ConfigSelector.vue'
import GenerateButton from './GenerateButton.vue'
import SettingsModal from './SettingsModal.vue'
import type { ChatMessage, AIResponse } from '@/types'

const store = useChatStore()
const config = useConfigStore()
const showSettings = ref(false)

const conversationHistory = ref<Array<{ role: string; content: string }>>([])

function applyResponse(res: AIResponse) {
  store.setProduct(res.product)

  // 图片队列：每次遇到 image 类型消息，依次取用上传的图片
  let imageIndex = 0
  const isDouble = config.chatMode === 'double'

  const messages: ChatMessage[] = res.messages.map((m, i) => {
    let role = m.role
    let content = m.content

    // 图片消息：替换为实际上传的图片 base64
    if (m.type === 'image') {
      content = store.images.length > 0 ? store.images[imageIndex % store.images.length] : m.content
      imageIndex++
    }

    // 双人模式：根据 speaker 分配角色，实现左右交替
    if (isDouble && m.speaker && m.type !== 'timestamp') {
      if (m.speaker === config.doubleNicknames[1]) {
        role = 'user'
      } else {
        role = 'assistant'
      }
    }

    return {
      id: `msg-${Date.now()}-${i}`,
      role,
      type: m.type,
      content,
      speaker: m.speaker,
    }
  })

  store.setMessages(messages)
  store.setStatus('success')
}

async function handleGenerate() {
  if (store.isGenerating) return
  nextGeneration()
  store.setStatus('loading')
  try {
    const systemPrompt = buildSystemPrompt(config.chatMode, config.copyStyle)
      .replace('{nickname}', config.singleNickname)
      .replace('{nickname1}', config.doubleNicknames[0])
      .replace('{nickname2}', config.doubleNicknames[1])
      + buildJSONFormatHint()

    const userContent = buildUserPrompt(store.images)
    const res = await callVisionAPI(systemPrompt, userContent)

    conversationHistory.value = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '请识别图片中的商品，然后生成推荐对话。' },
      { role: 'assistant', content: JSON.stringify(res) },
    ]

    applyResponse(res)
  } catch (e: any) {
    store.setError(e.message)
  }
}

async function handleFollowUp(instruction: string) {
  if (store.isGenerating) return
  store.setStatus('loading')
  try {
    conversationHistory.value.push({
      role: 'user',
      content: buildFollowUpPrompt(instruction),
    })

    const res = await callChatAPI(conversationHistory.value.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    })))

    conversationHistory.value.push({
      role: 'assistant',
      content: JSON.stringify(res),
    })

    const isDouble = config.chatMode === 'double'
    let imageIndex = 0
    const newMessages: ChatMessage[] = res.messages.map((m, i) => {
      let role = m.role
      let content = m.content

      if (m.type === 'image') {
        content = store.images.length > 0 ? store.images[imageIndex % store.images.length] : m.content
        imageIndex++
      }

      if (isDouble && m.speaker && m.type !== 'timestamp') {
        if (m.speaker === config.doubleNicknames[1]) {
          role = 'user'
        } else {
          role = 'assistant'
        }
      }

      return {
        id: `msg-${Date.now()}-${i}`,
        role,
        type: m.type,
        content,
        speaker: m.speaker,
      }
    })
    store.appendMessages(newMessages)
    store.setStatus('success')
  } catch (e: any) {
    store.setError(e.message)
  }
}

function handleRetry() {
  handleGenerate()
}

defineExpose({ handleFollowUp })
</script>
