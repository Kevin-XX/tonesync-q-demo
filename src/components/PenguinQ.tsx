import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export type PenguinOutfit = 
  | 'default' 
  | 'cyber' 
  | 'festival' 
  | 'star' 
  | 'winter' 
  | 'sport' 
  | 'ocean' 
  | 'panda' 
  | 'royal'
  // 王者荣耀联动
  | 'libai'
  | 'change'
  | 'wukong'
  | 'dianwei'
  | 'daji'
  | 'xiaoqiao'
  | 'yao'
export type PenguinMood = 'happy' | 'excited' | 'thinking' | 'cool' | 'love'

interface PenguinQProps {
  size?: number
  outfit?: PenguinOutfit
  mood?: PenguinMood
  animated?: boolean
  className?: string
  onClick?: () => void
  showBubble?: string
  floating?: boolean
  clickable?: boolean
}

// 基础颜色
const BASE = {
  body: '#1a1a1a',
  belly: '#ffffff',
  foot: '#ff9f43',
  beak: '#ff9f43',
  eye: '#ffffff',
  pupil: '#1a1a1a',
}

// 装扮配置
const outfitConfig: Record<PenguinOutfit, {
  body: string
  belly: string
  accessory: React.ReactNode
  bgGlow?: string
}> = {
  default: {
    body: BASE.body,
    belly: BASE.belly,
    accessory: (
      <>
        {/* 红色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#e8383d"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#e8383d"/>
        <rect x="36" y="50" width="5" height="5" rx="1" fill="#f5f5f5" opacity="0.6"/>
        <rect x="44" y="50" width="5" height="5" rx="1" fill="#f5f5f5" opacity="0.6"/>
        <rect x="52" y="50" width="5" height="5" rx="1" fill="#f5f5f5" opacity="0.6"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#e8383d"/>
      </>
    ),
  },
  cyber: {
    body: '#0a0a1a',
    belly: '#00ffff',
    bgGlow: 'rgba(0, 255, 255, 0.2)',
    accessory: (
      <>
        {/* 霓虹围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#ff00ff"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#ff00ff"/>
        <path d="M 56 52 Q 66 58 63 70" stroke="#ff00ff" strokeWidth="3" fill="none"/>
        {/* 赛博眼镜 */}
        <rect x="28" y="26" width="16" height="12" rx="4" fill="none" stroke="#00ffff" strokeWidth="2"/>
        <rect x="56" y="26" width="16" height="12" rx="4" fill="none" stroke="#00ffff" strokeWidth="2"/>
        <line x1="44" y1="32" x2="56" y2="32" stroke="#00ffff" strokeWidth="2"/>
        <rect x="28" y="26" width="16" height="12" rx="4" fill="#00ffff" fillOpacity="0.2"/>
        <rect x="56" y="26" width="16" height="12" rx="4" fill="#00ffff" fillOpacity="0.2"/>
        {/* 机械翅膀 */}
        <ellipse cx="14" cy="55" rx="8" ry="14" fill="none" stroke="#00ffff" strokeWidth="1.5" opacity="0.7"/>
        <ellipse cx="86" cy="55" rx="8" ry="14" fill="none" stroke="#00ffff" strokeWidth="1.5" opacity="0.7"/>
      </>
    ),
  },
  festival: {
    body: '#c0392b',
    belly: '#ffe0e0',
    bgGlow: 'rgba(255, 215, 0, 0.15)',
    accessory: (
      <>
        {/* 金色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#ffd700"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#ffd700"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#ffd700"/>
        {/* 节日帽 */}
        <ellipse cx="50" cy="12" rx="18" ry="5" fill="#ffd700"/>
        <rect x="36" y="3" width="28" height="11" rx="2" fill="#ffd700"/>
        <circle cx="50" cy="3" r="5" fill="#ff4444"/>
        <ellipse cx="50" cy="13" rx="16" ry="2.5" fill="#fff" opacity="0.3"/>
        {/* 彩带 */}
        <circle cx="28" cy="70" r="3" fill="#ffd700" opacity="0.8"/>
        <circle cx="72" cy="70" r="3" fill="#ff4444" opacity="0.8"/>
        <circle cx="25" cy="55" r="2" fill="#4ecdc4" opacity="0.8"/>
      </>
    ),
  },
  star: {
    body: '#1a1a1a',
    belly: '#ffd700',
    bgGlow: 'rgba(255, 215, 0, 0.2)',
    accessory: (
      <>
        {/* 金色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#ffd700"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#ffd700"/>
        <path d="M 56 52 Q 66 58 63 70" stroke="#ffd700" strokeWidth="3" fill="none"/>
        {/* 皇冠 */}
        <path d="M 30 22 L 36 8 L 50 16 L 64 8 L 70 22 L 60 20 L 50 26 L 40 20 Z" fill="#ffd700"/>
        <circle cx="50" cy="12" r="3" fill="#fff" opacity="0.6"/>
        <circle cx="36" cy="10" r="2" fill="#ff6b6b"/>
        <circle cx="64" cy="10" r="2" fill="#4ecdc4"/>
      </>
    ),
  },
  winter: {
    body: '#2c3e50',
    belly: '#ecf0f1',
    bgGlow: 'rgba(135, 206, 250, 0.15)',
    accessory: (
      <>
        {/* 蓝色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#3498db"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#3498db"/>
        <rect x="36" y="50" width="5" height="5" rx="1" fill="#ecf0f1" opacity="0.5"/>
        <rect x="44" y="50" width="5" height="5" rx="1" fill="#ecf0f1" opacity="0.5"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#3498db"/>
        {/* 毛线帽 */}
        <ellipse cx="50" cy="10" rx="16" ry="8" fill="#3498db"/>
        <rect x="36" y="6" width="28" height="10" rx="3" fill="#3498db"/>
        <circle cx="50" cy="3" r="5" fill="#bdc3c7"/>
        {/* 雪花 */}
        <text x="75" y="25" fontSize="10" fill="#87CEEB">❄</text>
        <text x="22" y="30" fontSize="8" fill="#87CEEB">❄</text>
      </>
    ),
  },
  sport: {
    body: '#1a1a1a',
    belly: '#ffffff',
    bgGlow: 'rgba(255, 165, 0, 0.15)',
    accessory: (
      <>
        {/* 运动头带 */}
        <rect x="24" y="18" width="52" height="6" rx="3" fill="#e74c3c"/>
        <text x="38" y="24" fontSize="6" fill="#fff" fontWeight="bold">GO!</text>
        {/* 运动服围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#3498db"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#3498db"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#3498db"/>
        {/* 奖牌 */}
        <circle cx="80" cy="70" r="6" fill="#f39c12"/>
        <circle cx="80" cy="70" r="4" fill="#f1c40f"/>
        <circle cx="18" cy="68" r="5" fill="#95a5a6"/>
        <circle cx="18" cy="68" r="3" fill="#bdc3c7"/>
      </>
    ),
  },
  ocean: {
    body: '#1a1a1a',
    belly: '#ffffff',
    bgGlow: 'rgba(0, 150, 255, 0.15)',
    accessory: (
      <>
        {/* 夏威夷围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#e74c3c"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#e74c3c"/>
        <path d="M 56 52 Q 66 58 63 70" stroke="#e74c3c" strokeWidth="5" fill="none"/>
        {/* 太阳镜 */}
        <rect x="26" y="26" width="18" height="12" rx="6" fill="#1a1a1a" opacity="0.8"/>
        <rect x="56" y="26" width="18" height="12" rx="6" fill="#1a1a1a" opacity="0.8"/>
        <line x1="44" y1="32" x2="56" y2="32" stroke="#e74c3c" strokeWidth="2"/>
        <rect x="26" y="26" width="18" height="12" rx="6" fill="#ff6b6b" fillOpacity="0.3"/>
        <rect x="56" y="26" width="18" height="12" rx="6" fill="#ff6b6b" fillOpacity="0.3"/>
        {/* 沙滩帽 */}
        <ellipse cx="50" cy="8" rx="24" ry="6" fill="#f39c12"/>
        <rect x="38" y="2" width="24" height="8" rx="2" fill="#f39c12"/>
        {/* 沙滩球 */}
        <circle cx="82" cy="75" r="8" fill="#f1c40f"/>
        <path d="M 76 75 Q 82 71 88 75 Q 82 79 76 75" fill="#e74c3c"/>
        <path d="M 78 72 Q 82 75 78 78" fill="#3498db"/>
      </>
    ),
  },
  panda: {
    body: '#ffffff',
    belly: '#ffffff',
    accessory: (
      <>
        {/* 黑色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#1a1a1a"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#1a1a1a"/>
        <path d="M 56 52 Q 66 58 63 70" stroke="#1a1a1a" strokeWidth="3" fill="none"/>
        {/* 熊猫眼圈（叠加在眼睛上） */}
        <ellipse cx="38" cy="32" rx="10" ry="9" fill="#1a1a1a"/>
        <ellipse cx="62" cy="32" rx="10" ry="9" fill="#1a1a1a"/>
        <ellipse cx="38" cy="32" rx="7" ry="6" fill="#ffffff"/>
        <ellipse cx="62" cy="32" rx="7" ry="6" fill="#ffffff"/>
        <ellipse cx="39" cy="33" rx="4" ry="5" fill="#1a1a1a"/>
        <ellipse cx="63" cy="33" rx="4" ry="5" fill="#1a1a1a"/>
        <circle cx="41" cy="31" r="1.5" fill="#ffffff"/>
        <circle cx="65" cy="31" r="1.5" fill="#ffffff"/>
        {/* 粉色腮红 */}
        <ellipse cx="28" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity="0.6"/>
        <ellipse cx="72" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity="0.6"/>
        {/* 竹叶 */}
        <path d="M 75 60 Q 85 55 80 70 Q 78 65 75 68" fill="#27ae60"/>
        <path d="M 25 60 Q 15 55 20 70 Q 22 65 25 68" fill="#27ae60"/>
      </>
    ),
  },
  royal: {
    body: '#1a1a1a',
    belly: '#ffffff',
    bgGlow: 'rgba(138, 43, 226, 0.15)',
    accessory: (
      <>
        {/* 紫色围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#8e44ad"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#8e44ad"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#8e44ad"/>
        {/* 权杖 */}
        <rect x="78" y="50" width="3" height="35" fill="#ffd700"/>
        <circle cx="79.5" cy="48" r="6" fill="#ffd700"/>
        <circle cx="79.5" cy="48" r="3" fill="#e74c3c"/>
        {/* 小皇冠 */}
        <path d="M 32 20 L 36 10 L 42 16 L 50 8 L 58 16 L 64 10 L 68 20 Z" fill="#ffd700"/>
        <circle cx="42" cy="12" r="2" fill="#3498db"/>
        <circle cx="50" cy="8" r="2" fill="#e74c3c"/>
        <circle cx="58" cy="12" r="2" fill="#3498db"/>
      </>
    ),
  },

  // ========== 王者荣耀联动皮肤 ==========

  // 李白·千年之狐（青白仙气配色）
  libai: {
    body: '#1a1a2e',
    belly: '#e8f4fd',
    bgGlow: 'rgba(135, 206, 250, 0.25)',
    accessory: (
      <>
        {/* 白色仙气围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#87CEEB"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#87CEEB"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#87CEEB"/>
        {/* 青竹发冠 */}
        <rect x="44" y="0" width="12" height="16" rx="3" fill="#2ecc71"/>
        <path d="M 44 6 Q 50 2 56 6" stroke="#27ae60" strokeWidth="1.5" fill="none"/>
        <ellipse cx="50" cy="17" rx="14" ry="4" fill="#2ecc71" opacity="0.7"/>
        {/* 仙剑（右侧） */}
        <rect x="78" y="42" width="3" height="40" rx="1" fill="#87CEEB"/>
        <path d="M 77 42 L 81 42 L 79.5 36 Z" fill="#b0e0e6"/>
        <rect x="76" y="44" width="7" height="3" rx="1" fill="#2ecc71"/>
        {/* 飘带 */}
        <path d="M 14 45 Q 8 55 12 65 Q 6 58 10 70" stroke="#87CEEB" strokeWidth="2" fill="none" opacity="0.8"/>
        {/* 星光 */}
        <circle cx="20" cy="25" r="1.5" fill="#ffffff" opacity="0.9"/>
        <circle cx="80" cy="30" r="1" fill="#ffffff" opacity="0.9"/>
        <circle cx="75" cy="22" r="1.5" fill="#b0e0e6" opacity="0.8"/>
      </>
    ),
  },

  // 嫦娥·共生（月白粉紫）
  change: {
    body: '#2c1654',
    belly: '#f8e8ff',
    bgGlow: 'rgba(200, 150, 255, 0.25)',
    accessory: (
      <>
        {/* 粉紫围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#c39bd3"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#c39bd3"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#c39bd3"/>
        {/* 月桂发饰 */}
        <path d="M 32 18 Q 26 8 36 5 Q 30 14 38 14 Z" fill="#ffd700"/>
        <path d="M 68 18 Q 74 8 64 5 Q 70 14 62 14 Z" fill="#ffd700"/>
        <circle cx="38" cy="8" r="2" fill="#f1c40f"/>
        <circle cx="62" cy="8" r="2" fill="#f1c40f"/>
        {/* 月亮头饰 */}
        <path d="M 42 3 Q 50 -2 58 3 Q 50 8 42 3 Z" fill="#ffd700"/>
        <circle cx="50" cy="3" r="2" fill="#fff" opacity="0.8"/>
        {/* 玉兔（左侧） */}
        <circle cx="14" cy="65" r="6" fill="#fff"/>
        <ellipse cx="12" cy="58" rx="2" ry="5" fill="#fff"/>
        <ellipse cx="16" cy="58" rx="2" ry="5" fill="#fff"/>
        <circle cx="14" cy="65" r="2" fill="#ffb6c1"/>
        {/* 星星 */}
        <circle cx="20" cy="30" r="1.5" fill="#ffd700" opacity="0.9"/>
        <circle cx="78" cy="25" r="1" fill="#ffd700" opacity="0.8"/>
        <circle cx="82" cy="35" r="1.5" fill="#c39bd3" opacity="0.8"/>
      </>
    ),
  },

  // 孙悟空·美猴王（金红热血）
  wukong: {
    body: '#2c1810',
    belly: '#fff3e0',
    bgGlow: 'rgba(255, 165, 0, 0.25)',
    accessory: (
      <>
        {/* 金红围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#e74c3c"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#e74c3c"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#e74c3c"/>
        {/* 紧箍咒 */}
        <path d="M 28 22 Q 50 16 72 22" stroke="#ffd700" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="18" r="2" fill="#ffd700"/>
        <circle cx="35" cy="21" r="1.5" fill="#ffd700"/>
        <circle cx="65" cy="21" r="1.5" fill="#ffd700"/>
        {/* 如意金箍棒（右侧斜放） */}
        <rect x="74" y="30" width="5" height="52" rx="2" fill="#c0a030" transform="rotate(-15 74 30)"/>
        <rect x="72" y="28" width="9" height="6" rx="2" fill="#ffd700" transform="rotate(-15 74 30)"/>
        <rect x="72" y="76" width="9" height="6" rx="2" fill="#ffd700" transform="rotate(-15 74 30)"/>
        {/* 火焰（两侧装饰） */}
        <path d="M 8 60 Q 12 52 10 45 Q 15 52 14 60 Q 18 52 16 42 Q 22 52 18 62" fill="#ff6b35" opacity="0.8"/>
        {/* 如意云纹 */}
        <path d="M 22 75 Q 26 70 30 75 Q 26 80 22 75" fill="#ffd700" opacity="0.6"/>
      </>
    ),
  },

  // 典韦·虎痴（暗金铠甲）
  dianwei: {
    body: '#2c2c2c',
    belly: '#c0a060',
    bgGlow: 'rgba(192, 160, 96, 0.25)',
    accessory: (
      <>
        {/* 暗金围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#8b6914"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#8b6914"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#8b6914"/>
        {/* 铁盔 */}
        <path d="M 28 22 Q 28 6 50 4 Q 72 6 72 22 L 68 25 Q 50 20 32 25 Z" fill="#555"/>
        <path d="M 32 22 Q 50 18 68 22" stroke="#c0a060" strokeWidth="2" fill="none"/>
        {/* 虎纹装饰 */}
        <path d="M 28 26 Q 24 30 26 36" stroke="#8b6914" strokeWidth="2" fill="none"/>
        <path d="M 72 26 Q 76 30 74 36" stroke="#8b6914" strokeWidth="2" fill="none"/>
        {/* 双戟（两侧） */}
        <rect x="6" y="45" width="3" height="35" rx="1" fill="#888"/>
        <path d="M 5 45 L 9 45 L 10 38 L 7.5 43 L 5 38 Z" fill="#c0a060"/>
        <rect x="90" y="45" width="3" height="35" rx="1" fill="#888"/>
        <path d="M 89 45 L 93 45 L 94 38 L 91.5 43 L 89 38 Z" fill="#c0a060"/>
        {/* 虎纹标记 */}
        <path d="M 38 15 L 40 10 L 42 15" stroke="#c0a060" strokeWidth="1.5" fill="none" opacity="0.8"/>
        <path d="M 58 15 L 60 10 L 62 15" stroke="#c0a060" strokeWidth="1.5" fill="none" opacity="0.8"/>
      </>
    ),
  },

  // 妲己·魅惑之狐（狐狸红粉）
  daji: {
    body: '#1a0a0a',
    belly: '#ffe8ee',
    bgGlow: 'rgba(255, 100, 130, 0.25)',
    accessory: (
      <>
        {/* 粉红围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#ff6b8a"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#ff6b8a"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#ff6b8a"/>
        {/* 狐狸耳朵 */}
        <path d="M 30 18 Q 22 4 32 2 Q 36 10 38 18 Z" fill="#ff6b8a"/>
        <path d="M 30 18 Q 24 8 32 6 Q 34 12 36 18 Z" fill="#ffe8ee"/>
        <path d="M 70 18 Q 78 4 68 2 Q 64 10 62 18 Z" fill="#ff6b8a"/>
        <path d="M 70 18 Q 76 8 68 6 Q 66 12 64 18 Z" fill="#ffe8ee"/>
        {/* 发簪 */}
        <rect x="60" y="1" width="2" height="18" fill="#ffd700"/>
        <circle cx="61" cy="1" r="3" fill="#e74c3c"/>
        <circle cx="63" cy="5" r="1.5" fill="#ff6b8a"/>
        {/* 九尾（左右各部分） */}
        <path d="M 10 55 Q 2 45 8 35 Q 10 45 14 50 Q 4 42 6 30 Q 12 42 14 55" fill="#ff6b8a" opacity="0.7"/>
        <path d="M 90 55 Q 98 45 92 35 Q 90 45 86 50 Q 96 42 94 30 Q 88 42 86 55" fill="#ff6b8a" opacity="0.7"/>
        {/* 妖狐眼线 */}
        <path d="M 26 30 Q 32 26 38 30" stroke="#ff6b8a" strokeWidth="1.5" fill="none"/>
        <path d="M 62 30 Q 68 26 74 30" stroke="#ff6b8a" strokeWidth="1.5" fill="none"/>
        {/* 爱心（装饰） */}
        <path d="M 78 70 Q 80 67 82 70 Q 84 73 80 76 Q 76 73 78 70" fill="#ff6b8a" opacity="0.8"/>
      </>
    ),
  },

  // 小乔·千纸鹤（樱花粉嫩少女风）
  xiaoqiao: {
    body: '#1a0a10',
    belly: '#fff0f5',
    bgGlow: 'rgba(255, 182, 193, 0.3)',
    accessory: (
      <>
        {/* 樱花粉围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#ffb7c5"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#ffb7c5"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#ffb7c5"/>
        {/* 双马尾蝴蝶结 */}
        <path d="M 20 20 Q 16 14 22 12 Q 20 18 26 16 Q 22 12 28 14 Q 24 20 20 20 Z" fill="#ff9eb5"/>
        <path d="M 80 20 Q 84 14 78 12 Q 80 18 74 16 Q 78 12 72 14 Q 76 20 80 20 Z" fill="#ff9eb5"/>
        <circle cx="20" cy="20" r="2.5" fill="#ffd6e0"/>
        <circle cx="80" cy="20" r="2.5" fill="#ffd6e0"/>
        {/* 千纸鹤发饰 */}
        <path d="M 42 4 Q 50 0 58 4 Q 54 8 50 6 Q 46 8 42 4 Z" fill="#ffb7c5"/>
        <path d="M 46 4 Q 50 2 54 4 Q 50 7 46 4 Z" fill="#ffd6e0"/>
        {/* 飘落的樱花 */}
        <circle cx="18" cy="35" r="3" fill="#ffb7c5" opacity="0.7"/>
        <circle cx="82" cy="42" r="2" fill="#ffc0cb" opacity="0.6"/>
        <circle cx="76" cy="28" r="2.5" fill="#ffb7c5" opacity="0.5"/>
        <circle cx="22" cy="55" r="2" fill="#ffd6e0" opacity="0.5"/>
        {/* 扇子（右侧） */}
        <path d="M 78 55 Q 88 48 92 58 Q 88 62 78 60 Z" fill="#ffb7c5" opacity="0.85"/>
        <path d="M 78 55 Q 85 52 88 56" stroke="#ff9eb5" strokeWidth="1" fill="none"/>
        <path d="M 78 57 Q 85 54 89 58" stroke="#ff9eb5" strokeWidth="1" fill="none"/>
        {/* 腮红 */}
        <ellipse cx="28" cy="42" rx="6" ry="4" fill="#ffb7c5" opacity="0.5"/>
        <ellipse cx="72" cy="42" rx="6" ry="4" fill="#ffb7c5" opacity="0.5"/>
      </>
    ),
  },

  // 瑶·仙鹤（仙白清冷仙女风）
  yao: {
    body: '#0d1a2e',
    belly: '#f0f8ff',
    bgGlow: 'rgba(173, 216, 230, 0.3)',
    accessory: (
      <>
        {/* 冰蓝围巾 */}
        <ellipse cx="50" cy="52" rx="30" ry="7" fill="#a8d8ea"/>
        <rect x="34" y="50" width="28" height="5" rx="2" fill="#a8d8ea"/>
        <path d="M 56 52 Q 66 58 63 70 Q 60 64 56 58" fill="#a8d8ea"/>
        {/* 仙鹤羽冠 */}
        <path d="M 50 2 Q 44 8 42 16 Q 50 10 58 16 Q 56 8 50 2 Z" fill="#f0f8ff"/>
        <path d="M 50 2 Q 47 9 50 12 Q 53 9 50 2 Z" fill="#a8d8ea"/>
        {/* 仙鹤翎羽（两侧） */}
        <path d="M 22 18 Q 10 12 14 22 Q 18 20 22 26 Q 18 18 22 18 Z" fill="#f0f8ff" opacity="0.9"/>
        <path d="M 78 18 Q 90 12 86 22 Q 82 20 78 26 Q 82 18 78 18 Z" fill="#f0f8ff" opacity="0.9"/>
        {/* 玉佩（左侧垂坠） */}
        <circle cx="12" cy="60" r="4" fill="none" stroke="#a8d8ea" strokeWidth="1.5"/>
        <circle cx="12" cy="60" r="2" fill="#a8d8ea" opacity="0.6"/>
        <line x1="12" y1="52" x2="12" y2="56" stroke="#a8d8ea" strokeWidth="1"/>
        {/* 仙法光球（右侧） */}
        <circle cx="86" cy="58" r="6" fill="#a8d8ea" opacity="0.25"/>
        <circle cx="86" cy="58" r="3.5" fill="#a8d8ea" opacity="0.4"/>
        <circle cx="86" cy="58" r="1.5" fill="#ffffff" opacity="0.8"/>
        {/* 星光点缀 */}
        <circle cx="16" cy="30" r="1.5" fill="#a8d8ea" opacity="0.8"/>
        <circle cx="84" cy="28" r="1" fill="#ffffff" opacity="0.9"/>
        <circle cx="80" cy="38" r="1.5" fill="#a8d8ea" opacity="0.7"/>
        <circle cx="20" cy="44" r="1" fill="#f0f8ff" opacity="0.8"/>
        {/* 莲花纹（胸前） */}
        <path d="M 44 65 Q 50 60 56 65 Q 50 70 44 65 Z" fill="#a8d8ea" opacity="0.4"/>
      </>
    ),
  },
}

