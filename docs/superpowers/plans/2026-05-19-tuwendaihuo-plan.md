# 抖音图文带货生成器 - 实施计划

> **对于自动化执行者：** 推荐使用 subagent-driven-development 技能按任务逐个实施。步骤使用复选框 (`- [ ]`) 语法追踪。

**目标：** 构建一个纯前端 Web 应用，支持上传商品图片、调用 AI 大模型生成好物安利文案、以微信聊天框形式预览并导出图片。

**架构：** Vue 3 + TypeScript + Vite 单页应用，左侧操作区(上传/配置/生成) + 右侧预览区(微信聊天框)。Pinia 管理状态，Tailwind CSS 还原微信 UI，html2canvas 导出图片。直接从前端调用 OpenAI-compatible API。

**技术栈：** Vue 3, TypeScript, Vite, Pinia, Tailwind CSS, html2canvas

---

### Task 1: 项目脚手架搭建

**文件：**
- 创建: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.ts`, `src/App.vue`, `src/style.css`, `env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "tuwendaihuo",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13",
    "pinia": "^2.3.0",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.3",
    "typescript": "~5.7.3",
    "vite": "^6.2.4",
    "vue-tsc": "^2.2.8",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.3",
    "autoprefixer": "^10.4.21"
  }
}
```

- [ ] **Step 2: 安装依赖**

```bash
cd "d:\桌面\编程开发\程序开发\tuwendaihuo" && npm install
```

- [ ] **Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

- [ ] **Step 4: 创建 tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 5: 创建 tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "env.d.ts"]
}
```

- [ ] **Step 6: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wechat-bg': '#EDEDED',
        'wechat-green': '#95EC69',
        'wechat-gray': '#8E8E93',
        'wechat-light': '#B0B0B0',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 8: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 9: 创建 env.d.ts**

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 10: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>抖音图文带货生成器</title>
  </head>
  <body class="bg-gray-100">
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 11: 创建 src/style.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
}
```

- [ ] **Step 12: 创建 src/main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 13: 创建占位 src/App.vue**

```vue
<template>
  <div class="min-h-screen flex items-center justify-center text-2xl text-gray-400">
    抖音图文带货生成器
  </div>
</template>

<script setup lang="ts">
</script>
```

- [ ] **Step 14: 验证项目可运行**

```bash
cd "d:\桌面\编程开发\程序开发\tuwendaihuo" && npx vite build
```
预期：构建成功，无报错。

---

### Task 2: 类型定义

**文件：**
- 创建: `src/types/index.ts`

- [ ] **Step 1: 写入所有类型定义**

```typescript
/** 消息角色 */
export type MessageRole = 'assistant' | 'user'

/** 消息类型 */
export type MessageType = 'text' | 'image' | 'timestamp'

/** 单条消息 */
export interface ChatMessage {
  id: string
  role: MessageRole
  type: MessageType
  content: string
  /** 双人模式下的角色名 */
  speaker?: string
}

/** 商品识别结果 */
export interface ProductInfo {
  name: string
  highlights: string[]
}

/** AI 返回的 JSON 结构 */
export interface AIResponse {
  product: ProductInfo
  messages: {
    role: MessageRole
    type: MessageType
    content: string
    speaker?: string
  }[]
}

/** 模型提供商 */
export type ModelProvider = 'deepseek' | 'qwen' | 'openai' | 'custom'

/** 模型配置 */
export interface ModelConfig {
  provider: ModelProvider
  endpoint: string
  model: string
  apiKey: string
}

/** 聊天模式 */
export type ChatMode = 'single' | 'double'

/** 文案风格 */
export type CopyStyle = 'natural' | 'professional' | 'short'

/** 生成状态 */
export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error'

/** 全局配置 */
export interface AppConfig {
  apiKeys: Record<ModelProvider, string>
  endpoints: Record<ModelProvider, string>
  models: Record<ModelProvider, string>
  currentProvider: ModelProvider
  chatMode: ChatMode
  copyStyle: CopyStyle
  singleNickname: string
  doubleNicknames: [string, string]
  groupName: string
}

