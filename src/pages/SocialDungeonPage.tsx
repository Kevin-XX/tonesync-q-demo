import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Trophy, Target, Gift, Swords, Crown, Star, Zap, MessageCircle } from 'lucide-react'
import { PenguinQ } from '../components/PenguinQ'

interface SocialDungeonPageProps {
  onBack: () => void
}

interface Team {
  id: string
  name: string
  theme: string
  emoji: string
  members: { name: string; avatar: string; score: number }[]
  totalScore: number
  rank: number
  status: 'active' | 'inviting'
}

interface LeaderboardEntry {
  rank: number
  teamName: string
  emoji: string
  score: number
  change: 'up' | 'down' | 'same'
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: '游戏搭子',
    theme: '开黑冲段位',
    emoji: '🎮',
    members: [
      { name: '小王', avatar: '王', score: 850 },
      { name: '小明', avatar: '明', score: 720 },
      { name: '你', avatar: '我', score: 680 },
    ],
    totalScore: 2250,
    rank: 2,
    status: 'active'
  },
  {
    id: '2',
    name: '学习小队',
    theme: '每日打卡',
    emoji: '📚',
    members: [
      { name: '小红', avatar: '红', score: 950 },
      { name: '小李', avatar: '李', score: 880 },
    ],
    totalScore: 1830,
    rank: 4,
    status: 'inviting'
  },
  {
    id: '3',
    name: '吃货联盟',
    theme: '探店美食',
    emoji: '🍜',
    members: [
      { name: '小芳', avatar: '芳', score: 1100 },
      { name: '老张', avatar: '张', score: 980 },
      { name: '阿杰', avatar: '杰', score: 850 },
    ],
    totalScore: 2930,
    rank: 1,
    status: 'active'
  },
]

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, teamName: '吃货联盟', emoji: '🍜', score: 2930, change: 'same' },
  { rank: 2, teamName: '游戏搭子', emoji: '🎮', score: 2250, change: 'up' },
  { rank: 3, teamName: '健身达人', emoji: '💪', score: 2100, change: 'down' },
  { rank: 4, teamName: '学习小队', emoji: '📚', score: 1830, change: 'up' },
  { rank: 5, teamName: '音乐之友', emoji: '🎵', score: 1650, change: 'same' },
]

const tasks = [
  { id: '1', title: '发起群聊互动', desc: '在任意群聊发送消息', reward: 20, progress: 1, total: 1, emoji: '💬' },
  { id: '2', title: '回复好友消息', desc: '回复5位好友的消息', reward: 30, progress: 3, total: 5, emoji: '👋' },
  { id: '3', title: '邀请好友组队', desc: '邀请1位好友加入小队', reward: 50, progress: 0, total: 1, emoji: '🤝' },
  { id: '4', title: '发布空间动态', desc: '发布1条带图动态', reward: 25, progress: 1, total: 1, emoji: '📸' },
]

