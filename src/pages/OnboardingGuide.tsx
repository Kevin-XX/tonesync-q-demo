import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageCircle, Users, Heart, ChevronRight, X } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface OnboardingGuideProps {
  onComplete: () => void
}

const guideSteps = [
  {
    id: 1,
    title: '同频小Q，你的QQ智能社交伙伴',
    desc: '不是冰冷的机器人，而是懂社交、懂语境、懂情绪的AI伙伴',
    highlight: 'PenguinQ',
    color: 'from-[#12B7F5] to-[#7C3AED]'
  },
  {
    id: 2,
    title: '智能聊天助手',
    desc: '长按输入框，AI帮你生成回复建议、文案润色、表情包',
    highlight: 'MessageCircle',
    color: 'from-[#FF6B35] to-[#FF8C5A]'
  },
  {
    id: 3,
    title: '小Q养成系统',
    desc: '通过日常社交积累经验，解锁新外观和能力，让你的小Q独一无二',
    highlight: 'Heart',
    color: 'from-[#EC4899] to-[#F472B6]'
  }
]

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // 完成引导
      setIsExiting(true)
      setTimeout(() => {
        onComplete()
      }, 400)
    }
  }

  const handleSkip = () => {
    setIsExiting(true)
    setTimeout(() => {
      onComplete()
    }, 400)
  }

  const step = guideSteps[currentStep]

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col"
        >
          {/* 跳过按钮 */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors"
            >
              <span>跳过</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 步骤指示器 */}
          <div className="flex justify-center gap-2 mt-8">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-white'
                    : index < currentStep
                    ? 'bg-white/60'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* 内容区 */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                {/* 亮点展示区 */}
                <div className="mb-8">
                  {currentStep === 0 && (
                    <div className="relative">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <PenguinQ size={120} outfit="default" mood="happy" animated={true} />
                      </motion.div>
                      {/* 光晕效果 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#12B7F5]/20 to-[#7C3AED]/20 rounded-full blur-2xl -z-10" />
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="relative">
                      <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}>
                        <MessageCircle className="w-14 h-14 text-white" />
                      </div>
                      {/* 浮动气泡 */}
                      <motion.div
                        animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-2 -right-4 w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-lg"
                      >
                        💬
                      </motion.div>
                      <motion.div
                        animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="absolute -bottom-2 -left-4 w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center text-sm"
                      >
                        ✨
                      </motion.div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="relative">
                      <div className="flex items-end gap-1">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        >
                          <PenguinQ size={80} outfit="star" mood="excited" animated={true} />
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        >
                          <PenguinQ size={60} outfit="cyber" mood="happy" animated={true} />
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        >
                          <PenguinQ size={50} outfit="royal" mood="love" animated={true} />
                        </motion.div>
                      </div>
                      <div className={`absolute -top-4 right-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 文字说明 */}
                <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
                <p className="text-white/70 text-base leading-relaxed max-w-xs">{step.desc}</p>

                {/* 功能标签 */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {currentStep === 0 && (
                    <>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">语境感知</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">情绪联动</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">主动代理</span>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">回复建议</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">文案润色</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">表情包</span>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">等级成长</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">形象解锁</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs">技能树</span>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 底部按钮 */}
          <div className="px-8 pb-12">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r ${step.color} text-white font-bold text-base shadow-lg flex items-center justify-center gap-2`}
            >
              <span>{currentStep === guideSteps.length - 1 ? '开始体验' : '下一步'}</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* 五大创新亮点预览 */}
            {currentStep === 0 && (
              <div className="mt-8 flex justify-center gap-4">
                {[
                  { icon: '🧠', label: '语境感知' },
                  { icon: '🚀', label: '主动代理' },
                  { icon: '🎯', label: '事件触发' },
                  { icon: '🐧', label: '人格养成' },
                  { icon: '💕', label: '情绪联动' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-white/50 text-[10px]">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
