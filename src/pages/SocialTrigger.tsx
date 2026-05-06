import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Share2, PartyPopper, CheckCircle, X, ArrowLeft, Heart, Sparkles } from 'lucide-react'

interface Action {
  id: number
  icon: any
  title: string
  desc: string
  color: string
  preview: string
}

const actions: Action[] = [
  { id: 1, icon: MessageCircle, title: '给 @小芳 发送生日分享', desc: '"今天生日，第一个想分享的人是你~ 🎂"', color: 'from-qqBlue-500 to-qqBlue-600', preview: '私聊消息预览' },
  { id: 2, icon: Share2, title: '分享到QQ空间', desc: '生成动态：配图+文案+@相关好友', color: 'from-accent-purple to-purple-600', preview: '空间动态预览' },
  { id: 3, icon: PartyPopper, title: '在群里发起庆祝', desc: '"今天本人生日，求祝福求红包！🎉"', color: 'from-accent-pink to-pink-600', preview: '群聊消息预览' },
]

export function SocialTrigger() {
  const [showTrigger, setShowTrigger] = useState(false)
  const [selectedAction, setSelectedAction] = useState<number | null>(null)
  const [sent, setSent] = useState(false)
  const [step, setStep] = useState<'trigger' | 'actions' | 'confirm' | 'success'>('trigger')

  const handleTrigger = () => {
    setStep('actions')
    setShowTrigger(true)
  }

  const handleConfirm = () => {
    setStep('confirm')
    setTimeout(() => {
      setStep('success')
      setSent(true)
    }, 800)
  }

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 页面标题 */}
      <div className="glass px-4 py-3 flex items-center gap-3">
        <button className="p-1 rounded-full hover:bg-slate-800/50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="font-bold text-sm block leading-tight">社交事件触发器</span>
          <span className="text-[10px] text-slate-400">AI自动感知社交事件</span>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 触发器按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTrigger}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-accent-pink via-accent-orange to-qqBlue-500 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)] animate-glow mb-8 relative group"
        >
          <div className="absolute inset-0 rounded-full bg-black/10 group-hover:bg-black/0 transition-colors" />
          <span className="text-6xl relative z-10 drop-shadow-lg">🎂</span>
        </motion.button>

        <h2 className="text-2xl font-bold mb-3 text-center gradient-text">今天是我的生日！</h2>
        <p className="text-slate-400 text-center text-sm mb-2">小Q检测到特殊日期事件</p>
        <p className="text-xs text-slate-500 text-center">点击触发，查看AI生成的个性化互动建议</p>

        {/* 事件时间线展示 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 w-full max-w-xs space-y-3"
        >
          <div className="glass-card p-3 rounded-xl flex items-center gap-3 border-l-2 border-accent-pink">
            <Heart className="w-4 h-4 text-accent-pink flex-shrink-0" />
            <div>
              <p className="text-xs font-medium">情感值检测</p>
              <p className="text-[10px] text-slate-500">检测到用户期待社交互动</p>
            </div>
          </div>
          <div className="glass-card p-3 rounded-xl flex items-center gap-3 border-l-2 border-qqBlue-500">
            <Sparkles className="w-4 h-4 text-qqBlue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium">AI事件分析</p>
              <p className="text-[10px] text-slate-500">基于关系图谱生成互动方案</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 模态弹窗 */}
      <AnimatePresence>
        {showTrigger && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md z-30"
              onClick={() => setShowTrigger(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', bounce: 0.35 }}
              className="absolute bottom-20 left-4 right-4 z-40 glass-card rounded-3xl overflow-hidden"
            >
              {/* 顶部小Q动画区 */}
              <div className="p-6 bg-gradient-to-r from-accent-pink/10 via-accent-purple/10 to-qqBlue-500/10 border-b border-slate-700/30 text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-qqBlue-400 to-accent-purple flex items-center justify-center shadow-xl animate-float-slow"
                >
                  <span className="text-4xl">🤖</span>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-bold mb-2 gradient-text"
                >
                  主人，生日快乐！🎂
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-slate-300"
                >
                  要不要给 @小芳 发个消息？<br />她是你最近互动最多的好友哦~
                </motion.p>
              </div>

              {/* 操作选项 */}
              {step === 'actions' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-qqBlue-400" />
                    <span className="font-bold text-sm">同频小Q 建议方案</span>
                  </div>

                  <div className="space-y-3">
                    {actions.map((action) => {
                      const Icon = action.icon
                      const isSelected = selectedAction === action.id
                      return (
                        <motion.button
                          key={action.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAction(action.id)}
                          className={`w-full text-left p-4 rounded-2xl transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r ' + action.color + ' text-white shadow-lg'
                              : 'glass-card hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl ${
                              isSelected ? 'bg-white/20' : 'bg-gradient-to-br ' + action.color
                            } flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm mb-1">{action.title}</p>
                              <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{action.desc}</p>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedAction}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                        selectedAction
                          ? 'bg-gradient-to-r from-qqBlue-500 to-accent-purple shadow-lg shadow-qqBlue-500/20'
                          : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      确认发送
                    </button>
                    <button
                      onClick={() => setShowTrigger(false)}
                      className="px-4 py-3 rounded-xl glass-card hover:bg-slate-800/50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 发送成功状态 */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-accent-green" />
                  </motion.div>
                  <h4 className="font-bold text-lg mb-2">发送成功！</h4>
                  <p className="text-sm text-slate-400 mb-4">小Q已帮你发送生日祝福，等待回复中...</p>
                  <button
                    onClick={() => { setShowTrigger(false); setSent(false); setStep('actions'); setSelectedAction(null); }}
                    className="py-2 px-6 rounded-xl bg-slate-800/50 text-sm hover:bg-slate-800/80 transition-colors"
                  >
                    关闭
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