// 心情表情配置
const moodConfig: Record<PenguinMood, {
  eyeScaleY: number
  mouthPath: string
  blushOpacity: number
  wingRotate: number
}> = {
  happy: { eyeScaleY: 1, mouthPath: 'M 38 48 Q 50 56 62 48', blushOpacity: 0.4, wingRotate: 8 },
  excited: { eyeScaleY: 1.1, mouthPath: 'M 36 46 Q 50 60 64 46', blushOpacity: 0.7, wingRotate: 15 },
  thinking: { eyeScaleY: 0.8, mouthPath: 'M 42 50 Q 50 52 58 50', blushOpacity: 0.2, wingRotate: 3 },
  cool: { eyeScaleY: 0.9, mouthPath: 'M 38 50 L 62 50', blushOpacity: 0, wingRotate: 12 },
  love: { eyeScaleY: 1.2, mouthPath: 'M 36 46 Q 50 58 64 46 Q 50 54 36 46', blushOpacity: 0.9, wingRotate: 20 },
}

const moodEmojis: Record<PenguinMood, string> = {
  happy: '😊',
  excited: '🎉',
  thinking: '🤔',
  cool: '😎',
  love: '💕',
}

// 装扮名称（用于显示）
export const outfitNames: Record<PenguinOutfit, string> = {
  default: '经典',
  cyber: '赛博',
  festival: '节日',
  star: '星际',
  winter: '冰雪',
  sport: '运动',
  ocean: '沙滩',
  panda: '熊猫',
  royal: '皇家',
  libai: '李白·谪仙',
  change: '嫦娥·月神',
  wukong: '孙悟空·齐天',
  dianwei: '典韦·虎痴',
  daji: '妲己·九尾',
  xiaoqiao: '小乔·千纸鹤',
  yao: '瑶·仙鹤',
}

