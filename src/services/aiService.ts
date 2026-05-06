/**
 * 同频小Q AI 服务
 * 统一的大模型调用接口，覆盖所有AI功能场景
 */

import { callAI } from './hunyuan'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ==================== 系统提示词配置 ====================

const SYSTEM_PROMPTS = {
  // 智能回复助手
  replyAssistant: `你是同频小Q的智能回复助手。根据聊天上下文，生成自然、得体的回复建议。
要求：
1. 回复要符合对话语境和双方关系
2. 提供3种不同风格的回复（热情/温柔/幽默）
3. 每条回复30字以内，简洁自然
4. 适当使用emoji增加亲和力

请直接输出3条回复建议，用换行分隔。`,

  // 润色助手
  polishAssistant: `你是同频小Q的文本润色助手。帮助用户优化表达，让文字更生动得体。
润色维度：
1. 幽默风趣 - 增加趣味性
2. 文艺清新 - 提升文学感
3. 正式得体 - 适合正式场合
4. 温柔体贴 - 增加亲和力
5. 小Q风格 - 活泼俏皮

请根据用户选择的风格进行润色，保持原意但提升表达。`,

  // 话题推荐助手
  topicAssistant: `你是同频小Q的话题推荐助手。根据聊天上下文和用户兴趣，推荐合适的话题。
要求：
1. 话题要自然衔接当前对话
2. 考虑双方共同兴趣
3. 提供3-5个话题建议
4. 每个话题附带简短开场白

请输出话题列表，格式：话题名 - 开场白`,

  // 群聊总结助手
  summaryAssistant: `你是同频小Q的群聊总结助手。请基于用户提供的真实群聊记录进行分析，严格遵循以下规则：
1. 只总结聊天记录中真实出现的内容，不要编造任何不存在的信息
2. 投票统计必须基于成员实际发言中的表态进行计数
3. 重要信息必须来自聊天记录中的实际通知、链接、规则等
4. 群事件必须是聊天记录中明确提到的活动、生日、聚会等
5. 氛围分析基于实际用词和emoji判断

输出格式必须是JSON：
{
  "hotTopics": ["话题1", "话题2"],
  "decisions": [
    {
      "title": "决策标题",
      "type": "vote",
      "options": [{"name": "选项1", "votes": 3}, {"name": "选项2", "votes": 2}],
      "status": "进行中"
    }
  ],
  "important": ["重要信息1", "重要信息2"],
  "events": [{"type": "birthday/meeting/activity", "desc": "事件描述", "who": "相关人员"}],
  "activeMembers": ["成员1", "成员2"],
  "mood": "氛围描述"
}

注意：
- 如果某项没有内容，返回空数组
- votes票数根据发言中明确表态的人数统计（如"我投XX""我也投XX"算1票）
- 不要输出JSON以外的任何文字`,

  // 动态内容助手
  momentAssistant: `你是同频小Q的动态内容助手。帮助用户创作有趣的社交动态。
内容类型：
1. 日常分享 - 生活点滴
2. 心情感悟 - 情感表达
3. 趣味段子 - 轻松幽默
4. 知识分享 - 有价值的内容
5. 互动话题 - 引发讨论

请根据用户提供的素材或主题，生成吸引人的动态文案。`,

  // 内容创作助手
  contentAssistant: `你是同频小Q的内容创作助手。帮助用户创作各类社交内容。
创作类型：
1. 朋友圈文案
2. 个性签名
3. 群公告
4. 自我介绍
5. 节日祝福
6. 道歉/感谢信

请根据用户需求，生成合适的内容。`,

  // 社交建议助手
  socialAssistant: `你是同频小Q的社交建议助手。提供专业的社交技巧和关系建议。
建议维度：
1. 聊天技巧 - 如何开启/维持对话
2. 关系维护 - 增进亲密度
3. 冲突处理 - 化解尴尬/矛盾
4. 社交礼仪 - 得体表达
5. 情感分析 - 解读对方意图

请给出具体、可操作的建议。`,
}

// ==================== AI 功能接口 ====================

/**
 * 智能回复建议
 */
export async function getReplySuggestions(
  chatContext: string,
  friendName: string,
  style: 'all' | 'warm' | 'humor' | 'formal' = 'all'
): Promise<Array<{ style: string; text: string; emoji: string }>> {
  const prompt = `聊天对象：${friendName}
聊天上下文：
${chatContext}

请生成3条不同风格的回复建议：`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.replyAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })

    // 解析回复
    const lines = response.split('\n').filter(l => l.trim())
    const suggestions = lines.slice(0, 3).map((line, i) => {
      const styles = ['热情', '温柔', '幽默']
      const emojis = ['😎', '☺️', '🤖']
      return {
        style: styles[i] || '自然',
        text: line.replace(/^\d+\.\s*/, '').trim(),
        emoji: emojis[i] || '💬'
      }
    })

    return suggestions.length > 0 ? suggestions : getDefaultSuggestions(style)
  } catch {
    return getDefaultSuggestions(style)
  }
}