/** API 调用错误 */
export interface APIError {
  message: string
  code?: string
}
```

---

### Task 3: 配置 Store

**文件：**
- 创建: `src/stores/config.ts`

- [ ] **Step 1: 创建 config store**

```typescript
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
  apiKeys: { deepseek: '', qwen: '', openai: '', custom: '' },
  endpoints: {
    deepseek: 'https://api.deepseek.com/chat/completions',
    qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    openai: 'https://api.openai.com/v1',
    custom: '',
  },
  models: {
    deepseek: 'deepseek-chat',
    qwen: 'qwen-vl-max',
    openai: 'gpt-4o',
    custom: '',
  },
  currentProvider: 'deepseek',
  chatMode: 'single',
  copyStyle: 'natural',
  singleNickname: '好物安利菌',
  doubleNicknames: ['🌸小美', '🍊橙子'],
  groupName: '好物种草小分队',
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
    }))
  }

  watch([apiKeys, endpoints, models, currentProvider, chatMode, copyStyle, singleNickname, doubleNicknames, groupName], persist, { deep: true })

  return { apiKeys, endpoints, models, currentProvider, chatMode, copyStyle, singleNickname, doubleNicknames, groupName }
})
```

---

### Task 4: 聊天 Store

**文件：**
- 创建: `src/stores/chat.ts`

- [ ] **Step 1: 创建 chat store**

```typescript
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
    setStatus, setError, setProduct,
    reset,
  }
})
```

---

### Task 5: 图片工具函数

**文件：**
- 创建: `src/utils/image.ts`

- [ ] **Step 1: 创建图片处理工具**

```typescript
const MAX_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_WIDTH = 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return '仅支持 PNG、JPG、WebP 格式'
  }
  if (file.size > MAX_SIZE) {
    return '图片大小不能超过 20MB'
  }
  return null
}

export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width <= MAX_WIDTH) {
        resolve(file)
        return
      }
      const ratio = MAX_WIDTH / img.width
      const canvas = document.createElement('canvas')
      canvas.width = MAX_WIDTH
      canvas.height = img.height * ratio
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else resolve(file)
      }, file.type, 0.85)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Base64 转换失败'))
    reader.readAsDataURL(blob)
  })
}

export async function fileToBase64(file: File): Promise<string> {
  const compressed = await compressImage(file)
  return blobToBase64(compressed)
}
```

---

### Task 6: Prompt 工具函数

**文件：**
- 创建: `src/utils/prompt.ts`

- [ ] **Step 1: 创建 Prompt 组装工具**

```typescript
import type { ChatMode, CopyStyle } from '@/types'

const STYLE_TEMPLATES: Record<CopyStyle, string> = {
  natural: `你是一个真诚热情的朋友，擅长在生活中发现好物并安利给身边人。
写作风格：
- 口语化，多用"姐妹"、"真的"、"绝了"、"冲"等语气词
- 大量使用 emoji 表情
- 像朋友私下聊天一样自然，不用正式语言
- 每条消息不要太长，像微信打字一样`
  ,
  professional: `你是一个专业的产品测评博主，擅长深度种草。
写作风格：
- 突出产品核心卖点和参数
- 用使用场景来说服人（"早上赶时间的时候..."）
- 适当做对比（"之前用的XX总是..."）
- 条理清晰，但保持口语化
- 每条消息有信息量但不啰嗦`
  ,
  short: `你是一个金句频出的好物推荐达人。
写作风格：
- 每句话都要有冲击力，像标语一样
- 1-2 句话让人记住一个卖点
- 用关键词打中痛点（"懒人福音"、"早八人必备"）
- 消息短小精悍，每条不超过 30 字`
  ,
}

