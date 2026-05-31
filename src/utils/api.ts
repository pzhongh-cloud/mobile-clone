import type { AIResponse } from '@/types'
import { useConfigStore } from '@/stores/config'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
}

const store = () => useConfigStore()
const API_TIMEOUT_MS = 120_000

// 公共：带超时的 API 请求
async function fetchWithTimeout(
  url: string,
  body: Record<string, unknown>,
  apiKey: string,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    return response
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('请求超时（120秒），请检查网络后重试')
    }
    throw e
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function callVisionAPI(
  systemPrompt: string,
  userContent: Array<{ type: string; text?: string; image_url?: { url: string } }>,
): Promise<AIResponse> {
  const s = store()
  const provider = s.currentProvider
  const endpoint = s.endpoints[provider]
  const model = s.models[provider]
  const apiKey = s.apiKeys[provider]

  if (!apiKey) throw new Error('API Key 未配置')
  if (!endpoint) throw new Error('API Endpoint 未配置')

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  const url = endpoint.endsWith('/') ? `${endpoint}chat/completions` : `${endpoint}/chat/completions`

  const response = await fetchWithTimeout(url, { model, messages, temperature: 0.8 }, apiKey)

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

  const url = endpoint.endsWith('/') ? `${endpoint}chat/completions` : `${endpoint}/chat/completions`

  const response = await fetchWithTimeout(url, { model, messages, temperature: 0.8 }, apiKey)

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
