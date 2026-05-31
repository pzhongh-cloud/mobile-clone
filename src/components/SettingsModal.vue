<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <div class="relative bg-white rounded-xl w-[480px] max-h-[80vh] overflow-y-auto shadow-xl">
        <div class="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">API 设置</h3>
          <button class="text-wechat-gray hover:text-black text-xl leading-none" @click="close">×</button>
        </div>

        <div class="px-6 py-4 space-y-5">
          <div v-for="p in providers" :key="p.key">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ p.label }}</label>
            <div class="space-y-2">
              <input
                v-model="config.apiKeys[p.key]"
                type="password"
                placeholder="API Key"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <input
                v-if="p.key === 'custom'"
                v-model="config.endpoints[p.key]"
                placeholder="API Endpoint"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <input
                v-if="p.key === 'custom'"
                v-model="config.models[p.key]"
                placeholder="模型名称"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
            </div>
          </div>

          <div class="pt-2 border-t">
            <label class="block text-sm font-medium text-gray-700 mb-2">角色名称设置</label>
            <div class="space-y-2">
              <input
                v-model="config.singleNickname"
                placeholder="单人模式昵称"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <input
                v-model="config.groupName"
                placeholder="双人模式群名"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <div class="flex gap-2">
                <input
                  v-model="config.doubleNicknames[0]"
                  placeholder="角色A昵称"
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
                />
                <input
                  v-model="config.doubleNicknames[1]"
                  placeholder="角色B昵称"
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
                />
              </div>
            </div>
          </div>

          <!-- 状态栏时间 -->
          <div class="pt-2 border-t">
            <label class="block text-sm font-medium text-gray-700 mb-2">状态栏时间</label>
            <input
              v-model="config.statusBarTime"
              placeholder="如 9:41"
              class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import type { ModelProvider } from '@/types'

const config = useConfigStore()

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function close() {
  emit('close')
}

const providers: { key: ModelProvider; label: string }[] = [
  { key: 'qwen', label: '通义千问 (Qwen) - 推荐' },
  { key: 'openai', label: 'OpenAI (GPT-4o)' },
  { key: 'custom', label: '自定义模型' },
]
</script>
