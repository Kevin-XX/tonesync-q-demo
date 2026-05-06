import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import type { SubPage } from '../App'
import type { ConversationState } from '../App'

interface MessagesPageProps {
  conversations: ConversationState[]
  onNavigate: (p: SubPage) => void
}

const avatarColors: Record<string, string> = {
  Q: 'bg-gradient-to-br from-[#12B7F5] to-[#0075B2]',
  晶: 'bg-gradient-to-br from-pink-400 to-rose-500',
  群: 'bg-gradient-to-br from-orange-400 to-red-500',
  打: 'bg-gradient-to-br from-green-400 to-emerald-600',
  明: 'bg-gradient-to-br from-blue-400 to-indigo-500',
  李: 'bg-gradient-to-br from-purple-400 to-violet-600',
  项: 'bg-gradient-to-br from-teal-400 to-cyan-600',
}

// P3-13: 骨架屏
function MessageSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
      <div className="skeleton skeleton-avatar flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton skeleton-text w-1/3" />
        <div className="skeleton skeleton-text w-2/3" />
      </div>
    </div>
  )
}

export function MessagesPage({ conversations, onNavigate }: MessagesPageProps) {
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<ConversationState[] | null>(null)

  // P2-11: 真实搜索（模拟）
  const handleSearch = (text: string) => {
    setSearchText(text)
    if (!text.trim()) { setSearchResult(null); return }
    setSearchLoading(true)
    setTimeout(() => {
      setSearchResult(conversations.filter(c =>
        c.name.includes(text) || c.lastMsg.includes(text)
      ))
      setSearchLoading(false)
    }, 600)
  }

  const displayList = searchResult !== null ? searchResult : conversations

  // 按时间排序：未读优先，然后按时间
  const sortedList = [...displayList].sort((a, b) => {
    if (a.unread && !b.unread) return -1
    if (!a.unread && b.unread) return 1
    return 0
  })

  const handleClick = (conv: ConversationState) => {
    if (conv.isGroup) {
      onNavigate({ type: 'groupchat', groupName: conv.name, groupId: conv.id })
    } else {
      onNavigate({ type: 'chat', friendName: conv.name, friendAvatar: conv.avatar, convId: conv.id })
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED] relative">
      {/* QQ消息标题栏 */}
      <div className="bg-[#12B7F5] px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-[18px] font-bold">消息</h1>
        <div className="flex items-center gap-3">
          <button className="p-1">
            <Search className="w-5 h-5 text-white" />
          </button>
          <button className="p-1">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-3 py-2 bg-[#EDEDED]">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 gap-2">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索"
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 骨架屏 */}
        {loading && <>
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </>}

        {/* 空搜索结果 */}
        {!loading && searchResult !== null && searchResult.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 mb-3 opacity-40">
              <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
                <ellipse cx="35" cy="92" rx="10" ry="5" fill="#ff9f43"/>
                <ellipse cx="65" cy="92" rx="10" ry="5" fill="#ff9f43"/>
                <ellipse cx="50" cy="62" rx="32" ry="30" fill="#1a1a1a"/>
                <ellipse cx="50" cy="68" rx="20" ry="18" fill="white"/>
                <ellipse cx="20" cy="58" rx="8" ry="14" fill="#1a1a1a" transform="rotate(-8 20 58)"/>
                <ellipse cx="80" cy="58" rx="8" ry="14" fill="#1a1a1a" transform="rotate(8 80 58)"/>
                <circle cx="50" cy="35" r="26" fill="#1a1a1a"/>
                <ellipse cx="50" cy="40" rx="18" ry="16" fill="white"/>
                <ellipse cx="40" cy="34" rx="6" ry="7" fill="white"/>
                <ellipse cx="41" cy="35" rx="4" ry="5" fill="#1a1a1a"/>
                <ellipse cx="60" cy="34" rx="6" ry="7" fill="white"/>
                <ellipse cx="61" cy="35" rx="4" ry="5" fill="#1a1a1a"/>
                <ellipse cx="32" cy="42" rx="5" ry="3" fill="#ffb6c1" opacity="0.4"/>
                <ellipse cx="68" cy="42" rx="5" ry="3" fill="#ffb6c1" opacity="0.4"/>
                <ellipse cx="50" cy="48" rx="7" ry="4" fill="#ff9f43"/>
              </svg>
            </div>
            <p className="text-[13px] text-gray-400">找不到"{searchText}"哦~</p>
          </div>
        )}

        {sortedList.map((conv, i) => (
          <motion.button
            key={conv.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => handleClick(conv)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 active:bg-gray-50 text-left"
          >
            {/* 头像 */}
            <div className="relative flex-shrink-0">
              {conv.isQSmall ? (
                // 可爱版小Q头像
                <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-br from-[#12B7F5] to-[#7C3AED] flex items-center justify-center shadow-lg">
                  <svg width="38" height="38" viewBox="0 0 100 100" fill="none">
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
                  <div className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow">AI</div>
                </div>
              ) : conv.isGroup ? (
                <div className="w-[50px] h-[50px] rounded-[10px] grid grid-cols-2 gap-[2px] p-[3px] bg-gray-200">
                  {[conv.avatar, '2', '3', '4'].map((a, idx) => (
                    <div key={idx} className={`rounded-sm ${idx === 0 ? avatarColors[a] || 'bg-blue-400' : 'bg-gray-300'} flex items-center justify-center text-white text-[9px] font-bold`}>
                      {idx === 0 ? a : ''}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`w-[50px] h-[50px] rounded-[10px] ${avatarColors[conv.avatar] || 'bg-blue-400'} flex items-center justify-center text-white font-bold text-lg`}>
                  {conv.avatar}
                </div>
              )}
              {/* 未读红点 */}
              {conv.unread > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {conv.unread > 99 ? '99+' : conv.unread}
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium text-[15px] truncate ${conv.isQSmall ? 'text-[#12B7F5]' : 'text-gray-900'}`}>
                  {conv.name}
                  {conv.isQSmall && <span className="ml-1 text-[10px] bg-[#12B7F5]/10 text-[#12B7F5] px-1.5 py-0.5 rounded-full font-normal">AI伴侣</span>}
                </span>
                <span className="text-gray-400 text-[11px] flex-shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className="text-[13px] text-gray-500 truncate leading-snug">{conv.lastMsg}</p>
            </div>
          </motion.button>
        ))}

        <div className="py-4 text-center">
          <p className="text-xs text-gray-400">— 没有更多消息 —</p>
        </div>
      </div>
    </div>
  )
}
