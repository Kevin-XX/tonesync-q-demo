// 智能场景中心 - 首页升级版
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Users, Sparkles, Heart, Trophy, Star, 
  ChevronRight, Sun, Clock, TrendingUp, Sparkle,
  Zap, Target, Flame
} from 'lucide-react'
import { useQState } from '../contexts/QStateContext'
import { GlobalFloatBall } from './GlobalFloatBall'
import type { SubPage } from '../App'

// 场景建议映射
const SCENE_SUGGESTIONS = {
  chatting: { icon: '💬', text: '开启聊天助手，获取智能回复建议', action: 'chat' },
  browsing: { icon: '📱', text: '浏览朋友圈，看看好友动态', action: 'dynamics' },
  idle: { icon: '🎯', text: '今日目标还没完成哦~', action: null },
  social: { icon: '🎉', text: '有好友生日快到了，记得祝福ta', action: 'social-event' },
  creating: { icon: '✨', text: '创作一条精彩内容吧', action: 'content-creator' },
}

interface SceneCardProps {
  icon: string
  title: string
  desc: string
  gradient: string
  delay: number
  onClick: () => void
  badge?: string
}

function SceneCard({ icon, title, desc, gradient, delay, onClick, badge }: SceneCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-4 text-left w-full group cursor-pointer relative overflow-hidden"
    >
      {/* 渐变背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* 徽章 */}
      {badge && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-medium">
          {badge}
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold mb-0.5 flex items-center gap-1.5">
            {title}
            {badge && <Flame className="w-3.5 h-3.5 text-accent-pink" />}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0 mt-2" />
      </div>
    </motion.button>
  )
}

// 每日目标进度组件
function DailyGoalProgress() {
  const { dailyGoals } = useQState()
  
  // 计算总体进度
  const totalCurrent = dailyGoals.reduce((sum, g) => sum + g.current, 0)
  const totalTarget = dailyGoals.reduce((sum, g) => sum + g.target, 0)
  const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-4 mb-4"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-qqBlue-500" />
          <span className="text-sm font-medium">今日社交目标</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <TrendingUp className="w-3 h-3" />
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* 总进度条 */}
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-qqBlue-500 to-accent-purple rounded-full"
        />
      </div>
      
      {/* 目标网格 */}
      <div className="grid grid-cols-4 gap-2">
        {dailyGoals.map((goal, idx) => {
          const completed = goal.current >= goal.target
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className={`relative p-2 rounded-xl text-center transition-all ${
                completed 
                  ? 'bg-qqBlue-500/20' 
                  : 'bg-slate-700/30'
              }`}
            >
              <div className="text-lg mb-0.5">{goal.icon}</div>
              <div className={`text-[10px] font-medium ${completed ? 'text-qqBlue-400' : 'text-slate-400'}`}>
                {goal.current}/{goal.target}
              </div>
              {/* 完成标记 */}
              {completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px]">✓</span>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// 快捷功能网格
function QuickActions({ onNavigate }: { onNavigate: (p: SubPage) => void }) {
  const quickActions = [
    { icon: '💬', label: '聊天助手', gradient: 'from-qqBlue-500 to-qqBlue-600', action: () => onNavigate({ type: 'chat', friendName: '小芳', friendAvatar: '' }) },
    { icon: '👥', label: '群聊管家', gradient: 'from-accent-purple to-purple-600', action: () => onNavigate({ type: 'groupchat', groupName: '老友群' }) },
    { icon: '🎉', label: '社交事件', gradient: 'from-accent-pink to-pink-600', action: () => onNavigate({ type: 'social-event' }) },
    { icon: '✨', label: '内容创作', gradient: 'from-accent-orange to-orange-600', action: () => onNavigate({ type: 'content-creator' }) },
    { icon: '💝', label: '关系维护', gradient: 'from-red-500 to-rose-600', action: () => onNavigate({ type: 'relation-health' }) },
    { icon: '🎮', label: '社交闯关', gradient: 'from-emerald-500 to-green-600', action: () => onNavigate({ type: 'social-dungeon' }) },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-orange" />
          <span className="text-sm font-medium">快捷功能</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action, idx) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.05, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-xl shadow-lg group-hover:shadow-xl transition-shadow`}>
              {action.icon}
            </div>
            <span className="text-[11px] text-slate-300 font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// 场景建议卡片
function SceneSuggestion({ onNavigate }: { onNavigate: (p: SubPage) => void }) {
  const { sceneContext, updateSceneContext } = useQState()
  const [show, setShow] = useState(true)
  
  // 模拟场景检测
  useEffect(() => {
    const scenes: Array<keyof typeof SCENE_SUGGESTIONS> = ['idle', 'chatting', 'social', 'creating']
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)]
    updateSceneContext({
      currentScene: randomScene,
      suggestion: SCENE_SUGGESTIONS[randomScene].text,
      relatedAction: SCENE_SUGGESTIONS[randomScene].action ?? undefined,
    })
  }, [updateSceneContext])
  
  if (!sceneContext || !show) return null
  
  const suggestion = SCENE_SUGGESTIONS[sceneContext.currentScene]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card rounded-xl p-3 mb-4 border-l-4 border-qqBlue-500"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-qqBlue-500/20 flex items-center justify-center text-xl">
          {suggestion.icon}
        </div>
        <div className="flex-1">
          <div className="text-xs text-slate-400 mb-0.5">📍 场景检测</div>
          <div className="text-sm font-medium">{suggestion.text}</div>
        </div>
        {suggestion.action && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const action = suggestion.action as any
              if (action === 'chat') onNavigate({ type: 'chat', friendName: '小芳', friendAvatar: '' })
              else if (action === 'dynamics') {}
              else if (action === 'social-event') onNavigate({ type: 'social-event' })
              else if (action === 'content-creator') onNavigate({ type: 'content-creator' })
              setShow(false)
            }}
            className="px-3 py-1.5 rounded-lg bg-qqBlue-500 text-white text-xs font-medium"
          >
            前往
          </motion.button>
        )}
        <button 
          onClick={() => setShow(false)}
          className="text-slate-500 hover:text-slate-300 text-xs"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// 小Q状态卡片
function QStatusCard() {
  const { level, exp, intimacy } = useQState()
  const expProgress = (exp / 100) * 100
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        {/* 头像 */}
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-qqBlue-500 to-accent-purple flex items-center justify-center text-3xl shadow-lg"
          >
            🤖
          </motion.div>
          {/* 等级徽章 */}
          <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-accent-orange text-white text-[10px] font-bold shadow">
            Lv.{level}
          </div>
        </div>
        
        {/* 信息 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">同频小Q</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i <= Math.floor(intimacy / 2000) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} 
                />
              ))}
            </div>
          </div>
          
          {/* 经验条 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-qqBlue-400" />
                经验值
              </span>
              <span>{exp}/100</span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expProgress}%` }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-qqBlue-500 to-accent-purple rounded-full"
              />
            </div>
          </div>
        </div>
        
        {/* 亲密度 */}
        <div className="text-center px-3 py-2 rounded-xl bg-slate-700/30">
          <div className="text-lg font-bold text-accent-pink">{intimacy}</div>
          <div className="text-[10px] text-slate-400">亲密度</div>
        </div>
      </div>
    </motion.div>
  )
}

// 时间问候语
function TimeGreeting() {
  const [greeting, setGreeting] = useState('')
  const [icon, setIcon] = useState('')
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('早上好')
      setIcon('🌅')
    } else if (hour >= 12 && hour < 14) {
      setGreeting('中午好')
      setIcon('☀️')
    } else if (hour >= 14 && hour < 18) {
      setGreeting('下午好')
      setIcon('🌤️')
    } else if (hour >= 18 && hour < 22) {
      setGreeting('晚上好')
      setIcon('🌙')
    } else {
      setGreeting('夜深了')
      setIcon('🌃')
    }
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center mb-4"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-base font-medium text-slate-200">{greeting}</div>
      <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
        <Clock className="w-3 h-3" />
        {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
      </div>
    </motion.div>
  )
}

