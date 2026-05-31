<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">AI 模型</label>
      <select
        v-model="config.currentProvider"
        class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
      >
        <option value="qwen">通义千问 (Qwen) - 推荐</option>
        <option value="openai">OpenAI (GPT-4o)</option>
        <option value="custom">自定义</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">聊天模式</label>
      <div class="flex gap-2">
        <button
          v-for="mode in modes"
          :key="mode.value"
          class="flex-1 py-2 text-sm rounded-md border transition-colors"
          :class="config.chatMode === mode.value
            ? 'border-wechat-green bg-green-50 text-green-700'
            : 'border-gray-200 text-gray-500 hover:border-gray-300'"
          @click="config.chatMode = mode.value"
        >{{ mode.label }}</button>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">文案风格</label>
      <div class="flex gap-2">
        <button
          v-for="s in styles"
          :key="s.value"
          class="flex-1 py-2 text-sm rounded-md border transition-colors"
          :class="config.copyStyle === s.value
            ? 'border-wechat-green bg-green-50 text-green-700'
            : 'border-gray-200 text-gray-500 hover:border-gray-300'"
          @click="config.copyStyle = s.value"
        >{{ s.label }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import type { ChatMode, CopyStyle } from '@/types'

const config = useConfigStore()

const modes: { label: string; value: ChatMode }[] = [
  { label: '🙋 单人安利', value: 'single' },
  { label: '👯 双人对话', value: 'double' },
]

const styles: { label: string; value: CopyStyle }[] = [
  { label: '💬 自然安利', value: 'natural' },
  { label: '📝 专业种草', value: 'professional' },
  { label: '⚡ 简短神评', value: 'short' },
]
</script>
