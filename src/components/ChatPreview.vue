<template>
  <!-- ===== 桌面端：完整 iPhone 外框（原样保留） ===== -->
  <div class="hidden md:block chat-preview-container w-[375px] h-[750px] rounded-[55px] overflow-hidden bg-black shadow-[0_0_0_4px_#1a1a1a,0_0_0_8px_#2d2d2d,0_0_0_9px_#1a1a1a,0_10px_40px_rgba(0,0,0,0.4)]">
    <!-- Dynamic Island + 状态栏 -->
    <div class="flex-shrink-0 bg-black pt-2 pb-1">
      <div class="flex justify-center mb-1">
        <div class="w-[120px] h-[34px] bg-[#1a1a1a] rounded-full"></div>
      </div>
      <div class="flex items-center justify-between px-7 pt-1">
        <span class="text-white text-[13px] font-medium leading-none">{{ config.statusBarTime }}</span>
        <div class="flex items-center gap-1.5">
          <svg width="15" height="10" viewBox="0 0 15 10" class="flex-shrink-0">
            <rect x="0" y="7" width="2.5" height="3" rx="0.4" fill="white"/>
            <rect x="4" y="5" width="2.5" height="5" rx="0.4" fill="white"/>
            <rect x="8" y="2" width="2.5" height="8" rx="0.4" fill="white"/>
            <rect x="12" y="0" width="2.5" height="10" rx="0.4" fill="white"/>
          </svg>
          <svg width="15" height="10" viewBox="0 0 15 10" class="flex-shrink-0">
            <path d="M7.5 9a.6.6 0 100-1.2.6.6 0 000 1.2z" fill="white"/>
            <path d="M5.2 6.8a3.4 3.4 0 014.6 0" stroke="white" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            <path d="M3 4.3a6.6 6.6 0 019 0" stroke="white" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          </svg>
          <svg width="25" height="11" viewBox="0 0 25 11" class="flex-shrink-0">
            <rect x="0" y="0" width="21" height="11" rx="3" stroke="white" stroke-width="0.8" fill="none" opacity="0.6"/>
            <rect x="1.5" y="1.5" width="16" height="8" rx="1.5" fill="white"/>
            <rect x="22" y="3.5" width="2" height="4" rx="1" fill="white" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 微信导航栏 -->
    <div class="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-[#EDEDED] border-b border-[#D9D9D9]/50">
      <svg class="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15,18 9,12 15,6"/>
      </svg>
      <span class="text-[16px] font-semibold text-[#111111]">{{ title }}</span>
      <svg class="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="1.8"/>
        <circle cx="12" cy="12" r="1.8"/>
        <circle cx="12" cy="19" r="1.8"/>
      </svg>
    </div>

    <!-- 聊天消息区域 -->
    <div ref="messageList" class="flex-1 overflow-y-auto px-2 py-2 bg-[#EDEDED]">
      <div v-if="!store.hasContent" class="flex items-center justify-center h-full text-sm text-[#B0B0B0]">
        生成文案后这里将展示聊天预览
      </div>
      <ChatBubble
        v-for="msg in store.messages"
        :key="msg.id"
        :message="msg"
        :mode="config.chatMode"
      />
    </div>

    <!-- 底部输入栏 -->
    <ChatInput
      v-if="store.hasContent"
      :disabled="store.isGenerating"
      @send="handleFollowUp"
    />

    <!-- Home Indicator -->
    <div v-if="store.hasContent" class="flex-shrink-0 flex justify-center pb-2 bg-[#F7F7F7]">
      <div class="w-[134px] h-[5px] bg-black rounded-full"></div>
    </div>
    <div v-else class="flex-shrink-0 flex justify-center pb-2 bg-[#EDEDED]">
      <div class="w-[134px] h-[5px] bg-black/80 rounded-full"></div>
    </div>
  </div>

  <!-- ===== 手机端：无外框，纯微信聊天全屏 ===== -->
  <div class="md:hidden chat-preview-container w-full h-full flex flex-col bg-[#EDEDED]">
    <!-- 微信导航栏 -->
    <div class="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-[#EDEDED] border-b border-[#D9D9D9]/50">
      <svg class="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15,18 9,12 15,6"/>
      </svg>
      <span class="text-[16px] font-semibold text-[#111111]">{{ title }}</span>
      <svg class="w-5 h-5 text-[#111111]" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="5" r="1.8"/>
        <circle cx="12" cy="12" r="1.8"/>
        <circle cx="12" cy="19" r="1.8"/>
      </svg>
    </div>

    <!-- 聊天消息区域 -->
    <div ref="messageListMobile" class="flex-1 overflow-y-auto px-2 py-2 bg-[#EDEDED]">
      <div v-if="!store.hasContent" class="flex items-center justify-center h-full text-sm text-[#B0B0B0]">
        生成文案后这里将展示聊天预览
      </div>
      <ChatBubble
        v-for="msg in store.messages"
        :key="msg.id"
        :message="msg"
        :mode="config.chatMode"
      />
    </div>

    <!-- 底部输入栏 -->
    <ChatInput
      v-if="store.hasContent"
      :disabled="store.isGenerating"
      @send="handleFollowUp"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import ChatBubble from './ChatBubble.vue'
import ChatInput from './ChatInput.vue'

const store = useChatStore()
const config = useConfigStore()
const messageList = ref<HTMLElement>()
const messageListMobile = ref<HTMLElement>()

const title = computed(() => {
  if (config.chatMode === 'single') return config.singleNickname
  return `${config.groupName}(2)`
})

const emit = defineEmits<{
  followUp: [instruction: string]
}>()

function handleFollowUp(text: string) {
  emit('followUp', text)
}

watch(() => store.messages.length, () => {
  nextTick(() => {
    const el = messageList.value || messageListMobile.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
})
</script>