/**
 * 文本润色
 */
export async function polishText(
  text: string,
  style: 'humor' | 'literary' | 'formal' | 'warm' | 'xiaoq'
): Promise<string> {
  const styleNames: Record<string, string> = {
    humor: '幽默风趣',
    literary: '文艺清新',
    formal: '正式得体',
    warm: '温柔体贴',
    xiaoq: '小Q风格'
  }

  const prompt = `请将以下文本润色成「${styleNames[style]}」风格：

原文：${text}

润色要求：
1. 保持原意不变
2. 增加${styleNames[style]}的表达特点
3. 适当使用emoji
4. 输出润色后的文本，不要解释`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.polishAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.9 })

    return response.trim()
  } catch {
    return text
  }
}

/**
 * 话题推荐
 */
export async function getTopicSuggestions(
  chatContext: string,
  interests: string[] = []
): Promise<Array<{ topic: string; opening: string }>> {
  const prompt = `聊天上下文：
${chatContext}

用户兴趣：${interests.join(', ') || '未指定'}

请推荐3-5个合适的话题，每个话题附带一句开场白。`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.topicAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })

    // 解析话题
    const lines = response.split('\n').filter(l => l.trim() && l.includes('-'))
    return lines.map(line => {
      const [topic, opening] = line.split('-').map(s => s.trim())
      return { topic: topic.replace(/^\d+\.\s*/, ''), opening: opening || '' }
    })
  } catch {
    return getDefaultTopics()
  }
}

export interface VoteOption {
  name: string
  votes: number
}

export interface DecisionItem {
  title: string
  type: 'vote' | 'decision'
  options: VoteOption[]
  status: string
}

export interface GroupEvent {
  type: 'birthday' | 'meeting' | 'activity' | 'other'
  desc: string
  who: string
}

export interface GroupSummary {
  hotTopics: string[]
  decisions: DecisionItem[]
  important: string[]
  events: GroupEvent[]
  activeMembers: string[]
  mood: string
}

/**
 * 群聊总结
 */
export async function summarizeGroupChat(
  messages: Array<{ sender: string; content: string; time: string }>
): Promise<GroupSummary> {
  const chatText = messages.map(m => `[${m.time}] ${m.sender}: ${m.content}`).join('\n')

  const prompt = `以下是群聊的真实聊天记录，请严格基于这些记录进行分析，不要编造任何不存在的信息：

${chatText}

请输出JSON格式的分析结果。`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.summaryAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.5 })

    // 提取JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return {
        hotTopics: Array.isArray(data.hotTopics) ? data.hotTopics : [],
        decisions: Array.isArray(data.decisions) ? data.decisions : [],
        important: Array.isArray(data.important) ? data.important : [],
        events: Array.isArray(data.events) ? data.events : [],
        activeMembers: Array.isArray(data.activeMembers) ? data.activeMembers : [],
        mood: typeof data.mood === 'string' ? data.mood : '活跃',
      }
    }

    return getDefaultSummary()
  } catch {
    return getDefaultSummary()
  }
}

/**
 * 动态内容生成
 */
export async function generateMomentContent(
  type: 'daily' | 'mood' | 'funny' | 'knowledge' | 'interactive',
  theme: string,
  images?: string[]
): Promise<{ text: string; tags: string[]; suggestedTime: string }> {
  const typeNames: Record<string, string> = {
    daily: '日常分享',
    mood: '心情感悟',
    funny: '趣味段子',
    knowledge: '知识分享',
    interactive: '互动话题'
  }

  const prompt = `请生成一条「${typeNames[type]}」类型的社交动态。
主题：${theme}
${images ? `配图描述：${images.join(', ')}` : ''}

要求：
1. 文案吸引人，适合发朋友圈/动态
2. 包含3-5个相关话题标签
3. 建议发布时间
4. 适当使用emoji

请输出格式：
文案：
标签：
建议时间：` 

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.momentAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.9 })

    // 解析输出
    const text = extractSection(response, '文案') || response
    const tags = extractTags(extractSection(response, '标签'))
    const time = extractSection(response, '建议时间') || '现在'

    return { text, tags, suggestedTime: time }
  } catch {
    return {
      text: `今天${theme}，感觉还不错~ ✨`,
      tags: ['#生活', '#日常'],
      suggestedTime: '现在'
    }
  }
}

/**
 * 内容创作
 */
