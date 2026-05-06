import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Wand2, Sparkles, Image, Send, Heart, Edit3, Copy, Check, FileText, Megaphone, Gift } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface ContentCreatorProps {
  onBack: () => void
}

type CreatorMode = 'moment' | 'announcement' | 'invitation' | 'nickname'

const momentStyles = [
  { id: 'funny', name: '幽默风趣', emoji: '😎', desc: '轻松搞笑，吸引眼球' },
  { id: 'literary', name: '文艺清新', emoji: '📖', desc: '诗意盎然，文艺气息' },
  { id: 'healing', name: '治愈温暖', emoji: '🌸', desc: '温暖人心，情感共鸣' },
  { id: 'qstyle', name: '小Q梗', emoji: '🤖', desc: '加入小Q的有趣梗' },
]

const mockGeneratedContent = {
  moment: {
    funny: '今天又被生活薅了一把羊毛，头发又少了几根...没事，至少我还有小Q！🤖 #今日份沙雕#',
    literary: '午后的阳光洒在窗台，一杯咖啡，一本书，一个慵懒的下午。☕📚 #慢生活#',
    healing: '今天的不开心就止于此吧，明天依旧要闪闪发光哦~ ✨🌟 #治愈系#',
    qstyle: '小Q说：主人今天发朋友圈的运气值+100！我信了，毕竟它从不骗我...大概吧 🤖 #小Q语录#',
  },
  announcement: {
    basic: '📢 【重要通知】\n\n各位小伙伴，本群即日起启用新群规，请大家仔细阅读置顶公告，共同维护良好的群聊氛围~\n\n—— 群管理团队',
    friendly: '🎉 群规更新通知\n\n亲们，群里有了新规定哦~虽然有点长，但都是为了让大家聊得更开心！有问题随时 @群主~',
    formal: '【群规更新公告】\n\n尊敬各位群友：\n经管理组讨论，现将新版群规公布如下，请各位知悉并遵守。详情请查看置顶消息。\n\n—— 管理员',
  },
  invitation: {
    party: '🎮 【组队邀请】\n\n今晚8点，王者开黑缺人！段位不限，能语音的来~ 来了就是兄弟，带你躺赢！\n\n报名回复：1',
    study: '📚 【学习搭子招募】\n\n有没有想一起打卡学习的？我建了个番茄钟群，互相监督共同进步！\n\n要求：每天至少学习2小时，能坚持的来~',
    movie: '🎬 【观影搭子】\n\n周末想看《沙丘2》，找个口味相似的小姐姐/小哥哥一起~\n\n地点：万达影城\n时间：周六下午3点\n感兴趣+V：xxxxx',
  },
}