export function buildSystemPrompt(mode: ChatMode, style: CopyStyle): string {
  const stylePrompt = STYLE_TEMPLATES[style]

  if (mode === 'single') {
    return `${stylePrompt}

你是一个叫"{nickname}"的好物推荐达人。你要根据用户上传的商品图片，生成一段微信聊天对话。

规则：
1. 你扮演"{nickname}"这个角色(role="assistant")，发消息安利好物
2. 穿插少量"我"的回复(role="user")，简短即可，增加真实感
3. 对话中适当插入 type="image" 的消息（发商品图）
4. 开头加一条 type="timestamp" 的时间戳消息
5. 对话要自然流畅，不要生硬推销

严格返回 JSON 格式，不要包含 markdown 代码块标记：`
  }

  return `${stylePrompt}

你要生成一段两个朋友的微信聊天对话，她们在聊天中自然引出好物推荐。

角色 A："{nickname1}"，是发现好物的人，热情安利
角色 B："{nickname2}"，是朋友，表现出兴趣和好奇

规则：
1. 两个角色交替发言
2. 对话通过角色 A 自然引出商品（"诶我最近买了个..."）
3. 角色 B 要有真实反应（"链接发我！"、"好用吗？"）
4. 对话中适当插入 type="image" 的消息（发商品图）
5. 开头加一条 type="timestamp" 的时间戳消息
6. 每条消息带 speaker 字段，值为角色昵称

严格返回 JSON 格式，不要包含 markdown 代码块标记：`
}

export function buildUserPrompt(base64Images: string[]): Array<{ type: string; text?: string; image_url?: { url: string } }> {
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = []

  content.push({
    type: 'text',
    text: '请识别图片中的商品，然后生成推荐对话。',
  })

  for (const img of base64Images) {
    content.push({
      type: 'image_url',
      image_url: { url: img },
    })
  }

  return content
}

export function buildFollowUpPrompt(instruction: string): string {
  return `根据之前的上下文，按以下要求调整对话："${instruction}"。保持 JSON 格式不变。`
}

export function buildJSONFormatHint(): string {
  return `\n输出格式：
{
  "product": { "name": "商品名称", "highlights": ["卖点1", "卖点2", "卖点3"] },
  "messages": [
    { "role": "assistant", "type": "timestamp", "content": "当前时间" },
    { "role": "assistant", "type": "text", "content": "消息内容" },
    ...
  ]
}`
}
```

---

### Task 7: API 调用工具

**文件：**
- 创建: `src/utils/api.ts`

- [ ] **Step 1: 创建 API 调用封装**

```typescript
import type { AIResponse } from '@/types'
import { useConfigStore } from '@/stores/config'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
}

const store = () => useConfigStore()

export async function callVisionAPI(
  systemPrompt: string,
  userContent: Array<{ type: string; text?: string; image_url?: { url: string } }>,
): Promise<AIResponse> {
  const s = store()
  const provider = s.currentProvider
  const endpoint = s.endpoints[provider]
  const model = s.models[provider]
  const apiKey = s.apiKeys[provider]

  if (!apiKey) {
    throw new Error('API Key 未配置')
  }
  if (!endpoint) {
    throw new Error('API Endpoint 未配置')
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.8 }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API 调用失败 (${response.status}): ${body}`)
  }

  const data = await response.json()
  const rawContent = data.choices?.[0]?.message?.content ?? ''

  return parseAIResponse(rawContent)
}

export async function callChatAPI(
  messages: ChatMessage[],
): Promise<AIResponse> {
  const s = store()
  const provider = s.currentProvider
  const endpoint = s.endpoints[provider]
  const model = s.models[provider]
  const apiKey = s.apiKeys[provider]

  if (!apiKey) throw new Error('API Key 未配置')
  if (!endpoint) throw new Error('API Endpoint 未配置')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.8 }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API 调用失败 (${response.status}): ${body}`)
  }

  const data = await response.json()
  const rawContent = data.choices?.[0]?.message?.content ?? ''
  return parseAIResponse(rawContent)
}

