# Angelzhengjy Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ding113s-projects/v0-angelzhengjy-website)

## 项目概述

这是一个为 Angelzhengjy 设计的个人作品集或品牌展示网站。它采用了现代 Web 技术栈，注重优雅的视觉设计、巴洛克风格的装饰元素以及流畅的用户体验。项目集成了产品展示、品牌故事、联系方式以及一个互动的小羊动画游戏。

## 项目结构

以下是项目的主要目录结构和说明：

```
.
├── app/                      # Next.js App Router 目录
│   ├── (main)/               # 主应用路由组
│   │   └── page.tsx          # 网站首页组件
│   ├── sheep/                # 小羊动画游戏页面
│   │   └── page.tsx          # 小羊游戏组件
│   ├── layout.tsx            # 全局根布局
│   └── globals.css           # 全局样式 (通常与 Tailwind 结合使用)
├── components/               # 可复用的UI组件 (如果存在)
│   └── (例如: Navbar.tsx, Footer.tsx, ProductCard.tsx)
├── public/                   # 静态资源目录
│   ├── images/               # 网站主要图片 (logo, 产品图, 头像等)
│   ├── sheep/                # 小羊游戏相关图片 (精灵图, 背景, 云朵等)
│   └── (其他如 favicons, fonts 等)
├── sheep/                    # 存放原始HTML版本的小羊动画 (参考用)
│   ├── advanced_sheep_animation.html
│   └── README.md             # (内容已整合到下方)
├── styles/                   # 样式文件 (如果除了globals.css还有其他)
├── hooks/                    # 自定义 React Hooks (如果存在)
├── lib/                      # 工具函数、常量等 (如果存在)
├── .next/                    # Next.js 构建输出目录
├── node_modules/             # 项目依赖
├── out/                      # Next.js 静态导出目录 (通过 pnpm build 生成)
├── .gitignore                # Git忽略文件配置
├── next.config.mjs           # Next.js 配置文件
├── package.json              # 项目元数据和依赖管理
├── pnpm-lock.yaml            # pnpm 锁文件
├── postcss.config.mjs        # PostCSS 配置文件 (通常用于 Tailwind)
├── tailwind.config.ts        # Tailwind CSS 配置文件
├── tsconfig.json             # TypeScript 配置文件
├── vercel.json               # Vercel 部署配置文件
├── wrangler.toml             # Cloudflare Pages 部署配置文件
├── README.md                 # 本文件 - 项目说明
├── SHEEP_INTEGRATION.md      # (内容已整合到下方)
├── MODIFICATIONS_SUMMARY.md  # (内容已整合到下方)
├── IMAGE_REPLACEMENT_GUIDE.md # (内容已整合到下方)
└── DEPLOYMENT.md             # (内容已整合到下方)
```

## 主要技术栈

*   **框架**: Next.js (App Router)
*   **语言**: TypeScript
*   **样式**: Tailwind CSS, styled-jsx
*   **包管理器**: pnpm
*   **部署**: Vercel, Cloudflare Pages (支持静态导出)

## 功能亮点

*   响应式设计，适配不同设备。
*   优雅的巴洛克风格 UI 和动画效果。
*   产品展示、品牌故事等内容模块。
*   集成的互动小羊动画游戏。
*   支持本地图片引用和自动缩放。

---

## 详细文档

### 小羊功能集成说明 (来自 SHEEP_INTEGRATION.md)

已成功将数羊功能集成到AngelZhengJY网站中。用户可以通过右上角导航栏的"快来数羊"按钮进入数羊页面，享受可爱的小羊动画。

**集成内容**

*   **页面路由**: 新增路由 `/sheep` (文件位置: `app/sheep/page.tsx`)
*   **导航栏更新**: 在主页导航栏添加了"快来数羊"选项 (使用小羊emoji图标 🐑)
*   **静态资源**: 复制了所有必要的图片资源到 `public/sheep/` 目录 (`image.png`, `cloud1.png`, `cloud2.png`, `cloud3.png`, `WechatIMG1675.jpg`)
*   **功能特性**: 7只不同颜色的小羊自动行走, 可拖拽互动, 抓羊计数, 美丽的背景场景, 响应式设计, 平滑动画, 返回首页按钮。

