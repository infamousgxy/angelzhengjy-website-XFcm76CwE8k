"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// 游戏常量
const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  SLOPE_ANGLE: 15,
  MOVEMENT_SPEED: 1.5,
  TREE_GENERATION_INTERVAL: 120,
  GRAVITY: 0.2,
  PLAYER_WIDTH: 32,
  PLAYER_HEIGHT: 32,
  OBSTACLE_WIDTH: 32,
  OBSTACLE_HEIGHT: 48
}

const COLORS = {
  sky: '#ffffff',
  snow: '#ffffff',
  skiTrail: '#e6f2ff'
}

const IMAGES = {
  PLAYER: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snowboarder-d8ooGdTTeqCc73t5hfW0TPLcqBEcmx.png",
  TREES: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_0-IiABkoy1TJgd2IK76dMoZKcBoSM3OV.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_1-PQuEzy4tGxrfIvvsOKN1x30qB7LxAZ.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_2-3emosJCVNsMc6SFLYBDexLwAjvMMcc.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_3-tCJCvnL001vtrqLkK4TxBhvwDljBAz.png"
  ],
  SNOWMEN: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_0-TCuDVs2e6275EeFLJgVZT2gG6xR8eW.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_1-1XU0CXxXygx3Tf6eGfSJhMcrv96ElE.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_2-5TfN4Fu4Jr2F9t91GlSdbqPFfPvupL.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_3-Lj63E3FyGim1kfm3G50zhSwi6zylMe.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_4-V6HRnct6cFbhVyfOx74b7CwzyGJ3la.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_5-m2NUZb2dgzRCPibAWx09MzpzNxYmLB.png"
  ]
}

const FONTS = {
  PIXEL: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
}

interface Obstacle {
  x: number
  y: number
  sprite: HTMLImageElement
}

interface Player {
  x: number
  y: number
  velocityY: number
  isMovingUp: boolean
  sprite: HTMLImageElement | null
}

interface TrailPoint {
  x: number
  y: number
}

