// 同频小Q 全局状态管理
import { createContext, useContext, useState, useCallback, type ReactNode, useEffect, useRef } from 'react'
import type { PenguinOutfit, PenguinMood } from '../components/PenguinQ'

export type ChatTheme = 'default' | 'dark' | 'qtheme'

// 惊喜时刻类型
export type SurpriseType = 
  | 'first_meet'        // 首次相遇
  | 'first_chat'        // 首次聊天
  | 'level_up'          // 升级
  | 'achievement'       // 成就解锁
  | 'streak_7'          // 连续7天
  | 'easter_egg'        // 彩蛋
  | 'holiday'           // 节日
  | 'milestone'         // 里程碑

// 主动互动类型
export type ActiveInteractionType =
  | 'morning_greeting'   // 早安问候
  | 'bored_prompt'       // 无聊提示
  | 'achievement_share'  // 成就分享
  | 'weather_tip'        // 天气建议
  | 'idle_reminder'      // 闲置提醒

interface SurpriseMoment {
  type: SurpriseType
  title: string
  description: string
  icon: string
  timestamp: number
  shown: boolean
}

interface ActiveInteraction {
  type: ActiveInteractionType
  message: string
  timestamp: number
}

interface QState {
  outfit: PenguinOutfit
  mood: PenguinMood
  intimacy: number       // 亲密度 0-10000
  exp: number            // 当前经验
  level: number          // 等级 1-50
  unlockedOutfits: PenguinOutfit[]
  chatTheme: ChatTheme
  globalMood: PenguinMood  // 全局浮球心情
  // 新增：体验优化相关状态
  isFirstVisit: boolean    // 是否首次访问
  onboardingStep: number   // Onboarding步骤 0-4
  hasSeenOnboarding: boolean
  surpriseQueue: SurpriseMoment[]
  activeInteraction: ActiveInteraction | null
  lastInteractionTime: number
  dailyGoals: DailyGoal[]
  sceneContext: SceneContext | null
}

interface DailyGoal {
  id: string
  label: string
  icon: string
  current: number
  target: number
  color: string
}

interface SceneContext {
  currentScene: 'chatting' | 'browsing' | 'idle' | 'social' | 'creating'
  suggestion: string
  relatedAction?: string
}

interface QStateContextType extends QState {
  setMood: (mood: PenguinMood) => void
  setOutfit: (outfit: PenguinOutfit) => void
  addExp: (amount: number) => void
  addIntimacy: (amount: number) => void
  unlockOutfit: (outfit: PenguinOutfit) => void
  setChatTheme: (theme: ChatTheme) => void
  setGlobalMood: (mood: PenguinMood) => void
  taskProgress: TaskProgress
  completeTask: (id: string) => void
  // 新增方法
  startOnboarding: () => void
  completeOnboarding: () => void
  nextOnboardingStep: () => void
  triggerSurprise: (surprise: Omit<SurpriseMoment, 'timestamp' | 'shown'>) => void
  dismissSurprise: () => void
  triggerActiveInteraction: (interaction: Omit<ActiveInteraction, 'timestamp'>) => void
  dismissActiveInteraction: () => void
  updateDailyGoal: (id: string, delta: number) => void
  updateSceneContext: (scene: SceneContext) => void
  recordInteraction: () => void
  isLoading: boolean
  loadingMessage: string
  setLoading: (loading: boolean, message?: string) => void
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  hideToast: () => void
}

interface TaskProgress {
  interacted: boolean
  replied: number
  liked: number
}

const QStateContext = createContext<QStateContextType | null>(null)

const MAX_EXP = 100

// 默认每日目标
const DEFAULT_DAILY_GOALS: DailyGoal[] = [
  { id: 'chat', label: '聊天互动', icon: '💬', current: 0, target: 5, color: 'from-qqBlue-500 to-qqBlue-600' },
  { id: 'social', label: '社交事件', icon: '🎉', current: 0, target: 3, color: 'from-accent-pink to-pink-600' },
  { id: 'create', label: '内容创作', icon: '✨', current: 0, target: 1, color: 'from-accent-purple to-purple-600' },
  { id: 'evolve', label: '小Q养成', icon: '🌟', current: 0, target: 2, color: 'from-accent-orange to-orange-600' },
]

