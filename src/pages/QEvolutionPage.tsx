import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Crown, Lock, CheckCircle2, Calendar, Gift, Home, Camera,
  Sparkles, Star, Heart, BookOpen, Trophy, Clock, ChevronRight, X,
  TrendingUp, Flame, Zap, Music, Gamepad2, Coffee, Cake, Diamond,
  PartyPopper, Sun, Cloud, Moon, CloudRain, Wind, Snowflake, Mountain,
  TreePine, Waves, Palette, Sofa, LampDesk, Plant, Frame, Award, Scroll,
  Milestone, Flower2, Wand2, MessageCircle, ThumbsUp, Send
} from 'lucide-react'
import { PenguinQ, type PenguinOutfit, type PenguinMood } from '../components/PenguinQ'
import { useQState } from '../contexts/QStateContext'

interface QEvolutionPageProps {
  onBack: () => void
}

type PageTab = 'dress' | 'skills' | 'bond' | 'home' | 'gift' | 'memory'
type BondSubTab = 'timeline' | 'achievements' | 'album'
type MemorySubTab = 'album' | 'diary' | 'milestone'

// ========== 皮肤数据 ==========
interface OutfitItem {
  id: PenguinOutfit
  name: string
  desc: string
  locked: boolean
  unlockCond?: string
  rarity: 'N' | 'R' | 'SR' | 'SSR' | 'UR'
  limited?: boolean
  limitedTime?: string
  category: 'normal' | 'limited' | 'event' | 'collab'
  collabTag?: string
}

const outfits: OutfitItem[] = [
  { id: 'default', name: '经典', desc: '经典QQ企鹅，红围巾是标配', locked: false, rarity: 'N', category: 'normal' },
  { id: 'cyber', name: '赛博', desc: '霓虹灯光，赛博朋克风格', locked: false, rarity: 'R', category: 'normal' },
  { id: 'festival', name: '节日', desc: '节日庆典，金色节日帽', locked: false, rarity: 'R', category: 'normal' },
  { id: 'star', name: '星际', desc: '皇家星际，闪耀皇冠加身', locked: true, rarity: 'SR', unlockCond: 'Lv.10解锁', category: 'normal' },
  { id: 'winter', name: '冰雪', desc: '冰雪冬季，戴着毛线帽', locked: true, rarity: 'SR', unlockCond: '达成"破冰先锋"成就', category: 'normal' },
  { id: 'sport', name: '运动', desc: '运动健将，头带奖牌加身', locked: false, rarity: 'SR', category: 'normal' },
  { id: 'ocean', name: '沙滩', desc: '沙滩夏日，太阳镜草帽', locked: false, rarity: 'SR', category: 'normal' },
  { id: 'panda', name: '熊猫', desc: '国宝熊猫，稀有黑白配色', locked: true, rarity: 'SSR', unlockCond: '亲密度5000解锁', category: 'limited' },
  { id: 'royal', name: '皇家', desc: '皇室贵族，紫色权杖在手', locked: true, rarity: 'SSR', unlockCond: 'Lv.25解锁', category: 'limited' },
  // 王者荣耀联动
  { id: 'libai', name: '李白·谪仙', desc: '千年之狐，青竹仙剑，飘逸白袍', locked: false, rarity: 'SSR', category: 'collab', collabTag: '王者荣耀' },
  { id: 'change', name: '嫦娥·月神', desc: '共生月兔，月桂发饰，仙气粉紫', locked: false, rarity: 'SSR', category: 'collab', collabTag: '王者荣耀' },
  { id: 'wukong', name: '孙悟空·齐天', desc: '美猴王降世，紧箍金箍棒，如意云纹', locked: false, rarity: 'SSR', category: 'collab', collabTag: '王者荣耀' },
  { id: 'dianwei', name: '典韦·虎痴', desc: '铁甲战神，双戟加身，暗金铠甲', locked: true, rarity: 'UR', unlockCond: '活动期间赢得"对战达人"成就', category: 'collab', collabTag: '王者荣耀' },
  { id: 'daji', name: '妲己·九尾', desc: '魅惑妖狐，九尾飘逸，粉红狐耳', locked: true, rarity: 'UR', unlockCond: '联动活动充值礼包专属', category: 'collab', collabTag: '王者荣耀' },
  { id: 'xiaoqiao', name: '小乔·千纸鹤', desc: '樱花少女，双蝴蝶结，折纸轻盈', locked: false, rarity: 'SSR', category: 'collab', collabTag: '王者荣耀' },
  { id: 'yao', name: '瑶·仙鹤', desc: '仙女清冷，仙鹤羽冠，玉佩流光', locked: false, rarity: 'SSR', category: 'collab', collabTag: '王者荣耀' },
]

const rarityColor: Record<string, string> = {
  N: 'text-gray-500 bg-gray-100 border-gray-200',
  R: 'text-blue-500 bg-blue-50 border-blue-200',
  SR: 'text-purple-500 bg-purple-50 border-purple-200',
  SSR: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  UR: 'text-orange-600 bg-orange-50 border-orange-300',
}

const rarityGlow: Record<string, string> = {
  N: '',
  R: 'shadow-blue-100',
  SR: 'shadow-purple-100',
  SSR: 'shadow-yellow-100',
  UR: 'shadow-orange-200',
}

// ========== 技能数据 ==========
interface SkillNode {
  id: string
  label: string
  emoji: string
  desc: string
  level: number
  maxLevel: number
  unlocked: boolean
  category: 'social' | 'insight' | 'care'
  children?: string[]
  parent?: string
}