export function SocialDungeonPage({ onBack }: SocialDungeonPageProps) {
  const [activeTab, setActiveTab] = useState<'teams' | 'rank' | 'tasks'>('teams')
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set(['1']))

  const handleJoinTeam = (teamId: string) => {
    setJoinedTeams(prev => new Set([...prev, teamId]))
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e]">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2.5 flex items-center">
        <button onClick={onBack} className="p-1.5 -ml-1">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Swords className="w-4 h-4 text-yellow-300" />
          <span className="text-white font-bold text-[16px]">社交副本</span>
        </div>
      </div>

      {/* 小Q引导 */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <PenguinQ size={48} outfit="star" mood="excited" animated={true} />
            </motion.div>
            <div>
              <p className="text-[13px] font-bold text-white mb-1">社交副本 · 与好友一起玩！</p>
              <p className="text-[11px] text-purple-300">组队协作、排行榜竞争、完成团队任务</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab切换 */}
      <div className="px-3 pt-3 flex gap-2">
        {[
          { id: 'teams' as const, label: '兴趣小队', icon: Users },
          { id: 'rank' as const, label: '排行榜', icon: Trophy },
          { id: 'tasks' as const, label: '团队任务', icon: Target },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/10 text-purple-300'
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
          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <p className="text-[11px] text-purple-400 font-medium">🎯 推荐小队</p>
              {mockTeams.map((team, i) => {
                const isJoined = joinedTeams.has(team.id)
                
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10"
                  >
                    {/* 队伍头部 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{team.emoji}</span>
                        <div>
                          <p className="text-[14px] font-bold text-white">{team.name}</p>
                          <p className="text-[10px] text-purple-300">{team.theme}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <Crown className="w-3 h-3 text-yellow-400" />
                        <span className="text-[11px] font-bold text-yellow-400">#{team.rank}</span>
                      </div>
                    </div>

                    {/* 成员 */}
                    <div className="flex items-center gap-2 mb-3">
                      {team.members.map((member, mi) => (
                        <div key={mi} className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {member.avatar}
                          </div>
                          {mi === 2 && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#12B7F5] flex items-center justify-center text-[6px] text-white font-bold">
                              你
                            </div>
                          )}
                        </div>
                      ))}
                      <span className="text-[10px] text-purple-300 ml-2">+{team.members.length}人</span>
                    </div>

                    {/* 队伍积分 */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-purple-300">团队积分</span>
                        <p className="text-[16px] font-bold text-white">{team.totalScore.toLocaleString()}</p>
                      </div>
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>

                    {/* 操作 */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !isJoined && handleJoinTeam(team.id)}
                      disabled={isJoined}
                      className={`w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 ${
                        isJoined
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      {isJoined ? (
                        <><MessageCircle className="w-4 h-4" /> 进入小队</>
                      ) : (
                        <><Gift className="w-4 h-4" /> 加入小队</>
                      )}
                    </motion.button>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'rank' && (
            <motion.div
              key="rank"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2"
            >
              <p className="text-[11px] text-purple-400 font-medium mb-3">🏆 本周小队排行</p>
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white/10 backdrop-blur rounded-xl p-3 flex items-center gap-3 ${
                    entry.rank <= 3 ? 'border border-yellow-500/30' : 'border border-white/10'
                  }`}
                >
                  {/* 排名 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500 text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-orange-400 text-white' :
                    'bg-white/20 text-purple-300'
                  }`}>
                    {entry.rank}
                  </div>

                  {/* 队伍 */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <p className="text-[13px] font-bold text-white">{entry.teamName}</p>
                      <div className="flex items-center gap-1">
                        {entry.change === 'up' && <Zap className="w-2.5 h-2.5 text-green-400" />}
                        {entry.change === 'down' && <Zap className="w-2.5 h-2.5 text-red-400 rotate-180" />}
                        <span className={`text-[9px] ${
                          entry.change === 'up' ? 'text-green-400' :
                          entry.change === 'down' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {entry.change === 'up' ? '上升' : entry.change === 'down' ? '下降' : '持平'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 积分 */}
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-white">{entry.score.toLocaleString()}</p>
                    <p className="text-[9px] text-purple-300">积分</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <p className="text-[11px] text-purple-400 font-medium">📋 团队任务</p>
              {tasks.map((task, i) => {
                const progress = task.progress / task.total
                const isComplete = task.progress >= task.total
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${
                        isComplete ? 'bg-green-500/20' : 'bg-purple-500/20'
                      }`}>
                        {task.emoji}
                      </div>
                      <div className="flex-1">
                        <p className={`text-[13px] font-bold ${isComplete ? 'text-green-400' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] text-purple-300">{task.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-yellow-400">
                          <Star className="w-3 h-3" />
                          <span className="text-[11px] font-bold">+{task.reward}</span>
                        </div>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isComplete ? 'bg-green-400' : 'bg-purple-400'}`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-purple-300">
                        {task.progress}/{task.total}
                      </span>
                    </div>
                  </motion.div>
                )
              })}

              {/* 奖励提示 */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="text-[12px] font-bold text-white">周榜奖励</span>
                </div>
                <p className="text-[11px] text-purple-300">本周前3名小队可获得：限定装扮碎片、额外经验值、荣誉徽章</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
