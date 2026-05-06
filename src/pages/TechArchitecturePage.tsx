import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Zap, Database, Cpu, Lock, Eye, CheckCircle2, ChevronRight, Layers, Brain, Globe } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface TechArchitectureProps {
  onBack: () => void
}

interface ArchitectureLayer {
  id: string
  name: string
  icon: typeof Cpu
  color: string
  bgColor: string
  items: { name: string; desc: string }[]
}

const layers: ArchitectureLayer[] = [
  {
    id: 'app',
    name: '应用层',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    items: [
      { name: '聊天助手', desc: '智能回复/润色/话题推荐' },
      { name: '群聊管家', desc: '智能摘要/活跃分析/事件播报' },
      { name: '内容创作', desc: '空间文案/群公告/邀请函生成' },
      { name: '关系维护', desc: '健康度评分/智能提醒/话题推荐' },
      { name: '小Q伴侣', desc: '人格养成/日记记录/表情生成' },
      { name: '社交副本', desc: '组队协作/排行榜竞争/团队任务' },
    ]
  },
  {
    id: 'ability',
    name: '能力层',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    items: [
      { name: '语境理解引擎', desc: '深度嵌入QQ社交语境，多模态理解' },
      { name: '内容生成引擎', desc: '大模型实时生成，风格自适应' },
      { name: '关系管理引擎', desc: '图神经网络+时序分析' },
      { name: '主动感知引擎', desc: '流式计算+规则引擎+强化学习' },
      { name: '情绪计算引擎', desc: '语义分析+表情识别+行为模式' },
      { name: '小Q人格引擎', desc: '性格生成+成长进化+社交互动' },
    ]
  },
  {
    id: 'model',
    name: '模型层',
    icon: Cpu,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    items: [
      { name: '腾讯混元大模型', desc: '社交场景微调，保障数据安全' },
      { name: '多模态模型', desc: 'CLIP+自研图文对齐' },
      { name: '图神经网络', desc: 'GraphSAGE处理十亿级关系' },
      { name: '推荐引擎', desc: '个性化内容与好友推荐' },
      { name: '情绪识别模型', desc: '多维度情绪感知与联动' },
    ]
  },
  {
    id: 'data',
    name: '数据层',
    icon: Database,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    items: [
      { name: '社交图谱', desc: '好友关系链与亲密度数据' },
      { name: '聊天记录', desc: '对话上下文与语义数据' },
      { name: '用户画像', desc: '行为偏好与兴趣标签' },
      { name: '行为数据', desc: '使用习惯与互动模式' },
      { name: '内容库', desc: '文案模板与表情包素材' },
    ]
  },
]

const privacyFeatures = [
  { icon: Lock, title: '端侧处理', desc: '敏感数据本地分析，不上传服务器' },
  { icon: Shield, title: '数据脱敏', desc: '自动识别并脱敏个人敏感信息' },
  { icon: Eye, title: '用户授权', desc: '所有数据使用需用户明确授权' },
  { icon: CheckCircle2, title: '隐私合规', desc: '符合GDPR及国内数据保护法规' },
]

const roadmapPhases = [
  { phase: 'Phase 1', name: 'MVP', time: '2个月', features: ['智能聊天助手', '社交事件基础触发'], status: 'current' },
  { phase: 'Phase 2', name: '场景扩展', time: '+2个月', features: ['群聊管家', '内容创作助手', '小Q人格系统'], status: 'planned' },
  { phase: 'Phase 3', name: '关系深化', time: '+2个月', features: ['关系维护助手', '社交副本系统', '情绪感知'], status: 'planned' },
  { phase: 'Phase 4', name: '生态融合', time: '持续', features: ['QQ空间/频道', '厘米秀/游戏', '开放平台'], status: 'future' },
]

export function TechArchitecture({ onBack }: TechArchitectureProps) {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full bg-[#0a1628]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0d2137] px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-white font-bold text-[16px]">技术架构</span>
        </div>
      </div>

      {/* 概览图 */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a365d] to-[#0d1b2a] rounded-2xl p-4 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-white font-bold text-[14px]">同频小Q · 技术架构</span>
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">v1.0</span>
          </div>

          {/* 架构图 */}
          <div className="space-y-2">
            {layers.map((layer, i) => (
              <motion.button
                key={layer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                className={`w-full p-3 rounded-xl ${layer.bgColor} border border-transparent hover:border-current transition-all flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <layer.icon className={`w-5 h-5 ${layer.color}`} />
                  <span className={`text-[13px] font-bold ${layer.color}`}>{layer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">{layer.items.length}个模块</span>
                  <motion.div
                    animate={{ rotate: selectedLayer === layer.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className={`w-4 h-4 ${layer.color}`} />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 展开详情 */}
          <AnimatePresence>
            {selectedLayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                {layers.find(l => l.id === selectedLayer)?.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 py-2 border-t border-white/10"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${layers.find(l => l.id === selectedLayer)?.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-[12px] text-white font-medium">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 隐私保护 */}
      <div className="px-3 pt-4">
        <p className="text-[11px] text-blue-400 font-medium mb-2 px-1">🔒 隐私保护</p>
        <div className="grid grid-cols-2 gap-2">
          {privacyFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-[#1a365d]/50 rounded-xl p-3 border border-white/5"
            >
              <feature.icon className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-[12px] text-white font-medium">{feature.title}</p>
              <p className="text-[10px] text-gray-400 mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 实现路线图 */}
      <div className="px-3 pt-4 pb-4">
        <p className="text-[11px] text-blue-400 font-medium mb-2 px-1">📅 实现路线图</p>
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500" />
          
          <div className="space-y-3 pl-10">
            {roadmapPhases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="relative"
              >
                {/* 节点 */}
                <div className={`absolute -left-[44px] top-2 w-4 h-4 rounded-full border-2 ${
                  phase.status === 'current' ? 'bg-blue-500 border-blue-400' :
                  phase.status === 'planned' ? 'bg-purple-500 border-purple-400' :
                  'bg-gray-600 border-gray-500'
                }`} />
                
                <div className={`rounded-xl p-3 ${
                  phase.status === 'current' ? 'bg-blue-500/20 border border-blue-500/40' :
                  phase.status === 'planned' ? 'bg-purple-500/20 border border-purple-500/30' :
                  'bg-gray-800/50 border border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold ${
                      phase.status === 'current' ? 'text-blue-400' :
                      phase.status === 'planned' ? 'text-purple-400' :
                      'text-gray-500'
                    }`}>
                      {phase.phase}
                    </span>
                    <span className="text-[10px] text-gray-500">{phase.time}</span>
                  </div>
                  <p className="text-[13px] text-white font-bold mb-1">{phase.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.features.map(f => (
                      <span key={f} className="text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
