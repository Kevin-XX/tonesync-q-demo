import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus, Camera, Send, X, Sparkles, Wand2 } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import type { PenguinMood } from '../components/PenguinQ'
import type { SubPage } from '../App'
import { AI_SERVICE } from '../services/aiService'

interface Comment {
  id: number
  user: string
  avatar: string
  avatarColor: string
  text: string
  time: string
}

interface DynamicItem {
  id: number
  user: string
  avatar: string
  avatarColor: string
  time: string
  text: string
  likes: number
  comments: number
  liked: boolean
  qComment: string | null
  qAction: string | null
  qTargetId?: string
  qTargetName?: string
  qTargetAvatar?: string
  commentList: Comment[]
}

const initialDynamics: DynamicItem[] = [
  {
    id: 1,
    user: '小芳',
    avatar: '芳',
    avatarColor: 'from-pink-400 to-rose-500',
    time: '10分钟前',
    text: '和朋友去了草莓园，今天天气超好 🍓✨',
    likes: 12,
    comments: 3,
    liked: false,
    qComment: '好羡慕！要不要给小明也推荐一下？他上次说想找地方出游~',
    qAction: '推荐给小明',
    qTargetId: 'ming',
    qTargetName: '小明',
    qTargetAvatar: '明',
    commentList: [
      { id: 1, user: '小红', avatar: '红', avatarColor: 'from-pink-400 to-pink-600', text: '哇！草莓看起来好甜~ 🍓', time: '8分钟前' },
      { id: 2, user: '小李', avatar: '李', avatarColor: 'from-purple-400 to-purple-600', text: '求地址！下次带我去', time: '5分钟前' },
      { id: 3, user: '小明', avatar: '明', avatarColor: 'from-blue-400 to-blue-600', text: '确实不错！收藏了', time: '2分钟前' },
    ],
  },
  {
    id: 2,
    user: '小明',
    avatar: '明',
    avatarColor: 'from-blue-400 to-blue-600',
    time: '1小时前',
    text: '期末备考中...愁😭 有没有好的学习方法分享一下',
    likes: 8,
    comments: 5,
    liked: true,
    qComment: null,
    qAction: null,
    commentList: [
      { id: 1, user: '小芳', avatar: '芳', avatarColor: 'from-pink-400 to-rose-500', text: '加油！我可以借你笔记 📚', time: '50分钟前' },
      { id: 2, user: '班长', avatar: '班', avatarColor: 'from-indigo-400 to-indigo-600', text: '重点在第三章和第五章', time: '40分钟前' },
    ],
  },
  {
    id: 3,
    user: '小李',
    avatar: '李',
    avatarColor: 'from-purple-400 to-purple-600',
    time: '3小时前',
    text: '原神4.8更新了！新角色超喜欢 🎮',
    likes: 23,
    comments: 11,
    liked: false,
    qComment: '你和小芳都喜欢原神！小Q可以帮你发起组队邀请~',
    qAction: '发起组队',
    qTargetId: 'game',
    commentList: [
      { id: 1, user: '小芳', avatar: '芳', avatarColor: 'from-pink-400 to-rose-500', text: '冲！晚上一起肝？', time: '2小时前' },
      { id: 2, user: '小明', avatar: '明', avatarColor: 'from-blue-400 to-blue-600', text: '带我一个！', time: '1小时前' },
    ],
  },
]

interface DynamicsPageProps {
  onNavigate: (p: SubPage) => void
}