// 主动互动消息池
const ACTIVE_INTERACTIONS: Record<ActiveInteractionType, string[]> = {
  morning_greeting: [
    '早上好呀！☀️ 今天有什么计划？',
    '早安！新的一天，继续加油~',
    '早呀~今天想和小Q聊些什么呢？',
  ],
  bored_prompt: [
    '嘿，在吗？无聊的话我给你讲个笑话~',
    '好久没和你说话了，想我了吗？',
    '发现一个有趣的话题，要不要聊聊？',
  ],
  achievement_share: [
    '太棒了！你已经坚持使用3天了！🏆',
    '恭喜达成新成就，快来看看~',
    '小Q发现你的社交能力又提升了！',
  ],
  weather_tip: [
    '今天天气不错，适合出门社交哦~',
    '雨天适合宅在家里刷动态~',
    '好天气！要不要发条动态分享心情？',
  ],
  idle_reminder: [
    '别忘了今天的目标还没完成哦~',
    '小Q在这里等你呢~',
    '有新消息提醒，快去看看吧！',
  ],
}

export function QStateProvider({ children }: { children: ReactNode }) {
  const [outfit, setOutfit] = useState<PenguinOutfit>('default')
  const [mood, setMoodState] = useState<PenguinMood>('happy')
  const [intimacy, setIntimacy] = useState(3280)
  const [exp, setExp] = useState(65)
  const [level, setLevel] = useState(8)
  const [unlockedOutfits, setUnlockedOutfits] = useState<PenguinOutfit[]>(['default', 'cyber', 'festival', 'star', 'winter', 'sport', 'ocean', 'panda', 'royal'])
  const [chatTheme, setChatTheme] = useState<ChatTheme>('default')
  const [globalMood, setGlobalMood] = useState<PenguinMood>('happy')
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({
    interacted: false,
    replied: 0,
    liked: 0,
  })
  
  // 新增状态
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [surpriseQueue, setSurpriseQueue] = useState<SurpriseMoment[]>([])
  const [activeInteraction, setActiveInteraction] = useState<ActiveInteraction | null>(null)
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now())
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(DEFAULT_DAILY_GOALS)
  const [sceneContext, setSceneContextState] = useState<SceneContext | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastTypeState] = useState<'success' | 'error' | 'info'>('info')
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setMood = useCallback((m: PenguinMood) => {
    setMoodState(m)
    setGlobalMood(m)
  }, [])

  const addExp = useCallback((amount: number) => {
    setExp(prev => {
      const newExp = prev + amount
      if (newExp >= MAX_EXP) {
        setLevel(l => l + 1)
        // 升级惊喜
        triggerSurpriseInternal({
          type: 'level_up',
          title: '升级啦！',
          description: `恭喜达到Lv.${level + 1}！`,
          icon: '🎉',
        })
        return newExp - MAX_EXP
      }
      return newExp
    })
  }, [level])

  const addIntimacy = useCallback((amount: number) => {
    setIntimacy(prev => Math.min(prev + amount, 10000))
  }, [])

  const unlockOutfit = useCallback((o: PenguinOutfit) => {
    setUnlockedOutfits(prev => prev.includes(o) ? prev : [...prev, o])
  }, [])

  const completeTask = useCallback((id: string) => {
    setTaskProgress(prev => {
      const next = { ...prev }
      if (id === 'interact') next.interacted = true
      if (id === 'replied') next.replied = Math.min(next.replied + 1, 3)
      if (id === 'liked') next.liked = Math.min(next.liked + 1, 2)
      return next
    })
    addExp(15)
    addIntimacy(20)
  }, [addExp, addIntimacy])

  // 新增方法实现
  const startOnboarding = useCallback(() => {
    setOnboardingStep(1)
    setIsFirstVisit(true)
  }, [])

  const completeOnboarding = useCallback(() => {
    setHasSeenOnboarding(true)
    setOnboardingStep(0)
    setIsFirstVisit(false)
    // 首次引导完成触发惊喜
    triggerSurpriseInternal({
      type: 'first_meet',
      title: '初次相遇',
      description: '欢迎来到同频小Q！让我们开始社交之旅吧~',
      icon: '🤝',
    })
  }, [])

  const nextOnboardingStep = useCallback(() => {
    setOnboardingStep(prev => {
      if (prev >= 4) {
        completeOnboarding()
        return 0
      }
      return prev + 1
    })
  }, [completeOnboarding])

  const triggerSurpriseInternal = useCallback((surprise: Omit<SurpriseMoment, 'timestamp' | 'shown'>) => {
    const newSurprise: SurpriseMoment = {
      ...surprise,
      timestamp: Date.now(),
      shown: false,
    }
    setSurpriseQueue(prev => [...prev, newSurprise])
  }, [])

  const triggerSurprise = useCallback((surprise: Omit<SurpriseMoment, 'timestamp' | 'shown'>) => {
    triggerSurpriseInternal(surprise)
  }, [triggerSurpriseInternal])

  const dismissSurprise = useCallback(() => {
    setSurpriseQueue(prev => prev.slice(1))
  }, [])

  const triggerActiveInteractionInternal = useCallback(() => {
    // 根据时间判断互动类型
    const hour = new Date().getHours()
    let type: ActiveInteractionType = 'idle_reminder'
    
    if (hour >= 7 && hour < 12) {
      type = 'morning_greeting'
    } else if (Math.random() > 0.7) {
      type = 'bored_prompt'
    }
    
    const messages = ACTIVE_INTERACTIONS[type]
    const message = messages[Math.floor(Math.random() * messages.length)]
    
    setActiveInteraction({ type, message, timestamp: Date.now() })
  }, [])

  const triggerActiveInteraction = useCallback((interaction: Omit<ActiveInteraction, 'timestamp'>) => {
    setActiveInteraction({ ...interaction, timestamp: Date.now() })
  }, [])

  const dismissActiveInteraction = useCallback(() => {
    setActiveInteraction(null)
    setLastInteractionTime(Date.now())
  }, [])

  const updateDailyGoal = useCallback((id: string, delta: number) => {
    setDailyGoals(prev => prev.map(g => 
      g.id === id ? { ...g, current: Math.min(g.current + delta, g.target) } : g
    ))
  }, [])

  const updateSceneContext = useCallback((scene: SceneContext) => {
    setSceneContextState(scene)
  }, [])

  const recordInteraction = useCallback(() => {
    setLastInteractionTime(Date.now())
    // 重置闲置计时器
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    // 5分钟无操作后触发主动互动
    idleTimerRef.current = setTimeout(() => {
      triggerActiveInteractionInternal()
    }, 5 * 60 * 1000)
  }, [triggerActiveInteractionInternal])

  const setLoading = useCallback((loading: boolean, message: string = '加载中...') => {
    setIsLoading(loading)
    setLoadingMessage(message)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message)
    setToastTypeState(type)
    // 3秒后自动消失
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }, [])

  const hideToast = useCallback(() => {
    setToastMessage(null)
  }, [])

  // 检查是否需要显示新手引导
  useEffect(() => {
    if (!hasSeenOnboarding && onboardingStep === 0) {
      // 可以在这里启动引导
    }
  }, [hasSeenOnboarding, onboardingStep])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [])

  return (
    <QStateContext.Provider value={{
      outfit, mood, intimacy, exp, level, unlockedOutfits, chatTheme, globalMood,
      taskProgress,
      setMood, setOutfit, addExp, addIntimacy, unlockOutfit, setChatTheme, setGlobalMood, completeTask,
      // 新增
      isFirstVisit,
      onboardingStep,
      hasSeenOnboarding,
      startOnboarding,
      completeOnboarding,
      nextOnboardingStep,
      surpriseQueue,
      triggerSurprise,
      dismissSurprise,
      activeInteraction,
      triggerActiveInteraction,
      dismissActiveInteraction,
      dailyGoals,
      updateDailyGoal,
      sceneContext,
      updateSceneContext,
      recordInteraction,
      lastInteractionTime,
      isLoading,
      loadingMessage,
      setLoading,
      toastMessage,
      toastType,
      showToast,
      hideToast,
    }}>
      {children}
    </QStateContext.Provider>
  )
}

export function useQState() {
  const ctx = useContext(QStateContext)
  if (!ctx) throw new Error('useQState must be used inside QStateProvider')
  return ctx
}
