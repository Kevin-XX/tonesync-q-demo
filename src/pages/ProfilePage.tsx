import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Settings, QrCode, Trophy } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'
import { useQState } from '../contexts/QStateContext'
import type { SubPage } from '../App'
import { AchievementPanel } from '../components/SurpriseMoment'

interface ProfilePageProps {
  onNavigate: (p: SubPage) => void
}

const menuGroups = [
  {
    items: [
      { icon: '💰', label: 'QQ钱包', badge: null, color: 'bg-yellow-500' },
      { icon: '⭐', label: '收藏', badge: null, color: 'bg-orange-500' },
      { icon: '🎮', label: '游戏中心', badge: null, color: 'bg-purple-500' },
    ]
  },
  {
    items: [
      { icon: '🔔', label: '消息通知', badge: null, color: 'bg-red-500' },
      { icon: '🔒', label: '隐私', badge: null, color: 'bg-gray-600' },
      { icon: '🌙', label: '勿扰模式', badge: null, color: 'bg-indigo-500' },
    ]
  },
  {
    items: [
      { icon: '⚙️', label: '设置', badge: null, color: 'bg-gray-500' },
    ]
  },
]

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { intimacy, level, exp, outfit, unlockedOutfits } = useQState()
  const [showAchievementPanel, setShowAchievementPanel] = useState(false)
  const expPct = exp // 0-100

  return (
    <div className="flex flex-col h-full bg-[#EDEDED] overflow-y-auto no-scrollbar relative">
      {/* 顶部背景 */}
      <div className="relative bg-gradient-to-b from-[#0A85B8] to-[#12B7F5] pt-4 pb-8 px-4">
        <div className="flex justify-end gap-3 mb-5">
          <button className="p-2"><QrCode className="w-5 h-5 text-white/80" /></button>
          <button className="p-2"><Settings className="w-5 h-5 text-white/80" /></button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#12B7F5] to-[#7C3AED] p-[3px] shadow-lg flex-shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
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
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-[20px] font-bold">小Q用户</h2>
              <svg className="w-4 h-4 text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p className="text-white/70 text-[12px] mt-0.5">QQ号：123456789</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">QQ会员</span>
              <span className="bg-yellow-400/30 text-yellow-200 text-[10px] px-2 py-0.5 rounded-full">年费会员</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </div>
      </div>

      {/* 小Q绑定卡片 */}
      <div className="mx-3 -mt-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 border border-[#12B7F5]/10 overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#12B7F5]/8 to-transparent" />

          <div className="flex items-center gap-3 relative">
            <div className="flex-shrink-0">
              <PenguinQ size={60} outfit={outfit} mood="happy" animated={true} floating={true} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-bold text-gray-900">同频小Q</span>
                <span className="bg-[#12B7F5] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">AI伴侣</span>
              </div>
              {/* 经验条 */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${expPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#12B7F5] to-[#8B5CF6] rounded-full"
                  />
                </div>
                <span className="text-[9px] text-gray-400">{expPct}/100</span>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: '亲密值', value: intimacy, unit: 'pt', color: 'text-pink-500' },
                  { label: '等级', value: `Lv.${level}`, unit: '', color: 'text-[#12B7F5]' },
                  { label: '已解锁', value: unlockedOutfits.length, unit: '装扮', color: 'text-purple-500' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-[13px] font-bold ${s.color}`}>{s.value}<span className="text-[9px] font-normal ml-0.5">{s.unit}</span></div>
                    <div className="text-[9px] text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate({ type: 'chat', friendName: '同频小Q', friendAvatar: 'Q' })}
              className="bg-[#12B7F5] text-white text-[12px] font-bold px-3 py-2 rounded-xl shadow-sm flex-shrink-0"
            >
              找小Q
            </motion.button>
          </div>

          {/* 快捷功能 */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-50">
            {[
              { emoji: '🚀', label: '创新亮点', action: () => onNavigate({ type: 'innovations' }), color: 'bg-gradient-to-br from-[#12B7F5]/10 to-[#7C3AED]/10', isNew: true },
              { emoji: '👗', label: '换装', action: () => onNavigate({ type: 'evolution' }), color: 'bg-pink-50' },
              { emoji: '💡', label: '社交事件', action: () => onNavigate({ type: 'social-event' }), color: 'bg-red-50', isNew: true },
              { emoji: '✍️', label: '内容创作', action: () => onNavigate({ type: 'content-creator' }), color: 'bg-purple-50', isNew: true },
              { emoji: '💕', label: '关系维护', action: () => onNavigate({ type: 'relation-health' }), color: 'bg-pink-50' },
              { emoji: '🏆', label: '社交副本', action: () => onNavigate({ type: 'social-dungeon' }), color: 'bg-indigo-50', isNew: true },
              { emoji: '💎', label: '会员中心', action: () => onNavigate({ type: 'vip-center' }), color: 'bg-yellow-50' },
              { emoji: '⚙️', label: '技术架构', action: () => onNavigate({ type: 'tech-architecture' }), color: 'bg-blue-50', isNew: true },
            ].map((item, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={item.action}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl ${item.color} relative`}
              >
                <span className="text-xl relative">
                  {item.emoji}
                  {item.isNew && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </span>
                <span className="text-[10px] text-gray-600 font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 功能菜单 */}
      <div className="mt-3 space-y-2 pb-4">
        {menuGroups.map((group, gi) => (
          <div key={gi} className="bg-white mx-3 rounded-xl overflow-hidden">
            {group.items.map((item, ii) => (
              <motion.button
                key={ii}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 text-left"
              >
                <div className={`w-9 h-9 ${item.color} rounded-lg flex items-center justify-center text-lg shadow-sm`}>
                  {item.icon}
                </div>
                <span className="flex-1 text-[15px] text-gray-800">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <div className="pb-6 text-center">
        <p className="text-[11px] text-gray-300">同频小Q · QQ社交AI伴侣 v2.0</p>
      </div>

      {/* 成就中心面板 */}
      <AnimatePresence>
        {showAchievementPanel && (
          <AchievementPanel onClose={() => setShowAchievementPanel(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
