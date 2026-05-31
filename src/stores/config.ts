import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ModelProvider, ChatMode, CopyStyle, AppConfig } from '@/types'

const STORAGE_KEY = 'tuwendaihuo-config'

function loadConfig(): Partial<AppConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

const defaults: AppConfig = {
  apiKeys: { qwen: '', openai: '', custom: '' },
  endpoints: {
    qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    openai: 'https://api.openai.com/v1',
    custom: '',
  },
  models: {
    qwen: 'qwen-vl-max',
    openai: 'gpt-4o',
    custom: '',
  },
  currentProvider: 'qwen',
  chatMode: 'single',
  copyStyle: 'natural',
  singleNickname: '好物安利菌',
  doubleNicknames: ['🌸小美', '🍊橙子'],
  groupName: '好物种草小分队',
  statusBarTime: '9:41',
}

export const useConfigStore = defineStore('config', () => {
  const saved = loadConfig()

  const apiKeys = ref<Record<ModelProvider, string>>({ ...defaults.apiKeys, ...saved.apiKeys })
  const endpoints = ref<Record<ModelProvider, string>>({ ...defaults.endpoints, ...saved.endpoints })
  const models = ref<Record<ModelProvider, string>>({ ...defaults.models, ...saved.models })
  const currentProvider = ref<ModelProvider>(saved.currentProvider ?? defaults.currentProvider)
  const chatMode = ref<ChatMode>(saved.chatMode ?? defaults.chatMode)
  const copyStyle = ref<CopyStyle>(saved.copyStyle ?? defaults.copyStyle)
  const singleNickname = ref(saved.singleNickname ?? defaults.singleNickname)
  const doubleNicknames = ref<[string, string]>(saved.doubleNicknames ?? defaults.doubleNicknames)
  const groupName = ref(saved.groupName ?? defaults.groupName)
  const statusBarTime = ref(saved.statusBarTime ?? defaults.statusBarTime)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      apiKeys: apiKeys.value,
      endpoints: endpoints.value,
      models: models.value,
      currentProvider: currentProvider.value,
      chatMode: chatMode.value,
      copyStyle: copyStyle.value,
      singleNickname: singleNickname.value,
      doubleNicknames: doubleNicknames.value,
      groupName: groupName.value,
      statusBarTime: statusBarTime.value,
    }))
  }

  watch([apiKeys, endpoints, models, currentProvider, chatMode, copyStyle, singleNickname, doubleNicknames, groupName, statusBarTime], persist, { deep: true })

  return { apiKeys, endpoints, models, currentProvider, chatMode, copyStyle, singleNickname, doubleNicknames, groupName, statusBarTime }
})

