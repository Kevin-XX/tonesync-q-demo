/**
 * 混元大模型 API 服务
 * 腾讯混元 Hunyuan - 同频小Q 智能对话引擎
 * 
 * 使用方式：
 * 1. 在腾讯云控制台开通混元大模型服务
 * 2. 获取 SecretId 和 SecretKey
 * 3. 配置环境变量或在代码中替换
 */

import CryptoJS from 'crypto-js'

// ==================== 配置 ====================
// 通义千问 API 配置（OpenAI兼容格式）
const API_CONFIG = {
  apiKey: 'sk-955a872b1bbf4ae0870858e27889b4e4',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',  // 阿里云百炼API地址
  model: 'qwen-turbo',  // 通义千问模型
}

// ==================== 小Q人设配置 ====================
const XIAOQ_SYSTEM_PROMPT = `你是「同频小Q」，腾讯QQ的AI社交助手，是用户的智能伙伴和朋友。

你的特点：
1. **温暖贴心**：像朋友一样关心用户，善于察觉情绪
2. **聪明睿智**：知识渊博，能解答各种问题
3. **活泼有趣**：说话风格轻松活泼，偶尔俏皮
4. **社交专家**：熟悉QQ社交场景，能给出社交建议

你的能力：
- 智能对话：流畅自然的聊天
- 社交建议：提供聊天回复建议、社交技巧
- 情感陪伴：在用户需要时给予支持和安慰
- 知识解答：回答各类问题

回复原则：
- 亲切自然，像朋友聊天
- 适度使用emoji增加亲和力
- 复杂问题耐心解释
- 不确定的问题诚实告知

请以「同频小Q」的身份回复用户。`

// ==================== 类型定义 ====================
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface HunyuanRequest {
  Model: string
  Stream: boolean
  Messages: Message[]
  Temperature?: number
  TopP?: number
  MaxTokens?: number
}

interface HunyuanResponse {
  Id: string
  Created: number
  Choices: {
    Message: {
      Role: string
      Content: string
    }
    FinishReason: string
  }[]
  Usage: {
    PromptTokens: number
    CompletionTokens: number
    TotalTokens: number
  }
  RequestId: string
}

// ==================== API 签名工具 ====================
function formatSignedDate(date: Date): { date: string; datetime: string } {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  return {
    date: `${year}-${month}-${day}`,
    datetime: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`,
  }
}

function sha256Hex(message: string): string {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex)
}

function hmacSha256Hex(key: string, message: string): string {
  return CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Hex)
}

function buildSignature(
  secretId: string,
  secretKey: string,
  method: string,
  host: string,
  pathname: string,
  payload: string,
  datetime: string,
  date: string
): string {
  // 1. Canonical Request
  const hashedPayload = sha256Hex(payload)
  const canonicalRequest = [
    method,
    pathname,
    '',
    `content-type:application/json`,
    `host:${host}`,
    '',
    'content-type;host',
    sha256Hex(''),
  ].join('\n')

  // 2. String to Sign
  const algorithm = 'TC3-HMAC-SHA256'
  const credentialScope = `${date}/tc3_request`
  const hashedCanonicalRequest = sha256Hex(canonicalRequest)
  const stringToSign = [
    algorithm,
    datetime,
    credentialScope,
    hashedCanonicalRequest,
  ].join('\n')

  // 3. Calculate Signature
  const secretDate = hmacSha256Hex(`TC3${secretKey}`, date)
  const secretService = hmacSha256Hex(secretDate, 'tc3_request')
  const signature = hmacSha256Hex(secretService, stringToSign)

  // 4. Authorization Header
  return `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`
}

// ==================== 核心 API 调用 ====================
export async function callAI(
  messages: Message[],
  options?: {
    stream?: boolean
    temperature?: number
    onChunk?: (text: string) => void
  }
): Promise<string> {
  const { stream = false, temperature = 0.8, onChunk } = options || {}

  // 检查是否配置了API密钥
  if (!API_CONFIG.apiKey) {
    throw new Error('请先配置 API 密钥！')
  }

  const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages,
      stream,
      temperature,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API 调用失败: ${response.status} ${error}`)
  }

  if (stream && response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                fullContent += content
                onChunk?.(content)
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    }

    return fullContent
  } else {
    const data = await response.json()
    
    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content
    }
    
    throw new Error('API 返回格式异常')
  }
}

// ==================== 小Q对话接口 ====================
export interface ChatOptions {
  userMessage: string
  chatHistory?: Message[]
  stream?: boolean
  onChunk?: (text: string) => void
}

export async function xiaoqChat(options: ChatOptions): Promise<string> {
  const { userMessage, chatHistory = [], stream = false, onChunk } = options

  // 构建消息列表
  const messages: Message[] = [
    { role: 'system', content: XIAOQ_SYSTEM_PROMPT },
    ...chatHistory,
    { role: 'user', content: userMessage },
  ]

  try {
    return await callAI(messages, { stream, onChunk })
  } catch (error) {
    console.error('API调用失败:', error)
    throw error
  }
}

// ==================== 导出配置检查 ====================
export function checkApiConfig(): { configured: boolean; message: string } {
  if (!API_CONFIG.apiKey) {
    return {
      configured: false,
      message: '❌ 未配置 API 密钥',
    }
  }
  return {
    configured: true,
    message: `✅ API 已配置\n模型: ${API_CONFIG.model}`,
  }
}

// 导出配置供外部使用
export { API_CONFIG }