export function PenguinQ({
  size = 80,
  outfit = 'default',
  mood = 'happy',
  animated = true,
  className = '',
  onClick,
  showBubble,
  floating = false,
  clickable = false,
}: PenguinQProps) {
  const [blink, setBlink] = useState(false)
  const [clickAnim, setClickAnim] = useState(false)
  const [loveHeart, setLoveHeart] = useState(false)

  const config = outfitConfig[outfit]
  const pose = moodConfig[mood]

  // 眨眼
  useEffect(() => {
    if (!animated) return
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 2500 + Math.random() * 1500)
    return () => clearInterval(blinkInterval)
  }, [animated])

  // 爱心效果
  useEffect(() => {
    if (mood === 'love' && animated) {
      const heartInterval = setInterval(() => {
        setLoveHeart(true)
        setTimeout(() => setLoveHeart(false), 1000)
      }, 2000)
      return () => clearInterval(heartInterval)
    }
  }, [mood, animated])

  const handleClick = () => {
    if (!onClick) return
    setClickAnim(true)
    setTimeout(() => setClickAnim(false), 400)
    onClick()
  }

  const floatAnimation = floating ? { y: [0, -10, 0], rotate: [-3, 3, -3] } : {}
  const floatTransition = floating ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const } : {}

  const clickBounce = clickAnim ? {
    scale: [1, 0.85, 1.15, 0.95, 1.05, 1] as number[],
    y: [0, -6, 0, -3, 0] as number[],
  } : {}

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size + (showBubble ? 40 : 0) }}>
      {/* 气泡 */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
          >
            <div className="bg-white text-gray-800 text-xs px-3 py-1.5 rounded-2xl rounded-bl-sm shadow-lg font-medium max-w-[160px] text-center leading-tight">
              {showBubble}
              <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white rotate-45 rounded-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          ...floatAnimation,
          ...(clickAnim ? clickBounce : {}),
        }}
        transition={{
          ...floatTransition,
          ...(clickAnim ? { duration: 0.4 } : {}),
        }}
        onClick={handleClick}
        style={{
          cursor: onClick || clickable ? 'pointer' : 'default',
          width: size,
          height: size,
          filter: config.bgGlow ? `drop-shadow(0 0 8px ${config.bgGlow})` : undefined,
        }}
        className="relative"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 脚 */}
          <ellipse cx="35" cy="92" rx="12" ry="6" fill={BASE.foot} />
          <ellipse cx="65" cy="92" rx="12" ry="6" fill={BASE.foot} />
          <ellipse cx="35" cy="91" rx="10" ry="4" fill="#ffb86c" />
          <ellipse cx="65" cy="91" rx="10" ry="4" fill="#ffb86c" />

          {/* 身体 */}
          <ellipse cx="50" cy="62" rx="35" ry="32" fill={config.body} />

          {/* 肚子 */}
          <ellipse cx="50" cy="68" rx="24" ry="22" fill={config.belly} />

          {/* 翅膀 */}
          <ellipse
            cx="18" cy="58"
            rx="10" ry="16"
            fill={config.body}
            transform={`rotate(${-pose.wingRotate} 18 58)`}
          />
          <ellipse
            cx="82" cy="58"
            rx="10" ry="16"
            fill={config.body}
            transform={`rotate(${pose.wingRotate} 82 58)`}
          />

          {/* 头 */}
          <circle cx="50" cy="35" r="28" fill={config.body} />

          {/* 脸部白色区域 */}
          <ellipse cx="50" cy="40" rx="20" ry="18" fill={config.belly} />

          {/* 装扮配件 */}
          {config.accessory}

          {/* 左眼 */}
          {outfit !== 'panda' && (
            <g transform={`translate(38, 32) scale(1, ${blink ? 0.1 : pose.eyeScaleY})`}>
              <ellipse cx="0" cy="0" rx="8" ry="9" fill={BASE.eye} />
              <ellipse cx="1" cy="1" rx="5" ry="6" fill={BASE.pupil} />
              <circle cx="3" cy="-2" r="2" fill={BASE.eye} />
            </g>
          )}

          {/* 右眼 */}
          {outfit !== 'panda' && (
            <g transform={`translate(62, 32) scale(1, ${blink ? 0.1 : pose.eyeScaleY})`}>
              <ellipse cx="0" cy="0" rx="8" ry="9" fill={BASE.eye} />
              <ellipse cx="1" cy="1" rx="5" ry="6" fill={BASE.pupil} />
              <circle cx="3" cy="-2" r="2" fill={BASE.eye} />
            </g>
          )}

          {/* 腮红（非熊猫） */}
          {outfit !== 'panda' && (
            <>
              <ellipse cx="30" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity={pose.blushOpacity} />
              <ellipse cx="70" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity={pose.blushOpacity} />
            </>
          )}

          {/* 嘴巴 */}
          <path d={pose.mouthPath} stroke={BASE.beak} strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="48" rx="8" ry="5" fill={BASE.beak} opacity="0.8" />
        </svg>

        {/* 心情emoji */}
        {animated && (
          <motion.div
            className="absolute -top-1 -right-1 text-sm"
            animate={{
              scale: [1, 1.2, 1],
              rotate: mood === 'love' ? [0, 10, -10, 0] : [-5, 5, -5]
            }}
            transition={{
              duration: mood === 'love' ? 1.5 : 2,
              repeat: Infinity
            }}
          >
            {moodEmojis[mood]}
          </motion.div>
        )}

        {/* 爱心飘出 */}
        <AnimatePresence>
          {loveHeart && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0 }}
              animate={{ opacity: 0, y: -30, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 text-lg"
            >
              💕
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

interface FloatingPenguinProps {
  outfit?: PenguinOutfit
  mood?: PenguinMood
  onTap?: () => void
  bubble?: string
  position?: 'bottom-right' | 'bottom-left'
}

export function FloatingPenguin({ outfit = 'default', mood = 'happy', onTap, bubble, position = 'bottom-right' }: FloatingPenguinProps) {
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    if (bubble) {
      const timer = setTimeout(() => setShowBubble(true), 1000)
      const hideTimer = setTimeout(() => setShowBubble(false), 5000)
      return () => { clearTimeout(timer); clearTimeout(hideTimer) }
    }
  }, [bubble])

  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4'

  return (
    <motion.div
      className={`absolute bottom-24 ${positionClass} z-40`}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
    >
      <PenguinQ
        size={64}
        outfit={outfit}
        mood={mood}
        floating={true}
        animated={true}
        onClick={onTap}
        showBubble={showBubble ? bubble : undefined}
      />
    </motion.div>
  )
}
