import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Wand2, Lightbulb, Smile, Sparkles, Send, Bot, ArrowLeft, MoreHorizontal } from 'lucide-react'

type TabType = 'reply' | 'polish' | 'topic' | 'emoji'

interface Suggestion {
  id: number
  style: string
  text: string
  emoji: string
}

const replySuggestions: Suggestion[] = [
  { id: 1, style: '幽默', text: '有啊！想去哪里玩？我已经准备好做攻略了🎉', emoji: '😎' },
  { id: 2, style: '温柔', text: '周末有空哦，有什么安排吗？随时都可以~', emoji: '☺️' },
  { id: 3, style: '小Q梗', text: '必须有！小Q说周末不约的人都是没有朋友的，我才不当孤家寡人呢🎮', emoji: '🤖' },
]

export function ChatAssistant() {
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('reply')
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean, time?: string}>>([
    { id: 1, text: '在干嘛呢？', isUser: false, time: '14:20' },
    { id: 2, text: '周末有空吗？想找你出去玩~', isUser: false, time: '14:21' },
  ])
  const [isThinking, setIsThinking] = useState(false)
  const [showQButton, setShowQButton] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowQButton(true), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendSuggestion = (text: string) => {
    setIsThinking(true)
    setShowPanel(false)
    setTimeout(() => {
      setIsThinking(false)
      setMessages(prev => [...prev, { id: Date.now(), text, isUser: true, time: '14:22' }])
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: '好耶！那我做攻略啦 😆', isUser: false, time: '14:23' }])
      }, 1500)
    }, 1000)
  }

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 顶部导航 */}
      <div className="glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded-full hover:bg-slate-800/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-xs font-bold">芳</div>
            <div>
              <span className="font-semibold text-sm block leading-tight">小芳</span>
              <span className="text-[10px] text-green-400">在线</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-800/50">
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* 聊天内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-20">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
          >
            {!msg.isUser && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex-shrink-0" />}
            <div className="max-w-[75%]">
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.isUser
                  ? 'bg-qqBlue-500 text-white rounded-br-sm shadow-lg shadow-qqBlue-500/20'
                  : 'glass rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              <div className={`text-[10px] text-slate-600 mt-1 ${msg.isUser ? 'text-right' : ''}`}>{msg.time}</div>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start items-end gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex-shrink-0" />
              <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* 底部操作区 */}
      <div className="absolute bottom-24 left-0 right-0 px-4 z-20">
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="glass rounded-3xl overflow-hidden shadow-2xl mb-3"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-qqBlue-500/10 to-accent-purple/10 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-qqBlue-400" />
                  <span className="font-bold text-sm">同频小Q</span>
                  <span className="text-[10px] text-qqBlue-400 px-2 py-0.5 rounded-full bg-qqBlue-400/10">AI生成</span>
                </div>
                <button onClick={() => setShowPanel(false)} className="text-slate-500 p-1">✕</button>
              </div>

              {/* 功能Tab */}
              <div className="flex border-b border-slate-700/50 overflow-x-auto no-scrollbar">
                {[
                  { id: 'reply' as TabType, label: '智能回复', icon: MessageCircle },
                  { id: 'polish' as TabType, label: '文案润色', icon: Wand2 },
                  { id: 'topic' as TabType, label: '话题推荐', icon: Lightbulb },
                  { id: 'emoji' as TabType, label: '表情', icon: Smile },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 px-2 text-xs font-medium flex items-center justify-center gap-1 transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'text-qqBlue-400 border-qqBlue-400 bg-qqBlue-400/5'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 内容区 */}
              <div className="p-4 max-h-[45vh] overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'reply' && (
                    <motion.div key="reply" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> 对方说"周末有空吗"，小Q建议：</p>
                      {replySuggestions.map((s) => (
                        <motion.button
                          key={s.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendSuggestion(s.text)}
                          className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors group flex items-start gap-3 border border-slate-700/30"
                        >
                          <span className="text-xl flex-shrink-0">{s.emoji}</span>
                          <div className="flex-1">
                            <span className="text-[10px] text-qqBlue-400 mb-1 block">{s.style}</span>
                            <p className="text-sm text-slate-200">{s.text}</p>
                          </div>
                          <Send className="w-4 h-4 text-slate-600 group-hover:text-qqBlue-400 transition-colors self-center" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'polish' && (
                    <motion.div key="polish" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                      <p className="text-xs text-slate-500 mb-2">输入你想润色的内容：</p>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="例如：今天天气不错，出来玩吗？"
                        className="w-full p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-sm resize-none focus:outline-none focus:border-qqBlue-400 transition-colors placeholder:text-slate-600"
                        rows={3}
                      />
                      <button className="w-full py-2.5 bg-gradient-to-r from-qqBlue-500 to-accent-purple rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-qqBlue-500/20">
                        ✨ 一键润色
                      </button>
                      <div className="flex gap-2 flex-wrap">
                        {['幽默风趣', '文艺清新', '正式得体', '小Q风格'].map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-full bg-slate-800/40 text-[10px] text-slate-400 border border-slate-700/30 cursor-pointer hover:border-qqBlue-400 hover:text-qqBlue-400 transition-colors">
                            {s}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'topic' && (
                    <motion.div key="topic" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> 基于共同兴趣，推荐话题：</p>
                      {['最近上映的《沙丘2》你看了吗？听说特效超赞🎬', '周末有草莓采摘，要不要一起去？🍓', '你上次说的那家咖啡店，我也想去试试☕'].map((t, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendSuggestion(t)}
                          className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors text-sm border border-slate-700/30"
                        >
                          {t}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'emoji' && (
                    <motion.div key="emoji" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                        {['😊', '😎', '🤣', '💕', '🎉', '🎮', '☕', '🍓'].map((e, i) => (
                          <button key={i} className="text-2xl p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all hover:scale-110 border border-slate-700/30">
                            {e}
                          </button>
                        ))}
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-r from-qqBlue-500/10 to-accent-purple/10 border border-qqBlue-500/20">
                        <p className="text-[10px] text-qqBlue-400 font-bold mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> 小Q专属表情</p>
                        <div className="flex gap-2">
                          {['🤖💬', '🤖✨', '🤖💕', '🤖🎮'].map((e, i) => (
                            <button key={i} className="text-lg px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30">
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 输入框区域 */}
      <div className="absolute bottom-20 left-0 right-0 px-4 z-10">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showQButton && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPanel(!showPanel)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-qqBlue-500 to-accent-purple flex items-center justify-center shadow-lg shadow-qqBlue-500/20 z-10"
              >
                <Sparkles className={`w-5 h-5 transition-transform ${showPanel ? 'rotate-180' : ''}`} />
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex-1 flex items-center bg-slate-800/60 rounded-full border border-slate-700/50 px-4 py-2.5">
            <input
              type="text"
              placeholder="输入消息..."
              className="flex-1 bg-transparent focus:outline-none text-sm placeholder:text-slate-600"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-qqBlue-500 flex items-center justify-center hover:bg-qqBlue-600 transition-colors shadow-lg shadow-qqBlue-500/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
