export type MessageRole = 'assistant' | 'user'

export type MessageType = 'text' | 'image' | 'timestamp'

export interface ChatMessage {
  id: string
  role: MessageRole
  type: MessageType
  content: string
  speaker?: string
}

export interface ProductInfo {
  name: string
  highlights: string[]
}

export interface AIResponse {
  product: ProductInfo
  messages: {
    role: MessageRole
    type: MessageType
    content: string
    speaker?: string
  }[]
}

export type ModelProvider = 'qwen' | 'openai' | 'custom'

export interface ModelConfig {
  provider: ModelProvider
  endpoint: string
  model: string
  apiKey: string
}

export type ChatMode = 'single' | 'double'

export type CopyStyle = 'natural' | 'professional' | 'short'

export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error'

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
  statusBarTime: string
}

export interface APIError {
  message: string
  code?: string
}