**技术实现**

*   **Next.js集成**: React Hooks, TypeScript, 客户端渲染, Next.js Link组件。
*   **动画系统**: CSS精灵动画, 逐帧控制, 物理引擎模拟, 平滑拖拽。
*   **样式设计**: styled-jsx, 保持主站风格, 响应式布局。

**使用方法**

1.  访问主页
2.  点击右上角导航栏的"快来数羊"
3.  在数羊页面中：观看、拖拽小羊，查看计数，点击返回按钮。

**浏览器兼容性**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+, 移动端浏览器。

**性能优化**: requestAnimationFrame, 定时器管理, 内存泄漏防护, 响应式图片加载。

**未来扩展**: 更多动物, 音效, 成就系统, 分享功能, 夜间模式。

---

### 项目修改总结 (来自 MODIFICATIONS_SUMMARY.md)

**已完成的修改**

*   **删除首页标语**: "轻柔，是我表达爱的方式"
*   **移除旋转边框动画**: 保留静态边框装饰。
*   **修复导航栏跳转功能**: 添加平滑滚动到对应section。
*   **创建图片目录**: `public/images/`
*   **图片引用更新 + 自动缩放功能**: 所有图片引用改成本地, 支持任意尺寸自动居中裁剪和缩放, 响应式优化。

**图片替换任务 (等待用户提供图片)**

*   **主要图片 (2张)**:
    1.  灵感故事区域大图: `inspiration-main.jpg` (6:7比例)
    2.  Angel头像: `angel-portrait.jpg` (1:1比例, 会裁剪为圆形)
*   **丝巾产品图片 (4张, 1:1比例)**: `scarf-rabbit.jpg`, `scarf-deer.jpg`, `scarf-bird.jpg`, `scarf-fox.jpg`.

**下一步操作**: 准备图片 -> 上传到 `public/images/` -> 刷新页面查看。

**新增功能特性: 智能图片处理**

*   比例优先, 自动缩放, 智能裁剪, 响应式, 性能优化。

**项目状态**: 开发服务器正常, 构建无错误, 导航功能正常, 图片系统支持自动缩放, 响应式设计完整, 动画效果优化。

---

### 图片替换指南 (来自 IMAGE_REPLACEMENT_GUIDE.md)

**图片存放位置**: `public/images/` (包含上述所有图片的文件名和建议比例)

**图片要求 (简化版)**

*   **比例要求**: 灵感故事主图 (6:7), Angel头像 (1:1), 丝巾产品图 (1:1)。
*   **尺寸灵活性**: 无需精确像素, 比例正确即可, 系统自动缩放。
*   **建议最小尺寸**: 300x300像素。
*   **建议最大尺寸**: 不超过2000x2000像素。
*   **格式**: JPG, PNG, WebP (建议JPG)。
*   **文件大小**: 建议1MB以内。
*   **风格建议**: 温暖柔和, 符合巴洛克风格; Angel头像清晰; 产品图背景简洁; 灵感故事图具艺术感。

**替换步骤**: 准备图片 -> 重命名 -> 上传到 `public/images/` -> 刷新页面。

---

### 项目部署指南 (来自 DEPLOYMENT.md)

**部署选项**

*   **Vercel (推荐)**: 连接GitHub仓库, Vercel自动检测和部署。
*   **Cloudflare Pages**: 连接GitHub, 构建命令 `pnpm build`, 输出目录 `out`, Node.js `20.x`。
    *   或使用 Wrangler CLI: `pnpm build && wrangler pages deploy out --project-name=angelzhengjy-website`
*   **其他静态托管平台**: Netlify, GitHub Pages, AWS S3等。

**构建命令**

```bash
pnpm install  # 安装依赖
pnpm dev      # 开发模式
pnpm build    # 构建生产版本 (静态导出到 out/)
```

**注意事项**

*   Node.js版本: 20.0.0+
*   静态导出时图片优化被禁用。
*   静态导出不支持API路由和自定义headers。

**故障排除**: 检查Node.js版本, 清理缓存, 确保 `out/` 目录已生成。
*   Cloudflare特定: 设置 `NODE_VERSION=20` 环境变量。

**当前部署状态链接 (示例)**