// 主组件
export function SceneCenter({ onNavigate }: { onNavigate: (p: SubPage) => void }) {
  const { startOnboarding, hasSeenOnboarding } = useQState()
  
  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar pb-20">
      {/* 顶部间距 */}
      <div className="h-2" />
      
      {/* 问候语 */}
      <TimeGreeting />
      
      {/* 小Q状态卡片 */}
      <QStatusCard />
      
      {/* 场景建议 */}
      <AnimatePresence mode="wait">
        <SceneSuggestion onNavigate={onNavigate} />
      </AnimatePresence>
      
      {/* 每日目标 */}
      <DailyGoalProgress />
      
      {/* 快捷功能 */}
      <QuickActions onNavigate={onNavigate} />
      
      {/* 功能入口 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-accent-orange" />
          <span className="text-sm font-medium">更多功能</span>
        </div>
        
        <SceneCard
          icon="💝"
          title="关系维护"
          desc="检查好友亲密度，保持社交活跃"
          gradient="from-red-500 to-rose-600"
          delay={0.7}
          badge="推荐"
          onClick={() => onNavigate({ type: 'relation-health' })}
        />
        
        <SceneCard
          icon="🎮"
          title="社交闯关"
          desc="完成社交任务，解锁专属奖励"
          gradient="from-emerald-500 to-green-600"
          delay={0.8}
          onClick={() => onNavigate({ type: 'social-dungeon' })}
        />
        
        <SceneCard
          icon="🧬"
          title="小Q养成"
          desc="培养小Q能力，解锁新技能"
          gradient="from-accent-orange to-orange-600"
          delay={0.9}
          onClick={() => onNavigate({ type: 'evolution' })}
        />
      </motion.div>
      
      {/* 新手引导入口 */}
      {!hasSeenOnboarding && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={startOnboarding}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-qqBlue-500 to-accent-purple text-white font-medium text-sm flex items-center justify-center gap-2"
        >
          <Sparkle className="w-4 h-4" />
          开始新手引导
        </motion.button>
      )}
      
      {/* 底部信息 */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-600">腾讯PCG校园AI产品创意大赛 · 决赛路演Demo</p>
        <p className="text-[9px] text-slate-700 mt-0.5">Version v3.0.0 · 体验优化版</p>
      </div>
    </div>
  )
}
