import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessagesPage } from './pages/MessagesPage'
import { ContactsPage } from './pages/ContactsPage'
import { DynamicsPage } from './pages/DynamicsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ChatPage } from './pages/ChatPage'
import { GroupChatPage } from './pages/GroupChatPage'
import { QEvolutionPage } from './pages/QEvolutionPage'
import { SocialEventPage } from './pages/SocialEventPage'
import { ContentCreator } from './pages/ContentCreator'
import { RelationHealth } from './pages/RelationHealthPage'
import { TechArchitecture } from './pages/TechArchitecturePage'
import { VipCenter } from './pages/VipCenter'
import { SocialDungeonPage } from './pages/SocialDungeonPage'
import { InnovationHighlights } from './pages/InnovationHighlights'
import { QQTabBar } from './components/QQTabBar'
import { QQStatusBar } from './components/QQStatusBar'
import { GlobalFloatBall } from './components/GlobalFloatBall'
import { QStateProvider, useQState } from './contexts/QStateContext'
import { OnboardingGuide } from './components/OnboardingGuide'
import { SurpriseMoment, QActiveBubble } from './components/SurpriseMoment'
import { Toast, LoadingOverlay } from './components/OperationFeedback'

export type MainTab = 'messages' | 'contacts' | 'dynamics' | 'profile'
export type SubPage =
  | { type: 'chat'; friendName: string; friendAvatar: string; convId: string }
  | { type: 'groupchat'; groupName: string; groupId: string }
  | { type: 'evolution' }
  | { type: 'social-event' }
  | { type: 'content-creator' }
  | { type: 'relation-health' }
  | { type: 'tech-architecture' }
  | { type: 'vip-center' }
  | { type: 'social-dungeon' }
  | { type: 'innovations' }
  | null

// 会话数据类型
export interface ConversationState {
  id: string
  name: string
  avatar: string
  lastMsg: string
  time: string
  unread: number
  isGroup?: boolean
  isQSmall?: boolean
}

const initialConversations: Record<string, ConversationState> = {
  q: { id: 'q', name: '同频小Q', avatar: 'Q', lastMsg: '🎂 今天是你的生日！要不要给小芳发个消息？', time: '刚刚', unread: 1, isQSmall: true },
  jing: { id: 'jing', name: '小晶', avatar: '晶', lastMsg: '周末有空吗？想找你出去玩~', time: '14:21', unread: 2 },
  game: { id: 'game', name: '开黑交流群', avatar: '群', lastMsg: '[小明] 今天吃火锅？🔥', time: '12:30', unread: 99, isGroup: true },
  study: { id: 'study', name: '学习打卡群', avatar: '打', lastMsg: '[班长] 明天交作业，大家注意！', time: '10:15', unread: 3, isGroup: true },
  ming: { id: 'ming', name: '小明', avatar: '明', lastMsg: '已读', time: '昨天', unread: 0 },
  li: { id: 'li', name: '小李', avatar: '李', lastMsg: '游戏攻略我发你了', time: '昨天', unread: 0 },
  work: { id: 'work', name: '项目协作群', avatar: '项', lastMsg: '[你] 好的，明天见', time: '周一', unread: 0, isGroup: true },
}

export function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('messages')
  const [subPage, setSubPage] = useState<SubPage>(null)

  // 全局会话状态
  const [conversationMap, setConversationMap] = useState<Record<string, ConversationState>>(
    () => ({ ...initialConversations })
  )

  const updateConversation = useCallback((id: string, updates: Partial<ConversationState>) => {
    setConversationMap(prev => {
      if (!prev[id]) return prev
      return {
        ...prev,
        [id]: { ...prev[id], ...updates },
      }
    })
  }, [])

  // 计算Tab切换方向
  const tabOrder: MainTab[] = ['messages', 'contacts', 'dynamics', 'profile']
  const currentIdx = tabOrder.indexOf(activeTab)

  return (
    <QStateProvider>
      <AppContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subPage={subPage}
        setSubPage={setSubPage}
        tabOrder={tabOrder}
        currentIdx={currentIdx}
        conversationMap={conversationMap}
        updateConversation={updateConversation}
      />
    </QStateProvider>
  )
}

