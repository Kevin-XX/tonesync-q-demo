import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Heart, AlertCircle, Calendar, Users, MessageCircle } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import { useQState } from '../contexts/QStateContext'

interface SocialEventPageProps {
  onBack: () => void
}

interface EventItem {
  id: string
  type: 'birthday' | 'emotion' | 'silence' | 'interest' | 'milestone'
  icon: string
  title: string
  desc: string
  action: string
  actionLabel: string
  priority: 'high' | 'medium' | 'low'
  timestamp: string
}

const mockEvents: EventItem[] = [
  {
    id: '1',
    type: 'birthday',
    icon: '🎂',
    title: '小芳生日提醒',
    desc: '今天是小芳的生日！她是你最近互动最多的好友哦~',
    action: '小Q已为你准备好祝福语：\n"生日快乐呀！愿每一天都闪闪发光✨"',
    actionLabel: '发送祝福 🎂',
    priority: 'high',
    timestamp: '今天 09:00'
  },
  {
    id: '2',
    type: 'emotion',
    icon: '💗',
    title: '情绪联动提醒',
    desc: '小芳最近情绪偏低，小Q检测到你们互动减少。',
    action: '建议发送关心消息：\n"最近怎么样？有什么想聊的吗？"',
    actionLabel: '发送关心 💕',
    priority: 'high',
    timestamp: '今天 10:30'
  },
  {
    id: '3',
    type: 'silence',
    icon: '🌙',
    title: '关系沉默预警',
    desc: '你与 @小明 已 15 天未互动，关系可能变淡。',
    action: '小Q推荐破冰话题：\n"最近《原神》出新角色了，你知道吗？"',
    actionLabel: '发起破冰 🧊',
    priority: 'medium',
    timestamp: '昨天'
  },
  {
    id: '4',
    type: 'interest',
    icon: '🎮',
    title: '共同兴趣更新',
    desc: '小李刚刚分享了《原神》攻略，你们都对这个话题感兴趣！',
    action: '小Q推荐开场白：\n"看到你发的攻略了！这次绫华怎么培养？"',
    actionLabel: '发起话题 🎮',
    priority: 'medium',
    timestamp: '昨天'
  },
  {
    id: '5',
    type: 'milestone',
    icon: '🏆',
    title: '羁绊里程碑',
    desc: '你与小Q的亲密度达到 500！解锁新能力：情绪感知 Pro',
    action: '点击查看详细成就和奖励~',
    actionLabel: '查看奖励 🎁',
    priority: 'low',
    timestamp: '4月20日'
  }
]

export function SocialEventPage({ onBack }: SocialEventPageProps) {
  const { mood, intimacy } = useQState()
  const [events, setEvents] = useState<EventItem[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [showAction, setShowAction] = useState(false)
  const [sentEvents, setSentEvents] = useState<Set<string>>(new Set())

  const handleEventClick = (event: EventItem) => {
    setSelectedEvent(event)
    setShowAction(true)
  }

  const handleSendAction = (event: EventItem) => {
    setSentEvents(prev => new Set([...prev, event.id]))
    setShowAction(false)
    setSelectedEvent(null)
  }

  const priorityColors = {
    high: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'bg-yellow-100' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100' }
  }

  const eventTypeLabels: Record<string, string> = {
    birthday: '生日提醒',
    emotion: '情绪联动',
    silence: '沉默预警',
    interest: '共同兴趣',
    milestone: '里程碑'
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-[#e8383d] to-[#ff6b6b] px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-white font-bold text-[16px]">社交事件中心</span>
        </div>
      </div>

      {/* 小Q主动提示 */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PenguinQ size={48} outfit="default" mood="excited" animated={true} />
            </motion.div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-gray-900 mb-1">小Q主动感知到 {events.length} 个社交机会</p>
              <p className="text-[12px] text-gray-500">把握每个互动时刻，让关系更有温度~</p>
            </div>
          </div>
          {/* 事件类型概览 */}
          <div className="flex gap-2 mt-3">
            {[
              { icon: '🎂', count: 1, label: '生日' },
              { icon: '💗', count: 1, label: '情绪' },
              { icon: '🌙', count: 1, label: '沉默' },
              { icon: '🎮', count: 1, label: '兴趣' },
            ].map((item, i) => (
              <div key={i} className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                <div className="text-lg mb-0.5">{item.icon}</div>
                <div className="text-[10px] text-gray-500">{item.count} {item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 事件列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-4 space-y-3">
        <p className="text-[11px] text-gray-400 font-medium px-1">📅 待处理事件</p>
        
        {events.map((event, i) => {
          const colors = priorityColors[event.priority]
          const isSent = sentEvents.has(event.id)
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !isSent && handleEventClick(event)}
              className={`bg-white rounded-2xl p-4 shadow-sm border ${colors.border} ${isSent ? 'opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center text-xl flex-shrink-0`}>
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-bold text-gray-900">{event.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      event.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {event.priority === 'high' ? '紧急' : '建议'}
                    </span>
                    {isSent && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
                        ✓ 已处理
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500 mb-2">{event.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{event.timestamp}</span>
                    <span className="text-[10px] text-[#12B7F5] bg-[#12B7F5]/10 px-2 py-1 rounded-full">
                      {eventTypeLabels[event.type]}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 事件详情弹窗 */}
      <AnimatePresence>
        {showAction && selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50"
              onClick={() => setShowAction(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl overflow-hidden"
            >
              <div className="p-5">
                {/* 标题 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{selectedEvent.icon}</div>
                  <div>
                    <h3 className="font-bold text-[16px] text-gray-900">{selectedEvent.title}</h3>
                    <p className="text-[11px] text-gray-400">{selectedEvent.timestamp}</p>
                  </div>
                </div>

                {/* 描述 */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <p className="text-[13px] text-gray-700 mb-2">{selectedEvent.desc}</p>
                </div>

                {/* AI生成内容 */}
                <div className="bg-gradient-to-r from-[#12B7F5]/5 to-blue-50 rounded-2xl p-4 mb-4 border border-[#12B7F5]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#12B7F5] flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] text-[#12B7F5] font-medium">小Q智能生成</span>
                  </div>
                  <p className="text-[13px] text-gray-800 whitespace-pre-line">{selectedEvent.action}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAction(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-[13px] font-medium text-gray-700"
                  >
                    稍后处理
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendAction(selectedEvent)}
                    className="flex-1 py-3 rounded-xl bg-[#12B7F5] text-white text-[13px] font-bold"
                  >
                    {selectedEvent.actionLabel}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
