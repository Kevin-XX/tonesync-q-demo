// 创新亮点展示页 - Innovation Highlights
import { motion } from 'framer-motion'
import { ArrowLeft, Brain, Rocket, Target, Sparkles, Heart } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface InnovationHighlightsProps {
  onBack: () => void
}

const innovations = [
  {
    id: 1,
    title: '语境感知型AI',
    icon: Brain,
    color: 'from-[#12B7F5] to-[#0EA5E9]',
    desc: '深度嵌入QQ社交语境，识别用户身份、关系、场景、情绪',
    features: ['身份感知', '关系感知', '场景感知', '情绪感知'],
    demo: '对方说"周末有空吗" → 识别为「邀约场景」→ 生成适合的回复风格'
  },
  {
    id: 2,
    title: '主动式社交代理',
    icon: Rocket,
    color: 'from-[#7C3AED] to-[#A855F7]',
    desc: '不是被动等待指令，而是主动感知、主动建议、主动执行',
    features: ['事件感知', '时机判断', '智能建议', '一键执行'],
    demo: '检测到好友生日 → 主动推送祝福建议 → 一键发送个性化消息'
  },
  {
    id: 3,
    title: '社交事件触发器',
    icon: Target,
    color: 'from-[#FF6B35] to-[#F97316]',
    desc: '首次将「社交事件」作为互动触发器，自动转化为个性化互动',
    features: ['生日提醒', '情绪联动', '沉默预警', '共同兴趣'],
    demo: '关系冷淡预警 → 推荐破冰话题 → 提升关系维护效率'
  },
  {
    id: 4,
    title: '小Q人格化',
    icon: Sparkles,
    color: 'from-[#EC4899] to-[#F472B6]',
    desc: '可养成、可互动、可展示的虚拟伙伴，让AI更有温度',
    features: ['性格养成', '技能成长', '形象解锁', '日记记录'],
    demo: '通过日常互动 → 小Q性格进化 → 成为独一无二的AI伙伴'
  },
  {
    id: 5,
    title: '情绪感知联动',
    icon: Heart,
    color: 'from-[#EF4444] to-[#F87171]',
    desc: '情绪低落→小Q关怀→好友通知的联动链条，让社交更有温度',
    features: ['情绪识别', '主动关怀', '好友联动', '氛围调节'],
    demo: '检测情绪低落 → 小Q发送安慰 → 好友收到陪伴邀请'
  }
]

export function InnovationHighlights({ onBack }: InnovationHighlightsProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* 顶部导航 */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">五大核心创新</h1>
          <p className="text-white/60 text-xs">同频小Q的差异化竞争力</p>
        </div>
      </div>

      {/* 创新亮点列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 space-y-4">
        {innovations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10"
          >
            {/* 头部 */}
            <div className={`px-4 py-4 bg-gradient-to-r ${item.color}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">{item.title}</h3>
                  <p className="text-white/80 text-xs mt-0.5">{item.desc}</p>
                </div>
                <div className="text-white/30 text-2xl font-bold">0{item.id}</div>
              </div>
            </div>

            {/* 功能标签 */}
            <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-white/5">
              {item.features.map((f, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/10 rounded-full text-white/70 text-xs">
                  {f}
                </span>
              ))}
            </div>

            {/* Demo演示 */}
            <div className="px-4 py-4">
              <div className="text-white/40 text-[10px] mb-2">工作流程</div>
              <div className="flex items-center gap-2 flex-wrap">
                {item.demo.split(' → ').map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="px-3 py-2 bg-white/5 rounded-lg">
                      <span className="text-white/90 text-xs">{step}</span>
                    </div>
                    {i < item.demo.split(' → ').length - 1 && (
                      <span className="text-white/30">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 总结 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#12B7F5]/20 to-[#7C3AED]/20 backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-center"
        >
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-white font-bold text-base mb-2">五重创新，领先行业</h3>
          <p className="text-white/60 text-sm">
            同频小Q 不是又一个 AI 聊天机器人，而是 QQ 社交生态的 AI 原生进化
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <PenguinQ size={40} outfit="star" mood="excited" animated={true} />
            <PenguinQ size={40} outfit="cyber" mood="happy" animated={true} />
            <PenguinQ size={40} outfit="royal" mood="love" animated={true} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