*   Vercel: (保留顶部的徽章链接)
*   原v0.dev项目链接已移除。

---

## 🐑 小羊行走动画项目 (HTML参考) (来自 sheep/README.md)

这是一个使用CSS精灵动画技术制作的小羊行走动画项目，包含两个版本的实现，存放于 `sheep/` 目录中作为原始参考。

### 📁 文件说明 (sheep/ 目录内)

- `image.png` - 精灵图文件（小羊的动画帧）
- `sheep_animation.html` - 基础版本的小羊动画
- `advanced_sheep_animation.html` - 高级版本的小羊动画（推荐）
- `README.md` - (本部分内容)

### 🚀 快速开始 (本地HTML版本)

1. 确保 `sheep/image.png` 精灵图文件在 `sheep/` 目录下
2. 用浏览器打开 `sheep/advanced_sheep_animation.html` 文件
3. 享受小羊行走的动画！

### ✨ 功能特性 (HTML版本)

#### 基础版本 (`sheep_animation.html`)
- ✅ 基本的小羊行走动画
- ✅ 简单的控制按钮
- ✅ 键盘快捷键支持
- ✅ 响应式设计

#### 高级版本 (`advanced_sheep_animation.html`)
- 🌟 完整的场景设计（天空、云朵、太阳、草地、花朵）
- 🎮 丰富的控制选项
- 🔄 自动检测精灵图尺寸
- 📱 移动设备触摸支持
- 🎨 多种视觉效果
- ⚡ 实时速度调节
- 🔀 方向切换功能
- 📏 大小调节功能

### 🎮 控制说明 (HTML版本)

#### 按钮控制
- **暂停/继续** - 控制动画播放状态
- **重置** - 重新开始动画
- **慢速/正常/快速** - 调节动画播放速度
- **改变方向** - 切换小羊行走方向
- **改变大小** - 调节小羊显示大小

#### 键盘快捷键
- `空格键` - 暂停/继续动画
- `1` - 慢速模式
- `2` - 正常速度
- `3` - 快速模式
- `R` - 重置动画
- `D` - 改变方向
- `S` - 改变大小

#### 移动设备
- **左右滑动** - 调节播放速度

### 🎨 精灵图要求 (HTML版本)

动画系统会自动检测精灵图的尺寸，但建议遵循以下格式：

- **格式**: PNG 图片
- **布局**: 水平排列的动画帧
- **帧数**: 4帧（可调整）
- **建议尺寸**: 每帧 64x64 像素或更大

#### 精灵图示例布局
```
[帧1][帧2][帧3][帧4]
```

### 🛠️ 技术实现 (HTML版本)

#### CSS 动画技术
- 使用 `@keyframes` 定义动画序列
- `steps()` 函数实现逐帧动画
- `background-position` 控制精灵图显示

#### JavaScript 功能
- 动态检测精灵图尺寸
- 实时控制动画参数
- 键盘和触摸事件处理
- 响应式布局适配

#### 动画层次
1. **背景层** - 天空渐变
2. **装饰层** - 太阳、云朵、花朵
3. **地面层** - 草地和草丛
4. **角色层** - 小羊动画

### 🔧 自定义配置 (HTML版本)

#### 修改动画速度
在CSS中调整以下参数：
```css
.sheep {
    animation: walk 0.6s steps(4) infinite;
}

.sheep-container {
    animation: move-sheep 12s linear infinite;
}
```

#### 修改精灵图帧数
在JavaScript中调整：
```javascript
const frameCount = 4; // 修改为实际帧数
```

#### 修改场景元素
可以通过CSS调整各种装饰元素的样式和动画。

### 🌐 浏览器兼容性 (HTML版本)
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

### 📱 响应式支持 (HTML版本)
动画在不同设备上都能正常显示。

### 🎯 使用建议 (HTML版本)
1. **性能优化**: 在低性能设备上可以降低动画速度
2. **精灵图质量**: 使用高质量的精灵图获得更好的视觉效果
3. **自定义场景**: 可以根据需要修改背景和装饰元素
4. **交互体验**: 利用键盘快捷键提供更好的用户体验

### 🤝 贡献 (HTML版本)
欢迎提交问题和改进建议！

### 📄 许可证 (HTML版本)
本项目采用 MIT 许可证。