function parseAIResponse(raw: string): AIResponse {
  let text = raw.trim()
  // 去除 markdown 代码块标记
  if (text.startsWith('```')) {
    const end = text.lastIndexOf('```')
    text = text.slice(text.indexOf('\n') + 1, end > 0 ? end : text.length)
  }

  try {
    const parsed = JSON.parse(text)
    return {
      product: parsed.product ?? { name: '未知商品', highlights: [] },
      messages: parsed.messages ?? [],
    }
  } catch {
    throw new Error('AI 返回格式异常，请重试')
  }
}
```

---

### Task 8: ChatBubble 组件

**文件：**
- 创建: `src/components/ChatBubble.vue`

- [ ] **Step 1: 创建消息气泡组件**

```vue
<template>
  <!-- 时间戳 -->
  <div v-if="message.type === 'timestamp'" class="flex justify-center my-3">
    <span class="text-xs text-wechat-light bg-white px-2 py-0.5 rounded">{{ message.content }}</span>
  </div>

  <!-- 图片消息 -->
  <div v-else-if="message.type === 'image'" class="flex mb-2" :class="isRight ? 'justify-end' : 'justify-start'">
    <img
      :src="message.content"
      class="max-w-[60%] rounded-lg"
      alt="商品图"
    />
  </div>

  <!-- 文字消息 -->
  <div v-else class="flex mb-2" :class="isRight ? 'justify-end' : 'justify-start'">
    <!-- 对方头像 -->
    <div v-if="!isRight" class="w-9 h-9 rounded-md bg-gray-400 flex-shrink-0 mr-2 flex items-center justify-center text-white text-xs">
      {{ avatarText }}
    </div>

    <div class="max-w-[70%]">
      <!-- 双人模式昵称 -->
      <div v-if="message.speaker && !isRight" class="text-xs text-wechat-gray mb-0.5 ml-0.5">{{ message.speaker }}</div>

      <!-- 气泡 -->
      <div
        class="px-3 py-2 text-[15px] leading-relaxed break-words"
        :class="isRight
          ? 'bg-wechat-green text-black rounded-bl-xl rounded-tl-xl rounded-br-md rounded-tr-xl'
          : 'bg-white text-black rounded-bl-md rounded-tl-md rounded-br-xl rounded-tr-xl'"
        :style="!isRight && speakerColor ? { backgroundColor: speakerColor } : {}"
      >{{ message.content }}</div>
    </div>

    <!-- 我的头像 -->
    <div v-if="isRight" class="w-9 h-9 rounded-md bg-wechat-green flex-shrink-0 ml-2 flex items-center justify-center text-white text-xs">
      我
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@/types'

const props = defineProps<{
  message: ChatMessage
  mode: 'single' | 'double'
}>()

const isRight = computed(() => props.message.role === 'user')
const avatarText = computed(() => props.message.speaker?.charAt(0) ?? '安')

const speakerColors: Record<string, string> = {
  '🌸小美': '#FFF0F5',
  '🍊橙子': '#FFF8DC',
}

const speakerColor = computed(() => {
  if (!props.message.speaker) return undefined
  return speakerColors[props.message.speaker]
})
</script>
```

---

### Task 9: ChatInput 组件

**文件：**
- 创建: `src/components/ChatInput.vue`

- [ ] **Step 1: 创建追加指令输入框组件**

```vue
<template>
  <div class="flex items-center gap-2 px-3 py-2 border-t bg-white">
    <input
      v-model="text"
      type="text"
      placeholder="输入补充指令，如「再简短一点」"
      class="flex-1 px-3 py-2 text-sm bg-wechat-bg rounded-md outline-none"
      :disabled="disabled"
      @keyup.enter="handleSend"
    />
    <button
      class="px-4 py-2 text-sm bg-wechat-green rounded-md font-medium disabled:opacity-50"
      :disabled="!text.trim() || disabled"
      @click="handleSend"
    >发送</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const text = ref('')

