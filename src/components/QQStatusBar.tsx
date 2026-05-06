// 手机QQ真实状态栏 - P0-2: 实时时间 + 动态信号 + 渐变电池
import { useState, useEffect } from 'react'

function SignalBars() {
  // 随机信号强度（每10秒微变）
  const [bars, setBars] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Math.floor(Math.random() * 2) + 3) // 3~4格
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-end gap-[2px]">
      {[3, 5, 7, 9].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm transition-all duration-500"
          style={{
            height: h,
            opacity: i < bars ? 1 : 0.25,
            backgroundColor: i < bars ? 'white' : 'rgba(255,255,255,0.4)',
          }}
        />
      ))}
    </div>
  )
}

function Battery() {
  const [level, setLevel] = useState(78)

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => Math.max(prev - Math.floor(Math.random() * 2), 20))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const isLow = level < 20
  const fillColor = isLow ? '#ff4444' : `rgb(${Math.round(255 - level * 1.2)}, ${Math.round(level * 1.2)}, 80)`

  return (
    <div className="flex items-center gap-0.5">
      <div className="w-[22px] h-[12px] rounded-[2px] border border-white/80 relative overflow-hidden">
        <div
          className="absolute inset-0.5 right-1 rounded-[1px] transition-all duration-1000"
          style={{ width: `${level}%`, backgroundColor: fillColor }}
        />
        {isLow && <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[14px] h-[2px] bg-red-500 rotate-45 absolute" />
        </div>}
      </div>
      <div className="w-[2px] h-[6px] bg-white/60 rounded-r-sm" />
    </div>
  )
}

export function QQStatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const dayStr = `${hours}:${minutes}`

  return (
    <div className="absolute top-0 left-0 right-0 h-[44px] bg-[#12B7F5] flex items-center justify-between px-5 z-50">
      {/* 实时时间 */}
      <span className="text-white text-[13px] font-semibold tabular-nums">{dayStr}</span>
      <div className="flex items-center gap-1.5">
        <SignalBars />
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5 C8.6 9.5 9 9.9 9 10.5 C9 11.1 8.6 11.5 8 11.5 C7.4 11.5 7 11.1 7 10.5 C7 9.9 7.4 9.5 8 9.5Z" fill="white"/>
          <path d="M4.5 7 C5.7 5.8 7.3 5 8 5 C8.7 5 10.3 5.8 11.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M2 4.5 C4 2.5 6.5 1 8 1 C9.5 1 12 2.5 14 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
        </svg>
        <Battery />
      </div>
    </div>
  )
}
