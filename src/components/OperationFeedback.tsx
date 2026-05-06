// 操作反馈系统 - Loading/Success/Error Feedback
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Loader2, AlertCircle, Info, Sparkles } from 'lucide-react'
import { useQState } from '../contexts/QStateContext'

// Toast 吐司通知
export function Toast() {
  const { toastMessage, toastType, hideToast } = useQState()
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    if (toastMessage) {
      setVisible(true)
    }
  }, [toastMessage])
  
  const icons = {
    success: <Check className="w-5 h-5 text-green-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-qqBlue-400" />,
  }
  
  const bgColors = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-qqBlue-500/10 border-qqBlue-500/30',
  }
  
  return (
    <AnimatePresence>
      {visible && toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] min-w-[200px] max-w-[90vw]"
        >
          <div className={`${bgColors[toastType]} border rounded-xl px-4 py-3 backdrop-blur-md shadow-xl flex items-center gap-3`}>
            {icons[toastType]}
            <span className="text-sm font-medium">{toastMessage}</span>
            <button 
              onClick={() => {
                setVisible(false)
                setTimeout(hideToast, 300)
              }}
              className="ml-2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 全屏加载
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
    >
      {/* 旋转的加载器 */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-qqBlue-500/20 border-t-qqBlue-500"
        />
        {/* 内部小Q */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-2xl">🤖</span>
        </motion.div>
      </div>
      
      {/* 加载文字 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-white font-medium mb-1">小Q正在思考...</p>
        <p className="text-slate-400 text-sm">{message || '加载中'}</p>
      </motion.div>
    </motion.div>
  )
}

// 成功动画
export function SuccessAnimation({ 
  message, 
  onComplete 
}: { 
  message?: string
  onComplete?: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center"
    >
      {/* 成功圆圈 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>
      
      {/* 消息 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-white font-medium"
      >
        {message || '操作成功！'}
      </motion.p>
      
      {/* 撒花效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: '50%', 
              x: `${50 + (Math.random() - 0.5) * 30}%`,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              y: '-50%',
              opacity: 0,
              rotate: Math.random() * 720 - 360
            }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.05 }}
            className="absolute w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: ['#12B7F5', '#F472B6', '#FB923C', '#A855F7'][i % 4]
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// 错误提示
export function ErrorToast({ 
  message, 
  onDismiss 
}: { 
  message: string
  onDismiss: () => void 
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 backdrop-blur-md shadow-xl flex items-center gap-3 max-w-[90vw]">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <span className="text-sm text-red-200 flex-1">{message}</span>
        <button 
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-300 text-xs"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// 按钮加载状态
interface LoadingButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function LoadingButton({ 
  children, 
  isLoading, 
  onClick, 
  className = '',
  disabled 
}: LoadingButtonProps) {
  return (
    <motion.button
      whileHover={isLoading ? {} : { scale: 1.02 }}
      whileTap={isLoading ? {} : { scale: 0.98 }}
      onClick={isLoading ? undefined : onClick}
      disabled={isLoading || disabled}
      className={`
        relative overflow-hidden
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* 加载中遮罩 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-inherit flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 内容 */}
      <div className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
        {children}
      </div>
    </motion.button>
  )
}

// 脉冲动画（用于强调）
export function PulseAnimation({ children, active = true }: { children: React.ReactNode, active?: boolean }) {
  if (!active) return <>{children}</>
  
  return (
    <motion.div
      animate={{ 
        boxShadow: [
          '0 0 0 0 rgba(18, 183, 245, 0.4)',
          '0 0 0 8px rgba(18, 183, 245, 0)',
        ]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  )
}

// 数字跳动（用于计数器）
export function AnimatedNumber({ value, className = '' }: { value: number, className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {value}
    </motion.span>
  )
}

// 空状态组件
interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* 图标 */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center text-4xl mb-4"
      >
        {icon}
      </motion.div>
      
      {/* 标题 */}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      
      {/* 描述 */}
      <p className="text-slate-400 text-sm mb-6 max-w-xs">{description}</p>
      
      {/* 操作按钮 */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-qqBlue-500 to-accent-purple text-white font-medium text-sm shadow-lg"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
