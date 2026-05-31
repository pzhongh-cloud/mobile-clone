<template>
  <div>
    <label class="block text-sm font-medium text-gray-600 mb-2">上传商品图片</label>

    <!-- 上传区域 -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-wechat-green transition-colors"
      :class="{ 'border-wechat-green bg-green-50': isDragging }"
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        class="hidden"
        @change="handleFileChange"
      />
      <div class="text-wechat-gray text-sm">
        <div class="text-2xl mb-1">📁</div>
        <!-- 桌面端：拖拽提示 -->
        <div class="hidden md:block">点击或拖拽上传图片</div>
        <div class="hidden md:block text-xs mt-1">支持 PNG / JPG / WebP，单张最大 20MB</div>
        <!-- 手机端：点击提示 -->
        <div class="md:hidden">点击选择图片</div>
        <div class="md:hidden text-xs mt-1">支持 PNG / JPG / WebP</div>
      </div>
    </div>

    <div v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</div>

    <div v-if="store.images.length > 0" class="mt-3 flex gap-2 flex-wrap">
      <div
        v-for="(img, index) in store.images"
        :key="index"
        class="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200"
      >
        <img :src="img" class="w-full h-full object-cover" alt="缩略图" />
        <button
          class="absolute top-0 right-0 w-5 h-5 bg-black/50 text-white text-xs flex items-center justify-center rounded-bl-md"
          @click="store.removeImage(index)"
        >×</button>
      </div>
      <button
        class="w-16 h-16 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-wechat-gray text-2xl hover:border-wechat-green transition-colors"
        @click="triggerInput"
      >+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { validateImage, fileToBase64 } from '@/utils/image'

const store = useChatStore()
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const error = ref('')

function triggerInput() {
  fileInput.value?.click()
}

async function processFiles(files: FileList) {
  error.value = ''
  for (const file of files) {
    const err = validateImage(file)
    if (err) {
      error.value = err
      return
    }
    try {
      const base64 = await fileToBase64(file)
      store.addImage(base64)
    } catch {
      error.value = '图片处理失败'
    }
  }
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) processFiles(input.files)
  input.value = ''
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files) processFiles(e.dataTransfer.files)
}
</script>