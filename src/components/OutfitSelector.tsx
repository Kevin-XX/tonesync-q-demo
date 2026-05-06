import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { PenguinQ, PenguinOutfit, outfitNames } from './PenguinQ'

interface OutfitSelectorProps {
  currentOutfit: PenguinOutfit
  onSelect: (outfit: PenguinOutfit) => void
  onClose: () => void
}

const allOutfits: PenguinOutfit[] = ['default', 'cyber', 'festival', 'star', 'winter', 'sport', 'ocean', 'panda', 'royal', 'libai', 'change', 'wukong', 'dianwei', 'daji', 'xiaoqiao', 'yao']

const outfitDescriptions: Record<PenguinOutfit, string> = {
  default: '经典QQ造型，红围巾是标配',
  cyber: '霓虹灯光，赛博朋克风格',
  festival: '节日庆典，金色节日帽',
  star: '皇家星际，闪耀皇冠加身',
  winter: '冰雪冬季，戴着毛线帽',
  sport: '运动健将，头带奖牌加身',
  ocean: '沙滩夏日，太阳镜草帽',
  panda: '国宝熊猫，稀有黑白配色',
  royal: '皇室贵族，紫色权杖在手',
  libai: '李白·谪仙，诗仙风范，剑气如虹',
  change: '嫦娥·月神，仙气飘飘，月光流辉',
  wukong: '孙悟空·齐天，金箍棒在手，火眼金睛',
  dianwei: '典韦·虎痴，霸气侧漏，虎背熊腰',
  daji: '妲己·九尾，妖娆魅惑，仙狐降世',
  xiaoqiao: '小乔·千纸鹤，温婉如水，才情兼备',
  yao: '瑶·仙鹿，可爱灵动，仙气环绕',
}

const outfitColors: Record<PenguinOutfit, string> = {
  default: 'from-red-500 to-red-600',
  cyber: 'from-purple-500 to-pink-500',
  festival: 'from-yellow-400 to-orange-500',
  star: 'from-yellow-300 to-yellow-500',
  winter: 'from-blue-300 to-cyan-400',
  sport: 'from-orange-500 to-red-500',
  ocean: 'from-cyan-400 to-blue-500',
  panda: 'from-gray-100 to-gray-300',
  royal: 'from-purple-400 to-purple-600',
  libai: 'from-blue-400 to-cyan-500',
  change: 'from-pink-300 to-purple-400',
  wukong: 'from-yellow-500 to-orange-500',
  dianwei: 'from-red-600 to-red-800',
  daji: 'from-pink-400 to-purple-500',
  xiaoqiao: 'from-pink-200 to-rose-300',
  yao: 'from-green-300 to-teal-400',
}

export function OutfitSelector({ currentOutfit, onSelect, onClose }: OutfitSelectorProps) {
  const [previewOutfit, setPreviewOutfit] = useState<PenguinOutfit>(currentOutfit)
  const [selectedIndex, setSelectedIndex] = useState(allOutfits.indexOf(currentOutfit))

  const handlePrev = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : allOutfits.length - 1
    setSelectedIndex(newIndex)
    setPreviewOutfit(allOutfits[newIndex])
  }

  const handleNext = () => {
    const newIndex = selectedIndex < allOutfits.length - 1 ? selectedIndex + 1 : 0
    setSelectedIndex(newIndex)
    setPreviewOutfit(allOutfits[newIndex])
  }

  const handleSelect = () => {
    onSelect(previewOutfit)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
      >
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-[#12B7F5] to-[#0075B2] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-bold">小Q换装间</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 大预览 */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-8 flex flex-col items-center">
          <div className="relative">
            <PenguinQ
              size={140}
              outfit={previewOutfit}
              mood="excited"
              animated={true}
              floating={true}
            />
          </div>
          <motion.div
            key={previewOutfit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${outfitColors[previewOutfit]} text-white text-sm font-medium mb-1`}>
              {outfitNames[previewOutfit]}
            </div>
            <p className="text-[12px] text-gray-500 max-w-[200px]">{outfitDescriptions[previewOutfit]}</p>
          </motion.div>
        </div>

        {/* 左右切换箭头 */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 装扮列表 */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {allOutfits.map((outfit, index) => (
              <motion.button
                key={outfit}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedIndex(index)
                  setPreviewOutfit(outfit)
                }}
                className={`flex-shrink-0 rounded-xl p-2 transition-all ${
                  previewOutfit === outfit
                    ? 'bg-[#12B7F5] shadow-lg ring-2 ring-[#12B7F5]/30'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${outfitColors[outfit]} flex items-center justify-center`}>
                  <PenguinQ
                    size={40}
                    outfit={outfit}
                    mood="happy"
                    animated={false}
                  />
                </div>
                <span className={`text-[10px] mt-1 block ${
                  previewOutfit === outfit ? 'text-white' : 'text-gray-600'
                }`}>
                  {outfitNames[outfit]}
                </span>
              </motion.button>
            ))}
          </div>

          {/* 确认按钮 */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSelect}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-white transition-all ${
              previewOutfit === currentOutfit
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#12B7F5] to-[#0075B2] shadow-lg'
            }`}
            disabled={previewOutfit === currentOutfit}
          >
            {previewOutfit === currentOutfit ? '当前装扮' : `换装「${outfitNames[previewOutfit]}」`}
          </motion.button>
        </div>

        {/* 装饰指示器 */}
        <div className="flex justify-center gap-1 pb-3">
          {allOutfits.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                selectedIndex === index ? 'w-4 bg-[#12B7F5]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