const skillTreeData: SkillNode[] = [
  { id: 's1', label: '智能回复', emoji: '💬', desc: '帮你生成最适合语境的回复', level: 3, maxLevel: 5, unlocked: true, category: 'social', children: ['s2', 's3'] },
  { id: 's2', label: '话题雷达', emoji: '📡', desc: '主动发现你们的共同兴趣', level: 2, maxLevel: 5, unlocked: true, category: 'social', parent: 's1' },
  { id: 's3', label: '群聊总结', emoji: '📋', desc: '一键提炼群聊重点', level: 1, maxLevel: 5, unlocked: true, category: 'social', parent: 's1' },
  { id: 's4', label: '情绪感知', emoji: '🫀', desc: '识别好友情绪并给出关怀提示', level: 2, maxLevel: 5, unlocked: true, category: 'insight', children: ['s5', 's8'] },
  { id: 's5', label: '关系图谱', emoji: '🕸️', desc: '可视化你的社交圈关系', level: 1, maxLevel: 5, unlocked: true, category: 'insight', parent: 's4' },
  { id: 's6', label: '生日提醒', emoji: '🎂', desc: '自动提醒好友生日并推荐礼物', level: 3, maxLevel: 5, unlocked: true, category: 'care', parent: 's7' },
  { id: 's7', label: '冲突调解', emoji: '🕊️', desc: '感知摩擦并建议调解方式', level: 0, maxLevel: 5, unlocked: false, category: 'care', children: ['s6'] },
  { id: 's8', label: '记忆系统', emoji: '🧠', desc: '记住所有关于好友的细节', level: 0, maxLevel: 5, unlocked: false, category: 'insight', parent: 's4' },
]

const categoryColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  social: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-400' },
  insight: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-400' },
  care: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', dot: 'bg-pink-400' },
}

const categoryNames: Record<string, string> = {
  social: '社交力',
  insight: '洞察力',
  care: '关怀力',
}

// ========== 羁绊数据 ==========
interface BondEvent {
  date: string
  text: string
  emoji: string
  highlight?: boolean
}

const bondEvents: BondEvent[] = [
  { date: '今天', text: '你和小芳聊了15分钟，话题：周末出游', emoji: '🌟', highlight: true },
  { date: '今天', text: '小Q帮你给小明生成了3条回复建议', emoji: '💬' },
  { date: '昨天', text: '小Q帮你发现了与小明的共同爱好：原神', emoji: '🎮', highlight: true },
  { date: '昨天', text: '总结了开黑交流群的聊天记录', emoji: '📋' },
  { date: '4月23日', text: '帮小红发送生日祝福', emoji: '🎂' },
  { date: '4月23日', text: '在开黑群投票中投了"火锅"', emoji: '🗳️' },
  { date: '4月22日', text: '智能回复技能升到Lv.3', emoji: '⬆️', highlight: true },
  { date: '4月22日', text: '今日签到，连续4天', emoji: '🎁' },
  { date: '4月21日', text: '解锁"星际"皮肤', emoji: '✨', highlight: true },
  { date: '4月20日', text: '化解了你和小明的尴尬冷场', emoji: '🕊️' },
  { date: '4月18日', text: '群聊中发现3个共同话题', emoji: '💡' },
]

interface AchievementItem {
  id: string
  emoji: string
  label: string
  desc: string
  earned: boolean
  progress?: number
  total?: number
}

const achievements: AchievementItem[] = [
  { id: 'a1', emoji: '🌅', label: '初次相遇', desc: '首次与小Q聊天', earned: true },
  { id: 'a2', emoji: '💬', label: '对话达人', desc: '累计聊天100次', earned: false, progress: 32, total: 100 },
  { id: 'a3', emoji: '🎂', label: '生日守护', desc: '使用生日提醒功能', earned: true },
  { id: 'a4', emoji: '🎮', label: '游戏搭子', desc: '与好友聊游戏话题10次', earned: false, progress: 3, total: 10 },
  { id: 'a5', emoji: '🌟', label: '话题大师', desc: '发现20个共同话题', earned: false, progress: 5, total: 20 },
  { id: 'a6', emoji: '💎', label: '破冰先锋', desc: '使用小Q建议完成社交破冰', earned: false, progress: 2, total: 10 },
  { id: 'a7', emoji: '💕', label: '社交达人', desc: '维护5段关系健康度>80', earned: false, progress: 1, total: 5 },
  { id: 'a8', emoji: '🛡️', label: '关系修复师', desc: '修复3段危险关系', earned: false, progress: 0, total: 3 },
  { id: 'a9', emoji: '✨', label: '创意大师', desc: '生成50条创意文案', earned: false, progress: 12, total: 50 },
  { id: 'a10', emoji: '📋', label: '群聊之星', desc: '总结群聊20次', earned: false, progress: 3, total: 20 },
]

const albumItems = [
  { id: 'album1', title: '第一次聊天', date: '4月10日', emoji: '🌅', locked: false },
  { id: 'album2', title: '破冰成功', date: '4月15日', emoji: '🧊', locked: false },
  { id: 'album3', title: '生日祝福', date: '4月21日', emoji: '🎂', locked: false },
  { id: 'album4', title: '群聊高光', date: '4月22日', emoji: '⭐', locked: false },
  { id: 'album5', title: '升级时刻', date: '???', emoji: '⬆️', locked: true },
  { id: 'album6', title: '灵魂伴侣', date: '???', emoji: '💕', locked: true },
]

// ========== 家园数据 ==========
const homeScenes = [
  { id: 'forest', name: '森林小屋', emoji: '🌲', bg: 'from-green-100 to-emerald-50', accent: 'text-green-600' },
  { id: 'ocean', name: '海边度假', emoji: '🌊', bg: 'from-blue-100 to-cyan-50', accent: 'text-blue-600' },
  { id: 'starry', name: '星空卧室', emoji: '🌃', bg: 'from-indigo-100 to-purple-50', accent: 'text-indigo-600' },
  { id: 'city', name: '都市公寓', emoji: '🏙️', bg: 'from-slate-100 to-gray-50', accent: 'text-slate-600' },
]

const homeFurniture = [
  { id: 'desk', name: '书桌', emoji: '📚', pos: 'left', desc: '小Q在这里学习' },
  { id: 'plant', name: '绿植', emoji: '🪴', pos: 'right', desc: '小Q每天浇水' },
  { id: 'coffee', name: '咖啡机', emoji: '☕', pos: 'center', desc: '小Q的提神利器' },
  { id: 'lamp', name: '台灯', emoji: '💡', pos: 'left', desc: '晚上陪伴小Q' },
  { id: 'trophy', name: '奖杯架', emoji: '🏆', pos: 'right', desc: '展示你的成就' },
  { id: 'photo', name: '照片墙', emoji: '🖼️', pos: 'center', desc: '记录美好回忆' },
]

