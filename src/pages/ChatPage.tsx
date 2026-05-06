import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MoreHorizontal, Phone, Video, Send, Sparkles, 
  Wand2, Lightbulb, Smile, Mic, Palette, Loader2, Image, 
  Camera, FileText, Heart, ThumbsUp, Laugh, Frown, Angry,
  Check, CheckCheck, Clock, X
} from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import { useQState } from '../contexts/QStateContext'
import { xiaoqChat, checkApiConfig } from '../services/hunyuan'
import { AI_SERVICE } from '../services/aiService'

type TabType = 'reply' | 'polish' | 'topic' | 'emoji'
type ChatBg = 'default' | 'dark' | 'qtheme'
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error'

interface Message {
  id: number
  text: string
  isUser: boolean
  time: string
  isFlying?: boolean
  status?: MessageStatus
  type?: 'text' | 'image' | 'voice' | 'file'
  reactions?: string[]
}

// 小Q的默认消息
const xiaoqInitialMessages: Message[] = [
  { 
    id: 1, 
    text: '你好呀！我是同频小Q，你的AI社交助手~ 🤖✨', 
    isUser: false, 
    time: '14:20',
    status: 'read'
  },
  { 
    id: 2, 
    text: '我可以陪你聊天、解答问题，还能给你社交建议哦！有什么想聊的吗？', 
    isUser: false, 
    time: '14:21',
    status: 'read'
  },
]

// 普通聊天的默认消息（根据不同好友）
const getFriendInitialMessages = (friendName: string): Message[] => {
  const messages: Record<string, Message[]> = {
    '小晶': [
      { id: 1, text: '在干嘛呢？', isUser: false, time: '14:20', status: 'read' },
      { id: 2, text: '周末有空吗？想找你出去玩~', isUser: false, time: '14:21', status: 'read' },
    ],
    '小明': [
      { id: 1, text: '嘿，最近怎么样？', isUser: false, time: '昨天', status: 'read' },
    ],
    '小李': [
      { id: 1, text: '游戏攻略我发你了', isUser: false, time: '昨天', status: 'read' },
    ],
  }
  return messages[friendName] || [
    { id: 1, text: '你好！', isUser: false, time: '14:20', status: 'read' },
  ]
}

// 小Q的回复建议
const xiaoqReplySuggestions = [
  { id: 1, style: '打招呼', text: '你好小Q！很高兴认识你~', emoji: '👋' },
  { id: 2, style: '问问题', text: '你能帮我解答什么问题呢？', emoji: '🤔' },
  { id: 3, style: '闲聊', text: '今天心情不错，陪我聊聊天吧！', emoji: '😊' },
]

// 普通聊天的回复建议
const getFriendReplySuggestions = (friendName: string) => {
  const suggestions: Record<string, typeof xiaoqReplySuggestions> = {
    '小晶': [
      { id: 1, style: '热情', text: '有啊！想去哪里玩？我已经准备好做攻略了🎉', emoji: '😎' },
      { id: 2, style: '温柔', text: '周末有空哦，有什么安排吗？随时可以~', emoji: '☺️' },
      { id: 3, style: '幽默', text: '必须有！小Q说周末不约的人都是孤家寡人，我才不认命呢🤖', emoji: '🤖' },
    ],
    '小明': [
      { id: 1, style: '轻松', text: '还不错！你呢？最近忙什么呢？', emoji: '👋' },
      { id: 2, style: '关心', text: '挺好的，你呢？工作顺利吗？', emoji: '🤗' },
    ],
  }
  return suggestions[friendName] || xiaoqReplySuggestions
}

