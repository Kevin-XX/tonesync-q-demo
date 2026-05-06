import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Vote, Bell, ChevronRight, ArrowLeft, MoreHorizontal, Calendar, MessageSquare } from 'lucide-react'

export function GroupManager() {
  const [showSummary, setShowSummary] = useState(false)

  const groupMessages = [
    { id: 1, user: '群主', text: '大家周末聚餐，投票啦！', time: '09:30', avatar: '主' },
    { id: 2, user: '小明', text: '火锅！必须火锅！🔥', time: '09:32', avatar: '明' },
    { id: 3, user: '小红', text: '我投烧烤，好久没吃了', time: '09:35', avatar: '红' },
    { id: 4, user: '小李', text: '发个新游戏攻略链接，大家看看', time: '09:40', avatar: '李' },
    { id: 5, user: '系统', text: '新群规已发布，请大家查看', time: '10:00', avatar: '规', isSystem: true },
    { id: 6, user: '系统', text: '今天是小明的生日🎂', time: '10:15', avatar: '日', isSystem: true },
  ]

  return (
    <motion.div
      className="flex-1 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 顶部导航 */}
      <div className="glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded-full hover:bg-slate-800/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="font-bold text-sm block leading-tight">开黑交流群</span>
            <span className="text-[10px] text-slate-400">128人 · 326条新消息</span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-800/50">
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* 群聊内容 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-24 relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
          <Users className="w-64 h-64" />
        </div>

        {groupMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: msg.id * 0.05 }}
            className="flex gap-3 items-start"
          >
            {!msg.isSystem ? (
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                msg.id % 2 === 0 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'
              } flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-lg`}>
                {msg.avatar}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${msg.isSystem ? 'text-qqBlue-400' : 'text-slate-300'}`}>
                  {msg.user}
                </span>
                <span className="text-[10px] text-slate-600">{msg.time}</span>
              </div>
              <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.isSystem 
                  ? 'bg-qqBlue-500/10 border border-qqBlue-500/20 text-qqBlue-200' 
                  : 'glass'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 召唤小Q按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSummary(!showSummary)}
          className="w-full py-3 mt-6 bg-gradient-to-r from-accent-purple to-qqBlue-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-qqBlue-500/20"
        >
          <Users className="w-4 h-4" />
          召唤同频小Q总结群聊
        </motion.button>
      </div>

      {/* 群聊摘要面板 */}
      <AnimatePresence>
        {showSummary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30"
              onClick={() => setShowSummary(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0.25 }}
              className="absolute bottom-20 left-0 right-0 z-40 max-h-[75%] overflow-y-auto no-scrollbar glass-card rounded-t-3xl border-b-0"
            >
              <div className="sticky top-0 px-5 py-4 bg-gradient-to-r from-accent-purple/20 to-qqBlue-500/20 border-b border-slate-700/50 flex items-center justify-between rounded-t-3xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <span className="font-bold">同频小Q 群聊摘要</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">326条消息</span>
              </div>

              <div className="p-5 space-y-6">
                {/* 投票区域 */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-accent-orange/20 flex items-center justify-center">
                      <Vote className="w-3.5 h-3.5 text-accent-orange" />
                    </div>
                    <h3 className="font-bold text-sm">待决策</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 space-y-4">
                    <p className="text-sm font-medium mb-3">周末聚餐地点投票</p>
                    {['火锅 🔥', '烧烤 🍢'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <div className="flex items-center gap-3 flex-1 mx-4">
                          <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: i === 0 ? '62%' : '38%' }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-qqBlue-500 to-qqBlue-400' : 'bg-gradient-to-r from-accent-orange to-orange-400'}`}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{i === 0 ? '5' : '3'}票</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2.5 rounded-xl bg-qqBlue-500/10 text-qqBlue-400 text-sm font-medium hover:bg-qqBlue-500/20 transition-colors border border-qqBlue-500/20">
                      帮我投火锅
                    </button>
                  </div>
                </section>

                {/* 重要信息 */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-accent-green/20 flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5 text-accent-green" />
                    </div>
                    <h3 className="font-bold text-sm">重要信息</h3>
                  </div>
                  <div className="space-y-2">
                    {['@群主 发布新群规（已置顶）', '@小李 分享游戏攻略链接'].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/30 flex items-start gap-3 border border-slate-700/30">
                        <ChevronRight className="w-4 h-4 text-qqBlue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 群事件 */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-accent-pink/20 flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5 text-accent-pink" />
                    </div>
                    <h3 className="font-bold text-sm">群事件</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-pink/10 to-accent-purple/10 border border-accent-pink/20">
                    <p className="text-sm font-medium mb-2">今天是 @小明 生日 🎂</p>
                    <button className="py-2 px-4 rounded-lg bg-accent-pink/20 text-accent-pink text-sm font-medium hover:bg-accent-pink/30 transition-colors flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      去祝福小明
                    </button>
                  </div>
                </section>

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-3 rounded-xl bg-slate-800/50 text-sm font-medium hover:bg-slate-800/80 transition-colors border border-slate-700/30">
                    查看完整详情
                  </button>
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="flex-1 py-3 rounded-xl bg-qqBlue-500/20 text-qqBlue-400 text-sm font-medium hover:bg-qqBlue-500/30 transition-colors border border-qqBlue-500/20"
                  >
                    标记已读
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