// 分离App内容组件以访问QState
function AppContent({
  activeTab,
  setActiveTab,
  subPage,
  setSubPage,
  tabOrder,
  currentIdx,
  conversationMap,
  updateConversation,
}: {
  activeTab: MainTab
  setActiveTab: (tab: MainTab) => void
  subPage: SubPage
  setSubPage: (page: SubPage) => void
  tabOrder: MainTab[]
  currentIdx: number
  conversationMap: Record<string, ConversationState>
  updateConversation: (id: string, updates: Partial<ConversationState>) => void
}) {
  const {
    isLoading,
    loadingMessage,
    onboardingStep,
    hasSeenOnboarding,
    startOnboarding,
    surpriseQueue,
    activeInteraction,
  } = useQState()

  const conversations = Object.values(conversationMap)

  const handleNavigate = useCallback((page: SubPage) => {
    // 清除对应会话的未读数
    if (page) {
      if (page.type === 'chat') {
        updateConversation(page.convId, { unread: 0 })
      } else if (page.type === 'groupchat') {
        updateConversation(page.groupId, { unread: 0 })
      }
    }
    setSubPage(page)
  }, [updateConversation, setSubPage])

  const renderMainPage = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <MessagesPage
            conversations={conversations}
            onNavigate={handleNavigate}
          />
        )
      case 'contacts':
        return <ContactsPage onNavigate={handleNavigate} />
      case 'dynamics':
        return <DynamicsPage onNavigate={handleNavigate} />
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />
      default:
        return (
          <MessagesPage
            conversations={conversations}
            onNavigate={handleNavigate}
          />
        )
    }
  }

  return (
    <>
      <div className="mobile-frame relative overflow-hidden bg-[#EDEDED]">
        {/* 动态岛 */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-[60] flex items-center justify-center">
          <div className="w-[8px] h-[8px] rounded-full bg-[#222] mr-3" />
          <div className="w-[60px] h-[18px] rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
            <div className="w-[6px] h-[6px] rounded-full bg-[#2d4a6b] mr-1" />
            <div className="w-[40px] h-[4px] rounded-full bg-[#0a1f3c]" />
          </div>
        </div>

        {/* iOS 状态栏 */}
        <QQStatusBar />

        {/* 主内容区 */}
        <div className="absolute inset-0 top-[44px]" style={{ bottom: subPage ? 0 : '56px' }}>
          {/* 主Tab页面 - 带方向滑动 */}
          <AnimatePresence mode="wait">
            {!subPage && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: currentIdx >= (tabOrder.indexOf(activeTab) || 0) ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentIdx >= (tabOrder.indexOf(activeTab) || 0) ? -30 : 30 }}
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                {renderMainPage()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 子页面 - 聊天/群聊/养成（全屏覆盖） */}
          <AnimatePresence>
            {subPage && (
              <motion.div
                key={subPage.type}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute inset-0 z-30"
              >
                {subPage.type === 'chat' && (
                  <ChatPage
                    friendName={subPage.friendName}
                    friendAvatar={subPage.friendAvatar}
                    convId={subPage.convId}
                    onBack={() => setSubPage(null)}
                    onUpdateConversation={updateConversation}
                  />
                )}
                {subPage.type === 'groupchat' && (
                  <GroupChatPage
                    groupName={subPage.groupName}
                    groupId={subPage.groupId}
                    onBack={() => setSubPage(null)}
                    onUpdateConversation={updateConversation}
                  />
                )}
                {subPage.type === 'evolution' && (
                  <QEvolutionPage onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'social-event' && (
                  <SocialEventPage onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'content-creator' && (
                  <ContentCreator onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'relation-health' && (
                  <RelationHealth onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'tech-architecture' && (
                  <TechArchitecture onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'vip-center' && (
                  <VipCenter onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'social-dungeon' && (
                  <SocialDungeonPage onBack={() => setSubPage(null)} />
                )}
                {subPage.type === 'innovations' && (
                  <InnovationHighlights onBack={() => setSubPage(null)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* QQ底部TabBar - 子页面时隐藏 */}
        <AnimatePresence>
          {!subPage && (
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-20"
            >
              <QQTabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 全局浮球 - 子页面隐藏 */}
        {!subPage && (
          <GlobalFloatBall onNavigate={handleNavigate} />
        )}
      </div>

      {/* 全局覆盖层 */}
      {/* 加载中遮罩 */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* Toast通知 */}
      <Toast />

      {/* 新手引导 */}
      {!hasSeenOnboarding && <OnboardingGuide />}

      {/* 惊喜时刻 */}
      {surpriseQueue.length > 0 && <SurpriseMoment />}

      {/* 小Q主动互动气泡 */}
      {activeInteraction && <QActiveBubble />}
    </>
  )
}
