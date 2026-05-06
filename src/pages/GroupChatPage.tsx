import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MoreHorizontal, Send, Search, Mic, Smile, Image, Vote, Bell, Calendar, MessageSquare, Loader2 } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import { summarizeGroupChat, type GroupSummary, type DecisionItem, type GroupEvent } from '../services/aiService'

interface GroupMessage {
  id: number
  user: string
  text: string
  time: string
  avatar: string
  color: string
  isSystem?: boolean
}

const avatarColors: Record<string, string> = {
  主: 'bg-gradient-to-br from-red-400 to-red-600',
  明: 'bg-gradient-to-br from-blue-400 to-blue-600',
  红: 'bg-gradient-to-br from-pink-400 to-pink-600',
  李: 'bg-gradient-to-br from-purple-400 to-purple-600',
  芳: 'bg-gradient-to-br from-orange-400 to-orange-600',
  我: 'bg-gradient-to-br from-green-400 to-green-600',
  班: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  组: 'bg-gradient-to-br from-teal-400 to-teal-600',
  产: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
  设: 'bg-gradient-to-br from-violet-400 to-violet-600',
}

// 各群聊的独立初始消息
const groupInitialMessages: Record<string, GroupMessage[]> = {
  '开黑交流群': [
    { id: 1, user: '群主', text: '大家周末聚餐，地点投票啦！🗳️', time: '09:30', avatar: '主', color: avatarColors['主'] },
    { id: 2, user: '小明', text: '火锅！必须火锅！🔥 火锅人永不言败', time: '09:32', avatar: '明', color: avatarColors['明'] },
    { id: 3, user: '小红', text: '我投烧烤，好久没吃了，上次说的那家巷子里的超赞', time: '09:35', avatar: '红', color: avatarColors['红'] },
    { id: 4, user: '小李', text: '发个新游戏攻略链接，这期更新真的良心 [链接] 原神4.8攻略', time: '09:40', avatar: '李', color: avatarColors['李'] },
    { id: 5, user: '小芳', text: '我也投火锅！还可以吃麻辣小龙虾🦞', time: '09:55', avatar: '芳', color: avatarColors['芳'] },
    { id: 6, user: '系统', text: '新群规已发布，请大家查看【已置顶】', time: '10:00', avatar: '规', color: '', isSystem: true },
    { id: 7, user: '系统', text: '🎂 今天是小明的生日，快去祝福他吧！', time: '10:15', avatar: '日', color: '', isSystem: true },
  ],
  '学习打卡群': [
    { id: 1, user: '班长', text: '同学们，明天下午5点前交高数作业，别忘啦！📚', time: '08:00', avatar: '班', color: avatarColors['班'] },
    { id: 2, user: '小明', text: '收到！已经写到第3章了', time: '08:15', avatar: '明', color: avatarColors['明'] },
    { id: 3, user: '小红', text: '求助，第5题怎么解啊？完全没思路😭', time: '08:30', avatar: '红', color: avatarColors['红'] },
    { id: 4, user: '小李', text: '第5题用洛必达法则，我已经整理好了步骤发群里', time: '08:45', avatar: '李', color: avatarColors['李'] },
    { id: 5, user: '小芳', text: '今日打卡 ✅ 图书馆学习3小时', time: '09:00', avatar: '芳', color: avatarColors['芳'] },
    { id: 6, user: '系统', text: '📢 本周六上午9点期中复习课，地点：教学楼302', time: '09:30', avatar: '通', color: '', isSystem: true },
    { id: 7, user: '班长', text: '另外提醒一下，下周英语口语考试，大家提前准备', time: '10:00', avatar: '班', color: avatarColors['班'] },
  ],
  '项目协作群': [
    { id: 1, user: '组长', text: '各位，本周五前要提交v1.0版本，进度怎么样了？', time: '09:00', avatar: '组', color: avatarColors['组'] },
    { id: 2, user: '产品经理', text: '需求文档已更新，新增用户画像模块，大家看一下', time: '09:15', avatar: '产', color: avatarColors['产'] },
    { id: 3, user: '设计师', text: 'UI稿已上传Figma，本周内完成评审', time: '09:30', avatar: '设', color: avatarColors['设'] },
    { id: 4, user: '前端开发', text: '首页框架搭好了，接口联调中', time: '10:00', avatar: '前', color: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
    { id: 5, user: '后端开发', text: 'API文档已更新，Swagger可以看了', time: '10:30', avatar: '后', color: 'bg-gradient-to-br from-green-400 to-emerald-500' },
    { id: 6, user: '系统', text: '📅 本周三下午2点项目评审会，全员参加', time: '11:00', avatar: '日', color: '', isSystem: true },
    { id: 7, user: '组长', text: '好的，收到。大家有问题随时提，别憋到最后', time: '11:30', avatar: '组', color: avatarColors['组'] },
  ],
}

interface GroupChatPageProps {
  groupName: string
  groupId: string
  onBack: () => void
  onUpdateConversation: (id: string, updates: { lastMsg?: string; time?: string; unread?: number }) => void
}

export function GroupChatPage({ groupName, groupId, onBack, onUpdateConversation }: GroupChatPageProps) {
  const [messages, setMessages] = useState<GroupMessage[]>(
    () => groupInitialMessages[groupName] || groupInitialMessages['开黑交流群']
  )
  const [showSummary, setShowSummary] = useState(false)
  const [inputText, setInputText] = useState('')
  const [qBouncing, setQBouncing] = useState(false)

  // AI 总结状态
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState<GroupSummary | null>(null)
  const [summaryError, setSummaryError] = useState('')

  // 用户已投票的选项（决策标题 + 选项名）
  const [votedOptions, setVotedOptions] = useState<Set<string>>(new Set())

  // 格式化当前时间
  const getCurrentTime = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  // 发送消息
  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text) return

    const timeStr = getCurrentTime()

    const newMsg: GroupMessage = {
      id: messages.length + 1,
      user: '我',
      text,
      time: timeStr,
      avatar: '我',
      color: avatarColors['我'],
    }

    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setInputText('')

    // 同步到消息列表
    onUpdateConversation(groupId, {
      lastMsg: `[你] ${text}`,
      time: timeStr,
    })
  }, [inputText, messages, groupId, onUpdateConversation])

  // 召唤小Q总结群聊
  const handleQTap = useCallback(async () => {
    setQBouncing(true)
    setShowSummary(true)
    setSummaryError('')
    setTimeout(() => setQBouncing(false), 1000)

    // 如果已有总结且消息没变化，直接展示
    if (summary && !isSummarizing) {
      return
    }

    setIsSummarizing(true)

    try {
      const chatRecords = messages
        .filter(m => !m.isSystem)
        .map(m => ({
          sender: m.user,
          content: m.text,
          time: m.time,
        }))

      // 把系统消息也加进去，让AI知道重要信息
      const systemMessages = messages
        .filter(m => m.isSystem)
        .map(m => ({
          sender: m.user || '系统',
          content: m.text,
          time: m.time,
        }))

      const result = await summarizeGroupChat([...chatRecords, ...systemMessages])
      setSummary(result)
    } catch (err) {
      setSummaryError('总结生成失败，请重试')
    } finally {
      setIsSummarizing(false)
    }
  }, [messages, summary, isSummarizing])

  // 点击投票
  const handleVote = (decisionIdx: number, optionIdx: number, optionName: string) => {
    const voteKey = `${decisionIdx}-${optionIdx}`
    if (votedOptions.has(voteKey)) return

    // 1. 标记已投
    setVotedOptions(prev => new Set([...prev, voteKey]))

    // 2. 更新 summary 票数
    setSummary(prev => {
      if (!prev) return prev
      const newDecisions = [...prev.decisions]
      if (newDecisions[decisionIdx]) {
        const newOptions = [...newDecisions[decisionIdx].options]
        if (newOptions[optionIdx]) {
          newOptions[optionIdx] = { ...newOptions[optionIdx], votes: (newOptions[optionIdx].votes || 0) + 1 }
          newDecisions[decisionIdx] = { ...newDecisions[decisionIdx], options: newOptions }
        }
      }
      return { ...prev, decisions: newDecisions }
    })

    // 3. 向群聊发送投票消息
    const timeStr = getCurrentTime()
    const voteMsg: GroupMessage = {
      id: messages.length + 1,
      user: '我',
      text: `我投${optionName.split(' ')[0]}！`,
      time: timeStr,
      avatar: '我',
      color: avatarColors['我'],
    }
    const updatedMessages = [...messages, voteMsg]
    setMessages(updatedMessages)

    // 4. 同步到消息列表
    onUpdateConversation(groupId, {
      lastMsg: `[你] 我投${optionName.split(' ')[0]}！`,
      time: timeStr,
    })
  }

  // 渲染投票/决策区域
  const renderDecisions = (decisions: DecisionItem[]) => {
    if (decisions.length === 0) {
      return (
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-[13px] text-gray-400">暂无待决策事项</p>
        </div>
      )
    }

    return decisions.map((decision, idx) => {
      const totalVotes = decision.options.reduce((sum, o) => sum + (o.votes || 0), 0)
      return (
        <div key={idx} className="bg-gray-50 rounded-2xl p-4">
          <p className="text-[13px] font-medium text-gray-800 mb-3">📊 {decision.title}</p>
          {decision.options.map((opt, i) => {
            const pct = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0
            return (
              <div key={i} className="mb-3">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[13px] text-gray-700 w-16 flex-shrink-0">{opt.name}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={`h-full rounded-full ${i === 0 ? 'bg-[#12B7F5]' : 'bg-orange-400'}`}
                    />
                  </div>
                  <span className="text-[12px] text-gray-500 w-8 text-right">{opt.votes || 0}票</span>
                </div>
                {/* 投票按钮 */}
                {decision.type === 'vote' && (
                  <button
                    onClick={() => handleVote(idx, i, opt.name)}
                    disabled={votedOptions.has(`${idx}-${i}`)}
                    className={`w-full py-2 rounded-xl text-[13px] font-medium transition-all ${
                      votedOptions.has(`${idx}-${i}`)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : i === 0
                        ? 'bg-[#12B7F5]/10 text-[#12B7F5] active:bg-[#12B7F5]/20'
                        : 'bg-orange-50 text-orange-500 active:bg-orange-100'
                    }`}
                  >
                    {votedOptions.has(`${idx}-${i}`) ? `已投${opt.name.split(' ')[0]} ✓` : `投${opt.name.split(' ')[0]}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )
    })
  }

  // 渲染重要信息
  const renderImportant = (items: string[]) => {
    if (items.length === 0) {
      return (
        <div className="p-3 rounded-xl bg-gray-50 text-center">
          <p className="text-[13px] text-gray-400">暂无重要信息</p>
        </div>
      )
    }

    return items.map((item, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
        <div className="w-1.5 h-1.5 rounded-full bg-[#12B7F5] flex-shrink-0" />
        <p className="text-[13px] text-gray-700">{item}</p>
      </div>
    ))
  }

  // 渲染群事件
  const renderEvents = (events: GroupEvent[]) => {
    if (events.length === 0) {
      return (
        <div className="p-4 rounded-2xl bg-gray-50 text-center">
          <p className="text-[13px] text-gray-400">暂无群事件</p>
        </div>
      )
    }

    return events.map((evt, i) => {
      const isBirthday = evt.type === 'birthday'
      return (
        <div
          key={i}
          className={`p-4 rounded-2xl ${isBirthday ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100' : 'bg-gray-50'}`}
        >
          <p className="text-[13px] font-medium text-gray-800 mb-2">
            {isBirthday ? '🎂' : '📅'} {evt.desc}
          </p>
          {isBirthday && (
            <button className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-pink-500/10 text-pink-500 text-[13px] font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              去祝福{evt.who || 'TA'}
            </button>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED] relative">
      {/* 群聊顶部栏 */}
      <div className="bg-[#12B7F5] px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 -ml-1">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="text-white font-bold text-[15px] leading-tight">{groupName}</div>
            <div className="text-white/70 text-[11px]">
              {groupName === '开黑交流群' ? '128人' : groupName === '学习打卡群' ? '56人' : '12人'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5"><Search className="w-5 h-5 text-white" /></button>
          <button className="p-1.5"><MoreHorizontal className="w-5 h-5 text-white" /></button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-3" style={{ paddingBottom: '70px' }}>
        {/* 时间戳 */}
        <div className="text-center">
          <span className="text-[11px] text-gray-400 bg-black/5 px-2 py-0.5 rounded-full">{messages[0]?.time || '09:30'}</span>
        </div>

        {messages.map((msg, i) => {
          if (msg.isSystem) {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <span className="text-[11px] text-gray-500 bg-black/5 px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </motion.div>
            )
          }

          const isMe = msg.user === '我'
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 25 }}
              className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {/* 头像 */}
              <div className={`w-9 h-9 rounded-lg ${msg.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                {msg.avatar}
              </div>
              {/* 内容 */}
              <div className={`flex-1 min-w-0 ${isMe ? 'text-right' : ''}`}>
                <div className="text-[11px] text-gray-500 mb-1 font-medium">{msg.user} <span className="text-gray-400 font-normal">{msg.time}</span></div>
                <div className={`${isMe ? 'bg-[#95EC69] rounded-tr-sm' : 'bg-white rounded-tl-sm'} rounded-2xl px-3 py-2.5 text-[14px] text-gray-800 shadow-sm inline-block max-w-[85%] relative`}>
                  {!isMe && <div className="absolute -left-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[7px] border-r-white" />}
                  {isMe && <div className="absolute -right-[6px] top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[7px] border-l-[#95EC69]" />}
                  {msg.text}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* 小Q召唤提示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-4"
        >
          <button
            onClick={handleQTap}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-[#12B7F5]/20 text-[12px] text-[#12B7F5] font-medium"
          >
            <PenguinQ size={24} outfit="default" mood="thinking" animated={false} />
            @同频小Q 总结一下群聊
          </button>
        </motion.div>
      </div>

      {/* 企鹅小Q悬浮 - 在群聊页角落蹦跶 */}
      <motion.div
        className="absolute bottom-20 right-4 z-20"
        animate={qBouncing ? { y: [0, -20, 0, -10, 0], rotate: [-10, 10, -5, 5, 0] } : { y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={qBouncing ? { duration: 0.6 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PenguinQ
          size={52}
          outfit="default"
          mood={showSummary ? 'thinking' : 'excited'}
          animated={true}
          onClick={handleQTap}
          showBubble={!showSummary ? '点我总结群聊！' : undefined}
        />
      </motion.div>

      {/* 底部输入栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] border-t border-gray-200 px-2 py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-full border border-gray-200 px-3 py-2">
            <input
              type="text"
              placeholder="输入消息..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent text-[14px] text-gray-800 focus:outline-none placeholder:text-gray-400"
            />
          </div>
          <button><Smile className="w-5 h-5 text-gray-500" /></button>
          <button><Image className="w-5 h-5 text-gray-500" /></button>
          {inputText.trim() ? (
            <button onClick={handleSend} className="w-9 h-9 rounded-full bg-[#12B7F5] flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button><Mic className="w-5 h-5 text-gray-500" /></button>
          )}
        </div>
      </div>

      {/* 群聊摘要面板 */}
      <AnimatePresence>
        {showSummary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black z-30"
              onClick={() => setShowSummary(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl overflow-hidden max-h-[80%]"
            >
              {/* 摘要标题 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#12B7F5]/5 to-blue-50">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -5, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <PenguinQ size={44} outfit="default" mood={isSummarizing ? 'thinking' : 'excited'} animated={true} />
                  </motion.div>
                  <div>
                    <div className="font-bold text-[15px] text-gray-900">同频小Q 群聊摘要</div>
                    <div className="text-[11px] text-gray-400">{messages.length}条消息 · {isSummarizing ? 'AI分析中...' : summary ? 'AI智能分析' : '点击生成总结'}</div>
                  </div>
                </div>
                <button onClick={() => setShowSummary(false)} className="text-gray-400 text-xl px-1">✕</button>
              </div>

              <div className="overflow-y-auto no-scrollbar p-5 space-y-5" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                {/* 加载中 */}
                {isSummarizing && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#12B7F5] animate-spin mb-3" />
                    <p className="text-[13px] text-gray-500">小Q正在分析群聊记录...</p>
                    <p className="text-[11px] text-gray-400 mt-1">基于真实聊天记录生成</p>
                  </div>
                )}

                {/* 错误提示 */}
                {summaryError && !isSummarizing && (
                  <div className="bg-red-50 rounded-2xl p-4 text-center">
                    <p className="text-[13px] text-red-500">{summaryError}</p>
                    <button
                      onClick={handleQTap}
                      className="mt-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-[12px] font-medium"
                    >
                      重试
                    </button>
                  </div>
                )}

                {/* AI 总结内容 */}
                {!isSummarizing && summary && (
                  <>
                    {/* 氛围标签 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500">群氛围：</span>
                      <span className="px-2.5 py-1 rounded-full bg-[#12B7F5]/10 text-[#12B7F5] text-[12px] font-medium">
                        {summary.mood}
                      </span>
                      {summary.activeMembers.length > 0 && (
                        <span className="text-[11px] text-gray-400">
                          活跃：{summary.activeMembers.join('、')}
                        </span>
                      )}
                    </div>

                    {/* 热点话题 */}
                    {summary.hotTopics.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <span className="text-[12px]">🔥</span>
                          </div>
                          <h3 className="font-bold text-[14px] text-gray-900">热点话题</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {summary.hotTopics.map((topic, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* 待决策 */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Vote className="w-4 h-4 text-orange-500" />
                        </div>
                        <h3 className="font-bold text-[14px] text-gray-900">待决策</h3>
                      </div>
                      {renderDecisions(summary.decisions)}
                    </section>

                    {/* 重要信息 */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-green-500" />
                        </div>
                        <h3 className="font-bold text-[14px] text-gray-900">重要信息</h3>
                      </div>
                      <div className="space-y-2">
                        {renderImportant(summary.important)}
                      </div>
                    </section>

                    {/* 群事件 */}
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-pink-500" />
                        </div>
                        <h3 className="font-bold text-[14px] text-gray-900">群事件</h3>
                      </div>
                      {renderEvents(summary.events)}
                    </section>
                  </>
                )}

                {/* 未生成总结时的占位 */}
                {!isSummarizing && !summary && !summaryError && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <PenguinQ size={64} outfit="default" mood="thinking" animated={true} />
                    <p className="text-[13px] text-gray-500 mt-3">点击上方按钮让小Q分析群聊</p>
                    <p className="text-[11px] text-gray-400 mt-1">基于真实聊天记录智能生成</p>
                  </div>
                )}

                <div className="flex gap-3 pb-2">
                  <button className="flex-1 py-3 rounded-xl bg-gray-100 text-[13px] font-medium text-gray-700">
                    查看详情
                  </button>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="flex-1 py-3 rounded-xl bg-[#12B7F5] text-white text-[13px] font-medium"
                  >
                    标记已读 ✓
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
