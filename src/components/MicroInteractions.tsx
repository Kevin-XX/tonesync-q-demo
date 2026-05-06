// 微交互动效库 - Micro Interactions Library
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useState, useEffect } from 'react'

// 弹簧弹性预设
export const SPRING_PRESETS = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },
  smooth: { type: 'spring', stiffness: 80, damping: 20 },
  snappy: { type: 'spring', stiffness: 400, damping: 25 },
}

// 按钮点击动效
interface SpringButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function SpringButton({ 
  children, 
  className = '',
  variant = 'primary',
  size = 'md',
  ...props 
}: SpringButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-qqBlue-500 to-accent-purple text-white shadow-lg',
    secondary: 'bg-slate-700 text-white',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-700/50',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl',
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={SPRING_PRESETS.gentle}
      className={`${variants[variant]} ${sizes[size]} font-medium cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// 卡片悬浮动效
interface HoverCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function HoverCard({ children, className = '', onClick }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING_PRESETS.gentle}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}

// 成功反馈动画
export function SuccessPop({ onComplete }: { onComplete?: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d="M20 6L9 17l-5-5" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

// 数字滚动动画
export function AnimatedCounter({ 
  value, 
  duration = 0.5 
}: { 
  value: number
  duration?: number 
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
      key={value}
    >
      {value}
    </motion.span>
  )
}

// 心跳动画
export function Heartbeat({ 
  children, 
  active = true 
}: { 
  children: React.ReactNode
  active?: boolean 
}) {
  if (!active) return <>{children}</>
  
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// 摇晃动画
export function Shake({ 
  children, 
  active = false 
}: { 
  children: React.ReactNode
  active?: boolean 
}) {
  return (
    <motion.div
      animate={active ? {
        x: [0, -5, 5, -5, 5, 0],
        rotate: [0, -2, 2, -2, 2, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// 浮动动画
export function Floating({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 脉冲环动画
export function PulseRing({ 
  children, 
  active = true 
}: { 
  children: React.ReactNode
  active?: boolean 
}) {
  if (!active) return <>{children}</>
  
  return (
    <div className="relative">
      {/* 脉冲环 */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1.5],
            opacity: [0.5, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full border-2 border-qqBlue-500"
        />
      </div>
      {children}
    </div>
  )
}

// 滑入动画
export function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0 
}: { 
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
}) {
  const directions = {
    left: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    up: { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  }
  
  return (
    <motion.div
      initial={directions[direction].initial}
      animate={directions[direction].animate}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// 渐入渐出
export function FadeInOut({ 
  children, 
  show = true 
}: { 
  children: React.ReactNode
  show?: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// 进度条动画
export function AnimatedProgress({ 
  value, 
  className = '',
  showLabel = false
}: { 
  value: number
  className?: string
  showLabel?: boolean
}) {
  return (
    <div className="relative">
      <div className={`h-2 bg-slate-700/50 rounded-full overflow-hidden ${className}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-qqBlue-500 to-accent-purple rounded-full"
        />
      </div>
      {showLabel && (
        <div className="text-xs text-slate-400 mt-1">
          {Math.round(value)}%
        </div>
      )}
    </div>
  )
}

// 礼花效果
export function Confetti({ 
  active = true,
  duration = 2
}: { 
  active?: boolean
  duration?: number
}) {
  if (!active) return null
  
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#12B7F5', '#F472B6', '#FB923C', '#A855F7', '#22C55E'][i % 5],
    size: Math.random() * 8 + 4,
    shape: Math.random() > 0.5 ? 'circle' : 'square',
    rotation: Math.random() * 360,
  }))
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            y: -20, 
            x: `${p.x}vw`,
            opacity: 1,
            rotate: p.rotation,
          }}
          animate={{ 
            y: '100vh', 
            opacity: [1, 1, 0],
            rotate: p.rotation + 720,
            x: `${p.x + (Math.random() - 0.5) * 30}vw`,
          }}
          transition={{ 
            duration: duration + Math.random(),
            delay: p.delay,
            ease: 'easeIn',
          }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

// 打字机效果
export function Typewriter({ 
  text, 
  speed = 50,
  className = ''
}: { 
  text: string
  speed?: number
  className?: string
}) {
  const [displayText, setDisplayText] = useState('')
  
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
    
    return () => clearInterval(interval)
  }, [text, speed])
  
  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  )
}