const emojiCategories = [
  { name: '常用', emojis: ['😊', '😎', '🤣', '💕', '🎉', '👍', '🔥', '✨', '😂', '🥰'] },
  { name: '表情', emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂'] },
  { name: '爱心', emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💟', '♥️', '💜'] },
  { name: '动物', emojis: ['🐧', '🐱', '🐶', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'] },
]

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡']

interface ChatPageProps {
  friendName: string
  friendAvatar: string
  convId: string
  onBack: () => void
  onUpdateConversation: (id: string, updates: { lastMsg?: string; time?: string; unread?: number }) => void
}

export function ChatPage({ friendName, friendAvatar, convId, onBack, onUpdateConversation }: ChatPageProps) {
  const isQSmall = friendName === '同频小Q'
  const [messages, setMessages] = useState<Message[]>(
    isQSmall ? xiaoqInitialMessages : getFriendInitialMessages(friendName)
  )
  const [showQPanel, setShowQPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('reply')
  const [inputText, setInputText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [qBubble, setQBubble] = useState('点我获取回复建议~')
  const [chatBg, setChatBg] = useState<ChatBg>('default')
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ style: string; text: string; emoji: string }>>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [polishedText, setPolishedText] = useState('')
  const [isPolishing, setIsPolishing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const avatarColor = isQSmall ? 'from-[#12B7F5] to-[#7C3AED]' : 'from-pink-400 to-rose-500'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 小Q专属状态
  const qState = useQState()
  const qLevel = qState?.level || 1
  const qExp = qState?.exp || 0
  const qIntimacy = qState?.intimacy || 0

  // 构建API调用用的消息历史
  const buildApiHistory = (msgs: typeof messages): { role: 'user' | 'assistant'; content: string }[] => {
    return msgs.filter(m => m.type === 'text' || !m.type).map(m => ({
      role: m.isUser ? 'user' : 'assistant',
      content: m.text
    }))
  }

  // 添加消息并自动滚动
  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg])
  }

  // 更新消息状态
  const updateMessageStatus = (id: number, status: MessageStatus) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  // 加载AI回复建议
  const loadAiSuggestions = async () => {
    setIsLoadingSuggestions(true)
    try {
      const context = messages.slice(-5).map(m => `${m.isUser ? '我' : friendName}: ${m.text}`).join('\n')
      const suggestions = await AI_SERVICE.getReplySuggestions(context, friendName)
      setAiSuggestions(suggestions)
    } catch {
      // 使用默认建议
      setAiSuggestions(isQSmall ? xiaoqReplySuggestions : getFriendReplySuggestions(friendName))
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // 润色文本
  const handlePolish = async (style: 'humor' | 'literary' | 'formal' | 'warm' | 'xiaoq') => {
    if (!inputText.trim()) return
    setIsPolishing(true)
    try {
      const polished = await AI_SERVICE.polishText(inputText, style)
      setPolishedText(polished)
      setInputText(polished)
    } catch {
      // 保持原文
    } finally {
      setIsPolishing(false)
    }
  }

  const handleSendSuggestion = async (text: string) => {
    setIsThinking(true)
    setShowQPanel(false)
    setQBubble('发送中...')
    
    const tempId = Date.now()
    const sendTime = formatTime()
    // 先加一条带飞行特效的
    addMessage({ id: tempId, text, isUser: true, time: sendTime, isFlying: true, status: 'sending' })
    
    // 同步到消息列表
    onUpdateConversation(convId, { lastMsg: `[我] ${text}`, time: sendTime })
    
    // 模拟发送过程
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, isFlying: false, status: 'sent' } : m))
      
      // 1秒后标记为已送达
      setTimeout(() => {
        updateMessageStatus(tempId, 'delivered')
      }, 1000)
      
      // 如果是与小Q聊天，使用API获取回复
      if (isQSmall) {
        const config = checkApiConfig()
        if (config.configured) {
          const history = buildApiHistory(messages.slice(-6))
          
          setQBubble('小Q正在思考...')
          
          try {
            xiaoqChat({
              userMessage: `对方说"${text}"后没回复，请生成一个对方可能的后续回复（简短、自然，30字以内）。直接回复内容，不要解释。`,
              chatHistory: history
            }).then(response => {
              setIsThinking(false)
              setQBubble('收到回复啦！✨')
              
              const replyId = Date.now() + 1
              addMessage({ 
                id: replyId, 
                text: response.slice(0, 100), 
                isUser: false, 
                time: formatTime(),
                status: 'read'
              })
              setQBubble('同频小Q')
              
              // 增加亲密度
              qState?.addIntimacy?.(3)
            })
          } catch {
            setIsThinking(false)
            setQBubble('收到回复啦！✨')
            addMessage({ 
              id: Date.now() + 1, 
              text: '好耶！那周六我做攻略 😆', 
              isUser: false, 
              time: formatTime(),
              status: 'read'
            })
            setQBubble('同频小Q')
          }
        } else {
          setIsThinking(false)
          setQBubble('发出去啦！✨')
          addMessage({ 
            id: Date.now() + 1, 
            text: '好耶！那周六我做攻略 😆', 
            isUser: false, 
            time: formatTime(),
            status: 'read'
          })
          setQBubble('点我获取回复建议~')
        }
      } else {
        // 普通聊天使用默认回复
        setIsThinking(false)
        setQBubble('发出去啦！✨')
        setTimeout(() => {
          const replyTime = formatTime()
          const replyText = '好耶！那周六我做攻略 😆'
          addMessage({ 
            id: Date.now() + 1, 
            text: replyText, 
            isUser: false, 
            time: replyTime,
            status: 'read'
          })
          // 同步对方回复到消息列表
          onUpdateConversation(convId, { lastMsg: `[${friendName}] ${replyText}`, time: replyTime })
          setQBubble('对方回复了~')
        }, 1500)
      }
    }, 800)
  }

  // 调用API发送消息
  const handleSend = async () => {
    if (!inputText.trim()) return
    
    const userMessage = inputText.trim()
    setInputText('')
    setShowEmojiPicker(false)
    
    const tempId = Date.now()
    
    // 如果是同频小Q聊天，调用真实API
    if (isQSmall) {
      const config = checkApiConfig()
      
      // 先显示用户消息
      addMessage({ 
        id: tempId, 
        text: userMessage, 
        isUser: true, 
        time: formatTime(),
        status: 'sending'
      })
      
      // 同步到消息列表
      onUpdateConversation(convId, { lastMsg: `[我] ${userMessage}`, time: formatTime() })

      // 模拟发送状态变化
      setTimeout(() => updateMessageStatus(tempId, 'sent'), 500)
      setTimeout(() => updateMessageStatus(tempId, 'delivered'), 1500)

      // 显示小Q正在输入
      setIsThinking(true)
      setQBubble('小Q正在思考...')
      
      // 构建聊天历史（限制最近10条）
      const history = buildApiHistory(messages.slice(-10))
      
      if (config.configured) {
        try {
          const response = await xiaoqChat({
            userMessage: userMessage,
            chatHistory: history,
            stream: false
          })
          
          setIsThinking(false)
          setQBubble('同频小Q')
          
          // 添加小Q的回复
          const qReplyTime = formatTime()
          addMessage({ 
            id: Date.now(), 
            text: response, 
            isUser: false, 
            time: qReplyTime,
            status: 'read'
          })
          
          // 同步到消息列表
          onUpdateConversation(convId, { lastMsg: `[同频小Q] ${response.slice(0, 20)}...`, time: qReplyTime })
          
          // 增加亲密度和经验
          qState?.addIntimacy?.(5)
          qState?.addExp?.(3)
          
        } catch (error) {
          setIsThinking(false)
          setQBubble('同频小Q')
          
          const errorMsg = error instanceof Error ? error.message : '网络有点问题...'
          addMessage({ 
            id: Date.now(), 
            text: `抱歉，我现在有点忙不过来 😅 可以稍后再试试吗？\n\n（API调用失败：${errorMsg}）`, 
            isUser: false, 
            time: formatTime(),
            status: 'read'
          })
        }
      } else {
        setIsThinking(false)
        setQBubble('同频小Q')
        addMessage({ 
          id: Date.now(), 
          text: `嗨！👋 我是同频小Q！\n\n要和我真正聊天吗？需要先配置 API 密钥哦~`, 
          isUser: false, 
          time: formatTime(),
          status: 'read'
        })
      }
    } else {
      // 普通聊天保持原有逻辑
      const sendTime = formatTime()
      addMessage({ 
        id: tempId, 
        text: userMessage, 
        isUser: true, 
        time: sendTime,
        status: 'sent'
      })
      // 同步到消息列表
      onUpdateConversation(convId, { lastMsg: `[我] ${userMessage}`, time: sendTime })
    }
  }

  // 添加表情反应
  const addReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const reactions = m.reactions || []
        if (reactions.includes(emoji)) {
          return { ...m, reactions: reactions.filter(r => r !== emoji) }
        }
        return { ...m, reactions: [...reactions, emoji] }
      }
      return m
    }))
  }

  // 格式化时间
  const formatTime = () => {
    return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 渲染消息状态图标
  const renderMessageStatus = (status?: MessageStatus) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-[#12B7F5]" />
      case 'error':
        return <X className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  const bgClass = `chat-bg-${chatBg}`

  return (
    <div className="flex flex-col h-full relative">
      {/* QQ聊天顶部栏 */}
      <div className="bg-gradient-to-r from-[#12B7F5] to-[#7C3AED] px-3 py-2.5 flex items-center justify-between relative">
        {isQSmall && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/4 w-12 h-12 bg-white/5 rounded-full translate-y-1/2" />
          </div>
        )}
        <div className="flex items-center gap-2 relative z-10">
          <button onClick={onBack} className="p-1.5 -ml-1">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            {isQSmall ? (
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-lg">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                  <ellipse cx="50" cy="65" rx="30" ry="28" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="70" rx="20" ry="18" fill="white"/>
                  <ellipse cx="22" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(-10 22 60)"/>
                  <ellipse cx="78" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(10 78 60)"/>
                  <circle cx="50" cy="38" r="24" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="42" rx="16" ry="14" fill="white"/>
                  <ellipse cx="32" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="68" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="42" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="58" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="43" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <ellipse cx="59" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <circle cx="44" cy="37" r="1.5" fill="white"/>
                  <circle cx="60" cy="37" r="1.5" fill="white"/>
                  <path d="M 44 50 Q 50 56 56 50" stroke="#ff9f43" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="50" cy="55" rx="26" ry="5" fill="#FF6B35"/>
                  <rect x="38" y="53" width="20" height="4" rx="1" fill="#FF6B35"/>
                  <rect x="42" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                  <rect x="48" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                </svg>
              </div>
            ) : (
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold`}>
                {friendAvatar}
              </div>
            )}
            <div>
              <div className="text-white font-bold text-[15px] leading-tight">{friendName}</div>
              {isQSmall ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-white/90 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">Lv.{qLevel}</span>
                  <span className="text-white/70 text-[10px]">亲密度 {qIntimacy}</span>
                </div>
              ) : (
                <div className="text-white/70 text-[11px]">在线</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          {!isQSmall && (
            <>
              <button className="p-1.5"><Phone className="w-5 h-5 text-white" /></button>
              <button className="p-1.5"><Video className="w-5 h-5 text-white" /></button>
            </>
          )}
          {isQSmall && (
            <button className="p-1.5 bg-white/20 rounded-lg" title="小Q设置">
              <Sparkles className="w-5 h-5 text-white" />
            </button>
          )}
          <button className="p-1.5"><MoreHorizontal className="w-5 h-5 text-white" /></button>
          {!isQSmall && (
            <button onClick={() => setShowThemePicker(o => !o)} className="p-1.5">
              <Palette className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        {/* 主题选择器 - 仅非小Q聊天 */}
        <AnimatePresence>
          {!isQSmall && showThemePicker && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-3 mt-1 bg-white/95 backdrop-blur rounded-xl shadow-lg p-2 flex gap-2 z-50"
            >
              {([
                { id: 'default' as ChatBg, color: '#EDEDED', label: '素雅' },
                { id: 'dark' as ChatBg, color: '#1a2744', label: '深夜' },
                { id: 'qtheme' as ChatBg, color: '#e0f2fe', label: '小Q' },
              ]).map(theme => (
                <button
                  key={theme.id}
                  onClick={() => { setChatBg(theme.id); setShowThemePicker(false) }}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${chatBg === theme.id ? 'border-[#12B7F5] scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: theme.color }}
                  title={theme.label}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 消息区域 */}
      <div className={`flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-3 ${bgClass}`} style={{ paddingBottom: showQPanel ? '380px' : '80px' }}>
        {/* 时间戳 */}
        <div className="text-center">
          <span className="text-[11px] text-gray-400 bg-black/5 px-2 py-0.5 rounded-full">{formatTime()}</span>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
          >
            {/* 对方头像 */}
            {!msg.isUser && (
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-[#12B7F5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md`}>
                {isQSmall ? (
                  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                    <ellipse cx="50" cy="65" rx="30" ry="28" fill="#1a1a1a"/>
                    <ellipse cx="50" cy="70" rx="20" ry="18" fill="white"/>
                    <ellipse cx="22" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(-10 22 60)"/>
                    <ellipse cx="78" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(10 78 60)"/>
                    <circle cx="50" cy="38" r="24" fill="#1a1a1a"/>
                    <ellipse cx="50" cy="42" rx="16" ry="14" fill="white"/>
                    <ellipse cx="32" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                    <ellipse cx="68" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                    <ellipse cx="42" cy="38" rx="7" ry="8" fill="white"/>
                    <ellipse cx="58" cy="38" rx="7" ry="8" fill="white"/>
                    <ellipse cx="43" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                    <ellipse cx="59" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                    <circle cx="44" cy="37" r="1.5" fill="white"/>
                    <circle cx="60" cy="37" r="1.5" fill="white"/>
                    <path d="M 44 50 Q 50 56 56 50" stroke="#ff9f43" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <ellipse cx="50" cy="55" rx="26" ry="5" fill="#FF6B35"/>
                    <rect x="38" y="53" width="20" height="4" rx="1" fill="#FF6B35"/>
                    <rect x="42" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                    <rect x="48" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                  </svg>
                ) : (
                  <span className="text-sm">{friendAvatar}</span>
                )}
              </div>
            )}

            <div className={`max-w-[72%] ${msg.isUser ? 'items-end' : 'items-start'} flex flex-col`}>
              {/* 消息气泡 */}
              <motion.div
                layoutId={`bubble-${msg.id}`}
                initial={msg.isFlying ? { opacity: 0, y: 30, scale: 0.8, x: -20 } : false}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`px-3 py-2.5 rounded-2xl text-[14px] leading-relaxed relative ${
                  msg.isUser
                    ? `message-bubble-self bg-gradient-to-r from-[#12B7F5] to-[#7C3AED] text-white rounded-tr-sm shadow-md`
                    : isQSmall
                    ? 'message-bubble-other bg-gradient-to-br from-white to-blue-50 text-gray-800 rounded-tl-sm shadow-md border-2 border-[#7C3AED]/20'
                    : 'message-bubble-other bg-white text-gray-800 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.isUser && (
                  <div className="absolute -right-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[7px] border-l-[#12B7F5]" />
                )}
                {!msg.isUser && (
                  <div className="absolute -left-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[7px] border-r-white" />
                )}
                {msg.text}
                
                {/* 表情反应 */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {msg.reactions.map((emoji, i) => (
                      <span key={i} className="text-xs bg-white/20 rounded-full px-1">{emoji}</span>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* 时间和状态 */}
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[10px] ${chatBg === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>{msg.time}</span>
                {msg.isUser && renderMessageStatus(msg.status)}
              </div>
            </div>

            {/* 自己头像 */}
            {msg.isUser && (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12B7F5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md overflow-hidden">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                  <ellipse cx="50" cy="65" rx="30" ry="28" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="70" rx="20" ry="18" fill="white"/>
                  <ellipse cx="22" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(-10 22 60)"/>
                  <ellipse cx="78" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(10 78 60)"/>
                  <circle cx="50" cy="38" r="24" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="42" rx="16" ry="14" fill="white"/>
                  <ellipse cx="32" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="68" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="42" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="58" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="43" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <ellipse cx="59" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <circle cx="44" cy="37" r="1.5" fill="white"/>
                  <circle cx="60" cy="37" r="1.5" fill="white"/>
                  <path d="M 44 50 Q 50 56 56 50" stroke="#ff9f43" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="50" cy="55" rx="26" ry="5" fill="#FF6B35"/>
                  <rect x="38" y="53" width="20" height="4" rx="1" fill="#FF6B35"/>
                  <rect x="42" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                  <rect x="48" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                </svg>
              </div>
            )}
          </motion.div>
        ))}

        {/* AI思考中 */}
        <AnimatePresence>
          {isThinking && isQSmall && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#12B7F5] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
                  <ellipse cx="50" cy="65" rx="30" ry="28" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="70" rx="20" ry="18" fill="white"/>
                  <ellipse cx="22" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(-10 22 60)"/>
                  <ellipse cx="78" cy="60" rx="8" ry="14" fill="#1a1a1a" transform="rotate(10 78 60)"/>
                  <circle cx="50" cy="38" r="24" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="42" rx="16" ry="14" fill="white"/>
                  <ellipse cx="32" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="68" cy="45" rx="5" ry="3" fill="#FFB6C1" opacity="0.7"/>
                  <ellipse cx="42" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="58" cy="38" rx="7" ry="8" fill="white"/>
                  <ellipse cx="43" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <ellipse cx="59" cy="39" rx="4" ry="5" fill="#1a1a1a"/>
                  <circle cx="44" cy="37" r="1.5" fill="white"/>
                  <circle cx="60" cy="37" r="1.5" fill="white"/>
                  <path d="M 44 50 Q 50 56 56 50" stroke="#ff9f43" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="50" cy="55" rx="26" ry="5" fill="#FF6B35"/>
                  <rect x="38" y="53" width="20" height="4" rx="1" fill="#FF6B35"/>
                  <rect x="42" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                  <rect x="48" y="53" width="4" height="4" rx="1" fill="#FFE4B5" opacity="0.6"/>
                </svg>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[70%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#12B7F5] animate-spin" />
                  <span className="text-sm text-gray-500">小Q正在思考...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* 小Q面板 */}
      <AnimatePresence>
        {showQPanel && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-[58px] left-0 right-0 bg-white border-t border-gray-200 z-20 rounded-t-2xl shadow-2xl max-h-[60vh] overflow-hidden"
          >
            {/* 小Q面板头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#12B7F5]/5 to-blue-50">
              <div className="flex items-center gap-2">
                <PenguinQ size={36} outfit="default" mood="thinking" animated={false} />
                <div>
                  <div className="text-[13px] font-bold text-[#12B7F5]">同频小Q</div>
                  <div className="text-[10px] text-gray-400">{qBubble}</div>
                </div>
              </div>
              <button onClick={() => setShowQPanel(false)} className="text-gray-400 text-lg px-2">✕</button>
            </div>

            {/* 功能Tab */}
            <div className="flex border-b border-gray-100 bg-white">
              {[
                { id: 'reply' as TabType, label: '智能回复', icon: Sparkles },
                { id: 'polish' as TabType, label: '润色', icon: Wand2 },
                { id: 'topic' as TabType, label: '话题', icon: Lightbulb },
                { id: 'emoji' as TabType, label: '表情', icon: Smile },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors relative ${
                    activeTab === tab.id ? 'text-[#12B7F5]' : 'text-gray-400'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="qPanelTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-[#12B7F5] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 功能内容 */}
            <div className="p-3 max-h-[200px] overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'reply' && (
                  <motion.div key="reply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] text-gray-400">💡 小Q建议回复：</p>
                      {isLoadingSuggestions && (
                        <div className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 text-[#12B7F5] animate-spin" />
                          <span className="text-[10px] text-gray-400">AI生成中...</span>
                        </div>
                      )}
                    </div>
                    {isLoadingSuggestions ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      (aiSuggestions.length > 0 ? aiSuggestions : (isQSmall ? xiaoqReplySuggestions : getFriendReplySuggestions(friendName))).map((s, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendSuggestion(s.text)}
                          className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-[#12B7F5]/5 border border-gray-100 flex items-start gap-2 transition-colors"
                        >
                          <span className="text-lg flex-shrink-0">{s.emoji}</span>
                          <div className="flex-1">
                            <span className="text-[10px] text-[#12B7F5] mb-0.5 block">{s.style}</span>
                            <p className="text-[13px] text-gray-700">{s.text}</p>
                          </div>
                          <Send className="w-4 h-4 text-[#12B7F5] self-center flex-shrink-0" />
                        </motion.button>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'polish' && (
                  <motion.div key="polish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <textarea
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="输入你想润色的内容..."
                      className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#12B7F5] text-gray-700"
                      rows={3}
                    />
                    {polishedText && (
                      <div className="p-3 rounded-xl bg-[#12B7F5]/5 border border-[#12B7F5]/20">
                        <p className="text-[10px] text-[#12B7F5] mb-1">✨ 润色结果：</p>
                        <p className="text-[13px] text-gray-700">{polishedText}</p>
                      </div>
                    )}
                    {isPolishing ? (
                      <button className="w-full py-2.5 bg-gray-300 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI润色中...
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePolish('xiaoq')}
                        className="w-full py-2.5 bg-[#12B7F5] text-white rounded-xl font-bold text-sm"
                      >
                        ✨ 一键润色
                      </button>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: '幽默风趣', value: 'humor' as const },
                        { label: '文艺清新', value: 'literary' as const },
                        { label: '正式得体', value: 'formal' as const },
                        { label: '温柔体贴', value: 'warm' as const },
                        { label: '小Q风格', value: 'xiaoq' as const },
                      ].map(s => (
                        <button
                          key={s.value}
                          onClick={() => handlePolish(s.value)}
                          disabled={isPolishing || !inputText.trim()}
                          className="px-3 py-1.5 rounded-full bg-gray-100 text-[11px] text-gray-500 hover:bg-[#12B7F5]/10 hover:text-[#12B7F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'topic' && (
                  <motion.div key="topic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <p className="text-[11px] text-gray-400 mb-2">🎯 基于共同兴趣推荐话题：</p>
                    {['最近上映的《沙丘2》你看了吗？特效超赞 🎬', '周末有草莓采摘，要不要一起去？🍓', '你上次说的那家咖啡店，我也想去试试 ☕'].map((t, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendSuggestion(t)}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 text-[13px] text-gray-700 border border-gray-100 hover:bg-[#12B7F5]/5 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'emoji' && (
                  <motion.div key="emoji" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="grid grid-cols-5 gap-2">
                      {['😊', '😎', '🤣', '💕', '🎉', '🎮', '☕', '🍓', '🔥', '✨'].map((e, i) => (
                        <button key={i} onClick={() => setInputText(prev => prev + e)} className="text-2xl p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:scale-110">
                          {e}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 表情选择器 */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="absolute bottom-[70px] left-0 right-0 bg-white border-t border-gray-200 z-20 rounded-t-2xl shadow-lg"
          >
            {/* 分类标签 */}
            <div className="flex border-b border-gray-100 px-2">
              {emojiCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveEmojiCategory(i)}
                  className={`px-3 py-2 text-[12px] font-medium transition-colors ${
                    activeEmojiCategory === i ? 'text-[#12B7F5] border-b-2 border-[#12B7F5]' : 'text-gray-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            {/* 表情网格 */}
            <div className="p-3 grid grid-cols-8 gap-2 max-h-[200px] overflow-y-auto">
              {emojiCategories[activeEmojiCategory].emojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(prev => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-2xl p-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部输入栏 */}
      <div className={`absolute bottom-0 left-0 right-0 px-2 py-2 z-10 ${
        isQSmall 
          ? 'bg-gradient-to-t from-[#7C3AED]/10 to-transparent' 
          : 'bg-[#F7F7F7] border-t border-gray-200'
      }`}>
        {/* 小Q状态条 */}
        {isQSmall && (
          <div className="px-2 pb-2">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-xl px-3 py-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] text-[#7C3AED]">
                <Sparkles className="w-3 h-3" />
                <span>Lv.{qLevel}</span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 text-[10px] text-gray-500">
                <span>经验</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#12B7F5] to-[#7C3AED] rounded-full" style={{ width: `${qExp}%` }} />
                </div>
                <span>{qExp}/100</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* 小Q助手按钮 - 仅在普通聊天显示 */}
          {!isQSmall && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowQPanel(!showQPanel)
                if (!showQPanel) {
                  loadAiSuggestions()
                }
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                showQPanel
                  ? 'bg-[#12B7F5] shadow-[#12B7F5]/30'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <PenguinQ
                size={showQPanel ? 30 : 28}
                outfit="default"
                mood={showQPanel ? 'thinking' : 'happy'}
                animated={false}
              />
            </motion.button>
          )}

          {/* 更多操作按钮 - 仅在小Q聊天显示 */}
          {isQSmall && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                showActions ? 'bg-[#12B7F5]' : 'bg-white border border-gray-200'
              }`}
            >
              <MoreHorizontal className={`w-5 h-5 ${showActions ? 'text-white' : 'text-gray-500'}`} />
            </motion.button>
          )}

          {/* 输入框 */}
          <div className={`flex-1 flex items-center rounded-2xl px-3 py-2 gap-2 ${
            isQSmall 
              ? 'bg-white shadow-lg border-2 border-[#7C3AED]/30 focus-within:border-[#7C3AED]' 
              : 'bg-white border border-gray-200'
          }`}>
            {isQSmall && (
              <Sparkles className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
            )}
            <input
              type="text"
              placeholder={isQSmall ? "和同频小Q聊聊..." : "输入消息..."}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className={`flex-1 bg-transparent text-[14px] text-gray-800 focus:outline-none ${
                isQSmall ? 'placeholder:text-[#7C3AED]/50' : 'placeholder:text-gray-400'
              }`}
            />
          </div>

          {/* 表情按钮 */}
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-9 h-9 flex items-center justify-center rounded-full ${isQSmall ? 'bg-white shadow-md' : ''}`}
          >
            <Smile className={`w-5 h-5 ${showEmojiPicker ? 'text-[#12B7F5]' : isQSmall ? 'text-[#7C3AED]' : 'text-gray-500'}`} />
          </button>

          {/* 发送/语音按钮 */}
          {inputText.trim() ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                isQSmall 
                  ? 'bg-gradient-to-r from-[#12B7F5] to-[#7C3AED]' 
                  : 'bg-[#12B7F5]'
              }`}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          ) : (
            <button className={`w-9 h-9 flex items-center justify-center rounded-full ${isQSmall ? 'bg-white shadow-md' : ''}`}>
              <Mic className={`w-5 h-5 ${isQSmall ? 'text-[#7C3AED]' : 'text-gray-500'}`} />
            </button>
          )}
        </div>

        {/* 更多操作面板 */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4 px-2 pt-2"
            >
              {[
                { icon: Image, label: '相册', color: '#12B7F5' },
                { icon: Camera, label: '拍摄', color: '#7C3AED' },
                { icon: FileText, label: '文件', color: '#F59E0B' },
                { icon: Heart, label: '收藏', color: '#EF4444' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-[10px] text-gray-500">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
