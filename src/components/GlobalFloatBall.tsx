// 全局浮球 - P1-5: 全页可拖动浮球 + 快捷面板
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shirt, Calendar, TrendingUp, X } from 'lucide-react'
import { PenguinQ } from './PenguinQ'
import { useQState } from '../contexts/QStateContext'
import type { SubPage } from '../App'

const BALL_SIZE = 56

interface GlobalFloatBallProps {
  onNavigate: (p: SubPage) => void
}

export function GlobalFloatBall({ onNavigate }: GlobalFloatBallProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 }) // 基于 right=12, bottom=68 的偏移
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const { outfit, mood, exp, level, intimacy } = useQState()

  // 计算边界约束
  const getConstraints = useCallback(() => {
    if (!containerRef.current) return { left: -9999, right: 9999, top: -9999, bottom: 9999 }
    const rect = containerRef.current.getBoundingClientRect()
    const maxX = rect.width - BALL_SIZE - 12
    const maxY = rect.height - BALL_SIZE - 68
    return {
      left: -maxX,
      right: 12,
      top: -maxY,
      bottom: 68,
    }
  }, [])

  // 处理拖拽结束，吸附到边缘
  const handleDragEnd = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const maxX = rect.width - BALL_SIZE - 12
    const maxY = rect.height - BALL_SIZE - 68

    setPos(prev => {
      // 吸附到最近的边缘（左或右）
      const currentRight = 12 - prev.x
      const targetRight = currentRight > rect.width / 2 ? 12 : -maxX + 12
      const newX = 12 - targetRight

      // 限制上下范围
      const currentBottom = 68 - prev.y
      const clampedBottom = Math.max(68, Math.min(currentBottom, maxY + 68))
      const newY = 68 - clampedBottom

      return { x: newX, y: newY }
    })
  }, [])

  const quickActions = [
    {
      icon: Sparkles,
      label: 'AI建议',
      color: 'bg-[#12B7F5]',
      text: '帮你聊天',
      action: () => onNavigate({ type: 'chat', friendName: '同频小Q', friendAvatar: 'Q', convId: 'q' }),
    },
    {
      icon: Shirt,
      label: '换装',
      color: 'bg-purple-500',
      text: '给小Q换装',
      action: () => onNavigate({ type: 'evolution' }),
    },
    {
      icon: Calendar,
      label: '每日任务',
      color: 'bg-orange-500',
      text: `${exp}/100 EXP`,
      action: () => onNavigate({ type: 'evolution' }),
    },
    {
      icon: TrendingUp,
      label: '亲密值',
      color: 'bg-pink-500',
      text: `${intimacy}/10000`,
      action: () => onNavigate({ type: 'relation-health' }),
    },
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none">
      {/* 快捷面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-[80px] right-4 w-[200px] bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-3 pointer-events-auto z-50"
          >
            {/* 头部：小Q信息 + 关闭按钮 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenguinQ size={28} outfit={outfit} mood={mood} animated={false} />
                <div>
                  <div className="text-xs font-bold text-gray-800">同频小Q</div>
                  <div className="text-[10px] text-gray-400">Lv.{level} · 在线</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {quickActions.map((action, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setOpen(false)
                    action.action()
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-left transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-gray-800">{action.label}</div>
                    <div className="text-[10px] text-gray-400 truncate">{action.text}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮球本体 - 使用 framer-motion drag */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={getConstraints()}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false)
          handleDragEnd()
        }}
        style={{
          position: 'absolute',
          right: 12,
          bottom: 68,
          x: pos.x,
          y: pos.y,
        }}
        animate={!isDragging && !open ? { scale: [1, 1.05, 1] } : {}}
        transition={!isDragging && !open ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
        className="pointer-events-auto cursor-grab active:cursor-grabbing z-40"
        onClick={() => {
          if (!isDragging) {
            setOpen(o => !o)
          }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <PenguinQ
            size={BALL_SIZE}
            outfit={outfit}
            mood={open ? 'thinking' : mood}
            floating={!open}
            animated={true}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{ animationDuration: '2.5s', backgroundColor: 'rgba(18,183,245,0.15)' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