function handleSend() {
  const trimmed = text.value.trim()
  if (!trimmed || props.disabled) return
  emit('send', trimmed)
  text.value = ''
}
</script>
```

---

### Task 10: ChatPreview 组件

**文件：**
- 创建: `src/components/ChatPreview.vue`

- [ ] **Step 1: 创建聊天框预览容器组件**

```vue
<template>
  <div class="flex flex-col h-full bg-wechat-bg rounded-lg overflow-hidden shadow-lg">
    <!-- 顶部标题栏 -->
    <div class="text-center py-3 bg-white/90 border-b font-medium text-sm">
      {{ title }}
    </div>

    <!-- 消息列表 -->
    <div ref="messageList" class="flex-1 overflow-y-auto px-3 py-2">
      <div v-if="!store.hasContent" class="flex items-center justify-center h-full text-wechat-gray text-sm">
        生成文案后这里将展示微信聊天框预览
      </div>

      <ChatBubble
        v-for="msg in store.messages"
        :key="msg.id"
        :message="msg"
        :mode="config.chatMode"
      />
    </div>

    <!-- 底部输入 -->
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

const title = computed(() => {
  if (config.chatMode === 'single') return config.singleNickname
  return `${config.groupName}(${config.doubleNicknames.length + 1})`
})

const emit = defineEmits<{
  followUp: [instruction: string]
}>()

function handleFollowUp(text: string) {
  emit('followUp', text)
}

// 新消息到达时自动滚到底部
watch(() => store.messages.length, () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
})
</script>
```

---

### Task 11: ImageUploader 组件

**文件：**
- 创建: `src/components/ImageUploader.vue`

- [ ] **Step 1: 创建图片上传组件**

```vue
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
        <div class="text-2xl mb-1">📷</div>
        <div>点击或拖拽上传图片</div>
        <div class="text-xs mt-1">支持 PNG / JPG / WebP，单张最大 20MB</div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</div>

    <!-- 缩略图列表 -->
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
      <!-- 继续添加按钮 -->
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
```

---

### Task 12: ConfigSelector 组件

**文件：**
- 创建: `src/components/ConfigSelector.vue`

- [ ] **Step 1: 创建配置选择器组件**

```vue
<template>
  <div class="space-y-4">
    <!-- 模型选择 -->
    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">AI 模型</label>
      <select
        v-model="config.currentProvider"
        class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
      >
        <option value="deepseek">DeepSeek</option>
        <option value="qwen">通义千问 (Qwen)</option>
        <option value="openai">OpenAI (GPT-4o)</option>
        <option value="custom">自定义</option>
      </select>
    </div>

    <!-- 聊天模式 -->
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

    <!-- 文案风格 -->
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
```

---

### Task 13: GenerateButton 组件

**文件：**
- 创建: `src/components/GenerateButton.vue`

- [ ] **Step 1: 创建生成按钮组件**

```vue
<template>
  <div class="mt-4">
    <button
      class="w-full py-3 rounded-lg font-medium text-sm transition-all"
      :class="buttonClass"
      :disabled="store.isGenerating || disabled"
      @click="handleClick"
    >{{ buttonText }}</button>
    <div v-if="store.status === 'error'" class="mt-2 text-sm text-red-500">
      {{ store.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  generate: []
  retry: []
}>()

const buttonText = computed(() => {
  switch (store.status) {
    case 'loading': return '生成中...'
    case 'error': return '重试'
    case 'success': return '重新生成'
    default: return '生成文案'
  }
})

const buttonClass = computed(() => {
  switch (store.status) {
    case 'loading':
      return 'bg-gray-300 text-gray-500 cursor-wait'
    case 'error':
      return 'bg-red-500 text-white hover:bg-red-600'
    default:
      return store.images.length === 0
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-wechat-green text-black hover:bg-green-400'
  }
})

const disabled = computed(() => {
  if (store.isGenerating) return true
  if (store.status === 'success') return props.disabled ?? false
  return store.images.length === 0
})

function handleClick() {
  if (store.status === 'error') {
    emit('retry')
  } else {
    emit('generate')
  }
}
</script>
```

---

### Task 14: ExportButton 组件

**文件：**
- 创建: `src/components/ExportButton.vue`

- [ ] **Step 1: 创建导出按钮组件**

```vue
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
    // html2canvas 重试逻辑
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
```

---

### Task 15: SettingsModal 组件

**文件：**
- 创建: `src/components/SettingsModal.vue`

- [ ] **Step 1: 创建设置弹窗组件**

```vue
<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <!-- 弹窗 -->
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
                :placeholder="'API Key'"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <input
                v-if="p.key !== 'deepseek' && p.key !== 'openai'"
                v-model="config.endpoints[p.key]"
                placeholder="API Endpoint"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
              <input
                v-if="p.key !== 'deepseek' && p.key !== 'openai'"
                v-model="config.models[p.key]"
                placeholder="模型名称"
                class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-wechat-green"
              />
            </div>
          </div>

          <!-- 角色名称设置 -->
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
  { key: 'deepseek', label: 'DeepSeek' },
  { key: 'qwen', label: '通义千问 (Qwen)' },
  { key: 'openai', label: 'OpenAI (GPT-4o)' },
  { key: 'custom', label: '自定义模型' },
]
</script>
```

---

### Task 16: LeftPanel 组件

**文件：**
- 创建: `src/components/LeftPanel.vue`

- [ ] **Step 1: 创建左侧操作面板组件**

```vue
<template>
  <div class="w-[360px] flex-shrink-0 bg-white rounded-xl shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">图文带货生成器</h2>
      <button
        class="text-sm text-wechat-gray hover:text-black transition-colors"
        @click="showSettings = true"
      >⚙️ 设置</button>
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

    <!-- 底部使用提示 -->
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
import ImageUploader from './ImageUploader.vue'
import ConfigSelector from './ConfigSelector.vue'
import GenerateButton from './GenerateButton.vue'
import SettingsModal from './SettingsModal.vue'
import type { ChatMessage, AIResponse } from '@/types'

