"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BlindBox {
  id: number
  x: number
  y: number
  clickCount: number
  isOpened: boolean
  isShaking: boolean
  color: string
  giftName: string
}

interface ClickEffect {
  id: number
  x: number
  y: number
  timestamp: number
}

interface Snowflake {
  x: number
  y: number
  xVel: number
  yVel: number
  angle: number
  angleVel: number
  size: number
  sizeOsc: number
}

export default function BlindBoxPage() {
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const sceneRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 盲盒数据
  const boxData = [
    { color: '#E4A493', giftName: '神秘手办' },
    { color: '#C8B8D5', giftName: '限量徽章' },
    { color: '#B8C4A8', giftName: '特制贴纸' },
    { color: '#E5C8C5', giftName: '精美明信片' },
    { color: '#C0B0A0', giftName: '珍藏钥匙扣' },
    { color: '#D4C4A8', giftName: '梦幻小物件' }
  ]

  // 初始化盲盒
  useEffect(() => {
    const updateLayout = () => {
      const boxes: BlindBox[] = []
      const boxCount = 6
      
      // 响应式布局 - 大幅增加间距，避免打开时重叠
      const screenWidth = window.innerWidth
      let positions
      
      if (screenWidth < 768) {
        // 移动设备：2列3行，垂直布局
        positions = [
          { x: 20, y: 160 },   
          { x: 200, y: 160 },  
          { x: 20, y: 400 },   
          { x: 200, y: 400 },  
          { x: 20, y: 640 },   
          { x: 200, y: 640 },  
        ]
      } else if (screenWidth < 1024) {
        // 平板设备：2列3行，大间距
        positions = [
          { x: 80, y: 160 },   
          { x: 450, y: 160 },   
          { x: 80, y: 420 },   
          { x: 450, y: 420 },   
          { x: 80, y: 680 },   
          { x: 450, y: 680 },   
        ]
      } else {
        // 桌面设备：3列2行，超大间距
        positions = [
          { x: 80, y: 160 },   
          { x: 480, y: 160 },   
          { x: 880, y: 160 },   
          { x: 80, y: 520 },   
          { x: 480, y: 520 },   
          { x: 880, y: 520 },   
        ]
      }
      
      for (let i = 0; i < boxCount; i++) {
        boxes.push({
          id: i,
          x: positions[i].x,
          y: positions[i].y,
          clickCount: 0,
          isOpened: false,
          isShaking: false,
          color: boxData[i].color,
          giftName: boxData[i].giftName
        })
      }
      
      setBlindBoxes(boxes)
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    
    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

  // 雪花动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvas()
    window.addEventListener('resize', updateCanvas)

    // 初始化雪花
    const initialSnowflakes: Snowflake[] = []
    for (let i = 0; i < 50; i++) {
      initialSnowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        xVel: (Math.random() - 0.5) * 0.1,
        yVel: Math.random() * 0.2 + 0.05,
        angle: Math.random() * Math.PI * 2,
        angleVel: (Math.random() - 0.5) * 0.002,
        size: Math.random() * 5 + 7,
        sizeOsc: Math.random() * 0.5 + 0.01
      })
    }
    setSnowflakes(initialSnowflakes)

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      
      setSnowflakes(prevSnowflakes => 
        prevSnowflakes.map(snowflake => {
          const newSnowflake = { ...snowflake }
          
          newSnowflake.x += newSnowflake.xVel
          newSnowflake.y += newSnowflake.yVel
          newSnowflake.angle += newSnowflake.angleVel
          
          if (newSnowflake.y > canvas.height + 50 || 
              newSnowflake.x < -50 || 
              newSnowflake.x > canvas.width + 50) {
            newSnowflake.x = Math.random() * canvas.width
            newSnowflake.y = -50
            newSnowflake.xVel = (Math.random() - 0.5) * 0.1
            newSnowflake.yVel = Math.random() * 0.2 + 0.05
          }
          
          ctx.beginPath()
          ctx.arc(newSnowflake.x, newSnowflake.y, newSnowflake.size * 0.2, 0, Math.PI * 2)
          ctx.fill()
          
          return newSnowflake
        })
      )
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', updateCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = (e: MouseEvent) => {
      const newEffect: ClickEffect = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }
      setClickEffects(prev => [...prev, newEffect])

      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id))
      }, 2000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  // 盲盒点击处理
  const handleBoxClick = (box: BlindBox) => {
    if (box.isOpened) return
    
    setBlindBoxes(prev => 
      prev.map(b => {
        if (b.id === box.id) {
          const newClickCount = b.clickCount + 1
          const newIsShaking = true
          
          // 如果点击达到10次，打开盲盒
          if (newClickCount >= 10) {
            setTimeout(() => openBlindBox(b.id), 500)
            return { ...b, clickCount: newClickCount, isShaking: newIsShaking, isOpened: true }
          }
          
          // 添加抖动效果，300ms后停止
          setTimeout(() => {
            setBlindBoxes(prev2 => 
              prev2.map(b2 => 
                b2.id === b.id ? { ...b2, isShaking: false } : b2
              )
            )
          }, 300)
          
          return { ...b, clickCount: newClickCount, isShaking: newIsShaking }
        }
        return b
      })
    )
  }

  // 开启盲盒 - 移除礼花效果
  const openBlindBox = (boxId: number) => {
    const box = blindBoxes.find(b => b.id === boxId)
    if (!box) return
    
    // 不再创建礼花效果，只是简单的盲盒打开动画
    console.log(`盲盒 ${boxId} 已开启: ${box.giftName}`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f3ede5] via-[#e8e2db] to-[#ede6dd]">
      {/* 背景雪花 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none z-1">
        <div className="absolute top-20 left-10 w-20 h-20 opacity-20 animate-large-ornate-float">
          <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
            <div className="absolute inset-2 border-2 border-[#c8b8d5] rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 opacity-20 animate-large-ornate-float-delayed">
          <div className="w-full h-full bg-gradient-to-r from-[#c0b0a0] to-[#c8b8d5] transform rotate-45 relative">
            <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#e5c8c5] transform -rotate-45"></div>
          </div>
        </div>
      </div>

      {/* 魔法光标 */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-40 mix-blend-multiply"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transition: "all 0.1s ease-out",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] rounded-full animate-cursor-magic opacity-70"></div>
      </div>

      {/* 点击效果 */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: effect.x - 25,
            top: effect.y - 25,
          }}
        >
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] rounded-full animate-click-ripple opacity-70"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-[#e5c8c5] to-[#c0b0a0] rounded-full animate-click-pulse"></div>
            <div className="absolute inset-4 bg-white rounded-full animate-click-sparkle"></div>
          </div>
        </div>
      ))}

      {/* 导航 */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button 
            variant="outline" 
            className="backdrop-blur-xl bg-white/70 border-2 border-[#d4a5a0]/40 rounded-full px-6 py-3 text-[#9a8d7d] hover:bg-[#d4a5a0]/20 transition-all duration-300"
          >
            ← 返回首页
          </Button>
        </Link>
      </div>

      {/* 标题和说明 */}
      <div className="relative z-20 pt-20 pb-10 text-center">
        <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] to-[#c0b0a0] bg-clip-text mb-4 baroque-title-font">
          快来抽盲盒
        </h1>
        <p className="text-xl text-[#9a8d7d] baroque-script-font mb-4">
          每一个盲盒都蕴含着惊喜，点击10次即可开启
        </p>
        <div className="flex justify-center space-x-8 text-sm text-[#9a8d7d]">
          <div>🎁 选择你心仪的盲盒</div>
          <div>👆 连续点击10次</div>
          <div>🎉 享受惊喜时刻</div>
        </div>
      </div>

      {/* 盲盒场景 - 增加高度以适应新布局 */}
      <div 
        ref={sceneRef}
        className="relative z-10 min-h-[950px] mx-auto max-w-7xl px-4"
      >
        {blindBoxes.map((box) => (
          <div
            key={box.id}
            className={`absolute transition-all duration-300 cursor-pointer hover:scale-105 ${
              box.isShaking ? 'animate-shake' : ''
            } ${box.isOpened ? 'z-50' : 'z-20'}`}
            style={{
              left: box.x,
              top: box.y,
              transform: box.isOpened ? 'scale(1.1)' : 'scale(1)',
            }}
            onClick={() => handleBoxClick(box)}
          >
            {/* 使用真正的3D盲盒 */}
            <div className={`present ${box.isOpened ? 'open' : ''}`}>
              <div className="name" style={{ color: '#9a8d7d' }}>
                <b>Gift:</b> {box.giftName} <br/> 
                <b>From:</b> Angel
              </div>
              
              <div className="rotate-container">
                <div className="bottom" style={{ backgroundColor: box.color }}></div>
                <div className="front" style={{ backgroundColor: box.color }}></div>
                <div className="left" style={{ backgroundColor: box.color }}></div>
                <div className="back" style={{ backgroundColor: box.color }}></div>
                <div className="right" style={{ backgroundColor: box.color }}></div>
                
                <div className="lid">
                  <div className="lid-top" style={{ backgroundColor: box.color }}></div>
                  <div className="lid-front" style={{ backgroundColor: box.color }}></div>
                  <div className="lid-left" style={{ backgroundColor: box.color }}></div>
                  <div className="lid-back" style={{ backgroundColor: box.color }}></div>
                  <div className="lid-right" style={{ backgroundColor: box.color }}></div>
                </div>
              </div>
            </div>
            
            {/* 点击进度显示 */}
            {!box.isOpened && (
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <div className="bg-white/80 backdrop-blur rounded-full px-4 py-2 inline-block shadow-lg">
                  <div className="text-[#9a8d7d] font-bold text-sm mb-1">
                    {box.clickCount}/10
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] transition-all duration-300"
                      style={{ width: `${(box.clickCount / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 礼花效果已移除，盲盒开启后只显示3D动画 */}
    </div>
  )
} 