export function ContentCreator({ onBack }: ContentCreatorProps) {
  const [mode, setMode] = useState<CreatorMode>('moment')
  const [selectedStyle, setSelectedStyle] = useState('funny')
  const [inputText, setInputText] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [thinkingStage, setThinkingStage] = useState(0)

  const modes: { id: CreatorMode; label: string; icon: typeof Sparkles; desc: string }[] = [
    { id: 'moment', label: '空间文案', icon: Image, desc: '配图文案生成' },
    { id: 'announcement', label: '群公告', icon: Megaphone, desc: '公告优化润色' },
    { id: 'invitation', label: '邀请函', icon: Gift, desc: '活动邀请生成' },
    { id: 'nickname', label: '昵称签名', icon: Edit3, desc: '个性昵称生成' },
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    setThinkingStage(0)
    
    // 模拟AI思考过程
    const stages = [
      '正在分析你的需求...',
      '正在理解内容风格...',
      '正在生成个性化内容...',
      '正在优化表达...',
    ]
    
    let stage = 0
    const interval = setInterval(() => {
      if (stage < stages.length - 1) {
        stage++
        setThinkingStage(stage)
      } else {
        clearInterval(interval)
        // 生成完成
        if (mode === 'moment') {
          setGeneratedContent(mockGeneratedContent.moment[selectedStyle as keyof typeof mockGeneratedContent.moment])
        } else if (mode === 'announcement') {
          const annKey = (inputText || 'basic') as keyof typeof mockGeneratedContent.announcement
          setGeneratedContent(mockGeneratedContent.announcement[annKey])
        } else if (mode === 'invitation') {
          const invKey = (inputText || 'party') as keyof typeof mockGeneratedContent.invitation
          setGeneratedContent(mockGeneratedContent.invitation[invKey])
        }
        setIsGenerating(false)
      }
    }, 800)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-[#9b59b6] to-[#e74c8c] px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Wand2 className="w-4 h-4 text-yellow-300" />
          <span className="text-white font-bold text-[16px]">内容创作助手</span>
        </div>
      </div>

      {/* 模式切换 */}
      <div className="px-3 pt-3">
        <div className="grid grid-cols-4 gap-2">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setGeneratedContent(''); setInputText('') }}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                mode === m.id
                  ? 'bg-white shadow-md border-2 border-[#e74c8c]'
                  : 'bg-white/50 border-2 border-transparent'
              }`}
            >
              <m.icon className={`w-5 h-5 ${mode === m.id ? 'text-[#e74c8c]' : 'text-gray-400'}`} />
              <span className={`text-[11px] font-medium ${mode === m.id ? 'text-gray-900' : 'text-gray-500'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-4 pb-4 space-y-4">
        {/* 小Q引导 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <PenguinQ size={40} outfit="star" mood="excited" animated={false} />
            <div className="flex-1">
              <p className="text-[12px] text-gray-900 font-medium mb-1">
                {mode === 'moment' && '📸 告诉我你想发什么，小Q帮你生成配图文案！'}
                {mode === 'announcement' && '📢 输入你想公告的内容，小Q帮你优化！'}
                {mode === 'invitation' && '🎉 告诉我活动类型，小Q帮你生成邀请函！'}
                {mode === 'nickname' && '✨ 告诉小Q你的风格偏好，生成专属昵称！'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 风格选择 - 仅空间文案 */}
        {mode === 'moment' && (
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">选择文案风格</p>
            <div className="grid grid-cols-2 gap-2">
              {momentStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedStyle === style.id
                      ? 'bg-[#e74c8c]/10 border-2 border-[#e74c8c]'
                      : 'bg-white border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{style.emoji}</span>
                    <span className="text-[12px] font-bold text-gray-900">{style.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 输入区 */}
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">
            {mode === 'moment' && '补充说明（可选）'}
            {mode === 'announcement' && '输入公告内容'}
            {mode === 'invitation' && '活动类型'}
            {mode === 'nickname' && '你的特点描述'}
          </p>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              mode === 'moment' ? '比如：今天吃了一家超好吃的火锅...' :
              mode === 'announcement' ? '输入你想公告的原始内容...' :
              mode === 'invitation' ? 'party/study/movie...' :
              '比如：喜欢二次元、有点文艺...'
            }
            className="w-full p-4 rounded-2xl bg-white border border-gray-200 text-[13px] text-gray-700 resize-none focus:outline-none focus:border-[#e74c8c]"
            rows={3}
          />
        </div>

        {/* 生成按钮 */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 ${
            isGenerating
              ? 'bg-gray-200 text-gray-500'
              : 'bg-gradient-to-r from-[#9b59b6] to-[#e74c8c] text-white shadow-lg'
          }`}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              {['分析中...', '理解中...', '生成中...', '优化中...'][thinkingStage]}
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              ✨ 一键生成
            </>
          )}
        </motion.button>

        {/* AI思考过程可视化 */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl p-4 overflow-hidden"
            >
              <p className="text-[11px] text-gray-400 mb-3">🤖 AI思考过程</p>
              <div className="space-y-2">
                {[
                  { text: '分析用户需求', done: thinkingStage >= 0 },
                  { text: '理解内容风格', done: thinkingStage >= 1 },
                  { text: '生成个性化内容', done: thinkingStage >= 2 },
                  { text: '优化表达方式', done: thinkingStage >= 3 },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <motion.div
                      animate={step.done ? { scale: [1, 1.2, 1] } : {}}
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        step.done ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {step.done ? <Check className="w-3 h-3" /> : <span className="text-[9px]">{i + 1}</span>}
                    </motion.div>
                    <span className={`text-[12px] ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.text}
                    </span>
                    {step.done && thinkingStage === i && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-[#12B7F5] text-[10px]"
                      >
                        处理中...
                      </motion.span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 生成结果 */}
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#12B7F5] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-[12px] font-medium text-gray-700">小Q生成结果</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-[11px] text-gray-600"
              >
                {copied ? (
                  <><Check className="w-3 h-3 text-green-500" /> 已复制</>
                ) : (
                  <><Copy className="w-3 h-3" /> 复制</>
                )}
              </motion.button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[13px] text-gray-800 whitespace-pre-line leading-relaxed">
                {generatedContent}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2.5 rounded-xl bg-[#12B7F5]/10 text-[#12B7F5] text-[12px] font-medium flex items-center justify-center gap-1">
                <Edit3 className="w-3 h-3" /> 编辑
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[#e74c8c] text-white text-[12px] font-bold flex items-center justify-center gap-1">
                <Send className="w-3 h-3" /> 发送
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