// ========== 礼物数据 ==========
interface GiftItem {
  id: string
  emoji: string
  name: string
  intimacy: number
  reaction: string
  color: string
}

const gifts: GiftItem[] = [
  { id: 'g1', emoji: '🍭', name: '糖果', intimacy: 5, reaction: '甜甜哒~', color: 'from-pink-100 to-pink-50' },
  { id: 'g2', emoji: '🌹', name: '玫瑰', intimacy: 15, reaction: '呜哇...谢谢！', color: 'from-red-100 to-red-50' },
  { id: 'g3', emoji: '📖', name: '书籍', intimacy: 10, reaction: '我会认真读的！', color: 'from-amber-100 to-amber-50' },
  { id: 'g4', emoji: '🎮', name: '游戏机', intimacy: 20, reaction: '一起开黑吗！', color: 'from-blue-100 to-blue-50' },
  { id: 'g5', emoji: '🍰', name: '蛋糕', intimacy: 25, reaction: '太好吃了！', color: 'from-orange-100 to-orange-50' },
  { id: 'g6', emoji: '🧸', name: '玩偶', intimacy: 30, reaction: '好可爱，抱紧~', color: 'from-purple-100 to-purple-50' },
  { id: 'g7', emoji: '💎', name: '宝石', intimacy: 50, reaction: '太贵重了！', color: 'from-cyan-100 to-cyan-50' },
  { id: 'g8', emoji: '🎂', name: '专属礼物', intimacy: 100, reaction: '这是我收到最棒的！', color: 'from-yellow-100 to-yellow-50' },
]

// ========== 回忆数据 ==========
const diaryEntries = [
  { date: '4月24日', mood: '😊', content: '今天帮主人回复了小芳的消息，主人看起来很开心。我发现主人和小芳都很喜欢草莓，下次可以推荐草莓园~' },
  { date: '4月23日', mood: '🎉', content: '主人连续签到4天了！真棒。今天还帮主人总结了群聊，火锅获得了3票呢。' },
  { date: '4月22日', mood: '🤔', content: '主人今天好像有点忙，没怎么聊天。我在角落里乖乖等着，希望主人记得来陪我。' },
  { date: '4月21日', mood: '💕', content: '今天是小红的生日！我提醒了主人，主人送出了祝福。看到小红开心，我也好开心。' },
]

const milestones = [
  { date: '4月10日', title: '初次相遇', desc: '小Q来到你身边', emoji: '🤝', done: true },
  { date: '4月12日', title: '首次聊天', desc: '你们开始了第一次对话', emoji: '💬', done: true },
  { date: '4月15日', title: '破冰成功', desc: '小Q帮你化解了尴尬', emoji: '🧊', done: true },
  { date: '4月18日', title: 'Lv.5达成', desc: '小Q成长了一点点', emoji: '⬆️', done: true },
  { date: '4月21日', title: '解锁新皮肤', desc: '获得"星际"皮肤', emoji: '✨', done: true },
  { date: '???', title: 'Lv.10', desc: '解锁更多技能', emoji: '🔒', done: false },
  { date: '???', title: '灵魂伴侣', desc: '亲密度达到5000', emoji: '💕', done: false },
]

// ========== 运势数据 ==========
const fortuneData = {
  overall: 85,
  love: 90,
  career: 75,
  wealth: 60,
  text: '今天适合社交！小Q感应到你的社交运势爆棚，主动联系老朋友会有惊喜收获哦~',
  luckyColor: '粉色',
  luckyNumber: '7',
  advice: '给小芳发条消息吧，她今天很想你',
}

// ========== 心情台词 ==========
const moodLines: Record<PenguinMood, string[]> = {
  happy: ['今天心情不错呢~', '嘿嘿，看到你就开心', '有什么好事分享吗？'],
  excited: ['哇！太棒了吧！', '我好兴奋啊啊啊！', '冲冲冲！'],
  thinking: ['嗯...让我想想', '这个问题有点意思', '我在认真思考哦'],
  cool: ['淡定，一切尽在掌握', '小事一桩', '帅就完事了'],
  love: ['最喜欢你了~', '抱抱！', '有你在真好'],
}

