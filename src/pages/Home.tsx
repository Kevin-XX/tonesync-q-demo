import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home as HomeIcon, MessageCircle, Users, Sparkles, Heart } from 'lucide-react'

type Page = 'home' | 'chat' | 'group' | 'social' | 'evolution'

interface FeatureCardProps {
  icon: any
  title: string
  desc: string
  gradient: string
  delay: number
  onClick: () => void
}

function FeatureCard({ icon: Icon, title, desc, gradient, delay, onClick }: FeatureCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-5 text-left w-full group cursor-pointer relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.button>
  )
}

export function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <motion.div 
      className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="mb-8 text-center"
        >
          <div className="relative w-28 h-28 mx-auto mb-6">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-qqBlue-400 to-accent-purple rounded-3xl animate-glow"
            />
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🤖</div>
          </div>
          <h1 className="text-4xl font-extrabold mb-2 gradient-text">同频小Q</h1>
          <p className="text-lg text-slate-400">ToneSync Q · 你的QQ智能社交伙伴</p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="text-center text-slate-300 mb-10 max-w-xs leading-relaxed"
        >
          以 AI 为翼，让 QQ 社交更有温度、更具想象力
        </motion.p>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          <FeatureCard 
            icon={MessageCircle} 
            title="智能聊天助手" 
            desc="智能回复、文案润色、话题推荐"
            gradient="from-qqBlue-500 to-qqBlue-600"
            delay={0.5}
            onClick={() => onNavigate('chat')}
          />
          <FeatureCard 
            icon={Users} 
            title="群聊管家" 
            desc="智能摘要、关键信息提取"
            gradient="from-accent-purple to-purple-600"
            delay={0.6}
            onClick={() => onNavigate('group')}
          />
          <FeatureCard 
            icon={Sparkles} 
            title="社交事件触发" 
            desc="生日提醒、个性化消息生成"
            gradient="from-accent-pink to-pink-600"
            delay={0.7}
            onClick={() => onNavigate('social')}
          />
          <FeatureCard 
            icon={Heart} 
            title="小Q养成系统" 
            desc="人格养成、能力成长、形象定制"
            gradient="from-accent-orange to-orange-600"
            delay={0.8}
            onClick={() => onNavigate('evolution')}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-slate-600 font-medium">腾讯PCG校园AI产品创意大赛 · 决赛路演Demo</p>
          <p className="text-[10px] text-slate-700 mt-1">Version v3.0.0</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
