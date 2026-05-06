import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Trophy, Sparkles, Crown, Zap, Shield, Book, Music, Gamepad2, Camera, ArrowLeft } from 'lucide-react'

type TabType = 'skills' | 'unlocked' | 'locked' | 'achievements'

interface SkillType {
  name: string
  value: number
  icon: any
  color: string
  desc: string
}

export function QEvolution() {
  const [activeTab, setActiveTab] = useState<TabType>('skills')

  const skills: SkillType[] = [
    { name: '文案力', value: 80, icon: Book, color: 'from-qqBlue-500 to-qqBlue-400', desc: '生成高质量文案的能力' },
    { name: '群管力', value: 60, icon: Shield, color: 'from-accent-purple to-purple-400', desc: '管理群聊与提取摘要的能力' },
    { name: '娱乐力', value: 90, icon: Gamepad2, color: 'from-accent-pink to-pink-400', desc: '活跃气氛与制造话题的能力' },
    { name: '情感力', value: 70, icon: Heart, color: 'from-accent-orange to-orange-400', desc: '感知情绪与社交关怀的能力' },
    { name: '社交力', value: 85, icon: Star, color: 'from-accent-green to-green-400', desc: '维护关系与破冰的能力' },
  ]

  const unlocked = [
    { name: '古风皮肤', icon: Camera, color: 'from-qqBlue-500 to-qqBlue-600' },
    { name: '御姐语音', icon: Music, color: 'from-accent-purple to-purple-600' },
    { name: '诗词技能', icon: Book, color: 'from-accent-pink to-pink-600' },
    { name: '社交达人', icon: Star, color: 'from-accent-green to-green-600' },
  ]

  const locked = [
    { name: '赛博皮肤', level: 'Lv.15', icon: Camera, color: 'from-slate-700 to-slate-600' },
    { name: '萝莉语音', level: 'Lv.18', icon: Music, color: 'from-slate-700 to-slate-600' },
    { name: 'Rap技能', level: 'Lv.20', icon: Gamepad2, color: 'from-slate-700 to-slate-600' },
    { name: '派对之王', level: 'Lv.25', icon: Crown, color: 'from-slate-700 to-slate-600' },
  ]

  const achievements = [
    { name: '破冰先锋', desc: '成功完成10次社交破冰', icon: Zap, earned: true },
    { name: '群聊之星', desc: '总结群聊50次', icon: Star, earned: true },
    { name: '创意大师', desc: '生成100条创意文案', icon: Sparkles, earned: true },
    { name: '社交达人', desc: '维护30段重要关系', icon: Heart, earned: false },
    { name: '关系修复师', desc: '修复10段冷淡关系', icon: Shield, earned: false },
  ]

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 顶部导航 */}
      <div className="glass px-4 py-3 flex items-center gap-3">
        <button className="p-1 rounded-full hover:bg-slate-800/50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="font-bold text-sm block leading-tight">同频小Q养成</span>
          <span className="text-[10px] text-slate-400">陪伴成长，见证进化</span>
        </div>
      </div>

      {/* 头部形象展示 */}
      <div className="glass p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-qqBlue-500/10 to-accent-purple/10" />
        <div className="relative z-10">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-qqBlue-400 to-accent-purple flex items-center justify-center shadow-xl shadow-qqBlue-500/20 animate-glow"
          >
            <span className="text-5xl">🤖</span>
          </motion.div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold gradient-text">同频小Q</h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-qqBlue-500/20 border border-qqBlue-500/30">
              <Crown className="w-3 h-3 text-qqBlue-400" />
              <span className="text-xs text-qqBlue-400 font-bold">Lv.12</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">温柔型 · "让我来帮你~"</p>
          
          {/* 经验条 */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
              <span>经验值</span>
              <span>2450 / 3000</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-qqBlue-500 via-accent-purple to-accent-pink rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex border-b border-slate-700/30 px-4 glass">
        {[
          { id: 'skills' as TabType, label: '能力值' },
          { id: 'unlocked' as TabType, label: '已解锁' },
          { id: 'locked' as TabType, label: '待解锁' },
          { id: 'achievements' as TabType, label: '成就' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-qqBlue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="qTab"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-qqBlue-400 rounded-full"
                transition={{ type: 'spring', bounce: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {skills.map((skill, i) => {
                const Icon = skill.icon
                return (
                  <motion.div 
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{skill.name}</span>
                          <span className="text-sm text-qqBlue-400 font-bold">{skill.value}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{skill.desc}</p>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'unlocked' && (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {unlocked.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-card rounded-2xl p-5 text-center cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-sm mb-1">{item.name}</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-accent-green font-medium">
                      <Trophy className="w-3 h-3" />
                      <span>已解锁</span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'locked' && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4"
            >
              {locked.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl p-5 text-center opacity-40"
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-bold text-sm mb-1">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.level} 解锁</p>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {achievements.map((achievement, i) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card rounded-xl p-4 flex items-center gap-3 transition-all ${
                      !achievement.earned ? 'opacity-40' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-qqBlue-500 to-accent-purple'
                        : 'bg-slate-700'
                    } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{achievement.name}</p>
                      <p className="text-xs text-slate-400">{achievement.desc}</p>
                    </div>
                    {achievement.earned && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1 + 0.3, type: 'spring' }}
                        className="text-accent-green"
                      >
                        <Trophy className="w-5 h-5" />
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
