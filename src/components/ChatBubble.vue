<template>
  <!-- 时间戳（可点击编辑） -->
  <div v-if="message.type === 'timestamp'" class="flex justify-center my-3">
    <input
      v-if="editingId === message.id"
      ref="timeInput"
      v-model="editText"
      class="text-[11px] text-[#B0B0B0] bg-white/80 px-2 py-0.5 rounded text-center outline-none border border-[#95EC69]"
      maxlength="30"
      @blur="saveEdit"
      @keyup.enter="saveEdit"
      @keyup.escape="editingId = null"
    />
    <span
      v-else
      class="text-[11px] text-[#B0B0B0] bg-white/80 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200 transition-colors"
      @click="startEdit"
    >{{ message.content }}</span>
  </div>

  <!-- 图片消息 -->
  <div v-else-if="message.type === 'image'" class="flex mb-4 animate-fade-in-up" :class="isRight ? 'justify-end' : 'justify-start'">
    <img
      v-if="!isRight"
      :src="leftAvatarUrl"
      class="w-10 h-10 rounded-md flex-shrink-0 mr-3 object-cover"
    />
    <img
      :src="message.content"
      class="max-w-[60%] rounded-lg"
      alt="商品图"
    />
    <img
      v-if="isRight"
      :src="myAvatarUrl"
      class="w-10 h-10 rounded-md flex-shrink-0 ml-3 object-cover"
    />
  </div>

  <!-- 文字消息 -->
  <div v-else class="flex mb-4 animate-fade-in-up" :class="isRight ? 'justify-end' : 'justify-start'">
    <!-- 对方头像 -->
    <img
      v-if="!isRight"
      :src="leftAvatarUrl"
      class="w-10 h-10 rounded-md flex-shrink-0 mr-3 object-cover"
    />

    <div class="max-w-[70%]">
      <!-- 双人模式昵称 -->
      <div v-if="message.speaker && !isRight" class="text-[11px] text-[#8E8E93] mb-0.5 ml-0.5">{{ message.speaker }}</div>
      <div v-if="message.speaker && isRight" class="text-[11px] text-[#8E8E93] mb-0.5 mr-0.5 text-right">{{ message.speaker }}</div>

      <!-- 气泡（带三角） -->
      <div class="relative">
        <!-- 对方气泡三角 -->
        <svg v-if="!isRight" class="absolute left-[-5px] top-[14px]" width="6" height="12" viewBox="0 0 6 12">
          <polygon points="6,0 0,6 6,12" :fill="bubbleColor"/>
        </svg>

        <div
          class="px-3 py-2 text-[15px] leading-relaxed break-words rounded-lg"
          :class="isRight
            ? 'bg-wechat-green text-[#111111]'
            : 'bg-white text-[#111111]'"
          :style="!isRight && message.speaker ? { backgroundColor: bubbleColor } : {}"
        >{{ message.content }}</div>

        <!-- 我方气泡三角 -->
        <svg v-if="isRight" class="absolute right-[-5px] top-[14px]" width="6" height="12" viewBox="0 0 6 12">
          <polygon points="0,0 6,6 0,12" fill="#95EC69"/>
        </svg>
      </div>
    </div>

    <!-- 我的头像 -->
    <img
      v-if="isRight"
      :src="myAvatarUrl"
      class="w-10 h-10 rounded-md flex-shrink-0 ml-3 object-cover"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useConfigStore } from '@/stores/config'
import type { ChatMessage } from '@/types'
import { getAvatarForName, getMyAvatar } from '@/utils/avatar'

const props = defineProps<{
  message: ChatMessage
  mode: 'single' | 'double'
}>()

const chatStore = useChatStore()
const config = useConfigStore()
const isRight = computed(() => props.message.role === 'user')
const editingId = ref<string | null>(null)
const editText = ref('')
const timeInput = ref<HTMLInputElement>()

function startEdit() {
  editingId.value = props.message.id
  editText.value = props.message.content
  nextTick(() => timeInput.value?.focus())
}

function saveEdit() {
  if (editingId.value && editText.value.trim()) {
    chatStore.updateMessage(editingId.value, editText.value.trim())
  }
  editingId.value = null
}

const myAvatarUrl = computed(() => getMyAvatar())

const leftAvatarUrl = computed(() => {
  if (props.message.speaker) {
    return getAvatarForName(props.message.speaker)
  }
  return getAvatarForName('assistant')
})

const bubbleColor = computed(() => {
  if (props.message.speaker === config.doubleNicknames[0]) return '#FFF0F5'
  if (props.message.speaker === config.doubleNicknames[1]) return '#FFF8DC'
  return '#FFFFFF'
})
</script>