const store = useChatStore()
const config = useConfigStore()
const showSettings = ref(false)

// 保存对话历史用于上下文中追加指令
const conversationHistory = ref<Array<{ role: string; content: string }>>([])

function applyResponse(res: AIResponse) {
  store.setProduct(res.product)
  const messages: ChatMessage[] = res.messages.map((m, i) => ({
    id: `msg-${Date.now()}-${i}`,
    role: m.role,
    type: m.type,
    content: m.content,
    speaker: m.speaker,
  }))
  store.setMessages(messages)
  store.setStatus('success')
}

async function handleGenerate() {
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

    // 追加消息，保留已有内容
    const newMessages: ChatMessage[] = res.messages.map((m, i) => ({
      id: `msg-${Date.now()}-${i}`,
      role: m.role,
      type: m.type,
      content: m.content,
      speaker: m.speaker,
    }))
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
```

---

### Task 17: RightPanel 组件

**文件：**
- 创建: `src/components/RightPanel.vue`

- [ ] **Step 1: 创建右侧预览面板组件**

```vue
<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- 聊天框预览 -->
    <div class="flex-1 chat-preview-container">
      <ChatPreview @follow-up="handleFollowUp" />
    </div>

    <!-- 导出按钮 -->
    <ExportButton />
  </div>
</template>

<script setup lang="ts">
import ChatPreview from './ChatPreview.vue'
import ExportButton from './ExportButton.vue'

const emit = defineEmits<{
  followUp: [instruction: string]
}>()

function handleFollowUp(text: string) {
  emit('followUp', text)
}
</script>
```

---

### Task 18: App.vue 整合

**文件：**
- 覆写: `src/App.vue`

- [ ] **Step 1: 覆写 App.vue 组装整个应用**

```vue
<template>
  <div class="min-h-screen bg-gray-100 flex items-start justify-center p-5 gap-5">
    <LeftPanel ref="leftPanel" />
    <RightPanel @follow-up="handleFollowUp" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'

const leftPanel = ref<InstanceType<typeof LeftPanel>>()

function handleFollowUp(instruction: string) {
  leftPanel.value?.handleFollowUp(instruction)
}
</script>
```

- [ ] **Step 2: 最终验证**

```bash
cd "d:\桌面\编程开发\程序开发\tuwendaihuo" && npx vite build
```
预期：构建成功，无 TS 错误。
