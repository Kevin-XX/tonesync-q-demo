// 惊喜时刻系统 - Surprise Moments
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Trophy, Star, Heart, Gift, Zap, Crown, PartyPopper } from 'lucide-react'
import { useQState, type SurpriseType } from '../contexts/QStateContext'

// 惊喜图标映射
const SURPRISE_ICONS: Record<SurpriseType, string> = {
  first_meet: '🤝',
  first_chat: '💬',
  level_up: '🎉',
  achievement: '🏆',
  streak_7: '🔥',
  easter_egg: '🥚',
  holiday: '🎊',
  milestone: '⭐',
}

// 惊喜颜色映射
const SURPRISE_COLORS: Record<SurpriseType, string> = {
  first_meet: 'from-green-500 to-emerald-600',
  first_chat: 'from-qqBlue-500 to-blue-600',
  level_up: 'from-purple-500 to-violet-600',
  achievement: 'from-yellow-500 to-orange-600',
  streak_7: 'from-red-500 to-rose-600',
  easter_egg: 'from-pink-500 to-rose-600',
  holiday: 'from-accent-pink to-purple-600',
  milestone: 'from-accent-orange to-yellow-500',
}

// 粒子动画
function Particles({ color }: { color: string }) {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    delay: Math.random() * 0.3,
    distance: 80 + Math.random() * 60,
  }))
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            scale: 0, 
            x: 0, 
            y: 0,
            opacity: 1 
          }}
          animate={{ 
            scale: [0, 1, 0],
            x: Math.cos(p.angle * Math.PI / 180) * p.distance,
            y: Math.sin(p.angle * Math.PI / 180) * p.distance,
            opacity: [1, 1, 0],
          }}
          transition={{ 
            duration: 1,
            delay: p.delay,
            ease: 'easeOut'
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// 星星动画
function StarBurst() {
  const stars = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    angle: (i / 8) * 360,
  }))
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {stars.map(s => (
        <motion.div
          key={s.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute"
          style={{
            transform: `rotate(${s.angle}deg)`,
          }}
        >
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </motion.div>
      ))}
    </div>
  )
}

// 惊喜卡片
function SurpriseCard({ 
  type, 
  title, 
  description, 
  icon,
  onDismiss 
}: { 
  type: SurpriseType
  title: string
  description: string
  icon: string
  onDismiss: () => void
}) {
  const gradient = SURPRISE_COLORS[type]
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onDismiss}
    >
      {/* 粒子效果 */}
      <Particles color={gradient.includes('yellow') ? '#FBBF24' : '#12B7F5'} />
      
      {/* 卡片 */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl overflow-hidden"
      >
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
        
        {/* 边框光效 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-xl`} />
        
        {/* 内容 */}
        <div className="relative text-center">
          {/* 图标 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-inner"
          >
            <motion.span 
              className="text-4xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {icon}
            </motion.span>
          </motion.div>
          
          {/* 星星爆发 */}
          <StarBurst />
          
          {/* 标签 */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-xs font-medium mb-3`}>
            <Sparkles className="w-3 h-3" />
            {type === 'level_up' ? '升级' : type === 'achievement' ? '成就解锁' : type === 'first_meet' ? '初次相遇' : '惊喜'}
          </div>
          
          {/* 标题 */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold mb-2"
          >
            {title}
          </motion.h3>
          
          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm leading-relaxed mb-4"
          >
            {description}
          </motion.p>
          
          {/* 确认按钮 */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg`}
          >
            太棒了！
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 成就列表徽章
function AchievementBadge({ 
  icon, 
  title, 
  description, 
  isNew = false 
}: { 
  icon: string
  title: string
  description: string
  isNew?: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card rounded-xl p-3 flex items-center gap-3 ${isNew ? 'ring-2 ring-yellow-500/50' : ''}`}
    >
      {/* 图标 */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isNew ? 'from-yellow-500 to-orange-500' : 'from-slate-700 to-slate-800'} flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      
      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{title}</span>
          {isNew && (
            <span className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-medium">NEW</span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate">{description}</p>
      </div>
    </motion.div>
  )
}

// 主组件 - 惊喜时刻展示
export function SurpriseMoment() {
  const { surpriseQueue, dismissSurprise } = useQState()
  const currentSurprise = surpriseQueue[0]
  
  if (!currentSurprise) return null
  
  return (
    <AnimatePresence>
      <SurpriseCard
        type={currentSurprise.type}
        title={currentSurprise.title}
        description={currentSurprise.description}
        icon={currentSurprise.icon}
        onDismiss={dismissSurprise}
      />
    </AnimatePresence>
  )
}

// 小Q主动互动气泡
export function QActiveBubble() {
  const { activeInteraction, dismissActiveInteraction } = useQState()
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    if (activeInteraction) {
      setVisible(true)
      // 5秒后自动消失
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(dismissActiveInteraction, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [activeInteraction, dismissActiveInteraction])
  
  if (!activeInteraction) return null
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-24 right-4 z-40 max-w-[280px]"
          onClick={() => {
            setVisible(false)
            setTimeout(dismissActiveInteraction, 300)
          }}
        >
          <div className="glass-card rounded-2xl p-4 shadow-xl border border-qqBlue-500/30 cursor-pointer hover:border-qqBlue-500/50 transition-colors">
            {/* 小Q头像 */}
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-qqBlue-500 to-accent-purple flex items-center justify-center text-xl shadow-lg flex-shrink-0"
              >
                🤖
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <span>同频小Q</span>
                  <span className="text-qqBlue-400">在线</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {activeInteraction.message}
                </p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setVisible(false)
                  setTimeout(dismissActiveInteraction, 300)
                }}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 预设成就展示
export const ACHIEVEMENTS = [
  { id: 'first_meet', icon: '🤝', title: '初次相遇', description: '完成新手引导', unlocked: true },
  { id: 'first_chat', icon: '💬', title: '初次对话', description: '和小Q聊过天', unlocked: false },
  { id: 'level_5', icon: '⭐', title: '初露锋芒', description: '达到5级', unlocked: false },
  { id: 'streak_3', icon: '🔥', title: '连续活跃', description: '连续使用3天', unlocked: false },
  { id: 'content_creator', icon: '✨', title: '创作者', description: '发布第一条内容', unlocked: false },
  { id: 'social_master', icon: '🎭', title: '社交达人', description: '关系维护达到100%', unlocked: false },
]

// 成就展示面板
export function AchievementPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold">成就中心</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              isNew={achievement.id === 'first_meet'}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
