import { motion } from 'framer-motion'
import type { MainTab } from '../App'

interface QQTabBarProps {
  activeTab: MainTab
  onTabChange: (tab: MainTab) => void
}

// QQ原版TabBar图标
const tabs: { id: MainTab; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    id: 'messages',
    label: '消息',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path
          d="M13 3C7.477 3 3 6.925 3 11.75C3 14.188 4.175 16.388 6.063 17.95L5.5 22L10 19.712C10.95 19.9 11.962 20 13 20C18.523 20 23 16.075 23 11.25C23 6.425 18.523 2.5 13 2.5"
          stroke={active ? '#12B7F5' : '#999'}
          strokeWidth="1.8"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M8 11h10M8 14h6" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'contacts',
    label: '联系人',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="9" r="4.5" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.8"/>
        <path d="M4 22C4 17.582 8.029 14 13 14C17.971 14 22 17.582 22 22" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="19" cy="9" r="3" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5" opacity="0.6"/>
        <path d="M22 16.5C23.5 17.3 24.5 18.5 25 20" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'dynamics',
    label: '动态',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.8"/>
        <path d="M13 4C13 4 10 8 10 13C10 18 13 22 13 22" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5"/>
        <path d="M13 4C13 4 16 8 16 13C16 18 13 22 13 22" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5"/>
        <path d="M4 13H22" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.5"/>
        <path d="M5.5 9H20.5M5.5 17H20.5" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.2" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: '我',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="10" r="5" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.8"/>
        <path d="M4 23C4 18.029 8.029 14 13 14C17.971 14 22 18.029 22 23" stroke={active ? '#12B7F5' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function QQTabBar({ activeTab, onTabChange }: QQTabBarProps) {
  return (
    <div className="bg-white border-t border-gray-200 flex items-center justify-around px-2 pt-2 pb-4" style={{ height: 56 }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 flex-1 relative"
          >
            {tab.icon(isActive)}
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#12B7F5]' : 'text-[#999]'}`}>
              {tab.label}
            </span>
            {/* 消息Tab红点 */}
            {tab.id === 'messages' && !isActive && (
              <div className="absolute top-0 right-4 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                3
              </div>
            )}
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute -bottom-2 w-8 h-[2px] bg-[#12B7F5] rounded-full"
                transition={{ type: 'spring', bounce: 0.2 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
