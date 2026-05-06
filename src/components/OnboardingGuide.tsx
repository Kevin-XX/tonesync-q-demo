// 新手引导系统 - Onboarding Guide
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Sparkles, Heart, Trophy, 
  ChevronRight, ChevronLeft, Star, Check,
  Sparkle, Home, Users, Camera
} from 'lucide-react'
import { useQState } from '../contexts/QStateContext'

interface OnboardingStep {
  id: number
  icon: string
  title: string
  description: string
  highlight?: string  // 高亮区域描述
  action?: string     // 操作提示
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    icon: '🤖',
    title: '欢迎来到同频小Q',
    description: '我是你的AI社交伙伴，可以帮你智能回复、创作内容、管理关系，让社交更有趣！',
    action: '左右滑动切换功能页',
  },
  {
    id: 2,
    icon: '💬',
    title: '智能聊天助手',
    description: '不知道如何回复？让小Q帮你！输入消息，快速获得多个回复建议，还能帮你润色文案。',
    highlight: '消息页面 → 聊天助手',
  },
  {
    id: 3,
    icon: '🎉',
    title: '社交事件提醒',
    description: '好友生日、重要纪念日...小Q会提前提醒你，再也不会错过重要的日子！',
    highlight: '个人中心 → 社交事件',
  },
  {
    id: 4,
    icon: '💝',
    title: '关系健康度',
    description: '担心和好友疏远了？小Q帮你监测关系亲密度，提醒你保持联系。',
    highlight: '个人中心 → 关系维护',
  },
  {
    id: 5,
    icon: '🎮',
    title: '社交闯关游戏',
    description: '通过完成社交任务获得奖励，解锁小Q的新皮肤和能力，边玩边社交！',
    highlight: '个人中心 → 社交闯关',
  },
]

// 步骤指示器
function StepIndicator({ total, current, onClick }: { total: number, current: number, onClick: (step: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onClick(idx)}
          className={`transition-all duration-300 rounded-full ${
            idx === current 
              ? 'w-8 h-2.5 bg-qqBlue-500' 
              : idx < current 
                ? 'w-2.5 h-2.5 bg-qqBlue-500/50' 
                : 'w-2.5 h-2.5 bg-slate-600'
          }`}
        />
      ))}
    </div>
  )
}

// 步骤内容卡片
function StepContent({ step, isActive }: { step: OnboardingStep, isActive: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-center px-4"
        >
          {/* 大图标 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-qqBlue-500/20 to-accent-purple/20 flex items-center justify-center text-5xl shadow-2xl border border-qqBlue-500/30"
          >
            {step.icon}
          </motion.div>
          
          {/* 标题 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-3"
          >
            {step.title}
          </motion.h2>
          
          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-sm leading-relaxed mb-4 max-w-xs mx-auto"
          >
            {step.description}
          </motion.p>
          
          {/* 高亮区域 */}
          {step.highlight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-qqBlue-500/10 border border-qqBlue-500/30 text-qqBlue-400 text-xs"
            >
              <Camera className="w-3 h-3" />
              {step.highlight}
            </motion.div>
          )}
          
          {/* 操作提示 */}
          {step.action && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"
            >
              <ChevronRight className="w-3 h-3" />
              {step.action}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 成就徽章
function AchievementBadge({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 p-1 rounded-full shadow-2xl"
          >
            <div className="bg-slate-900 rounded-full p-6 flex flex-col items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, repeat: 2 }}
                className="text-6xl mb-3"
              >
                🏆
              </motion.div>
              <div className="text-lg font-bold text-white mb-1">恭喜完成引导!</div>
              <div className="text-xs text-slate-400">解锁成就「初次相遇」</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 撒花动画
function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#12B7F5', '#F472B6', '#FB923C', '#A855F7', '#22C55E'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    type: Math.random() > 0.5 ? 'circle' : 'square',
  }))
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{ 
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.type === 'circle' ? '50%' : 0,
          }}
        />
      ))}
    </div>
  )
}

// 主组件
export function OnboardingGuide() {
  const { onboardingStep, nextOnboardingStep, completeOnboarding, hasSeenOnboarding } = useQState()
  const [showAchievement, setShowAchievement] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const isLastStep = onboardingStep === ONBOARDING_STEPS.length
  const currentStep = ONBOARDING_STEPS[onboardingStep - 1] || ONBOARDING_STEPS[0]
  
  const handleNext = () => {
    if (isLastStep) {
      setShowConfetti(true)
      setTimeout(() => {
        setShowAchievement(true)
        setTimeout(() => {
          setShowAchievement(false)
          setShowConfetti(false)
          completeOnboarding()
        }, 2000)
      }, 500)
    } else {
      nextOnboardingStep()
    }
  }
  
  const handleSkip = () => {
    completeOnboarding()
  }
  
  if (hasSeenOnboarding) return null
  
  return (
    <>
      <AnimatePresence>
        {onboardingStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col"
          >
            {/* 撒花效果 */}
            <Confetti show={showConfetti} />
            
            {/* 成就弹窗 */}
            <AchievementBadge show={showAchievement} />
            
            {/* 内容区 */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🤖</span>
                  <span className="font-bold text-lg">同频小Q</span>
                </div>
              </motion.div>
              
              {/* 步骤内容 */}
              <div className="w-full max-w-sm">
                <StepContent 
                  step={currentStep} 
                  isActive={!showAchievement} 
                />
              </div>
              
              {/* 步骤指示器 */}
              {!showAchievement && (
                <div className="mt-8">
                  <StepIndicator 
                    total={ONBOARDING_STEPS.length} 
                    current={onboardingStep - 1}
                    onClick={() => {}}
                  />
                </div>
              )}
            </div>
            
            {/* 底部按钮 */}
            {!showAchievement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 space-y-3"
              >
                {/* 主按钮 */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-qqBlue-500 to-accent-purple text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-qqBlue-500/30"
                >
                  {isLastStep ? (
                    <>
                      <Check className="w-5 h-5" />
                      完成引导
                    </>
                  ) : (
                    <>
                      {onboardingStep === 1 ? '开始探索' : '下一步'}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                
                {/* 跳过按钮 */}
                {onboardingStep < 3 && (
                  <button
                    onClick={handleSkip}
                    className="w-full py-2 text-slate-500 text-sm"
                  >
                    跳过引导
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 便携式引导提示（用于非首访用户）
interface GuideTipProps {
  target: string
  children: React.ReactNode
}

export function GuideTip({ target, children }: GuideTipProps) {
  const { hasSeenOnboarding } = useQState()
  
  if (hasSeenOnboarding) return <>{children}</>
  
  return (
    <div className="relative group">
      {children}
      {/* 引导高亮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 rounded-xl border-2 border-qqBlue-500 pointer-events-none"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -inset-1 rounded-xl border border-qqBlue-500/50"
        />
      </motion.div>
    </div>
  )
}