export function QEvolutionPage({ onBack }: QEvolutionPageProps) {
  const { outfit: ctxOutfit, mood, level, exp, intimacy, setOutfit: ctxSetOutfit, setMood: ctxSetMood, addExp, addIntimacy } = useQState()

  const [activeTab, setActiveTab] = useState<PageTab>('dress')
  const [bondSubTab, setBondSubTab] = useState<BondSubTab>('timeline')
  const [memorySubTab, setMemorySubTab] = useState<MemorySubTab>('album')
  const [previewOutfit, setPreviewOutfit] = useState<PenguinOutfit>(ctxOutfit)
  const [skills, setSkills] = useState(skillTreeData)
  const [checkedIn, setCheckedIn] = useState(false)
  const [streakDays, setStreakDays] = useState(4)
  const [levelUpAnim, setLevelUpAnim] = useState(false)
  const [newLevel, setNewLevel] = useState(level)
  const [showFortune, setShowFortune] = useState(false)
  const [showSurprise, setShowSurprise] = useState(false)
  const [surprises] = useState([
    { icon: '🎉', title: '升级啦！', desc: '恭喜达到Lv.8！', time: '2分钟前' },
    { icon: '✨', title: '新皮肤解锁', desc: '获得"星际"皮肤预览权', time: '昨天' },
    { icon: '💬', title: '话题发现', desc: '发现你和小明都喜欢原神', time: '昨天' },
  ])
  const [penguinBubble, setPenguinBubble] = useState('')
  const [homeScene, setHomeScene] = useState('forest')
  const [activeFurniture, setActiveFurniture] = useState<string | null>(null)
  const [giftAnim, setGiftAnim] = useState<{ id: string; x: number; y: number } | null>(null)
  const [giftReaction, setGiftReaction] = useState('')
  const [dressFilter, setDressFilter] = useState<'all' | 'normal' | 'limited' | 'event' | 'collab'>('all')
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  const expPercent = exp

  // 签到
  const handleCheckIn = () => {
    if (checkedIn) return
    setCheckedIn(true)
    setStreakDays(prev => prev + 1)
    addExp(20)
  }

  // 技能升级
  const handleUpgradeSkill = (id: string) => {
    setSkills(prev => prev.map(s =>
      s.id === id && s.level < s.maxLevel && s.unlocked ? { ...s, level: s.level + 1 } : s
    ))
    addExp(10)
  }

  // 点击小Q互动
  const handlePenguinTap = useCallback(() => {
    const lines = moodLines[mood]
    const line = lines[Math.floor(Math.random() * lines.length)]
    setPenguinBubble(line)
    setTimeout(() => setPenguinBubble(''), 2500)
    addIntimacy(2)
  }, [mood, addIntimacy])

  // 切换心情
  const handleMoodChange = (m: PenguinMood) => {
    ctxSetMood(m)
    const lines = moodLines[m]
    setPenguinBubble(lines[0])
    setTimeout(() => setPenguinBubble(''), 2500)
  }

  // 送礼
  const handleSendGift = (gift: GiftItem, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setGiftAnim({ id: gift.id, x: rect.left, y: rect.top })
    setTimeout(() => {
      setGiftAnim(null)
      setGiftReaction(gift.reaction)
      addIntimacy(gift.intimacy)
      setTimeout(() => setGiftReaction(''), 2000)
    }, 800)
  }

  // 升级动画触发（演示用）
  const triggerLevelUp = () => {
    setNewLevel(level + 1)
    setLevelUpAnim(true)
    setTimeout(() => setLevelUpAnim(false), 3500)
  }

  const moods: PenguinMood[] = ['happy', 'excited', 'thinking', 'cool', 'love']
  const moodEmoji: Record<PenguinMood, string> = {
    happy: '😊', excited: '🎉', thinking: '🤔', cool: '😎', love: '💕'
  }

  const filteredOutfits = dressFilter === 'all'
    ? outfits
    : outfits.filter(o => o.category === dressFilter)

  const selectedOutfit = previewOutfit

  // 亲密度称号
  const getIntimacyTitle = (val: number) => {
    if (val >= 5000) return { label: '灵魂伴侣', emoji: '💖' }
    if (val >= 3000) return { label: '挚友', emoji: '💝' }
    if (val >= 1500) return { label: '好友', emoji: '💕' }
    if (val >= 500) return { label: '熟人', emoji: '💙' }
    return { label: '新朋友', emoji: '🤝' }
  }

  const intimacyInfo = getIntimacyTitle(intimacy)

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      {/* 顶栏 */}
      <div className="bg-gradient-to-r from-[#0A85B8] to-[#12B7F5] px-3 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 -ml-1">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white font-bold text-[16px]">小Q的成长</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 惊喜铃铛 */}
          <button
            onClick={() => setShowSurprise(!showSurprise)}
            className="relative p-1.5 bg-white/20 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#12B7F5]" />
          </button>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <Crown className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-white text-[12px] font-bold">Lv.{level}</span>
          </div>
        </div>
      </div>

      {/* 主角区域 */}
      <div className="bg-gradient-to-b from-[#12B7F5]/15 to-transparent px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* 企鹅展示区 - 可点击互动 */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-[96px] h-[96px] rounded-2xl bg-gradient-to-br from-white to-[#E8F8FE] shadow-md flex items-center justify-center border border-[#12B7F5]/20 relative overflow-hidden cursor-pointer"
              onClick={handlePenguinTap}
            >
              <div className="absolute inset-0 bg-radial-gradient from-[#12B7F5]/10 to-transparent" />
              <PenguinQ
                size={80}
                outfit={previewOutfit}
                mood={mood}
                animated={true}
                floating={true}
                showBubble={penguinBubble || undefined}
              />
            </motion.div>
            {/* 心情切换 */}
            <div className="flex gap-1 mt-2">
              {moods.map(m => (
                <button
                  key={m}
                  onClick={() => handleMoodChange(m)}
                  className={`w-7 h-7 rounded-full text-[14px] flex items-center justify-center transition-all ${mood === m ? 'scale-110 bg-white shadow-md' : 'opacity-50'}`}
                >
                  {moodEmoji[m]}
                </button>
              ))}
            </div>
          </div>

          {/* 信息面板 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-gray-900 text-[16px] font-bold">同频小Q</span>
              <span className="bg-[#12B7F5] text-white text-[9px] px-1.5 py-0.5 rounded-full">AI伴侣</span>
            </div>
            <p className="text-gray-500 text-[11px] mb-1.5 truncate">"我在，你不孤独。"</p>

            {/* 经验条 */}
            <div className="mb-1.5">
              <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                <span>Lv.{level}</span>
                <span>{exp} / 100</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${expPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#12B7F5] to-[#0075B2] rounded-full"
                />
              </div>
            </div>

            {/* 数据面板 */}
            <div className="flex gap-2">
              <div className="text-center flex-1 bg-white/60 rounded-lg py-1">
                <div className="text-[13px] font-bold text-pink-500">{intimacy}</div>
                <div className="text-[9px] text-gray-400">{intimacyInfo.emoji} 亲密</div>
              </div>
              <div className="text-center flex-1 bg-white/60 rounded-lg py-1">
                <div className="text-[13px] font-bold text-[#12B7F5]">{streakDays}</div>
                <div className="text-[9px] text-gray-400">🔥 连续</div>
              </div>
              <div className="text-center flex-1 bg-white/60 rounded-lg py-1">
                <div className="text-[13px] font-bold text-purple-500">{level + 6}天</div>
                <div className="text-[9px] text-gray-400">📅 相识</div>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作栏 */}
        <div className="flex gap-2 mt-2.5">
          {/* 签到 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCheckIn}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
              checkedIn
                ? 'bg-green-100 text-green-600'
                : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm'
            }`}
          >
            {checkedIn ? (
              <><CheckCircle2 className="w-3.5 h-3.5" /> 已签到</>
            ) : (
              <><Calendar className="w-3.5 h-3.5" /> 今日签到 +20EXP</>
            )}
          </motion.button>
          {/* 运势 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFortune(true)}
            className="flex-1 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> 今日运势
          </motion.button>
          {/* 每日目标 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('skills')}
            className="flex-1 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 bg-white text-[#12B7F5] shadow-sm border border-[#12B7F5]/20"
          >
            <Flame className="w-3.5 h-3.5" /> 每日目标
          </motion.button>
        </div>
      </div>

      {/* Tab切换 - 6个Tab */}
      <div className="flex bg-white border-b border-gray-100 mx-3 rounded-xl overflow-hidden shadow-sm flex-shrink-0 mt-1">
        {[
          { id: 'dress' as PageTab, label: '换装', emoji: '👗' },
          { id: 'skills' as PageTab, label: '技能', emoji: '⚡' },
          { id: 'bond' as PageTab, label: '羁绊', emoji: '💕' },
          { id: 'home' as PageTab, label: '家园', emoji: '🏠' },
          { id: 'gift' as PageTab, label: '礼物', emoji: '🎁' },
          { id: 'memory' as PageTab, label: '回忆', emoji: '📔' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 flex items-center justify-center gap-0.5 text-[11px] font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-[#12B7F5]' : 'text-gray-400'
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="evolutionTab"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#12B7F5] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab内容区域 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <AnimatePresence mode="wait">

          {/* ========== 换装Tab ========== */}
          {activeTab === 'dress' && (
            <motion.div
              key="dress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 分类筛选 */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as const, label: '全部' },
                  { id: 'normal' as const, label: '常规' },
                  { id: 'limited' as const, label: '限定' },
                  { id: 'event' as const, label: '活动' },
                  { id: 'collab' as const, label: '🎮 王者联动' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setDressFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                      dressFilter === f.id
                        ? f.id === 'collab' ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md' : 'bg-[#12B7F5] text-white'
                        : 'bg-white text-gray-500 border border-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-gray-400 px-1 mb-2">点击预览，点击"穿上"保存</p>

              {/* 王者联动Banner */}
              {dressFilter === 'collab' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 p-3 flex items-center gap-3">
                    <div className="text-2xl">🎮</div>
                    <div>
                      <p className="text-white font-bold text-[13px]">王者荣耀 × 小Q 联动限定</p>
                      <p className="text-white/80 text-[10px]">穿上英雄皮肤，与王者一起社交！</p>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="bg-white/20 text-white text-[9px] px-2 py-1 rounded-full font-bold">限时活动</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 px-3 py-1.5 flex gap-3 text-[10px] text-orange-700">
                    <span>👑 李白 · 嫦娥 · 孙悟空 · 小乔 · 瑶</span>
                    <span className="text-orange-400">|</span>
                    <span>🔒 典韦 · 妲己（活动专属）</span>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                {filteredOutfits.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-2xl p-3 flex items-center gap-3 shadow-sm border-2 transition-all ${
                      selectedOutfit === item.id && !item.locked
                        ? 'border-[#12B7F5] shadow-[#12B7F5]/20 bg-white'
                        : item.category === 'collab'
                          ? 'border-orange-200 bg-gradient-to-r from-orange-50/60 to-yellow-50/60'
                          : 'border-transparent bg-white'
                    } ${item.locked ? 'opacity-70' : ''}`}
                  >
                    {/* 预览区 */}
                    <div
                      className={`w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0 ${
                        item.locked ? '' : 'hover:shadow-md'
                      }`}
                      onClick={() => !item.locked && setPreviewOutfit(item.id)}
                    >
                      {item.locked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <PenguinQ size={48} outfit={item.id} mood="happy" animated={false} />
                      )}
                    </div>

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[13px] font-bold text-gray-900">{item.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${rarityColor[item.rarity]}`}>
                          {item.rarity}
                        </span>
                        {item.limited && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 font-bold border border-red-100">
                            限定
                          </span>
                        )}
                        {item.collabTag && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold shadow-sm">
                            🎮 {item.collabTag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                      {item.locked && item.unlockCond && (
                        <p className="text-[10px] text-orange-500 mt-0.5 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {item.unlockCond}
                        </p>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    {!item.locked && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          ctxSetOutfit(item.id)
                          setPreviewOutfit(item.id)
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex-shrink-0 transition-all ${
                          selectedOutfit === item.id
                            ? 'bg-[#12B7F5] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {selectedOutfit === item.id ? '✓ 已穿' : '穿上'}
                      </motion.button>
                    )}
                    {item.locked && (
                      <span className="px-3 py-1.5 rounded-xl text-[11px] font-bold flex-shrink-0 bg-gray-100 text-gray-400">
                        未解锁
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========== 技能Tab ========== */}
          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 每日目标 */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 mb-3 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-[12px] font-bold text-gray-900">每日目标</span>
                  </div>
                  <span className="text-[11px] text-orange-500 font-bold">2/4 完成</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: '💬', label: '聊天', current: 3, target: 5, done: false },
                    { icon: '🎉', label: '社交', current: 2, target: 3, done: false },
                    { icon: '✨', label: '创作', current: 1, target: 1, done: true },
                    { icon: '🌟', label: '养成', current: 2, target: 2, done: true },
                  ].map((goal, gi) => (
                    <div key={gi} className={`text-center p-1.5 rounded-xl ${goal.done ? 'bg-green-50 border border-green-100' : 'bg-white/60'}`}>
                      <div className="text-[16px] mb-0.5">{goal.icon}</div>
                      <div className="text-[10px] text-gray-500">{goal.current}/{goal.target}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技能树 */}
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-[11px] text-gray-400">点击技能查看详情，点击+1升级</p>
                <button
                  onClick={triggerLevelUp}
                  className="text-[11px] text-[#12B7F5] font-bold px-2 py-1 bg-[#12B7F5]/10 rounded-lg"
                >
                  演示升级动画
                </button>
              </div>

              {/* 技能树可视化 */}
              <div className="space-y-3">
                {(['social', 'insight', 'care'] as const).map(cat => {
                  const catSkills = skills.filter(s => s.category === cat)
                  const colors = categoryColors[cat]
                  const rootSkill = catSkills.find(s => !s.parent)
                  const childSkills = catSkills.filter(s => s.parent)

                  return (
                    <div key={cat} className={`bg-white rounded-2xl overflow-hidden border ${colors.border} shadow-sm`}>
                      <div className={`px-4 py-2 ${colors.bg} flex items-center gap-2`}>
                        <span className={`text-[12px] font-bold ${colors.text}`}>{categoryNames[cat]}</span>
                        <div className={`text-[10px] ${colors.text} opacity-70`}>
                          {catSkills.filter(s => s.unlocked).length}/{catSkills.length} 已解锁
                        </div>
                      </div>

                      <div className="p-3">
                        {/* 根技能 */}
                        {rootSkill && (
                          <SkillCard
                            skill={rootSkill}
                            colors={colors}
                            onUpgrade={() => handleUpgradeSkill(rootSkill.id)}
                            onSelect={() => setSelectedSkill(selectedSkill === rootSkill.id ? null : rootSkill.id)}
                            isSelected={selectedSkill === rootSkill.id}
                          />
                        )}

                        {/* 子技能 */}
                        {childSkills.length > 0 && (
                          <div className="ml-4 mt-2 pl-4 border-l-2 border-dashed border-gray-200 space-y-2">
                            {childSkills.map(child => (
                              <SkillCard
                                key={child.id}
                                skill={child}
                                colors={colors}
                                onUpgrade={() => handleUpgradeSkill(child.id)}
                                onSelect={() => setSelectedSkill(selectedSkill === child.id ? null : child.id)}
                                isSelected={selectedSkill === child.id}
                                isChild
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ========== 羁绊Tab ========== */}
          {activeTab === 'bond' && (
            <motion.div
              key="bond"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 亲密度概览 */}
              <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <PenguinQ size={48} outfit={selectedOutfit} mood="love" animated={true} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-bold text-gray-900">我们的羁绊</span>
                      <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {intimacyInfo.emoji} {intimacyInfo.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">小Q陪伴你已有 <span className="text-pink-500 font-bold">{level + 6}天</span>，进行了 <span className="text-[#12B7F5] font-bold">{streakDays + 124}次</span> 交流</p>
                  </div>
                </div>

                <div className="mb-1 flex justify-between text-[10px] text-gray-400">
                  <span>{intimacyInfo.label} {intimacyInfo.emoji}</span>
                  <span>{intimacy} / 10000 → 知己</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(intimacy / 10000) * 100}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                  />
                </div>
              </div>

              {/* 子Tab */}
              <div className="flex bg-white rounded-xl overflow-hidden shadow-sm mb-3 border border-gray-100">
                {[
                  { id: 'timeline' as BondSubTab, label: '时间线', emoji: '⏱️' },
                  { id: 'achievements' as BondSubTab, label: '成就', emoji: '🏆' },
                  { id: 'album' as BondSubTab, label: '相册', emoji: '📷' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setBondSubTab(sub.id)}
                    className={`flex-1 py-2 flex items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                      bondSubTab === sub.id ? 'text-[#12B7F5] bg-[#12B7F5]/5' : 'text-gray-400'
                    }`}
                  >
                    <span>{sub.emoji}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {/* 子Tab内容 */}
              <AnimatePresence mode="wait">
                {bondSubTab === 'timeline' && (
                  <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                      {bondEvents.map((event, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`px-4 py-3 flex items-start gap-3 border-b border-gray-50 last:border-0 ${event.highlight ? 'bg-pink-50/30' : ''}`}
                        >
                          <span className="text-xl flex-shrink-0">{event.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-gray-700">{event.text}</p>
                            <span className="text-[10px] text-gray-400">{event.date}</span>
                          </div>
                          {event.highlight && <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {bondSubTab === 'achievements' && (
                  <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                    {achievements.map((ach, i) => (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm ${ach.earned ? '' : 'opacity-60'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${ach.earned ? 'bg-gradient-to-br from-yellow-100 to-orange-100' : 'bg-gray-100'}`}>
                          {ach.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-gray-900">{ach.label}</span>
                            {ach.earned && <Trophy className="w-3.5 h-3.5 text-yellow-500" />}
                          </div>
                          <p className="text-[11px] text-gray-500">{ach.desc}</p>
                          {!ach.earned && ach.progress !== undefined && ach.total !== undefined && (
                            <div className="mt-1">
                              <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
                                <span>进度</span>
                                <span>{ach.progress}/{ach.total}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#12B7F5] to-[#0075B2] rounded-full"
                                  style={{ width: `${(ach.progress / ach.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {bondSubTab === 'album' && (
                  <motion.div key="album" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-2 gap-2">
                      {albumItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className={`bg-white rounded-2xl p-4 text-center shadow-sm ${item.locked ? 'opacity-50' : ''}`}
                        >
                          <div className="text-3xl mb-2">{item.locked ? '🔒' : item.emoji}</div>
                          <p className="text-[12px] font-bold text-gray-900">{item.title}</p>
                          <p className="text-[10px] text-gray-400">{item.locked ? '???' : item.date}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ========== 家园Tab ========== */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 场景展示 */}
              <div className={`bg-gradient-to-b ${homeScenes.find(s => s.id === homeScene)?.bg || 'from-green-100 to-emerald-50'} rounded-2xl p-4 mb-3 relative overflow-hidden min-h-[180px] flex items-center justify-center shadow-sm`}>
                {/* 场景背景元素 */}
                {homeScene === 'forest' && (
                  <>
                    <div className="absolute top-2 left-4 text-2xl opacity-30">🌲</div>
                    <div className="absolute top-4 right-6 text-xl opacity-30">🌳</div>
                    <div className="absolute bottom-2 left-8 text-lg opacity-30">🍄</div>
                    <div className="absolute bottom-3 right-4 text-xl opacity-30">🌿</div>
                  </>
                )}
                {homeScene === 'ocean' && (
                  <>
                    <div className="absolute top-3 left-6 text-2xl opacity-30">🐚</div>
                    <div className="absolute top-2 right-8 text-xl opacity-30">⭐</div>
                    <div className="absolute bottom-2 left-4 text-lg opacity-30">🐠</div>
                    <div className="absolute bottom-3 right-6 text-xl opacity-30">🐡</div>
                  </>
                )}
                {homeScene === 'starry' && (
                  <>
                    <div className="absolute top-2 left-5 text-lg opacity-30">⭐</div>
                    <div className="absolute top-4 right-10 text-sm opacity-30">✨</div>
                    <div className="absolute top-6 left-12 text-xs opacity-30">🌙</div>
                    <div className="absolute bottom-2 right-5 text-lg opacity-30">⭐</div>
                  </>
                )}
                {homeScene === 'city' && (
                  <>
                    <div className="absolute top-3 left-6 text-lg opacity-30">🏢</div>
                    <div className="absolute top-2 right-8 text-xl opacity-30">🌆</div>
                    <div className="absolute bottom-2 left-4 text-lg opacity-30">🚗</div>
                  </>
                )}

                {/* 小Q在家园里 */}
                <div className="relative z-10">
                  <PenguinQ size={72} outfit={selectedOutfit} mood="happy" animated={true} floating={true} />
                  {activeFurniture && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 px-3 py-1 rounded-full text-[11px] text-gray-700 shadow-sm"
                    >
                      {homeFurniture.find(f => f.id === activeFurniture)?.desc}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* 场景切换 */}
              <p className="text-[11px] text-gray-400 px-1 mb-2">切换场景</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {homeScenes.map(scene => (
                  <button
                    key={scene.id}
                    onClick={() => setHomeScene(scene.id)}
                    className={`p-2 rounded-xl text-center transition-all border ${
                      homeScene === scene.id
                        ? 'bg-white border-[#12B7F5] shadow-sm'
                        : 'bg-white/50 border-transparent'
                    }`}
                  >
                    <div className="text-xl mb-1">{scene.emoji}</div>
                    <div className="text-[10px] text-gray-600 font-medium">{scene.name}</div>
                  </button>
                ))}
              </div>

              {/* 家具互动 */}
              <p className="text-[11px] text-gray-400 px-1 mb-2">家具互动</p>
              <div className="grid grid-cols-3 gap-2">
                {homeFurniture.map(item => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFurniture(activeFurniture === item.id ? null : item.id)}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      activeFurniture === item.id
                        ? 'bg-[#12B7F5]/10 border-[#12B7F5]/30'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-[11px] font-medium text-gray-700">{item.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========== 礼物Tab ========== */}
          {activeTab === 'gift' && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 小Q心情 */}
              <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm text-center">
                <PenguinQ size={56} outfit={selectedOutfit} mood="love" animated={true} className="mx-auto mb-2" />
                <p className="text-[13px] font-bold text-gray-900 mb-0.5">小Q心情：开心 {moodEmoji[mood]}</p>
                <p className="text-[11px] text-gray-500">
                  {giftReaction || '"今天收到礼物会超开心！"'}
                </p>
              </div>

              {/* 礼物网格 */}
              <div className="grid grid-cols-4 gap-2">
                {gifts.map((gift, i) => (
                  <motion.button
                    key={gift.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleSendGift(gift, e)}
                    className={`bg-gradient-to-b ${gift.color} rounded-2xl p-3 text-center border border-white/50 relative overflow-hidden`}
                  >
                    <div className="text-2xl mb-1">{gift.emoji}</div>
                    <div className="text-[11px] font-medium text-gray-700">{gift.name}</div>
                    <div className="text-[10px] text-pink-500 font-bold">+{gift.intimacy}亲密</div>
                  </motion.button>
                ))}
              </div>

              {/* 礼物飞行动画 */}
              <AnimatePresence>
                {giftAnim && (
                  <motion.div
                    initial={{ x: giftAnim.x - 150, y: giftAnim.y - 200, scale: 1, opacity: 1 }}
                    animate={{ x: 0, y: -80, scale: 0.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeIn' }}
                    className="fixed z-50 pointer-events-none text-3xl"
                    style={{ left: 150, top: 200 }}
                  >
                    {gifts.find(g => g.id === giftAnim.id)?.emoji}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ========== 回忆Tab ========== */}
          {activeTab === 'memory' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* 子Tab */}
              <div className="flex bg-white rounded-xl overflow-hidden shadow-sm mb-3 border border-gray-100">
                {[
                  { id: 'album' as MemorySubTab, label: '相册', emoji: '📷' },
                  { id: 'diary' as MemorySubTab, label: '日记', emoji: '📖' },
                  { id: 'milestone' as MemorySubTab, label: '里程碑', emoji: '🚩' },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setMemorySubTab(sub.id)}
                    className={`flex-1 py-2 flex items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                      memorySubTab === sub.id ? 'text-[#12B7F5] bg-[#12B7F5]/5' : 'text-gray-400'
                    }`}
                  >
                    <span>{sub.emoji}</span>
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* 相册 */}
                {memorySubTab === 'album' && (
                  <motion.div key="album" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-2 gap-2">
                      {albumItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`bg-white rounded-2xl overflow-hidden shadow-sm ${item.locked ? 'opacity-50' : ''}`}
                        >
                          <div className={`h-20 flex items-center justify-center text-3xl ${item.locked ? 'bg-gray-100' : 'bg-gradient-to-br from-yellow-50 to-orange-50'}`}>
                            {item.locked ? '🔒' : item.emoji}
                          </div>
                          <div className="p-3 text-center">
                            <p className="text-[12px] font-bold text-gray-900">{item.title}</p>
                            <p className="text-[10px] text-gray-400">{item.locked ? '???' : item.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 日记 */}
                {memorySubTab === 'diary' && (
                  <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {diaryEntries.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{entry.mood}</span>
                          <span className="text-[11px] text-gray-400">{entry.date}</span>
                          <BookOpen className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                        </div>
                        <p className="text-[12px] text-gray-700 leading-relaxed">{entry.content}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* 里程碑 */}
                {memorySubTab === 'milestone' && (
                  <motion.div key="milestone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="relative pl-6">
                      {/* 时间线竖线 */}
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200" />

                      {milestones.map((ms, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="relative mb-4 last:mb-0"
                        >
                          {/* 节点 */}
                          <div className={`absolute -left-[19px] top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 ${
                            ms.done
                              ? 'bg-[#12B7F5] border-[#12B7F5] text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            {ms.done ? '✓' : ms.emoji}
                          </div>

                          <div className={`bg-white rounded-2xl p-3 shadow-sm ${ms.done ? '' : 'opacity-60'}`}>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[12px] font-bold text-gray-900">{ms.title}</span>
                              {ms.done && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                            </div>
                            <p className="text-[11px] text-gray-500">{ms.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{ms.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ========== 运势弹窗 ========== */}
      <AnimatePresence>
        {showFortune && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50"
              onClick={() => setShowFortune(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-[16px] text-gray-900">小Q今日运势</span>
                  </div>
                  <button onClick={() => setShowFortune(false)} className="p-1.5 bg-gray-100 rounded-full">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* 总体运势 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] font-bold text-gray-900">综合运势</span>
                    <span className="text-[20px] font-bold text-purple-600">{fortuneData.overall}分</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fortuneData.overall}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    />
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{fortuneData.text}</p>
                </div>

                {/* 分项 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: '桃花', value: fortuneData.love, emoji: '💕', color: 'from-pink-400 to-rose-400' },
                    { label: '事业', value: fortuneData.career, emoji: '💼', color: 'from-blue-400 to-cyan-400' },
                    { label: '财运', value: fortuneData.wealth, emoji: '💰', color: 'from-yellow-400 to-orange-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">{item.emoji}</div>
                      <div className="text-[14px] font-bold text-gray-900">{item.value}</div>
                      <div className="text-[10px] text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* 幸运信息 */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center border border-pink-100">
                    <p className="text-[10px] text-pink-400 mb-0.5">幸运色</p>
                    <p className="text-[13px] font-bold text-pink-600">{fortuneData.luckyColor}</p>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                    <p className="text-[10px] text-blue-400 mb-0.5">幸运数字</p>
                    <p className="text-[13px] font-bold text-blue-600">{fortuneData.luckyNumber}</p>
                  </div>
                </div>

                {/* 小Q建议 */}
                <div className="bg-[#12B7F5]/5 rounded-2xl p-4 border border-[#12B7F5]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-[#12B7F5]" />
                    <span className="text-[11px] text-[#12B7F5] font-medium">小Q建议</span>
                  </div>
                  <p className="text-[12px] text-gray-700">{fortuneData.advice}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== 惊喜弹窗 ========== */}
      <AnimatePresence>
        {showSurprise && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-50"
              onClick={() => setShowSurprise(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl p-5 w-[80%] max-w-[300px] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[15px] text-gray-900">惊喜时刻</span>
                <button onClick={() => setShowSurprise(false)} className="p-1 bg-gray-100 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {surprises.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-gray-900">{s.title}</p>
                      <p className="text-[11px] text-gray-500">{s.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== 升级全屏动画 ========== */}
      <AnimatePresence>
        {levelUpAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center"
            >
              {/* Confetti粒子 */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (i % 2 === 0 ? 1 : -1) * (50 + Math.random() * 100),
                    y: -100 - Math.random() * 150,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="absolute left-1/2 top-1/2 text-2xl"
                >
                  {['🎉', '✨', '⭐', '💫', '🌟'][i % 5]}
                </motion.div>
              ))}

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                <PenguinQ size={100} outfit={selectedOutfit} mood="excited" animated={true} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <p className="text-white text-[14px] font-medium mb-1">恭喜升级！</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-yellow-300 text-[18px] font-bold">Lv.{level}</span>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                    className="text-white text-[20px]"
                  >
                    →
                  </motion.span>
                  <span className="text-yellow-300 text-[24px] font-bold">Lv.{newLevel}</span>
                </div>
                <p className="text-white/70 text-[12px] mt-2">获得新技能槽位 + 解锁"星际"皮肤</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== 技能卡片子组件 ==========
function SkillCard({
  skill,
  colors,
  onUpgrade,
  onSelect,
  isSelected,
  isChild,
}: {
  skill: SkillNode
  colors: { bg: string; text: string; border: string; dot: string }
  onUpgrade: () => void
  onSelect: () => void
  isSelected: boolean
  isChild?: boolean
}) {
  return (
    <div className={`${isChild ? '' : 'mb-2'}`}>
      <div
        onClick={onSelect}
        className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
          isSelected ? colors.bg + ' border ' + colors.border : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-xl flex-shrink-0">{skill.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[13px] font-bold ${skill.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
              {skill.label}
            </span>
            {!skill.unlocked && <Lock className="w-3 h-3 text-gray-400" />}
          </div>
          <p className="text-[10px] text-gray-400">{skill.desc}</p>
          {/* 等级条 */}
          {skill.unlocked && (
            <div className="flex gap-1 mt-1.5">
              {Array.from({ length: skill.maxLevel }).map((_, li) => (
                <div
                  key={li}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    li < skill.level ? colors.dot : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {skill.unlocked && skill.level < skill.maxLevel && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onUpgrade() }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${colors.bg} ${colors.text} border ${colors.border} flex-shrink-0`}
          >
            +1
          </motion.button>
        )}
        {skill.unlocked && skill.level === skill.maxLevel && (
          <div className="flex items-center gap-1 px-2">
            <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
            <span className={`text-[10px] ${colors.text} font-bold`}>MAX</span>
          </div>
        )}
      </div>

      {/* 展开详情 */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`mx-2 p-3 rounded-xl text-[11px] text-gray-600 ${colors.bg} border ${colors.border}`}>
              <p className="mb-1"><span className="font-bold">当前等级：</span>Lv.{skill.level}/{skill.maxLevel}</p>
              <p className="mb-1"><span className="font-bold">效果：</span>
                {skill.level === 0 ? '未解锁'
                  : skill.level === 1 ? '基础效果'
                    : skill.level === skill.maxLevel ? '满级效果 - 能力最大化'
                      : `Lv.${skill.level} 效果 - 性能提升${skill.level * 20}%`}
              </p>
              {skill.level < skill.maxLevel && (
                <p><span className="font-bold">下一级：</span>升级后可提升{skill.label}效果</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
