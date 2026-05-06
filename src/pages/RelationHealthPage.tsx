import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, AlertTriangle, TrendingUp, TrendingDown, Clock, MessageCircle, Sparkles, Calendar, UserPlus } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface RelationHealthProps {
  onBack: () => void
}

interface FriendRelation {
  id: string
  name: string
  avatar: string
  color: string
  health: number // 0-100
  lastChat: string
  trend: 'up' | 'down' | 'stable'
  status: 'healthy' | 'warning' | 'danger'
  reason: string
  suggestions: string[]
}

const mockFriends: FriendRelation[] = [
  {
    id: '1',
    name: '小芳',
    avatar: '芳',
    color: 'from-pink-400 to-rose-500',
    health: 85,
    lastChat: '今天',
    trend: 'up',
    status: 'healthy',
    reason: '最近互动频繁，亲密度持续上升',
    suggestions: ['继续保持，可以约出来玩~']
  },
  {
    id: '2',
    name: '小明',
    avatar: '明',
    color: 'from-blue-400 to-indigo-500',
    health: 35,
    lastChat: '15天前',
    trend: 'down',
    status: 'danger',
    reason: '已15天未互动，关系正在变淡',
    suggestions: ['建议发一条消息破冰', '可以聊聊他喜欢的游戏']
  },
  {
    id: '3',
    name: '小李',
    avatar: '李',
    color: 'from-purple-400 to-violet-600',
    health: 55,
    lastChat: '7天前',
    trend: 'stable',
    status: 'warning',
    reason: '互动减少，但关系稳定',
    suggestions: ['可以分享一些有趣的内容', '询问他最近在忙什么']
  },
  {
    id: '4',
    name: '小红',
    avatar: '红',
    color: 'from-orange-400 to-red-500',
    health: 78,
    lastChat: '3天前',
    trend: 'up',
    status: 'healthy',
    reason: '关系健康，互动质量不错',
    suggestions: ['可以考虑深入交流']
  },
  {
    id: '5',
    name: '老王',
    avatar: '王',
    color: 'from-green-400 to-emerald-600',
    health: 25,
    lastChat: '30天前',
    trend: 'down',
    status: 'danger',
    reason: '关系冷淡，可能变成陌生人',
    suggestions: ['发个表情包试试', '如果有共同话题可以聊聊']
  },
]

const upcomingEvents = [
  { name: '小芳', type: 'birthday', date: '明天', emoji: '🎂' },
  { name: '小明', type: 'anniversary', date: '4月25日', emoji: '💕' },
  { name: '小红', type: 'festival', date: '4月30日', emoji: '🎉' },
]

export function RelationHealth({ onBack }: RelationHealthProps) {
  const [selectedFriend, setSelectedFriend] = useState<FriendRelation | null>(null)
  const [filter, setFilter] = useState<'all' | 'danger' | 'warning'>('all')

  const filteredFriends = filter === 'all' 
    ? mockFriends 
    : mockFriends.filter(f => f.status === filter)

  const statusColors = {
    healthy: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', icon: 'bg-green-100' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', icon: 'bg-yellow-100' },
    danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: 'bg-red-100' },
  }

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'from-green-400 to-emerald-500'
    if (health >= 40) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-[#e74c8c] to-[#fd79a8] px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Heart className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-[16px]">关系维护中心</span>
        </div>
      </div>

      {/* 小Q健康度概览 */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PenguinQ size={56} outfit="default" mood="love" animated={true} />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-bold text-gray-900">社交健康度</span>
                <span className="text-[10px] bg-[#e74c8c]/10 text-[#e74c8c] px-2 py-0.5 rounded-full font-medium">良好</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>需要关注: <span className="text-red-500 font-medium">2人</span></span>
                <span>健康: <span className="text-green-500 font-medium">2人</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 即将到来的事件 */}
        <div className="mt-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-[12px] font-bold text-gray-900">即将到来的事件</span>
          </div>
          <div className="flex gap-2">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex-1 bg-white rounded-xl p-2.5 text-center">
                <div className="text-lg mb-1">{event.emoji}</div>
                <p className="text-[10px] font-medium text-gray-900 truncate">{event.name}</p>
                <p className="text-[9px] text-gray-400">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 筛选 */}
      <div className="px-3 pt-3 flex gap-2">
        {[
          { id: 'all' as const, label: '全部', count: mockFriends.length },
          { id: 'danger' as const, label: '需要维护', count: mockFriends.filter(f => f.status === 'danger').length },
          { id: 'warning' as const, label: '需关注', count: mockFriends.filter(f => f.status === 'warning').length },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-2 rounded-xl text-[12px] font-medium transition-all ${
              filter === f.id
                ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                : 'bg-white/50 text-gray-500'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* 好友列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-4 space-y-3">
        {filteredFriends.map((friend, i) => {
          const colors = statusColors[friend.status]
          
          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedFriend(friend)}
              className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-transform`}
            >
              <div className="flex items-start gap-3">
                {/* 头像 */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${friend.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {friend.avatar}
                  {friend.status === 'danger' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-bold text-gray-900">{friend.name}</span>
                    <div className="flex items-center gap-1">
                      {friend.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {friend.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                      {friend.trend === 'stable' && <span className="w-3 h-0.5 bg-gray-400 rounded" />}
                      <span className="text-[11px] text-gray-500">{friend.lastChat}</span>
                    </div>
                  </div>

                  {/* 健康度条 */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getHealthColor(friend.health)} rounded-full`}
                        style={{ width: `${friend.health}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500">{friend.health}%</span>
                  </div>

                  <p className="text-[11px] text-gray-500">{friend.reason}</p>
                </div>
              </div>

              {/* 紧急提示 */}
              {friend.status === 'danger' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-3 p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                    <span className={`text-[11px] ${colors.text} font-medium`}>关系冷淡预警！建议立即互动</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 好友详情弹窗 */}
      <AnimatePresence>
        {selectedFriend && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50"
              onClick={() => setSelectedFriend(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl overflow-hidden"
            >
              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedFriend.color} flex items-center justify-center text-white font-bold text-xl`}>
                    {selectedFriend.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-gray-900">{selectedFriend.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        selectedFriend.status === 'healthy' ? 'bg-green-100 text-green-600' :
                        selectedFriend.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {selectedFriend.status === 'healthy' ? '关系健康' :
                         selectedFriend.status === 'warning' ? '需要关注' : '需要维护'}
                      </span>
                      <span className="text-[10px] text-gray-400">健康度 {selectedFriend.health}%</span>
                    </div>
                  </div>
                </div>

                {/* 小Q建议 */}
                <div className="bg-gradient-to-r from-[#12B7F5]/5 to-blue-50 rounded-2xl p-4 mb-4 border border-[#12B7F5]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#12B7F5] flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] text-[#12B7F5] font-medium">小Q建议</span>
                  </div>
                  <p className="text-[12px] text-gray-600 mb-2">{selectedFriend.reason}</p>
                  <div className="space-y-1.5">
                    {selectedFriend.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[10px] text-[#12B7F5]">•</span>
                        <span className="text-[12px] text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 快速操作 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-[#12B7F5]" />
                    <span className="text-[10px] text-gray-600">发消息</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-[10px] text-gray-600">送个表情</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                    <UserPlus className="w-5 h-5 text-purple-500" />
                    <span className="text-[10px] text-gray-600">拉群互动</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedFriend(null)}
                  className="w-full py-3 rounded-xl bg-gray-100 text-[13px] font-medium text-gray-600"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