export function DynamicsPage({ onNavigate }: DynamicsPageProps) {
  const [items, setItems] = useState<DynamicItem[]>(initialDynamics)
  const [likedAnimId, setLikedAnimId] = useState<number | null>(null)
  const [bannerMsg] = useState('小芳刚发了动态，要去点个赞吗？')
  const [bannerVisible, setBannerVisible] = useState(true)
  const [qMood] = useState<PenguinMood>('excited')

  // 评论区展开状态
  const [expandedComments, setExpandedComments] = useState<number | null>(null)
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [commentLoading, setCommentLoading] = useState<Record<number, boolean>>({})
  const [showQAssist, setShowQAssist] = useState<number | null>(null)
  const [qSuggestions, setQSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const handleLike = (id: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 } : item
    ))
    setLikedAnimId(id)
    setTimeout(() => setLikedAnimId(null), 600)
  }

  // 点击小Q建议跳转
  const handleQAction = (item: DynamicItem) => {
    if (!item.qTargetId) return

    if (item.qTargetId === 'game') {
      // 发起组队跳转到开黑交流群
      onNavigate({ type: 'groupchat', groupName: '开黑交流群', groupId: 'game' })
    } else {
      // 跳转到私聊
      onNavigate({
        type: 'chat',
        friendName: item.qTargetName || item.qTargetId,
        friendAvatar: item.qTargetAvatar || item.qTargetId[0],
        convId: item.qTargetId,
      })
    }
  }

  // 展开/收起评论
  const toggleComments = (id: number) => {
    setExpandedComments(prev => prev === id ? null : id)
    setShowQAssist(null)
  }

  // 输入评论
  const handleCommentInput = (id: number, text: string) => {
    setCommentInputs(prev => ({ ...prev, [id]: text }))
  }

  // 发送评论
  const handleSendComment = async (itemId: number) => {
    const text = commentInputs[itemId]?.trim()
    if (!text) return

    setCommentLoading(prev => ({ ...prev, [itemId]: true }))

    // 模拟发送延迟
    await new Promise(r => setTimeout(r, 300))

    const newComment: Comment = {
      id: Date.now(),
      user: '我',
      avatar: '我',
      avatarColor: 'from-green-400 to-green-600',
      text,
      time: '刚刚',
    }

    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, comments: item.comments + 1, commentList: [...item.commentList, newComment] }
        : item
    ))

    setCommentInputs(prev => ({ ...prev, [itemId]: '' }))
    setCommentLoading(prev => ({ ...prev, [itemId]: false }))
    setShowQAssist(null)
  }

  // 小Q评论建议
  const loadQCommentSuggestions = async (itemId: number) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    setIsLoadingSuggestions(true)
    setShowQAssist(itemId)

    try {
      const context = `${item.user}的动态：${item.text}`
      const suggestions = await AI_SERVICE.getReplySuggestions(context, item.user)
      setQSuggestions(suggestions.map(s => s.text))
    } catch {
      // 默认建议
      setQSuggestions([
        '太棒了！为你开心 🎉',
        '确实不错！学到了 👍',
        '哈哈，同感！😆',
      ])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // 小Q润色评论
  const polishComment = async (itemId: number) => {
    const text = commentInputs[itemId]?.trim()
    if (!text) return

    setIsLoadingSuggestions(true)
    setShowQAssist(itemId)

    try {
      const polished = await AI_SERVICE.polishText(text, 'warm')
      setQSuggestions([polished])
    } catch {
      setQSuggestions([text])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // 使用小Q建议
  const useSuggestion = (itemId: number, text: string) => {
    setCommentInputs(prev => ({ ...prev, [itemId]: text }))
    setShowQAssist(null)
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      <div className="bg-[#12B7F5] px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-[18px] font-bold">动态</h1>
        <div className="flex items-center gap-2">
          <button className="p-1">
            <Camera className="w-5 h-5 text-white" />
          </button>
          <button className="p-1">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 发布框 */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#12B7F5] to-[#0075B2] flex items-center justify-center">
          <PenguinQ size={32} outfit="default" mood="happy" animated={false} />
        </div>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[13px] text-gray-400">
          分享你的生活动态...
        </div>
        <button className="text-[12px] text-[#12B7F5] font-medium">发布</button>
      </div>

      {/* P1-7: 小Q说 Banner */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#12B7F5]/10 to-blue-50 px-4 py-2 flex items-center gap-2 overflow-hidden border-b border-[#12B7F5]/10"
          >
            <PenguinQ size={22} outfit="default" mood={qMood} animated={true} />
            <p className="text-[12px] text-[#12B7F5] font-medium flex-1">{bannerMsg}</p>
            <button onClick={() => setBannerVisible(false)} className="text-gray-400 text-sm">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 动态列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white mb-2 px-4 py-4"
          >
            {/* 用户信息 */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-bold`}>
                {item.avatar}
              </div>
              <div className="flex-1">
                <div className="font-medium text-[14px] text-gray-900">{item.user}</div>
                <div className="text-[11px] text-gray-400">{item.time}</div>
              </div>
              <button><MoreHorizontal className="w-5 h-5 text-gray-300" /></button>
            </div>

            {/* 内容 */}
            <p className="text-[14px] text-gray-800 mb-3 leading-relaxed">{item.text}</p>

            {/* 小Q智能建议卡片 - P1-7: 完整交互 */}
            {item.qComment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="mb-3 p-3 rounded-xl bg-[#12B7F5]/5 border border-[#12B7F5]/15 flex items-start gap-2"
              >
                <PenguinQ size={28} outfit="default" mood="excited" animated={false} />
                <div className="flex-1">
                  <div className="text-[10px] text-[#12B7F5] font-bold mb-0.5">小Q建议</div>
                  <p className="text-[12px] text-gray-600 leading-snug">{item.qComment}</p>
                </div>
                {item.qAction && (
                  <button
                    onClick={() => handleQAction(item)}
                    className="text-[11px] text-[#12B7F5] font-medium whitespace-nowrap bg-[#12B7F5]/10 px-2 py-1 rounded-lg hover:bg-[#12B7F5]/20 active:bg-[#12B7F5]/30 transition-colors"
                  >
                    {item.qAction}
                  </button>
                )}
              </motion.div>
            )}

            {/* 操作栏 - P1-7: 点赞企鹅跳起 */}
            <div className="flex items-center gap-5 pt-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleLike(item.id)}
                className={`flex items-center gap-1.5 text-[13px] transition-colors relative ${item.liked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <motion.div
                  animate={likedAnimId === item.id ? { y: [0, -12, 0], scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Heart
                    className={`${item.liked ? 'fill-red-500' : ''}`}
                    style={{ width: 18, height: 18 }}
                  />
                </motion.div>
                <span className="relative">{item.likes}</span>
              </motion.button>
              <button
                onClick={() => toggleComments(item.id)}
                className={`flex items-center gap-1.5 text-[13px] transition-colors ${expandedComments === item.id ? 'text-[#12B7F5]' : 'text-gray-400'}`}
              >
                <MessageCircle style={{ width: 18, height: 18 }} />
                {item.comments}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] text-gray-400">
                <Share2 style={{ width: 18, height: 18 }} />
                分享
              </button>
            </div>

            {/* 评论区 */}
            <AnimatePresence>
              {expandedComments === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {/* 已有评论 */}
                    <div className="space-y-3 mb-3">
                      {item.commentList.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${comment.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                            {comment.avatar}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[12px] font-medium text-gray-700">{comment.user}</span>
                              <span className="text-[10px] text-gray-400">{comment.time}</span>
                            </div>
                            <p className="text-[13px] text-gray-800 leading-snug">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 小Q辅助面板 */}
                    <AnimatePresence>
                      {showQAssist === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="mb-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <PenguinQ size={20} outfit="default" mood="thinking" animated={true} />
                            <span className="text-[11px] text-[#12B7F5] font-medium">小Q助手</span>
                          </div>
                          {isLoadingSuggestions ? (
                            <div className="flex items-center gap-2 text-[12px] text-gray-500">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-[#12B7F5] border-t-transparent rounded-full"
                              />
                              小Q正在思考...
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {qSuggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => useSuggestion(item.id, suggestion)}
                                  className="w-full text-left text-[12px] text-gray-700 bg-white rounded-lg px-3 py-2 hover:bg-[#12B7F5]/5 transition-colors border border-transparent hover:border-[#12B7F5]/20"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 评论输入 */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
                        <input
                          type="text"
                          placeholder={`评论${item.user}的动态...`}
                          value={commentInputs[item.id] || ''}
                          onChange={e => handleCommentInput(item.id, e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendComment(item.id)}
                          className="flex-1 bg-transparent text-[13px] text-gray-800 focus:outline-none placeholder:text-gray-400"
                        />
                      </div>
                      {/* 小Q建议按钮 */}
                      <button
                        onClick={() => loadQCommentSuggestions(item.id)}
                        className="p-2 rounded-full bg-[#12B7F5]/10 text-[#12B7F5] hover:bg-[#12B7F5]/20 transition-colors"
                        title="小Q建议"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      {/* 润色按钮 */}
                      <button
                        onClick={() => polishComment(item.id)}
                        className="p-2 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                        title="润色"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                      {/* 发送按钮 */}
                      <button
                        onClick={() => handleSendComment(item.id)}
                        disabled={!commentInputs[item.id]?.trim() || commentLoading[item.id]}
                        className="w-8 h-8 rounded-full bg-[#12B7F5] flex items-center justify-center disabled:bg-gray-300 transition-colors"
                      >
                        {commentLoading[item.id] ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
