"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

interface SheepData {
  id: number
  container: HTMLDivElement | null
  element: HTMLDivElement | null
  currentX: number
  currentY: number
  currentFrame: number
  direction: number
  totalDistance: number
  isWalking: boolean
  isDragging: boolean
  isAutoWalking: boolean
  autoWalkInterval: NodeJS.Timeout | null
  color: string
  walkSpeed: number
  walkTimeout?: NodeJS.Timeout
}

export default function SheepPage() {
  const [allSheep, setAllSheep] = useState<SheepData[]>([])
  const [selectedSheep, setSelectedSheep] = useState<SheepData | null>(null)
  const [catchCount, setCatchCount] = useState(0)
  const sceneRef = useRef<HTMLDivElement>(null)
  
  const sheepCount = 7
  // 基础大小增加到2.3倍
  const baseFrameWidth = 64 * 2.3  // 147.2px
  const baseFrameHeight = 64 * 2.3 // 147.2px
  const [frameWidth, setFrameWidth] = useState(baseFrameWidth)
  const [frameHeight, setFrameHeight] = useState(baseFrameHeight)
  const frameDistance = 10
  
  const dragOffset = useRef({ x: 0, y: 0 })

  // 动态调整小羊大小
  const adjustSheepSize = () => {
    const screenWidth = window.innerWidth
    let scaleFactor = 1
    
    if (screenWidth <= 480) {
      scaleFactor = 0.8 // 超小屏幕稍微小一点
    } else if (screenWidth <= 768) {
      scaleFactor = 1.0 // 平板保持基础大小
    } else if (screenWidth <= 1200) {
      scaleFactor = 1.2 // 中等屏幕稍大
    } else {
      scaleFactor = 1.4 // 大屏幕更大
    }
    
    const newFrameWidth = baseFrameWidth * scaleFactor
    const newFrameHeight = baseFrameHeight * scaleFactor
    
    setFrameWidth(newFrameWidth)
    setFrameHeight(newFrameHeight)
    
    console.log(`屏幕宽度: ${screenWidth}px, 缩放因子: ${scaleFactor}, 小羊大小: ${newFrameWidth}x${newFrameHeight}`)
    
    return { width: newFrameWidth, height: newFrameHeight, scaleFactor }
  }

  // 初始化小羊
  useEffect(() => {
    if (!sceneRef.current) return
    
    // 初始调整小羊大小
    adjustSheepSize()
    
    // 延迟初始化，确保DOM完全加载
    const timer = setTimeout(() => {
      createSheep()
    }, 100)
    
    // 窗口大小变化监听
    const handleResize = () => {
      // 重新调整小羊大小
      const { width: newWidth, height: newHeight } = adjustSheepSize()
      
      // 重新调整小羊位置，确保不超出边界
      allSheep.forEach(sheepData => {
        if (sheepData.currentX > window.innerWidth - newWidth) {
          sheepData.currentX = window.innerWidth - newWidth
          updateSheepPosition(sheepData)
        }
        
        // 更新小羊元素的大小
        if (sheepData.element) {
          sheepData.element.style.width = newWidth + 'px'
          sheepData.element.style.height = newHeight + 'px'
          // 按照原始HTML的逻辑：背景大小应该按frameWidth的缩放比例来设置
          const baseFrameSize = 64 // 原始HTML中的基础帧大小
          const scaleFactor = newWidth / baseFrameSize
          const bgWidth = 512 * scaleFactor // 512是原始背景宽度
          const bgHeight = 128 * scaleFactor // 128是原始背景高度
          sheepData.element.style.backgroundSize = `${bgWidth}px ${bgHeight}px`
          sheepData.element.style.backgroundPosition = '0 0'
          
          sheepData.element.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      // 清理定时器
      allSheep.forEach(sheep => {
        if (sheep.autoWalkInterval) {
          clearInterval(sheep.autoWalkInterval)
        }
      })
    }
  }, []) // 移除allSheep依赖，避免无限循环

  // 创建小羊
  const createSheep = () => {
    if (!sceneRef.current) {
      console.log('Scene ref not available')
      return
    }
    
    console.log('Creating sheep...')
    
    // 清除现有小羊
    const existingContainers = sceneRef.current.querySelectorAll('.sheep-container')
    existingContainers.forEach(container => container.remove())
    
    const newSheep: SheepData[] = []
    
    for (let i = 0; i < sheepCount; i++) {
      console.log(`Creating sheep ${i + 1}`)
      
      const container = document.createElement('div')
      container.className = 'sheep-container'
      container.style.position = 'absolute'
      container.style.bottom = '0'
      container.style.zIndex = '10'
      
      const randomX = Math.random() * (window.innerWidth - frameWidth)
      container.style.left = randomX + 'px'
      container.style.transition = 'none'
      
      const sheepElement = document.createElement('div')
      sheepElement.className = 'sheep'
      sheepElement.style.width = frameWidth + 'px'
      sheepElement.style.height = frameHeight + 'px'
      sheepElement.style.backgroundImage = "url('/sheep/image.png')"
      sheepElement.style.backgroundRepeat = 'no-repeat'
      // 按照原始HTML的逻辑：背景大小应该按frameWidth的缩放比例来设置
      // 原始：frameWidth=64px 对应 backgroundSize=512x128px
      // 现在：frameWidth=147.2px 对应 backgroundSize=1177.6x294.4px
      const baseFrameSize = 64 // 原始HTML中的基础帧大小
      const scaleFactor = frameWidth / baseFrameSize
      const bgWidth = 512 * scaleFactor // 512是原始背景宽度
      const bgHeight = 128 * scaleFactor // 128是原始背景高度
      sheepElement.style.backgroundSize = `${bgWidth}px ${bgHeight}px`
      sheepElement.style.backgroundPosition = '0 0'
      sheepElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      sheepElement.style.cursor = 'grab'
      sheepElement.style.transition = 'transform 0.1s ease'
      sheepElement.style.userSelect = 'none'
      sheepElement.style.display = 'block'
      
      console.log(`小羊${i + 1}创建: frameWidth=${frameWidth}, scaleFactor=${scaleFactor.toFixed(2)}, 背景大小=${bgWidth.toFixed(1)}x${bgHeight.toFixed(1)}px`)
      
      container.appendChild(sheepElement)
      sceneRef.current.appendChild(container)
      
      const sheepData: SheepData = {
        id: i,
        container: container,
        element: sheepElement,
        currentX: randomX,
        currentY: 0,
        currentFrame: 0,
        direction: 1,
        totalDistance: 0,
        isWalking: false,
        isDragging: false,
        isAutoWalking: false,
        autoWalkInterval: null,
        color: `hue-rotate(${i * 60}deg)`,
        walkSpeed: 4.5 + Math.random() * 4
      }
      
      sheepElement.style.filter += ` ${sheepData.color}`
      
      // 添加事件监听
      sheepElement.addEventListener('mousedown', (e) => {
        startDraggingSheep(e, sheepData)
      })
      
      sheepElement.addEventListener('touchstart', (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        startDraggingSheep({
          preventDefault: () => {},
          clientX: touch.clientX,
          clientY: touch.clientY
        } as MouseEvent, sheepData)
      })
      
      newSheep.push(sheepData)
      updateSheepFrame(sheepData)
      
      // 延迟启动自动行走，确保DOM更新完成
      setTimeout(() => {
        startAutoWalkSheep(sheepData)
      }, 100 + i * 50)
      
      console.log(`Sheep ${i + 1} created and added to DOM`)
    }
    
    setAllSheep(newSheep)
    if (newSheep.length > 0) {
      setSelectedSheep(newSheep[0])
    }
    
    console.log(`Total sheep created: ${newSheep.length}`)
  }

  // 更新小羊动画帧
  const updateSheepFrame = (sheepData: SheepData) => {
    if (!sheepData.element) return

    // 从元素实际样式获取当前的帧宽高
    const currentFrameWidth = parseFloat(sheepData.element.style.width);
    const currentFrameHeight = parseFloat(sheepData.element.style.height);

    if (isNaN(currentFrameWidth) || isNaN(currentFrameHeight) || currentFrameWidth === 0 || currentFrameHeight === 0) {
        console.error(`小羊${sheepData.id}的元素尺寸无效: ${sheepData.element.style.width}, ${sheepData.element.style.height}`);
        return;
    }
    
    const row = sheepData.isDragging ? 1 : 0 // 0为走路，1为拖拽
    const frameX = -(sheepData.currentFrame * currentFrameWidth)
    const frameY = -(row * currentFrameHeight)
    
    sheepData.element.style.backgroundPosition = `${frameX}px ${frameY}px`
    // 修复方向逻辑：direction === 1 时向右（不翻转），direction === -1 时向左（翻转）
    sheepData.element.style.transform = sheepData.direction === 1 ? 'scaleX(-1)' : 'scaleX(1)'
    
    // 获取当前背景大小用于调试
    const currentBgSize = sheepData.element.style.backgroundSize
    console.log(`小羊${sheepData.id}动画更新: 帧=${sheepData.currentFrame}, 行=${row}, 位置=${frameX}px ${frameY}px, 拖拽=${sheepData.isDragging}, currentFrameWidth=${currentFrameWidth}, currentFrameHeight=${currentFrameHeight}, 背景大小=${currentBgSize}`)
  }

  // 更新小羊位置
  const updateSheepPosition = (sheepData: SheepData) => {
    if (!sheepData.container) return
    
    sheepData.container.style.left = sheepData.currentX + 'px'
    sheepData.container.style.bottom = sheepData.currentY + 'px'
  }

  // 开始拖拽小羊
  const startDraggingSheep = (e: MouseEvent, sheepData: SheepData) => {
    e.preventDefault()
    setSelectedSheep(sheepData)
    sheepData.isDragging = true
    sheepData.currentFrame = 0 // 重置到拖拽动画的第一帧
    sheepData.totalDistance = 0 // 重置总距离
    if (sheepData.element) {
      sheepData.element.classList.add('dragging')
      sheepData.element.style.cursor = 'grabbing'
    }
    stopAutoWalkSheep(sheepData)
    
    if (sheepData.element) {
      const rect = sheepData.element.getBoundingClientRect()
      dragOffset.current.x = e.clientX - rect.left
      dragOffset.current.y = e.clientY - rect.top
    }
    
    // 立即切换到拖拽动画（下排）第一帧
    updateSheepFrame(sheepData)
    setCatchCount(prev => prev + 1)
    
    console.log('开始拖拽小羊:', sheepData.id, '总抓羊次数:', catchCount + 1, '切换到拖拽动画第一帧')
  }

  // 停止自动行走
  const stopAutoWalkSheep = (sheepData: SheepData) => {
    if (sheepData.autoWalkInterval) {
      clearInterval(sheepData.autoWalkInterval)
      sheepData.autoWalkInterval = null
    }
    sheepData.isAutoWalking = false
  }

  // 开始自动行走
  const startAutoWalkSheep = (sheepData: SheepData) => {
    if (sheepData.autoWalkInterval) return
    
    sheepData.isAutoWalking = true
    sheepData.autoWalkInterval = setInterval(() => {
      const step = sheepData.walkSpeed // 只向右走
      
      // 向右移动
      sheepData.currentX += step
      
      // 检查右边界，从左边出现
      if (sheepData.currentX > window.innerWidth) {
        sheepData.currentX = -frameWidth
      }
      
      // 更新位置和动画
      sheepData.totalDistance += Math.abs(step)
      const frameStep = Math.floor(sheepData.totalDistance / frameDistance)
      sheepData.currentFrame = frameStep % 8
      sheepData.isWalking = true
      
      updateSheepPosition(sheepData)
      updateSheepFrame(sheepData)
    }, 30)
  }

  // 重新初始化单只小羊
  const reinitializeSheep = (sheepData: SheepData) => {
    // 停止所有动画和定时器
    stopAutoWalkSheep(sheepData)
    
    // 重置所有状态
    sheepData.isDragging = false
    sheepData.isWalking = false
    sheepData.isAutoWalking = false
    sheepData.currentFrame = 0
    sheepData.totalDistance = 0
    sheepData.direction = 1 // 重置为向右
    sheepData.currentY = 0 // 重置到地面
    
    // 重置位置到随机位置
    const randomX = Math.random() * (window.innerWidth - frameWidth)
    sheepData.currentX = randomX
    
    // 更新DOM位置
    if (sheepData.container) {
      sheepData.container.style.left = randomX + 'px'
      sheepData.container.style.bottom = '0px'
    }
    
    // 重置样式
    if (sheepData.element) {
      sheepData.element.classList.remove('dragging')
      sheepData.element.style.cursor = 'grab'
      sheepData.element.style.transform = 'scaleX(-1)' // 默认向右
    }
    
    // 更新动画帧到行走动画第一帧
    updateSheepFrame(sheepData)
    
    // 延迟启动自动行走，确保状态完全重置
    setTimeout(() => {
      startAutoWalkSheep(sheepData)
    }, 100)
    
    console.log(`小羊${sheepData.id}已重新初始化，位置: ${randomX.toFixed(1)}px`)
  }

  // 让小羊落回地面
  const dropSheepToGround = (sheepData: SheepData) => {
    const groundY = 0;
    // sheepData.currentX 是鼠标释放时的X坐标 (我们希望小羊在此处落地)
    // sheepData.isDragging 已经是 false, sheepData.currentFrame 已经是 0 (由 handleMouseUp 设置)
    // updateSheepFrame 也已在 handleMouseUp 中调用，视觉上已经是行走的第一帧

    // 如果小羊在空中一定高度以上，执行下落动画
    if (sheepData.currentY > groundY + 5) { // 使用一个小的阈值，例如5px
      let velocity = 0;
      const gravity = 0.8; // 使用现有的重力值
      const bounce = 0.6;  // 使用现有的弹跳系数
      let bounceCount = 0;

      const fallAnimation = () => {
        velocity += gravity;
        sheepData.currentY -= velocity; // 更新Y坐标

        if (sheepData.currentY <= groundY) { // 触地或穿过地面
          sheepData.currentY = groundY;    // 精确设置到地面

          if (Math.abs(velocity) > 2 && bounceCount < 3) { // 如果速度足够且弹跳次数未达上限
            velocity = -velocity * bounce; // 反向并衰减速度以实现弹跳
            bounceCount++;
            if (sheepData.container) { // 更新弹跳过程中的视觉位置
              sheepData.container.style.bottom = sheepData.currentY + 'px';
            }
            requestAnimationFrame(fallAnimation); // 继续下一帧弹跳动画
          } else { // 落地并停止弹跳
            if (sheepData.container) { // 确保最终Y坐标更新到DOM
              sheepData.container.style.bottom = groundY + 'px';
            }
            // 小羊的 isDragging, currentFrame 状态已由 handleMouseUp 设置好
            // 小羊的视觉也已通过 handleMouseUp 中的 updateSheepFrame 更新为行走第一帧
            startAutoWalkSheep(sheepData); // 从当前的X坐标，地面Y坐标开始行走
            return; // 结束坠落动画
          }
        } else { // 仍在下落过程中
          if (sheepData.container) {
            sheepData.container.style.bottom = sheepData.currentY + 'px';
          }
          requestAnimationFrame(fallAnimation); // 继续下一帧下落动画
        }
      };
      requestAnimationFrame(fallAnimation); // 开始下落动画
    } else { // 如果已经在地面附近或地面上
      sheepData.currentY = groundY; // 精确设置到地面
      if (sheepData.container) {
        sheepData.container.style.bottom = groundY + 'px';
      }
      // 状态和视觉已由 handleMouseUp 设置
      startAutoWalkSheep(sheepData); // 从当前的X坐标，地面Y坐标开始行走
    }
  };

  // 全局鼠标事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedSheep && selectedSheep.isDragging) {
        e.preventDefault()
        
        const newX = e.clientX - dragOffset.current.x
        const newY = e.clientY - dragOffset.current.y
        const bottomY = window.innerHeight - newY - frameHeight
        
        if (selectedSheep.container) {
          selectedSheep.container.style.left = newX + 'px'
          selectedSheep.container.style.bottom = bottomY + 'px'
        }
        
        selectedSheep.currentX = newX
        selectedSheep.currentY = bottomY
        
        // 更新动画帧 - 拖拽时也要更新帧数
        selectedSheep.totalDistance += 5
        selectedSheep.currentFrame = Math.floor(selectedSheep.totalDistance / frameDistance) % 8
        updateSheepFrame(selectedSheep)
      }
    }

    const handleMouseUp = () => {
      if (selectedSheep && selectedSheep.isDragging) {
        console.log('停止拖拽小羊:', selectedSheep.id)
        selectedSheep.isDragging = false
        selectedSheep.currentFrame = 0 // 重置动画帧到第一帧
        selectedSheep.totalDistance = 0 // 重置总距离
        if (selectedSheep.element) {
          selectedSheep.element.classList.remove('dragging')
          selectedSheep.element.style.cursor = 'grab'
        }
        // 立即更新一次动画帧，确保切换到行走动画的第一帧
        updateSheepFrame(selectedSheep)
        dropSheepToGround(selectedSheep)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [selectedSheep, frameHeight, frameDistance])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/sheep/WechatIMG1675.jpg')" }}
      />
      
      {/* 返回按钮 */}
      <Link 
        href="/"
        className="fixed top-6 left-4 md:left-6 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 rounded-full px-4 md:px-6 py-2 md:py-3 border-2 border-[#d4a5a0]/40 shadow-lg hover:shadow-xl"
      >
        <span className="text-[#a89688] font-medium text-sm md:text-base">← 返回首页</span>
      </Link>

      {/* 场景容器 */}
      <div ref={sceneRef} className="scene relative w-full h-screen min-h-screen">
        {/* 太阳元素被移除 */}

        {/* 云朵 */}
        <div className="clouds absolute top-0 w-full h-[40%] overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`cloud absolute opacity-85 animate-float`}
              style={{
                width: `${160 + i * 20}px`,
                height: `${100 + i * 15}px`,
                backgroundImage: `url('/sheep/cloud${((i - 1) % 3) + 1}.png')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                top: `${8 + (i % 3) * 10}%`,
                left: `-${200 + i * 20}px`,
                animationDelay: `${-i * 3}s`,
                animationDuration: `${18 + i * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* 抓羊计数器 */}
        <div className="catch-counter fixed top-20 right-6 md:right-20 bg-white/90 backdrop-blur-sm rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg border-2 border-green-200 z-50">
          <span className="text-xl md:text-2xl mr-2">🐑</span>
          <span className="text-base md:text-lg font-bold text-gray-700">
            抓到: <span className="text-green-600 text-lg md:text-xl">{catchCount}</span> 只
          </span>
        </div>
      </div>

      {/* CSS样式 */}
      <style jsx>{`
        .sheep {
          background-image: url('/sheep/image.png');
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          cursor: grab;
          transition: transform 0.1s ease;
          user-select: none;
        }

        .sheep:active {
          cursor: grabbing;
        }

        .sheep.dragging {
          z-index: 1000;
          transform: scale(1.1);
        }

        .sun::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent);
          border-radius: 50%;
        }

        @keyframes float {
          from { transform: translateX(0); }
          to { transform: translateX(calc(100vw + 150px)); }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .catch-counter:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0,0,0,0.15);
        }

        .catch-animation {
          animation: catchEffect 0.5s ease-out;
        }

        @keyframes catchEffect {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); background: rgba(76, 175, 80, 0.2); }
          100% { transform: scale(1); }
        }

        /* 响应式设计 - 移除固定大小，让JavaScript控制 */
        @media (max-width: 768px) {
          .catch-counter {
            top: 10px;
            right: 10px;
            padding: 12px 16px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
} 