// 温馨提醒弹窗组件
function WelcomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md mx-4 p-8 bg-white/95 backdrop-blur-xl rounded-3xl border-3 border-[#d4a5a0]/60 shadow-2xl animate-bounce-in">
        {/* 装饰性元素 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full border-2 border-white"></div>
        <div className="absolute -bottom-4 left-1/4 w-6 h-6 bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full border-2 border-white"></div>
        <div className="absolute -bottom-4 right-1/4 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#d4a5a0] rounded-full border-2 border-white"></div>
        
        <div className="text-center space-y-6">
          <div className="text-4xl mb-4">🌙✨</div>
          <h2 className="text-2xl font-bold text-[#a89688] font-serif">温馨提醒</h2>
          <p className="text-lg text-[#9a8d7d] leading-relaxed font-serif">
            早点睡觉，不要熬夜了，<br/>
            不生气了呢。💫
          </p>
          <p className="text-sm text-[#9a8d7d]/80 font-serif">
            愿你有个甜美的梦境 🌸
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl border-none font-serif"
          >
            知道了，开始游戏 🎿
          </button>
        </div>
      </div>
    </div>
  )
}

function SnowBored() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const hasShownWelcomeRef = useRef(false) // 用于记录是否已经显示过欢迎弹窗
  
  // 动态游戏尺寸状态
  const [gameSize, setGameSize] = useState({
    width: 800,
    height: 400,
    scale: 1
  })
  
  // 存储已加载的精灵
  const spritesRef = useRef<{
    treeSprites: HTMLImageElement[]
    snowmanSprites: HTMLImageElement[]
    getRandomObstacleSprite: () => HTMLImageElement
  } | null>(null)
  
  // 动态游戏常量
  const getDynamicConstants = () => {
    const scale = gameSize.scale
    return {
      CANVAS_WIDTH: gameSize.width,
      CANVAS_HEIGHT: gameSize.height,
      SLOPE_ANGLE: 15,
      MOVEMENT_SPEED: 1.5 * scale,
      TREE_GENERATION_INTERVAL: Math.floor(120 / scale),
      GRAVITY: 0.2 * scale,
      PLAYER_WIDTH: Math.floor(32 * scale),
      PLAYER_HEIGHT: Math.floor(32 * scale),
      OBSTACLE_WIDTH: Math.floor(32 * scale),
      OBSTACLE_HEIGHT: Math.floor(48 * scale)
    }
  }
  
  const gameStateRef = useRef({
    player: {
      x: 100,
      y: gameSize.height / 2,
      velocityY: 0,
      isMovingUp: false,
      sprite: null as HTMLImageElement | null
    },
    obstacles: [] as Obstacle[],
    trailPoints: [] as TrailPoint[],
    frameCount: 0,
    startTime: Date.now(),
    gameSpeedMultiplier: 1,
    obstacleGenerationInterval: 120,
    lastSpeedIncreaseTime: Date.now(),
    score: 0,
    isGameOver: false
  })

  // 计算适合的游戏尺寸
  const calculateGameSize = () => {
    const maxWidth = Math.min(window.innerWidth - 32, 800) // 减去padding
    const maxHeight = Math.min(window.innerHeight * 0.5, 400) // 最多占屏幕高度的50%
    
    // 保持16:8的宽高比
    const aspectRatio = 2
    let width = maxWidth
    let height = width / aspectRatio
    
    // 如果高度超过最大高度，则以高度为准
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    // 确保最小尺寸
    width = Math.max(width, 320)
    height = Math.max(height, 160)
    
    const scale = width / 800 // 相对于原始尺寸的缩放比例
    
    return { width: Math.floor(width), height: Math.floor(height), scale }
  }

  // 监听窗口尺寸变化
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculateGameSize()
      setGameSize(newSize)
      
      // 更新游戏状态中的玩家位置
      if (gameStateRef.current.player) {
        gameStateRef.current.player.y = newSize.height / 2
      }
    }

    // 初始化尺寸
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 重启游戏函数
  const restartGame = () => {
    const currentTime = Date.now()
    const constants = getDynamicConstants()
    
    // 重置游戏状态
    gameStateRef.current = {
      player: {
        x: 100 * gameSize.scale,
        y: gameSize.height / 2,
        velocityY: 0,
        isMovingUp: false,
        sprite: gameStateRef.current.player.sprite // 保持已加载的精灵
      },
      obstacles: [],
      trailPoints: [],
      frameCount: 0,
      startTime: currentTime, // 使用当前时间重置开始时间
      gameSpeedMultiplier: 1,
      obstacleGenerationInterval: constants.TREE_GENERATION_INTERVAL,
      lastSpeedIncreaseTime: currentTime, // 重置最后速度增加时间
      score: 0,
      isGameOver: false
    }
    
    // 重新生成初始障碍物
    if (spritesRef.current) {
      for (let i = 0; i < 6; i++) {
        gameStateRef.current.obstacles.push({
          x: Math.random() * gameSize.width,
          y: Math.random() * (gameSize.height - 100 * gameSize.scale) + 50 * gameSize.scale,
          sprite: spritesRef.current.getRandomObstacleSprite()
        })
      }
    }
    
    // 重置React状态
    setScore(0)
    setGameTime(0)
    setGameOver(false)
    // 不重置弹窗状态，因为我们不想再次显示弹窗
  }

  // 关闭欢迎弹窗的处理函数
  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
    hasShownWelcomeRef.current = true // 标记已经显示过弹窗
  }

  // 检查是否应该显示弹窗（只在第一次进入页面时显示）
  const shouldShowWelcomeModal = showWelcomeModal && !hasShownWelcomeRef.current

  // 鼠标和触摸事件处理
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = true
    }
  }

  const handlePointerUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = false
    }
  }

  // 处理鼠标离开canvas区域的情况
  const handlePointerLeave = () => {
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = false
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fontLink = document.createElement('link')
    fontLink.href = FONTS.PIXEL
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image() // 明确使用浏览器原生的Image构造函数
        img.crossOrigin = "anonymous"
        img.src = src
        img.onload = () => resolve(img)
        img.onerror = reject
      })
    }

    const loadObstacleSprites = async () => {
      const treeSprites = await Promise.all(IMAGES.TREES.map(loadImage))
      const snowmanSprites = await Promise.all(IMAGES.SNOWMEN.map(loadImage))
      return { treeSprites, snowmanSprites }
    }

    const initGame = async () => {
      const playerSprite = await loadImage(IMAGES.PLAYER)
      const { treeSprites, snowmanSprites } = await loadObstacleSprites()

      gameStateRef.current.player.sprite = playerSprite

      const getRandomObstacleSprite = () => {
        const useTree = Math.random() > 0.3
        const sprites = useTree ? treeSprites : snowmanSprites
        return sprites[Math.floor(Math.random() * sprites.length)]
      }

      // 保存精灵到ref中
      spritesRef.current = {
        treeSprites,
        snowmanSprites,
        getRandomObstacleSprite
      }

      for (let i = 0; i < 6; i++) {
        gameStateRef.current.obstacles.push({
          x: Math.random() * gameSize.width,
          y: Math.random() * (gameSize.height - 100 * gameSize.scale) + 50 * gameSize.scale,
          sprite: getRandomObstacleSprite()
        })
      }

      const drawBackground = () => {
        ctx.fillStyle = COLORS.sky
        ctx.fillRect(0, 0, gameSize.width, gameSize.height)
      }

      const drawPlayer = () => {
        const { player } = gameStateRef.current
        const constants = getDynamicConstants()
        
        if (player.sprite) {
          ctx.save()
          ctx.translate(player.x, player.y)
          
          if (gameStateRef.current.isGameOver) {
            ctx.rotate(-Math.PI / 2)
          }
          
          ctx.drawImage(
            player.sprite,
            -constants.PLAYER_WIDTH / 2,
            -constants.PLAYER_HEIGHT / 2,
            constants.PLAYER_WIDTH,
            constants.PLAYER_HEIGHT
          )
          ctx.restore()
        }
      }

      const drawObstacles = () => {
        const constants = getDynamicConstants()
        
        gameStateRef.current.obstacles.forEach(obstacle => {
          ctx.drawImage(
            obstacle.sprite,
            obstacle.x - constants.OBSTACLE_WIDTH / 2,
            obstacle.y - constants.OBSTACLE_HEIGHT,
            constants.OBSTACLE_WIDTH,
            constants.OBSTACLE_HEIGHT
          )
        })
      }

      const drawSkiTrail = () => {
        ctx.strokeStyle = COLORS.skiTrail
        ctx.lineWidth = 2 * gameSize.scale // 根据缩放调整线宽
        ctx.beginPath()
        gameStateRef.current.trailPoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }

      const drawUI = () => {
        const fontSize = Math.floor(16 * gameSize.scale)
        ctx.fillStyle = '#000000'
        ctx.font = `${fontSize}px "Press Start 2P"`
        
        const scoreText = `Score: ${gameStateRef.current.score}`
        const scoreWidth = ctx.measureText(scoreText).width
        ctx.fillText(scoreText, gameSize.width - scoreWidth - 20 * gameSize.scale, 30 * gameSize.scale)
        
        const currentTime = gameStateRef.current.isGameOver 
          ? gameTime 
          : Math.floor((Date.now() - gameStateRef.current.startTime) / 1000)
        const timeString = new Date(currentTime * 1000).toISOString().substr(14, 5)
        ctx.fillText(timeString, 20 * gameSize.scale, 30 * gameSize.scale)
      }

      const checkCollision = () => {
        const { player, obstacles } = gameStateRef.current
        const constants = getDynamicConstants()
        
        for (let obstacle of obstacles) {
          const dx = Math.abs(player.x - obstacle.x)
          const dy = Math.abs(player.y - obstacle.y)
          if (dx < constants.PLAYER_WIDTH / 2 && dy < constants.PLAYER_HEIGHT / 2) {
            return true
          }
        }
        return false
      }

      const updateGame = () => {
        if (gameStateRef.current.isGameOver) return

        const { player, obstacles, trailPoints } = gameStateRef.current
        const constants = getDynamicConstants()
        const currentTime = Date.now()
        
        if (currentTime - gameStateRef.current.lastSpeedIncreaseTime >= 2500) {
          gameStateRef.current.gameSpeedMultiplier += 0.05
          gameStateRef.current.obstacleGenerationInterval = Math.max(
            30 / gameSize.scale,
            gameStateRef.current.obstacleGenerationInterval - 5
          )
          gameStateRef.current.lastSpeedIncreaseTime = currentTime
        }

        if (player.isMovingUp) {
          player.velocityY = Math.max(player.velocityY - 0.2 * gameSize.scale, -constants.MOVEMENT_SPEED)
        } else {
          player.velocityY = Math.min(player.velocityY + constants.GRAVITY, constants.MOVEMENT_SPEED)
        }

        player.y += player.velocityY

        const minY = 50 * gameSize.scale
        const maxY = gameSize.height - 70 * gameSize.scale
        
        if (player.y < minY) player.y = minY
        if (player.y > maxY) player.y = maxY

        trailPoints.unshift({ x: player.x, y: player.y + 10 * gameSize.scale })
        if (trailPoints.length > 50) {
          trailPoints.pop()
        }

        gameStateRef.current.obstacles = obstacles.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - constants.MOVEMENT_SPEED * gameStateRef.current.gameSpeedMultiplier
        })).filter(obstacle => obstacle.x > -50 * gameSize.scale)

        gameStateRef.current.trailPoints = trailPoints.map(point => ({
          ...point,
          x: point.x - constants.MOVEMENT_SPEED * gameStateRef.current.gameSpeedMultiplier
        })).filter(point => point.x > 0)

        if (gameStateRef.current.frameCount % gameStateRef.current.obstacleGenerationInterval === 0) {
          gameStateRef.current.obstacles.push({
            x: gameSize.width + 50 * gameSize.scale,
            y: Math.random() * (gameSize.height - 100 * gameSize.scale) + 50 * gameSize.scale,
            sprite: spritesRef.current?.getRandomObstacleSprite() || gameStateRef.current.obstacles[0]?.sprite
          })
        }

        if (checkCollision()) {
          gameStateRef.current.isGameOver = true
          setGameOver(true)
          setGameTime(Math.floor((Date.now() - gameStateRef.current.startTime) / 1000))
          return
        }

        if (gameStateRef.current.frameCount % 60 === 0) {
          gameStateRef.current.score += 10
        }

        gameStateRef.current.frameCount++
      }

      const gameLoop = () => {
        ctx.clearRect(0, 0, gameSize.width, gameSize.height)
        
        drawBackground()
        drawSkiTrail()
        drawObstacles()
        drawPlayer()
        drawUI()
        
        if (!gameStateRef.current.isGameOver) {
          updateGame()
          setScore(gameStateRef.current.score)
        }
        
        requestAnimationFrame(gameLoop)
      }

      gameLoop()
    }

    initGame()

    return () => {
      // 清理函数，取消动画帧请求
      // 这里我们应该存储animationFrameId并在清理时取消
    }
  }, [gameSize]) // 移除依赖项，只在组件挂载时初始化一次

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-2 md:p-4"
      style={{
        backgroundImage: 'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ice-RFivzrFYklghXcbtYkoYiMiESh5rh5.png")',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* 温馨提醒弹窗 */}
      <WelcomeModal 
        isOpen={shouldShowWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      
      <h1 
        className={`text-xl md:text-4xl font-bold mb-2 md:mb-4 text-center ${gameOver ? 'text-red-500' : 'text-white'}`} 
        style={{ 
          fontFamily: '"Press Start 2P", cursive',
          fontSize: `${Math.max(16, 24 * gameSize.scale)}px`
        }}
      >
        {gameOver ? "It's Snow Over" : "We're Snow Back"}
      </h1>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={gameSize.width}
          height={gameSize.height}
          className="border-2 md:border-4 border-gray-700 rounded-lg cursor-pointer select-none shadow-lg"
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerLeave}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          style={{ 
            touchAction: 'none',
            maxWidth: '100vw',
            maxHeight: '50vh'
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 rounded-lg">
            <div className="text-white text-center">
              <button
                onClick={restartGame}
                className="px-3 md:px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-pixel transition-colors"
                style={{ 
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: `${Math.max(12, 16 * gameSize.scale)}px`
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <p 
        className="text-white mt-2 md:mt-4 text-center px-4"
        style={{ fontSize: `${Math.max(12, 14 * gameSize.scale)}px` }}
      >
        点击并按住游戏区域向上飞行
        <br />
        <span className="text-xs md:text-sm opacity-75">支持触摸操作</span>
      </p>
      
      {/* 游戏信息显示 */}
      <div className="mt-2 text-white text-center flex gap-4 md:gap-8">
        <div style={{ fontSize: `${Math.max(10, 12 * gameSize.scale)}px` }}>
          分数: {score}
        </div>
        {gameOver && (
          <div style={{ fontSize: `${Math.max(10, 12 * gameSize.scale)}px` }}>
            时间: {gameTime}s
          </div>
        )}
      </div>
    </div>
  )
}

export default function SkiingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 背景图片层 */}
      <div className="fixed inset-0 z-0 hero-background" />
      
      {/* 背景遮罩层 */}
      <div className="fixed inset-0 z-1 bg-gradient-to-br from-[#f3ede5]/60 via-[#e8e2db]/40 via-[#ede6dd]/50 to-[#f0e9e0]/60"></div>
      
      {/* 返回首页按钮 */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="group inline-flex items-center space-x-3 bg-white/70 backdrop-blur-xl hover:bg-white/90 px-6 py-3 rounded-full border-2 border-[#d4a5a0]/40 hover:border-[#d4a5a0]/60 transition-all duration-500 hover:scale-105 shadow-xl"
        >
          <div className="w-5 h-5 border-2 border-[#a89688] rounded-full group-hover:animate-pulse relative">
            <div className="absolute inset-1 bg-[#a89688] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-[#a89688] font-medium baroque-font">返回梦境</span>
        </Link>
      </div>
      
      {/* 标题区域 */}
      <div className="relative z-10 pt-28 pb-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-12 border-2 border-white/60 relative overflow-hidden">
            {/* 装饰元素 */}
            <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-2 border-[#b8c4a8] rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] transform rotate-45 opacity-60 animate-pulse"></div>
            <div className="absolute bottom-6 right-6 w-6 h-6 border-2 border-[#d4a5a0] rounded-full opacity-60 animate-pulse"></div>
            
            <h1 className="text-5xl md:text-6xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] to-[#c0b0a0] bg-clip-text mb-6">
              雪地滑翔梦境
            </h1>
            <p className="text-xl text-[#a89688]/90 max-w-3xl mx-auto leading-relaxed baroque-text-font">
              在雪花纷飞的梦境中，与Angel一起体验滑雪的优雅与速度，
              <br />
              避开雪人和树木，在纯白的世界里自由翱翔
            </p>
            
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="w-6 h-6 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full animate-bounce"></div>
              <div className="w-4 h-4 border-2 border-[#c8b8d5] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-6 h-6 bg-gradient-to-r from-[#d4a5a0] to-[#9a8d7d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 border-2 border-[#e5c8c5] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 游戏区域 */}
      <div className="relative z-10 pb-20">
        <SnowBored />
      </div>
      
      {/* 游戏说明 */}
      <div className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#d4a5a0]/30 relative">
            <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full opacity-60"></div>
            
            <h3 className="text-2xl font-bold baroque-title-font text-[#a89688] mb-6 text-center">
              游戏玩法
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">点击并按住游戏区域向上飞行</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">避开雪人和树木障碍</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">获得更高的分数</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 