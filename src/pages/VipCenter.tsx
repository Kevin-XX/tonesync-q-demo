import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Crown, Sparkles, Check, Gift, Star, Zap, Shield, Heart, Palette } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface VipCenterProps {
  onBack: () => void
}

const vipBenefits = [
  { icon: Zap, title: '极速响应', desc: 'AI响应速度提升3倍', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { icon: Palette, title: '专属形象', desc: '解锁SSR限定装扮', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Star, title: '更多风格', desc: '解锁20+种文案风格', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Shield, title: '隐私保护', desc: '高级隐私模式', color: 'text-green-500', bg: 'bg-green-50' },
  { icon: Heart, title: '专属关怀', desc: '小Q性格深度定制', color: 'text-pink-500', bg: 'bg-pink-50' },
  { icon: Crown, title: '尊贵标识', desc: '会员专属头像框', color: 'text-orange-500', bg: 'bg-orange-50' },
]

const storeItems = [
  { id: 'skin1', name: '赛博朋克', type: '装扮', price: 60, originalPrice: 80, emoji: '🤖', rarity: 'R', tag: '热卖' },
  { id: 'skin2', name: '皇家贵族', type: '装扮', price: 120, originalPrice: 160, emoji: '👑', rarity: 'SSR', tag: '限定' },
  { id: 'skin3', name: '小Q表情包', type: '表情', price: 30, originalPrice: 0, emoji: '😎', rarity: 'N', tag: '新品' },
  { id: 'skin4', name: '御姐语音', type: '语音', price: 80, originalPrice: 100, emoji: '🎤', rarity: 'SR', tag: '' },
  { id: 'skin5', name: '古风套装', type: '装扮', price: 100, originalPrice: 120, emoji: '🏮', rarity: 'SR', tag: '折扣' },
  { id: 'skin6', name: 'rap技能', type: '技能', price: 150, originalPrice: 200, emoji: '🎤', rarity: 'SSR', tag: '稀有' },
]

const membershipPlans = [
  { id: 'monthly', name: '月卡', price: 18, period: '30天', features: ['极速响应', '5套装扮', '20种风格'], recommended: false },
  { id: 'quarterly', name: '季卡', price: 45, period: '90天', features: ['极速响应', '10套装扮', '全部风格', '8折优惠'], recommended: true },
  { id: 'yearly', name: '年卡', price: 128, period: '365天', features: ['全部权益', '专属顾问', '限定活动'], recommended: false },
]

const rarityColors: Record<string, { border: string; text: string; bg: string }> = {
  N: { border: 'border-gray-200', text: 'text-gray-500', bg: 'bg-gray-100' },
  R: { border: 'border-blue-200', text: 'text-blue-500', bg: 'bg-blue-50' },
  SR: { border: 'border-purple-200', text: 'text-purple-500', bg: 'bg-purple-50' },
  SSR: { border: 'border-yellow-200', text: 'text-yellow-600', bg: 'bg-yellow-50' },
}

export function VipCenter({ onBack }: VipCenterProps) {
  const [activeTab, setActiveTab] = useState<'member' | 'store'>('member')
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set(['skin3']))

  const handlePurchase = (itemId: string) => {
    if (ownedItems.has(itemId)) return
    setOwnedItems(prev => new Set([...prev, itemId]))
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#333] px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-bold text-[16px]">会员中心</span>
        </div>
      </div>

      {/* 小Q引导 */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <PenguinQ size={56} outfit="royal" mood="excited" animated={false} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-gray-900 mb-1">升级会员，解锁小Q全部能力！</p>
              <p className="text-[11px] text-gray-500">更多风格、更快响应、专属装扮</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab切换 */}
      <div className="px-3 pt-3 flex gap-2">
        {[
          { id: 'member' as const, label: '开通会员', icon: Crown },
          { id: 'store' as const, label: '道具商城', icon: Gift },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                : 'bg-white text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-4 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'member' && (
            <motion.div
              key="member"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* 会员权益 */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">✨ 会员专属权益</p>
                <div className="grid grid-cols-3 gap-2">
                  {vipBenefits.map((benefit, i) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`${benefit.bg} rounded-xl p-3 text-center`}
                    >
                      <benefit.icon className={`w-5 h-5 ${benefit.color} mx-auto mb-1.5`} />
                      <p className="text-[11px] font-bold text-gray-800">{benefit.title}</p>
                      <p className="text-[9px] text-gray-500">{benefit.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 套餐选择 */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium mb-2 px-1">💎 选择套餐</p>
                <div className="space-y-2">
                  {membershipPlans.map(plan => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                        plan.recommended
                          ? 'border-yellow-400 shadow-lg shadow-yellow-100'
                          : 'border-gray-100'
                      }`}
                    >
                      {plan.recommended && (
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          <span className="text-[10px] text-yellow-600 font-medium">推荐</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-gray-900">{plan.name}</span>
                          <span className="text-[10px] text-gray-400">{plan.period}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[18px] font-bold text-orange-500">¥{plan.price}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {plan.features.map(f => (
                          <span key={f} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5 text-green-500" /> {f}
                          </span>
                        ))}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2.5 rounded-xl font-bold text-[13px] ${
                          plan.recommended
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        立即开通
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                {storeItems.map((item, i) => {
                  const rarity = rarityColors[item.rarity]
                  const isOwned = ownedItems.has(item.id)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white rounded-2xl p-3 border ${rarity.border} relative`}
                    >
                      {/* 标签 */}
                      {item.tag && (
                        <div className={`absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                          item.tag === '限定' ? 'bg-purple-100 text-purple-600' :
                          item.tag === '热卖' ? 'bg-red-100 text-red-600' :
                          item.tag === '折扣' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {item.tag}
                        </div>
                      )}
                      
                      {/* 商品 */}
                      <div className="flex flex-col items-center pt-2">
                        <span className="text-4xl mb-2">{item.emoji}</span>
                        <p className="text-[12px] font-bold text-gray-900">{item.name}</p>
                        <p className="text-[9px] text-gray-400 mb-2">{item.type}</p>
                        <div className={`text-[9px] px-1.5 py-0.5 rounded-full ${rarity.bg} ${rarity.text} font-bold mb-2`}>
                          {item.rarity}
                        </div>
                      </div>
                      
                      {/* 价格/按钮 */}
                      {isOwned ? (
                        <button
                          disabled
                          className="w-full py-2 bg-green-100 text-green-600 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> 已拥有
                        </button>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePurchase(item.id)}
                          className="w-full py-2 bg-orange-500 text-white rounded-xl text-[11px] font-bold"
                        >
                          ¥{item.price} {item.originalPrice > 0 && <span className="line-through opacity-70">¥{item.originalPrice}</span>}
                        </motion.button>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
