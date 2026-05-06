import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Star, Settings2, Bell, Shield, Crown, User, Heart, MessageCircle, Camera, QrCode } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import type { SubPage } from '../App'

interface ContactsPageProps {
  onNavigate: (p: SubPage) => void
}

const contacts = [
  { id: 'q', name: '同频小Q', tag: 'AI伴侣', isQ: true },
  { id: 'fang', name: '小芳', tag: '好友', avatar: '芳', avatarColor: 'from-pink-400 to-rose-500' },
  { id: 'ming', name: '小明', tag: '好友', avatar: '明', avatarColor: 'from-blue-400 to-blue-600' },
  { id: 'li', name: '小李', tag: '同学', avatar: '李', avatarColor: 'from-purple-400 to-purple-600' },
  { id: 'hong', name: '小红', tag: '同学', avatar: '红', avatarColor: 'from-pink-400 to-pink-600' },
]

const groups = [
  { id: 'game', name: '开黑交流群', count: 128 },
  { id: 'study', name: '学习打卡群', count: 56 },
  { id: 'work', name: '项目协作群', count: 12 },
]

export function ContactsPage({ onNavigate }: ContactsPageProps) {
  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      <div className="bg-[#12B7F5] px-4 py-3">
        <h1 className="text-white text-[18px] font-bold">联系人</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 功能入口 */}
        <div className="bg-white mt-0 mb-2">
          {[
            { icon: '👥', label: '新的朋友', badge: '2' },
            { icon: '💬', label: '群聊', badge: null },
            { icon: '🏷️', label: '标签', badge: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 rounded-lg bg-[#12B7F5]/10 flex items-center justify-center text-lg">{item.icon}</div>
              <span className="flex-1 text-[15px] text-gray-800">{item.label}</span>
              {item.badge && <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </div>

        {/* 小Q伴侣 */}
        <div className="px-4 py-2">
          <p className="text-[11px] text-gray-400 font-medium">我的AI伴侣</p>
        </div>
        <div className="bg-white mb-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate({ type: 'chat', friendName: '同频小Q', friendAvatar: 'Q', convId: 'q' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#12B7F5] to-[#0075B2] flex items-center justify-center relative">
              <PenguinQ size={44} outfit="default" mood="happy" animated={true} />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">AI</div>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-medium text-[#12B7F5]">同频小Q</div>
              <div className="text-[12px] text-gray-400">你的QQ智能社交伙伴 · Lv.12</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] bg-[#12B7F5]/10 text-[#12B7F5] px-2 py-0.5 rounded-full font-medium">温柔型</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </motion.button>
        </div>

        {/* 好友列表 */}
        <div className="px-4 py-2">
          <p className="text-[11px] text-gray-400 font-medium">好友（{contacts.filter(c => !c.isQ).length}）</p>
        </div>
        <div className="bg-white mb-2">
          {contacts.filter(c => !c.isQ).map((c, i) => (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate({ type: 'chat', friendName: c.name, friendAvatar: c.avatar || c.name[0], convId: c.id })}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
                {c.avatar}
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-gray-800">{c.name}</div>
                <div className="text-[12px] text-gray-400">{c.tag}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </motion.button>
          ))}
        </div>

        {/* 群聊 */}
        <div className="px-4 py-2">
          <p className="text-[11px] text-gray-400 font-medium">群聊（{groups.length}）</p>
        </div>
        <div className="bg-white mb-4">
          {groups.map((g, i) => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate({ type: 'groupchat', groupName: g.name, groupId: g.id })}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200 grid grid-cols-2 gap-[2px] p-[3px]">
                {[1,2,3,4].map(n => (
                  <div key={n} className={`rounded-sm ${['bg-blue-400','bg-green-400','bg-pink-400','bg-purple-400'][n-1]}`} />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-gray-800">{g.name}</div>
                <div className="text-[12px] text-gray-400">{g.count}人</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
