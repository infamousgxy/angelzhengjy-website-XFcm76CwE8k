"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"

interface ClickEffect {
  id: number
  x: number
  y: number
  timestamp: number
}

interface MagicParticle {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

export default function AngelZhengJYWebsite() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [magicParticles, setMagicParticles] = useState<MagicParticle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // 添加滚动到指定section的函数
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  useEffect(() => {
    // Loading animation
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval)
          setTimeout(() => setIsLoaded(true), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

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
      setClickEffects((prev) => [...prev, newEffect])

      setTimeout(() => {
        setClickEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
      }, 2000)
    }

    // Generate magical particles
    const generateParticles = () => {
      const newParticles = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5,
        size: Math.random() * 3 + 1,
      }))
      setMagicParticles(newParticles)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    generateParticles()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      clearInterval(loadingInterval)
    }
  }, [])

  const scarfProducts = [
    {
      name: "晨光小兔",
      price: "¥398",
      description: "小白兔在晨光中跳跃，织入温柔的梦境色彩",
      image: "/images/scarf-rabbit.jpg",
    },
    {
      name: "星夜小鹿",
      price: "¥428",
      description: "星空下的小鹿轻盈漫步，诉说夜的浪漫秘密",
      image: "/images/scarf-deer.jpg",
    },
    {
      name: "花语小鸟",
      price: "¥368",
      description: "彩色小鸟在花丛中歌唱春天的甜美故事",
      image: "/images/scarf-bird.jpg",
    },
    {
      name: "月影小狐",
      price: "¥458",
      description: "月光下的小狐狸编织着银色的浪漫梦境",
      image: "/images/scarf-fox.jpg",
    },
  ]

  const ClickEffect = ({ effect }: { effect: ClickEffect }) => (
    <div
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
        <div className="absolute inset-1 border-2 border-[#d4c4a8] rounded-full animate-click-ornate opacity-60"></div>
      </div>
    </div>
  )

  const MagicParticle = ({ particle }: { particle: MagicParticle }) => (
    <div
      className="fixed pointer-events-none z-10"
      style={{
        left: particle.x,
        top: particle.y,
        animationDelay: `${particle.delay}s`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full animate-magical-float-particle opacity-50"></div>
    </div>
  )

  const LoadingScreen = () => (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#f3ede5] via-[#e8e2db] to-[#ede6dd] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 border-6 border-[#d4a5a0]/40 rounded-full animate-loading-spin"></div>
          <div className="absolute inset-4 border-4 border-[#c8b8d5] rounded-full animate-loading-spin-reverse"></div>
          <div className="absolute inset-8 border-2 border-[#b8c4a8] rounded-full animate-loading-pulse"></div>
          <div className="absolute inset-10 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full animate-loading-glow"></div>
          <div className="absolute inset-2 border border-[#d4c4a8] rounded-full animate-loading-ornate opacity-60"></div>
        </div>
        <h1 className="text-4xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] to-[#c0b0a0] bg-clip-text mb-4">
          AngelZhengJY
        </h1>
        <p className="text-xl baroque-script-font text-[#9a8d7d] mb-6">梦境正在编织中...</p>
        <div className="w-64 h-2 bg-[#e8e2db] rounded-full overflow-hidden border border-[#d4a5a0]/30">
          <div
            className="h-full bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] rounded-full transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-[#9a8d7d] mt-2">{loadingProgress}%</p>
      </div>
    </div>
  )

  if (!isLoaded) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3ede5] via-[#e8e2db] via-[#ede6dd] to-[#f0e9e0] relative overflow-x-hidden animate-page-entrance">
      {/* Enhanced Magic Cursor Trail */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-40 mix-blend-multiply"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transition: "all 0.1s ease-out",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] rounded-full animate-cursor-magic opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4c4a8] to-[#c4a898] rounded-full animate-cursor-orbit opacity-40"></div>
      </div>

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <ClickEffect key={effect.id} effect={effect} />
      ))}

      {/* Enhanced Particle System */}
      {magicParticles.map((particle) => (
        <MagicParticle key={particle.id} particle={particle} />
      ))}

      {/* Ornate Floating Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-20 h-20 opacity-20 animate-large-ornate-float">
          <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
            <div className="absolute inset-2 border-2 border-[#c8b8d5] rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
            <div className="absolute top-0 left-1/2 w-1 h-4 bg-[#d4c4a8] transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-4 bg-[#d4c4a8] transform -translate-x-1/2"></div>
          </div>
        </div>

        <div className="absolute top-40 right-20 w-16 h-16 opacity-20 animate-large-ornate-float-delayed">
          <div className="w-full h-full bg-gradient-to-r from-[#c0b0a0] to-[#c8b8d5] transform rotate-45 relative">
            <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#e5c8c5] transform -rotate-45"></div>
            <div className="absolute inset-4 border border-[#d4c4a8] transform -rotate-45"></div>
          </div>
        </div>

        <div className="absolute bottom-40 right-10 w-24 h-24 opacity-15 animate-large-ornate-spin">
          <div className="w-full h-full border-6 border-[#d4a5a0]/40 rounded-full relative">
            <div className="absolute top-0 left-1/2 w-2 h-8 bg-[#c8b8d5] transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-2 h-8 bg-[#c8b8d5] transform -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-8 h-2 bg-[#c8b8d5] transform -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-8 h-2 bg-[#c8b8d5] transform -translate-y-1/2"></div>
            <div className="absolute inset-4 border-2 border-[#b8c4a8] rounded-full"></div>
          </div>
        </div>

        {/* Additional ornate elements */}
        <div className="absolute top-32 left-20 w-12 h-12 opacity-30 animate-ornate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-[#d4a5a0] to-[#c8b8d5] transform rotate-12 rounded-lg relative">
            <div className="absolute inset-1 border border-[#d4c4a8] rounded-lg"></div>
          </div>
        </div>
        <div className="absolute top-52 right-32 w-10 h-10 opacity-30 animate-ornate-pulse-delayed">
          <div className="w-full h-full bg-gradient-to-br from-[#b8c4a8] to-[#c4a898] rounded-full relative">
            <div className="absolute inset-1 border border-[#d4c4a8] rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-60 right-20 w-18 h-18 opacity-25 animate-ornate-float">
          <div className="w-full h-full border-3 border-[#c8b8d5] transform rotate-45 relative">
            <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#e5c8c5] transform -rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-1000 animate-nav-entrance ${
          isScrolled ? "backdrop-blur-xl bg-white/70" : "backdrop-blur-lg bg-white/50"
        } rounded-full px-4 md:px-10 py-3 md:py-5 border-2 border-[#d4a5a0]/40 shadow-xl hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden max-w-[95vw]`}
      >
        {/* Ornate nav decoration */}
        <div className="absolute top-2 left-4 w-4 h-4 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full opacity-60 animate-nav-ornate"></div>
        <div className="absolute top-2 right-4 w-4 h-4 bg-gradient-to-r from-[#b8c4a8] to-[#d4c4a8] rounded-full opacity-60 animate-nav-ornate-delayed"></div>

        <div className="flex items-center space-x-3 md:space-x-10 overflow-x-auto scrollbar-hide">
          {[
            { name: "首页", id: "home" },
            { name: "精选丝巾", id: "products" },
            { name: "关于 Angel", id: "about" },
            { name: "灵感故事", id: "stories" },
            { name: "联系我们", id: "contact" },
          ].map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center space-x-2 md:space-x-3 text-[#a89688] hover:text-[#9a8d7d] transition-all duration-700 hover:scale-110 relative animate-nav-item whitespace-nowrap flex-shrink-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current rounded-full group-hover:animate-nav-icon-spin transition-all duration-700 relative">
                  <div className="absolute inset-0.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 border border-[#d4c4a8] rounded-full opacity-0 group-hover:opacity-60 animate-nav-icon-ornate"></div>
                </div>
              </div>
              <span className="text-sm md:text-base font-medium group-hover:animate-nav-text-wave tracking-wide baroque-font">
                {item.name}
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full"></div>
            </button>
          ))}
          
          {/* 快来数羊链接 */}
          <Link
            href="/sheep"
            className="group flex items-center space-x-2 md:space-x-3 text-[#a89688] hover:text-[#9a8d7d] transition-all duration-700 hover:scale-110 relative animate-nav-item whitespace-nowrap flex-shrink-0"
            style={{ animationDelay: `${5 * 0.1}s` }}
          >
            <div className="relative">
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current rounded-full group-hover:animate-nav-icon-spin transition-all duration-700 relative">
                <div className="absolute inset-0.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 border border-[#d4c4a8] rounded-full opacity-0 group-hover:opacity-60 animate-nav-icon-ornate"></div>
                {/* 小羊图标 */}
                <div className="absolute inset-1 text-xs flex items-center justify-center">🐑</div>
              </div>
            </div>
            <span className="text-sm md:text-base font-medium group-hover:animate-nav-text-wave tracking-wide baroque-font">
              快来数羊
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full"></div>
          </Link>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 animate-hero-entrance">
        {/* Enhanced Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-40 h-40 bg-gradient-to-r from-[#d4a5a0]/30 to-[#c8b8d5]/30 rounded-full blur-3xl animate-hero-orb-dance"></div>
          <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-gradient-to-r from-[#b8c4a8]/30 to-[#e5c8c5]/30 rounded-full blur-3xl animate-hero-orb-dance-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-[#c0b0a0]/25 to-[#c8b8d5]/25 rounded-full blur-3xl animate-hero-orb-pulse"></div>
        </div>

        <div className="text-center z-10 max-w-6xl mx-auto px-6">
          <div className="relative">
            {/* Enhanced Ornate Border - 移除旋转动画 */}
            <div className="absolute -inset-16 border-6 border-[#d4a5a0]/30 rounded-3xl"></div>
            <div className="absolute -inset-8 border-2 border-[#b8c4a8]/30 rounded-xl animate-hero-inner-glow"></div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-20 border-2 border-white/60 relative overflow-hidden animate-hero-content-entrance">
              {/* Enhanced Corner Decorations */}
              <div className="absolute top-6 left-6 w-12 h-12 opacity-50 animate-hero-corner-ornate">
                <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="absolute top-6 right-6 w-12 h-12 opacity-50 animate-hero-corner-ornate-delayed">
                <div className="w-full h-full bg-gradient-to-br from-[#b8c4a8] to-[#c0b0a0] transform rotate-45 relative">
                  <div className="absolute inset-2 border border-[#d4c4a8] transform -rotate-45"></div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 w-12 h-12 opacity-50 animate-hero-corner-ornate">
                <div className="w-full h-full border-3 border-[#c4a898] transform rotate-45 relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] transform -rotate-45"></div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 w-12 h-12 opacity-50 animate-hero-corner-ornate-delayed">
                <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#d4a5a0] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Enhanced Title */}
              <div className="relative mb-12 animate-title-entrance">
                <h1 className="text-7xl md:text-9xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] via-[#c0b0a0] to-[#a89688] bg-clip-text animate-title-symphony bg-size-200">
                  Angel
                </h1>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 animate-title-crown">
                  <div className="w-full h-full border-3 border-[#9a8d7d] rounded-full relative">
                    <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-1 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/4 w-6 h-6 animate-title-ornate">
                  <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] transform rotate-45 relative">
                    <div className="absolute inset-1 border border-[#d4c4a8] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 right-1/4 w-6 h-6 animate-title-ornate-delayed">
                  <div className="w-full h-full border-2 border-[#c8b8d5] rounded-full relative">
                    <div className="absolute inset-1 bg-[#d4a5a0] rounded-full"></div>
                  </div>
                </div>
              </div>

              <p className="text-2xl text-[#a89688]/90 max-w-4xl mx-auto leading-relaxed mb-10 baroque-text-font animate-description-entrance">
                在梦境与诗意的交织中，每一条丝巾都承载着色彩的疗愈力量，
                <br />
                融合东方侘寂的宁静与西方巴洛克的华丽，与小动物们共舞
              </p>

              <div className="flex items-center justify-center space-x-6 animate-icons-entrance">
                <div className="w-8 h-8 animate-hero-icon">
                  <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full relative">
                    <div className="absolute inset-1 border border-white rounded-full"></div>
                  </div>
                </div>
                <div className="w-8 h-8 animate-hero-icon-delayed">
                  <div className="w-full h-full border-2 border-[#c8b8d5] transform rotate-45 relative">
                    <div className="absolute inset-1 bg-[#d4a5a0] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="w-8 h-8 animate-hero-icon">
                  <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#9a8d7d] rounded-full"></div>
                </div>
                <div className="w-8 h-8 animate-hero-icon-delayed">
                  <div className="w-full h-full border-2 border-[#e5c8c5] rounded-full relative">
                    <div className="absolute inset-1 bg-gradient-to-r from-[#c8b8d5] to-[#b8c4a8] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="py-28 px-6 relative animate-section-entrance">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f3ede5]/70 via-transparent to-[#ede6dd]/70"></div>

        {/* Enhanced Section Ornaments */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-28 h-28 opacity-20 animate-section-ornament-grand">
            <div className="w-full h-full border-6 border-[#d4a5a0]/60 rounded-full relative">
              <div className="absolute inset-3 border-3 border-[#c8b8d5]/60 rounded-full"></div>
              <div className="absolute inset-6 bg-gradient-to-r from-[#b8c4a8]/60 to-[#e5c8c5]/60 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-1 h-6 bg-[#d4c4a8] transform -translate-x-1/2"></div>
            </div>
          </div>
          <div className="absolute bottom-20 right-20 w-24 h-24 opacity-20 animate-section-ornament-grand-delayed">
            <div className="w-full h-full bg-gradient-to-br from-[#c0b0a0]/60 to-[#c8b8d5]/60 transform rotate-45 relative">
              <div className="absolute inset-3 bg-gradient-to-br from-[#c8b8d5]/60 to-[#e5c8c5]/60 transform -rotate-45"></div>
              <div className="absolute inset-5 border border-[#d4c4a8] transform -rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 animate-products-header-entrance">
            <div className="relative inline-block">
              <h2 className="text-6xl md:text-7xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] via-[#c0b0a0] to-[#a89688] bg-clip-text animate-products-title-symphony bg-size-200 mb-8">
                精选丝巾
              </h2>
              <div className="absolute -top-6 -left-6 w-10 h-10 animate-products-title-ornate">
                <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-10 h-10 animate-products-title-ornate-delayed">
                <div className="w-full h-full border-3 border-[#c4a898] transform rotate-45 relative">
                  <div className="absolute inset-2 bg-[#e5c8c5] transform -rotate-45"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 animate-products-title-crown">
                <div className="w-full h-full border-3 border-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#d4a5a0] to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-[#9a8d7d] italic baroque-script-font animate-products-subtitle max-w-3xl mx-auto">
              每一款都是梦境的延续，小动物们的童话浪漫故事
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {scarfProducts.map((product, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-1000 hover:scale-105 hover:shadow-xl rounded-2xl cursor-pointer animate-product-card-entrance border-2 border-[#d4a5a0]/30 hover:border-[#c8b8d5]/50"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => {
                  const card = document.querySelector(`[data-product="${index}"]`)
                  if (card) {
                    card.classList.add("animate-product-click")
                    setTimeout(() => {
                      card.classList.remove("animate-product-click")
                    }, 600)
                  }
                }}
                data-product={index}
              >
                {/* Enhanced Magical Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#c8b8d5]/40 via-transparent to-[#e5c8c5]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-product-inner-glow"></div>

                {/* Enhanced Corner Decoration */}
                <div className="absolute top-4 right-4 z-20 w-8 h-8 group-hover:animate-product-ornate transition-all duration-700">
                  <div className="w-full h-full border-2 border-[#d4a5a0] rounded-full relative">
                    <div className="absolute inset-1 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>

                <div className="p-8 relative z-10">
                  <div className="relative mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-52 object-cover group-hover:scale-115 transition-transform duration-1000 aspect-square"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#d4a5a0]/30 via-transparent to-[#c8b8d5]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    {/* Enhanced Overlay Elements */}
                    <div className="absolute top-3 left-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-product-sparkle">
                      <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                    </div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-product-sparkle-delayed">
                      <div className="w-full h-full border border-white rounded-full"></div>
                    </div>
                    <div className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-product-crown">
                      <div className="w-full h-full border border-white transform rotate-45 relative">
                        <div className="absolute inset-1 bg-[#d4c4a8] transform -rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] to-[#9a8d7d] bg-clip-text mb-4 group-hover:animate-product-title-wave">
                    {product.name}
                  </h3>
                  <p className="text-[#9a8d7d] font-bold text-lg mb-4 group-hover:animate-product-price-dance">
                    {product.price}
                  </p>
                  <p className="text-[#9a8d7d] italic text-base leading-relaxed mb-8 baroque-text-font">
                    {product.description}
                  </p>

                  <Button className="w-full bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] via-[#b8c4a8] to-[#c4a898] hover:from-[#c4a898] hover:via-[#d4a5a0] hover:to-[#c8b8d5] text-white border-none group-hover:animate-product-button-symphony text-lg py-4 rounded-xl font-medium shadow-xl baroque-button-font transition-all duration-500 relative overflow-hidden">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 animate-button-heart">
                        <div className="w-full h-full bg-white rounded-full"></div>
                      </div>
                      <span>心动收藏</span>
                      <div className="w-5 h-5 animate-button-sparkle">
                        <div className="w-full h-full border border-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-button-shimmer"></div>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stories Section */}
      <section
        id="stories"
        className="py-28 px-6 bg-gradient-to-br from-[#f3ede5]/80 via-[#c8b8d5]/20 to-[#ede6dd]/80 relative animate-section-entrance"
      >
        {/* Enhanced Story Ornaments */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 opacity-25 animate-story-ornament-majestic">
            <div className="w-full h-full border-6 border-[#d4a5a0]/60 rounded-full relative">
              <div className="absolute inset-3 border-3 border-[#c8b8d5]/60 rounded-full"></div>
              <div className="absolute inset-6 bg-gradient-to-r from-[#b8c4a8]/60 to-[#e5c8c5]/60 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-1 h-8 bg-[#d4c4a8] transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-[#d4c4a8] transform -translate-x-1/2"></div>
            </div>
          </div>
          <div className="absolute top-40 right-20 w-24 h-24 opacity-25 animate-story-ornament-dance">
            <div className="w-full h-full bg-gradient-to-br from-[#c0b0a0]/60 to-[#c8b8d5]/60 transform rotate-45 relative">
              <div className="absolute inset-3 bg-gradient-to-br from-[#c8b8d5]/60 to-[#e5c8c5]/60 transform -rotate-45"></div>
              <div className="absolute inset-5 border border-[#d4c4a8] transform -rotate-45"></div>
            </div>
          </div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 opacity-25 animate-story-ornament-float">
            <div className="w-full h-full border-4 border-[#d4a5a0]/60 transform rotate-45 relative">
              <div className="absolute inset-2 border-2 border-[#c8b8d5]/60 transform -rotate-45"></div>
              <div className="absolute inset-4 bg-[#e5c8c5]/60 transform -rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24 animate-stories-header-entrance">
            <h2 className="text-6xl md:text-7xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#b8c4a8] via-[#9a8d7d] to-[#a89688] bg-clip-text animate-stories-title-symphony bg-size-200 mb-8">
              灵感故事
            </h2>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="w-10 h-10 animate-stories-ornate">
                <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="w-6 h-6 animate-stories-ornate-small">
                <div className="w-full h-full border-2 border-[#c4a898] transform rotate-45 relative">
                  <div className="absolute inset-1 bg-[#e5c8c5] transform -rotate-45"></div>
                </div>
              </div>
              <div className="w-6 h-6 animate-stories-ornate-small-delayed">
                <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#c8b8d5] rounded-full"></div>
              </div>
              <div className="w-6 h-6 animate-stories-ornate-small">
                <div className="w-full h-full border-2 border-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-1 bg-[#d4a5a0] rounded-full"></div>
                </div>
              </div>
              <div className="w-10 h-10 animate-stories-ornate-delayed">
                <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#c0b0a0] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#d4a5a0] to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-[#9a8d7d] italic baroque-script-font max-w-4xl mx-auto animate-stories-subtitle">
              每一款丝巾的设计灵感，来自一次星光下的散步、一朵梦里的花、一只可爱小动物的温柔眼神
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              {[
                {
                  title: "夜晚的灵感",
                  content:
                    "在夜晚，我看到星星像蝴蝶一样落在花瓣上，小白兔在月光下轻盈跳跃，那一刻的美好被我织进了丝巾的纹理中。",
                  gradient: "from-white/60 to-[#c8b8d5]/30",
                  border: "border-[#d4a5a0]/40",
                },
                {
                  title: "晨光的诗意",
                  content: "清晨的第一缕阳光透过窗纱，小鸟在枝头歌唱，在墙上投下温柔的影子，这份宁静成为了设计的源泉。",
                  gradient: "from-white/60 to-[#b8c4a8]/30",
                  border: "border-[#b8c4a8]/40",
                },
                {
                  title: "梦境的色彩",
                  content: "梦里的花园没有边界，小鹿在其中漫步，色彩自由流淌，我试图用丝巾捕捉那份无拘无束的美。",
                  gradient: "from-white/60 to-[#e5c8c5]/30",
                  border: "border-[#c8b8d5]/40",
                },
              ].map((story, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${story.gradient} backdrop-blur-sm border-2 ${story.border} p-10 rounded-2xl hover:scale-105 transition-all duration-700 cursor-pointer animate-story-card-entrance relative overflow-hidden`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                  onClick={() => {
                    const card = document.querySelector(`[data-story="${index}"]`)
                    if (card) {
                      card.classList.add("animate-story-click")
                      setTimeout(() => {
                        card.classList.remove("animate-story-click")
                      }, 800)
                    }
                  }}
                  data-story={index}
                >
                  {/* Enhanced story decorations */}
                  <div className="absolute top-4 right-4 w-6 h-6 opacity-40 animate-story-decoration">
                    <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                  </div>

                  <div className="flex items-start space-x-8">
                    <div className="relative">
                      <div className="w-14 h-14 animate-story-icon">
                        <div className="w-full h-full border-3 border-[#9a8d7d] rounded-full relative">
                          <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                          <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-[#9a8d7d]/20 rounded-full animate-story-aura blur-lg"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold baroque-title-font text-[#a89688] mb-4 flex items-center">
                        {story.title}
                        <div className="ml-3 w-6 h-6 animate-story-title-ornate">
                          <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
                        </div>
                      </h3>
                      <p className="text-[#9a8d7d] italic leading-relaxed text-lg baroque-text-font">{story.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative animate-stories-image-entrance">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4a5a0]/40 via-[#c8b8d5]/30 to-[#b8c4a8]/40 rounded-2xl blur-3xl animate-stories-image-aura"></div>
              <div className="relative z-10">
                <Image
                  src="/images/inspiration-main.jpg"
                  alt="Ornate Inspiration"
                  width={600}
                  height={700}
                  className="w-full rounded-2xl shadow-2xl border-4 border-white/60 object-cover"
                  style={{ aspectRatio: '6/7' }}
                />
                {/* Enhanced Floating Elements on Image */}
                <div className="absolute top-6 left-6 w-8 h-8 animate-stories-image-ornate">
                  <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full relative">
                    <div className="absolute inset-2 border border-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 w-10 h-10 animate-stories-image-ornate-delayed">
                  <div className="w-full h-full border-3 border-white rounded-full relative">
                    <div className="absolute inset-2 bg-gradient-to-r from-[#c4a898] to-[#e5c8c5] rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-6 h-6 animate-stories-image-sparkle">
                  <div className="w-full h-full border-2 border-white transform rotate-45 relative">
                    <div className="absolute inset-1 bg-[#d4c4a8] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 w-8 h-8 animate-stories-image-sparkle-delayed">
                  <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-28 px-6 relative animate-section-entrance">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative animate-about-portrait-entrance">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c8b8d5]/50 via-[#e5c8c5]/40 to-[#d4a5a0]/50 rounded-full blur-3xl animate-about-portrait-aura"></div>
              <div className="relative z-10">
                <Image
                  src="/images/angel-portrait.jpg"
                  alt="Angel Ornate Portrait"
                  width={600}
                  height={600}
                  className="w-full rounded-full shadow-2xl border-6 border-white/60 object-cover aspect-square"
                />
                {/* Enhanced Elements Around Portrait */}
                <div className="absolute top-10 left-10 w-12 h-12 animate-about-portrait-ornate">
                  <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
                    <div className="absolute inset-2 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="absolute top-10 right-10 w-10 h-10 animate-about-portrait-ornate-delayed">
                  <div className="w-full h-full bg-gradient-to-br from-[#b8c4a8] to-[#c0b0a0] transform rotate-45 relative">
                    <div className="absolute inset-2 border border-[#d4c4a8] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="absolute bottom-10 left-10 w-10 h-10 animate-about-portrait-ornate">
                  <div className="w-full h-full border-3 border-[#c4a898] transform rotate-45 relative">
                    <div className="absolute inset-2 bg-[#e5c8c5] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="absolute bottom-10 right-10 w-12 h-12 animate-about-portrait-ornate-delayed">
                  <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#d4a5a0] rounded-full relative">
                    <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 w-8 h-8 animate-about-portrait-sparkle">
                  <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#b8c4a8] rounded-full"></div>
                </div>
                <div className="absolute top-1/2 right-0 w-8 h-8 animate-about-portrait-sparkle-delayed">
                  <div className="w-full h-full border-2 border-[#d4a5a0] rounded-full relative">
                    <div className="absolute inset-1 bg-[#e5c8c5] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10 animate-about-content-entrance">
              <div className="relative">
                <h2 className="text-6xl md:text-7xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] via-[#c0b0a0] to-[#a89688] bg-clip-text animate-about-title-symphony bg-size-200 mb-10">
                  关于 Angel
                </h2>
                <div className="absolute -top-6 -left-6 w-12 h-12 animate-about-title-crown">
                  <div className="w-full h-full border-3 border-[#9a8d7d] rounded-full relative">
                    <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-10 h-10 animate-about-title-heart">
                  <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full relative">
                    <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-10 border-2 border-[#d4a5a0]/30 relative overflow-hidden">
                {/* Enhanced Decorative Elements */}
                <div className="absolute top-6 right-6 w-8 h-8 animate-about-content-ornate">
                  <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
                    <div className="absolute inset-2 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 w-8 h-8 animate-about-content-ornate-delayed">
                  <div className="w-full h-full bg-gradient-to-br from-[#b8c4a8] to-[#c0b0a0] transform rotate-45 relative">
                    <div className="absolute inset-2 border border-[#d4c4a8] transform -rotate-45"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 right-0 w-4 h-4 animate-about-content-sparkle">
                  <div className="w-full h-full bg-gradient-to-r from-[#c4a898] to-[#d4a5a0] rounded-full"></div>
                </div>

                <p className="text-xl text-[#9a8d7d] leading-relaxed mb-8 baroque-text-font">
                  你好，我是 Angel，喜欢用色彩讲故事，把柔软织进生活的缝隙。
                  我的丝巾不是配饰，而是一段段梦境的延续，每一只小动物都有自己的浪漫故事。
                </p>

                <p className="text-xl text-[#9a8d7d] leading-relaxed mb-10 baroque-text-font">
                  在东方侘寂的宁静中寻找内心的平和，在西方巴洛克的华丽中释放创作的激情。
                  每一次设计都是一场色彩的疗愈之旅，每一条丝巾都承载着温柔的力量和小动物们的祝福。
                </p>

                <div className="flex items-center justify-center space-x-8 text-[#a89688]">
                  <div className="w-8 h-8 animate-about-signature-ornate">
                    <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full relative">
                      <div className="absolute inset-2 border border-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 animate-about-signature-small">
                    <div className="w-full h-full border border-[#c4a898] rounded-full"></div>
                  </div>
                  <span className="italic font-bold text-xl baroque-script-font">愿每一份美好都能被温柔以待</span>
                  <div className="w-4 h-4 animate-about-signature-small-delayed">
                    <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 animate-about-signature-ornate-delayed">
                    <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#c0b0a0] rounded-full relative">
                      <div className="absolute inset-2 border border-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section
        id="contact"
        className="py-28 px-6 bg-gradient-to-br from-[#f3ede5]/90 via-[#c8b8d5]/30 to-[#ede6dd]/90 relative overflow-hidden animate-section-entrance"
      >
        {/* Enhanced Contact Ornaments */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-36 h-36 opacity-20 animate-contact-ornament-grand">
            <div className="w-full h-full border-8 border-[#d4a5a0]/60 rounded-full relative">
              <div className="absolute inset-4 border-4 border-[#c8b8d5]/60 rounded-full"></div>
              <div className="absolute inset-8 bg-gradient-to-r from-[#b8c4a8]/60 to-[#e5c8c5]/60 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-2 h-10 bg-[#d4c4a8] transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-10 bg-[#d4c4a8] transform -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-10 h-2 bg-[#d4c4a8] transform -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 w-10 h-2 bg-[#d4c4a8] transform -translate-y-1/2"></div>
            </div>
          </div>
          <div className="absolute bottom-20 right-20 w-32 h-32 opacity-20 animate-contact-ornament-grand-delayed">
            <div className="w-full h-full bg-gradient-to-br from-[#c0b0a0]/60 to-[#c8b8d5]/60 transform rotate-45 relative">
              <div className="absolute inset-4 bg-gradient-to-br from-[#c8b8d5]/60 to-[#e5c8c5]/60 transform -rotate-45"></div>
              <div className="absolute inset-6 border-2 border-[#d4c4a8] transform -rotate-45"></div>
            </div>
          </div>
          <div className="absolute top-1/2 right-10 w-24 h-24 opacity-20 animate-contact-ornament-flutter">
            <div className="w-full h-full border-6 border-[#d4a5a0]/60 transform rotate-45 relative">
              <div className="absolute inset-3 border-3 border-[#c8b8d5]/60 transform -rotate-45"></div>
              <div className="absolute inset-5 bg-[#e5c8c5]/60 transform -rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20 animate-contact-header-entrance">
            <h2 className="text-6xl md:text-7xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] via-[#c0b0a0] to-[#a89688] bg-clip-text animate-contact-title-symphony bg-size-200 mb-10">
              写信给我
            </h2>
            <div className="flex items-center justify-center space-x-10 mb-10">
              <div className="w-10 h-10 animate-contact-ornate">
                <div className="w-full h-full border-3 border-[#9a8d7d] rounded-full relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="w-6 h-6 animate-contact-ornate-small">
                <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
              </div>
              <div className="w-6 h-6 animate-contact-ornate-small-delayed">
                <div className="w-full h-full border-2 border-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-1 bg-[#d4a5a0] rounded-full"></div>
                </div>
              </div>
              <div className="w-6 h-6 animate-contact-ornate-small">
                <div className="w-full h-full bg-gradient-to-r from-[#c4a898] to-[#d4a5a0] rounded-full"></div>
              </div>
              <div className="w-10 h-10 animate-contact-ornate-delayed">
                <div className="w-full h-full border-3 border-[#e5c8c5] rounded-full relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#d4a5a0] to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-[#9a8d7d] italic baroque-script-font animate-contact-subtitle">
              分享你的故事，让我们一起编织美好，和小动物们成为朋友
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border-3 border-[#d4a5a0]/40 shadow-2xl rounded-2xl relative overflow-hidden animate-contact-form-entrance">
            {/* Enhanced Border Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] via-[#b8c4a8] via-[#e5c8c5] to-[#d4a5a0] opacity-20 animate-contact-border rounded-2xl"></div>

            <div className="p-14 relative z-10">
              {/* Enhanced Contact Decorations */}
              <div className="absolute top-8 left-8 w-10 h-10 animate-contact-form-ornate">
                <div className="w-full h-full border-3 border-[#d4a5a0] rounded-full relative">
                  <div className="absolute inset-2 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="absolute top-8 right-8 w-10 h-10 animate-contact-form-ornate-delayed">
                <div className="w-full h-full bg-gradient-to-br from-[#b8c4a8] to-[#c0b0a0] transform rotate-45 relative">
                  <div className="absolute inset-2 border border-[#d4c4a8] transform -rotate-45"></div>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 w-8 h-8 animate-contact-form-sparkle">
                <div className="w-full h-full bg-gradient-to-r from-[#c4a898] to-[#d4a5a0] rounded-full"></div>
              </div>
              <div className="absolute bottom-8 right-8 w-8 h-8 animate-contact-form-sparkle-delayed">
                <div className="w-full h-full border-2 border-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-1 bg-[#e5c8c5] rounded-full"></div>
                </div>
              </div>

              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative animate-contact-input-entrance">
                    <label className="block text-[#a89688] font-medium mb-4 text-xl baroque-title-font">姓名</label>
                    <Input
                      className="bg-white/80 border-3 border-[#d4a5a0]/60 focus:border-[#9a8d7d] rounded-xl py-5 text-lg backdrop-blur-sm hover:bg-white/90 transition-all duration-500 baroque-text-font hover:scale-105"
                      placeholder="请输入您的姓名"
                    />
                    <div className="absolute top-4 right-4 w-4 h-4 animate-contact-input-ornate">
                      <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full"></div>
                    </div>
                  </div>
                  <div className="relative animate-contact-input-entrance-delayed">
                    <label className="block text-[#a89688] font-medium mb-4 text-xl baroque-title-font">邮箱</label>
                    <Input
                      type="email"
                      className="bg-white/80 border-3 border-[#d4a5a0]/60 focus:border-[#9a8d7d] rounded-xl py-5 text-lg backdrop-blur-sm hover:bg-white/90 transition-all duration-500 baroque-text-font hover:scale-105"
                      placeholder="请输入您的邮箱"
                    />
                    <div className="absolute top-4 right-4 w-4 h-4 animate-contact-input-ornate-delayed">
                      <div className="w-full h-full border border-[#c4a898] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="relative animate-contact-textarea-entrance">
                  <label className="block text-[#a89688] font-medium mb-4 text-xl baroque-title-font">留言</label>
                  <Textarea
                    className="bg-white/80 border-3 border-[#d4a5a0]/60 focus:border-[#9a8d7d] rounded-xl min-h-[160px] text-lg backdrop-blur-sm hover:bg-white/90 transition-all duration-500 baroque-text-font hover:scale-105"
                    placeholder="分享您的想法或故事，告诉我您最喜欢的小动物..."
                  />
                  <div className="absolute top-4 right-4 w-6 h-6 animate-contact-textarea-ornate">
                    <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full relative">
                      <div className="absolute inset-2 border border-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] via-[#b8c4a8] via-[#c4a898] to-[#e5c8c5] hover:from-[#c4a898] hover:via-[#d4a5a0] hover:to-[#c8b8d5] text-white py-7 rounded-xl text-xl font-medium transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-contact-submit-symphony relative overflow-hidden baroque-button-font border-none">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-6 h-6 animate-contact-submit-ornate">
                      <div className="w-full h-full bg-white rounded-full relative">
                        <div className="absolute inset-1 border border-[#c4a898] rounded-full"></div>
                      </div>
                    </div>
                    <span>发送祝福</span>
                    <div className="w-6 h-6 animate-contact-submit-ornate-delayed">
                      <div className="w-full h-full border-2 border-white rounded-full"></div>
                    </div>
                    <div className="w-4 h-4 animate-contact-submit-small">
                      <div className="w-full h-full bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-contact-submit-shimmer"></div>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-[#f3ede5] via-[#e8e2db] to-[#ede6dd] py-20 px-6 border-t-3 border-[#d4a5a0]/30 relative overflow-hidden animate-footer-entrance">
        {/* Enhanced Footer Ornaments */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-24 h-24 opacity-30 animate-footer-ornament-majestic">
            <div className="w-full h-full border-6 border-[#d4a5a0]/60 rounded-full relative">
              <div className="absolute inset-3 border-3 border-[#c8b8d5]/60 rounded-full"></div>
              <div className="absolute inset-6 bg-gradient-to-r from-[#b8c4a8]/60 to-[#e5c8c5]/60 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-1 h-6 bg-[#d4c4a8] transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-6 bg-[#d4c4a8] transform -translate-x-1/2"></div>
            </div>
          </div>
          <div className="absolute top-10 right-20 w-18 h-18 opacity-30 animate-footer-ornament-dance">
            <div className="w-full h-full border-3 border-[#b8c4a8] rounded-full relative">
              <div className="absolute inset-2 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/4 w-20 h-20 opacity-30 animate-footer-ornament-flutter">
            <div className="w-full h-full bg-gradient-to-br from-[#c0b0a0]/60 to-[#c8b8d5]/60 transform rotate-45 relative">
              <div className="absolute inset-3 bg-gradient-to-br from-[#c8b8d5]/60 to-[#e5c8c5]/60 transform -rotate-45"></div>
            </div>
          </div>
          <div className="absolute bottom-10 right-1/4 w-16 h-16 opacity-30 animate-footer-ornament-bounce">
            <div className="w-full h-full border-3 border-[#d4a5a0] transform rotate-45 relative">
              <div className="absolute inset-2 bg-[#e5c8c5] transform -rotate-45"></div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-10">
            <div className="flex items-center justify-center space-x-10 animate-footer-message-entrance">
              <div className="w-10 h-10 animate-footer-ornate">
                <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="w-6 h-6 animate-footer-ornate-small">
                <div className="w-full h-full border-2 border-[#c4a898] rounded-full"></div>
              </div>
              <p className="text-[#a89688] text-3xl italic font-bold baroque-script-font">
                愿你在这里找到柔软的灵魂栖息地
              </p>
              <div className="w-6 h-6 animate-footer-ornate-small-delayed">
                <div className="w-full h-full bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full"></div>
              </div>
              <div className="w-10 h-10 animate-footer-ornate-delayed">
                <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#c0b0a0] rounded-full relative">
                  <div className="absolute inset-2 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-[#d4c4a8] transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-16 animate-footer-social-entrance">
              <a
                href="#"
                className="text-[#9a8d7d] hover:text-[#a89688] transition-all duration-700 hover:scale-150 transform group"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-current rounded-full group-hover:animate-footer-social-dance relative">
                    <div className="absolute inset-2 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 border border-[#d4c4a8] rounded-full opacity-0 group-hover:opacity-60"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4a5a0] to-[#c4a898] rounded-full opacity-0 group-hover:opacity-40 animate-footer-social-aura blur-lg"></div>
                </div>
              </a>
              <a
                href="#"
                className="text-[#9a8d7d] hover:text-[#a89688] transition-all duration-700 hover:scale-150 transform group"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-current rounded-full group-hover:animate-footer-social-dance relative">
                    <div className="absolute inset-2 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 border border-[#d4c4a8] rounded-full opacity-0 group-hover:opacity-60"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4a5a0] to-[#c4a898] rounded-full opacity-0 group-hover:opacity-40 animate-footer-social-aura blur-lg"></div>
                </div>
              </a>
              <a
                href="#"
                className="text-[#9a8d7d] hover:text-[#a89688] transition-all duration-700 hover:scale-150 transform group"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-3 border-current rounded-full group-hover:animate-footer-social-dance relative">
                    <div className="absolute inset-2 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 border border-[#d4c4a8] rounded-full opacity-0 group-hover:opacity-60"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4a5a0] to-[#c4a898] rounded-full opacity-0 group-hover:opacity-40 animate-footer-social-aura blur-lg"></div>
                </div>
              </a>
            </div>

            <div className="border-t-2 border-[#d4a5a0]/30 pt-10 animate-footer-copyright-entrance">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="w-6 h-6 animate-footer-copyright-ornate">
                  <div className="w-full h-full bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full"></div>
                </div>
                <div className="w-6 h-6 animate-footer-copyright-ornate-delayed">
                  <div className="w-full h-full border-2 border-[#b8c4a8] rounded-full"></div>
                </div>
                <div className="w-6 h-6 animate-footer-copyright-ornate">
                  <div className="w-full h-full bg-gradient-to-r from-[#d4a5a0] to-[#c4a898] rounded-full"></div>
                </div>
              </div>
              <p className="text-[#9a8d7d] text-xl font-medium baroque-title-font">
                © 2025 AngelZhengJY · 梦织世界 版权所有
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
