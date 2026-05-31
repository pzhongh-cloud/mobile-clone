import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage, GenerateStatus, ProductInfo } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const product = ref<ProductInfo | null>(null)
  const status = ref<GenerateStatus>('idle')
  const errorMessage = ref('')
  const images = ref<string[]>([])

  const hasContent = computed(() => messages.value.length > 0)
  const isGenerating = computed(() => status.value === 'loading')

  function addMessage(msg: ChatMessage) {
    messages.value.push(msg)
  }

  function setMessages(msgs: ChatMessage[]) {
    messages.value = msgs
  }

  function appendMessages(msgs: ChatMessage[]) {
    messages.value.push(...msgs)
  }

  function setImages(imgs: string[]) {
    images.value = imgs
  }

  function addImage(img: string) {
    images.value.push(img)
  }

  function removeImage(index: number) {
    images.value.splice(index, 1)
  }

  function setStatus(s: GenerateStatus) {
    status.value = s
  }

  function updateMessage(id: string, content: string) {
    const idx = messages.value.findIndex(m => m.id === id)
    if (idx !== -1) {
      messages.value[idx] = { ...messages.value[idx], content }
    }
  }

  function setError(msg: string) {
    errorMessage.value = msg
    status.value = 'error'
  }

  function setProduct(p: ProductInfo) {
    product.value = p
  }

  function reset() {
    messages.value = []
    product.value = null
    status.value = 'idle'
    errorMessage.value = ''
    images.value = []
  }

  return {
    messages, product, status, errorMessage, images,
    hasContent, isGenerating,
    addMessage, setMessages, appendMessages,
    setImages, addImage, removeImage,
    setStatus, setError, setProduct, updateMessage,
    reset,
  }
})
