<template>
  <div class="mt-3">
    <button
      class="w-full py-2.5 rounded-lg border border-wechat-green text-wechat-green font-medium text-sm hover:bg-green-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="!store.hasContent || exporting"
      @click="handleExport"
    >{{ exporting ? '导出中...' : '导出图片' }}</button>
    <div v-if="exportError" class="mt-2 text-sm text-red-500">{{ exportError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()
const exporting = ref(false)
const exportError = ref('')

async function handleExport() {
  exportError.value = ''
  exporting.value = true

  const el = document.querySelector('.chat-preview-container') as HTMLElement | null
  if (!el) {
    exportError.value = '未找到聊天框元素'
    exporting.value = false
    return
  }

  try {
    let canvas: HTMLCanvasElement | null = null
    for (let i = 0; i < 2; i++) {
      try {
        canvas = await html2canvas(el, {
          backgroundColor: '#EDEDED',
          scale: 2,
          useCORS: true,
        })
        break
      } catch {
        if (i === 1) throw new Error('导出超时')
      }
    }

    if (!canvas) throw new Error('导出失败')
    const link = document.createElement('a')
    link.download = `好物安利_${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e: any) {
    exportError.value = e.message ?? '导出失败，请尝试截图保存'
  } finally {
    exporting.value = false
  }
}
</script>
