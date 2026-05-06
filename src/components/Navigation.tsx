import { motion } from 'framer-motion'
import { MessageCircle, Users, Sparkles, Heart, Home } from 'lucide-react'

type Page = 'home' | 'chat' | 'group' | 'social' | 'evolution'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems = [
  { id: 'home' as Page, label: '首页', icon: Home },
  { id: 'chat' as Page, label: '助手', icon: MessageCircle },
  { id: 'group' as Page, label: '群聊', icon: Users },
  { id: 'social' as Page, label: '触发', icon: Sparkles },
  { id: 'evolution' as Page, label: '养成', icon: Heart },
]

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* 顶部毛玻璃渐变 */}
      <div className="absolute inset-0 glass rounded-t-3xl border-b-0"></div>
      
      <div className="relative px-4 pt-3 pb-6 flex justify-between items-end">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center px-3 py-2 transition-all duration-300"
            >
              <motion.div
                className={`absolute -top-1 w-8 h-1 rounded-full ${isActive ? 'bg-qqBlue-400' : 'bg-transparent'}`}
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
              />
              
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-300 ${
                  isActive ? 'text-qqBlue-400 drop-shadow-[0_0_8px_rgba(18,183,245,0.5)]' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  isActive ? 'text-qqBlue-400 font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
