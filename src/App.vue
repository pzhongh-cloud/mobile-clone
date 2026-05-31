<template>
  <!--
    容器：PC端横排(flex-row)，手机端竖排(flex-col)
    md: 是Tailwind的断点，屏幕宽度≥768px时生效
  -->
  <div class="min-h-screen bg-gray-100 flex items-start justify-center md:p-5 md:gap-5 md:flex-row flex-col">
    
    <!-- 错误提示（所有端共享） -->
    <div v-if="appError" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm max-w-md">{{ appError }}</div>

    <!-- ===== PC端：左侧操作面板 ===== -->
    <div class="hidden md:block">
      <LeftPanel ref="leftPanel" />
    </div>

    <!-- ===== 预览区（所有端共享，手机端全屏） ===== -->
    <RightPanel @follow-up="handleFollowUp" />

    <!-- ===== 手机端：底部操作栏 ===== -->
    <MobileTabs
      class="block md:hidden"
      :images-count="chatStore.images.length"
      :is-generating="chatStore.isGenerating"
      :has-content="chatStore.hasContent"
      @open-settings="showSettings = true"
      @generate="handleMobileGenerate"
      @open-upload="showUpload = true"
        @retry="handleMobileRetry"
    />

    <!-- ===== 手机端：上传面板（底部弹出） ===== -->
    <Teleport to="body">
      <div v-if="showUpload" class="fixed inset-0 z-40 flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/40" @click="showUpload = false"></div>
        <div class="relative bg-white rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold">上传商品图片</span>
            <button class="text-gray-400 text-xl" @click="showUpload = false">&times;</button>
          </div>
          <ImageUploader />
          <ConfigSelector />
          <div class="mt-3">
            <button
              class="w-full py-3 rounded-lg font-medium text-sm transition-all"
              :class="chatStore.images.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-wechat-green text-black'"
              :disabled="chatStore.images.length === 0 || chatStore.isGenerating"
              @click="showUpload = false"
            >确定</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 设置弹窗（手机+PC共享） -->
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
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import MobileTabs from './components/MobileTabs.vue'
import ImageUploader from './components/ImageUploader.vue'
import ConfigSelector from './components/ConfigSelector.vue'
import SettingsModal from './components/SettingsModal.vue'
import type { ChatMessage, AIResponse } from '@/types'

const leftPanel = ref<InstanceType<typeof LeftPanel>>()
const chatStore = useChatStore()
const config = useConfigStore()
const appError = ref('')
const showSettings = ref(false)
const showUpload = ref(false)
const conversationHistory = ref<Array<{ role: string; content: string }>>([])

// 手机端暴露上传面板
function handleMobileUpload() {
  showUpload.value = true
}

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
      if (m.speaker === config.doubleNicknames[1]) { role = 'user' }
      else { role = 'assistant' }
    }
    return { id: `msg-${Date.now()}-${i}`, role, type: m.type, content, speaker: m.speaker }
  })
  chatStore.setMessages(messages)
  chatStore.setStatus('success')
}

async function handleMobileGenerate() {
  if (chatStore.isGenerating) return
  nextGeneration()
  chatStore.setStatus('loading')
  try {
    const systemPrompt = buildSystemPrompt(config.chatMode, config.copyStyle)
      .replace('{nickname}', config.singleNickname)
      .replace('{nickname1}', config.doubleNicknames[0])
      .replace('{nickname2}', config.doubleNicknames[1])
      + buildJSONFormatHint()
    const userContent = buildUserPrompt(chatStore.images)
    const res = await callVisionAPI(systemPrompt, userContent)
    conversationHistory.value = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: '请识别图片中的商品，然后生成推荐对话。' },
      { role: 'assistant', content: JSON.stringify(res) },
    ]
    applyResponse(res)
  } catch (e: any) {
    chatStore.setError(e.message)
  }
}

function handleMobileRetry() { handleMobileGenerate() }

function handleFollowUp(instruction: string) {
  leftPanel.value?.handleFollowUp(instruction)
}

// 暴露给 MobileTabs 调用
defineExpose({ handleMobileUpload, handleMobileGenerate, handleMobileRetry, handleFollowUp })
</script>