export async function createContent(
  type: 'signature' | 'announcement' | 'intro' | 'greeting' | 'apology',
  context: string
): Promise<string> {
  const typeNames: Record<string, string> = {
    signature: '个性签名',
    announcement: '群公告',
    intro: '自我介绍',
    greeting: '节日祝福',
    apology: '道歉/感谢信'
  }

  const prompt = `请创作一条「${typeNames[type]}」。
背景信息：${context}

要求：
1. 符合${typeNames[type]}的格式和语气
2. 简洁有力，不超过100字
3. 适当使用emoji
4. 直接输出内容，不要解释`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.contentAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.85 })

    return response.trim()
  } catch {
    return context
  }
}

/**
 * 社交建议
 */
export async function getSocialAdvice(
  situation: string,
  goal: string
): Promise<{ advice: string; tips: string[]; warnings: string[] }> {
  const prompt = `社交场景：${situation}
目标：${goal}

请提供专业的社交建议，包括：
1. 核心建议（简短有力）
2. 3-5个实用技巧
3. 需要注意的坑`

  try {
    const response = await callAI([
      { role: 'system', content: SYSTEM_PROMPTS.socialAssistant },
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })

    const sections = response.split(/\d+\./)
    return {
      advice: (sections[1] || '').trim() || '保持真诚，自然表达',
      tips: extractList(sections[2]),
      warnings: extractList(sections[3]),
    }
  } catch {
    return {
      advice: '保持真诚，自然表达',
      tips: ['倾听对方', '找共同话题', '适度幽默'],
      warnings: ['不要过于刻意', '避免敏感话题']
    }
  }
}

/**
 * 情感分析
 */
export async function analyzeEmotion(
  text: string
): Promise<{
  emotion: string
  intensity: number
  suggestions: string[]
}> {
  const prompt = `请分析以下文本的情感：

${text}

请输出：
1. 主要情感（如：开心、难过、生气、焦虑等）
2. 情感强度（1-10）
3. 3条回应建议`

  try {
    const response = await callAI([
      { role: 'system', content: '你是情感分析专家，擅长识别文本中的情绪并提供建议。' },
      { role: 'user', content: prompt }
    ], { temperature: 0.7 })

    const lines = response.split('\n').filter(l => l.trim())
    return {
      emotion: extractValue(lines[0]) || '中性',
      intensity: parseInt(extractValue(lines[1])) || 5,
      suggestions: lines.slice(2).map(l => l.replace(/^\d+\.\s*/, '')).filter(Boolean)
    }
  } catch {
    return { emotion: '中性', intensity: 5, suggestions: ['继续观察', '保持关心'] }
  }
}

// ==================== 工具函数 ====================

function getDefaultSuggestions(style: string): Array<{ style: string; text: string; emoji: string }> {
  const defaults: Record<string, Array<{ style: string; text: string; emoji: string }>> = {
    all: [
      { style: '热情', text: '好呀！听起来不错~ 🎉', emoji: '😎' },
      { style: '温柔', text: '嗯嗯，我懂你的意思 ☺️', emoji: '☺️' },
      { style: '幽默', text: '哈哈，你这个想法很有意思 🤣', emoji: '🤖' },
    ],
    warm: [{ style: '温柔', text: '我理解你的感受，慢慢来 ☺️', emoji: '☺️' }],
    humor: [{ style: '幽默', text: '哈哈，你这个太逗了 🤣', emoji: '🤖' }],
    formal: [{ style: '正式', text: '收到，我会认真考虑的', emoji: '👔' }],
  }
  return defaults[style] || defaults.all
}

function getDefaultTopics(): Array<{ topic: string; opening: string }> {
  return [
    { topic: '最近电影', opening: '最近有看什么好看的电影吗？' },
    { topic: '美食推荐', opening: '发现一家超好吃的店！' },
    { topic: '周末计划', opening: '周末有什么安排吗？' },
  ]
}

function getDefaultSummary(): GroupSummary {
  return {
    hotTopics: ['日常闲聊'],
    decisions: [],
    important: [],
    events: [],
    activeMembers: ['群成员'],
    mood: '活跃',
  }
}

function extractList(text: string): string[] {
  if (!text) return []
  return text.split(/[\n,，]/).map(s => s.trim()).filter(Boolean)
}

function extractSection(text: string, section: string): string {
  const regex = new RegExp(`${section}[：:]\s*([^\n]+)`)
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

function extractTags(text: string): string[] {
  if (!text) return []
  return text.match(/#[\w\u4e00-\u9fa5]+/g) || []
}

function extractValue(text: string): string {
  if (!text) return ''
  const parts = text.split(/[：:]/)
  return parts[parts.length - 1].trim()
}

// ==================== 导出 ====================

export const AI_SERVICE = {
  getReplySuggestions,
  polishText,
  getTopicSuggestions,
  summarizeGroupChat,
  generateMomentContent,
  createContent,
  getSocialAdvice,
  analyzeEmotion,
}

export default AI_SERVICE
