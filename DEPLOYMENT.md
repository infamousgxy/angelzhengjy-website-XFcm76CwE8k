# 部署说明

这个项目已经配置为支持多种部署平台。

## 🚀 部署选项

### 1. Vercel 部署（推荐）

这是最简单的部署方式，因为项目最初就是为 Vercel 设计的。

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 上导入项目
3. Vercel 会自动检测到这是一个 Next.js 项目并进行部署

**配置文件**: `vercel.json`

### 2. Cloudflare Pages 部署

项目现在也支持 Cloudflare Pages 静态部署。

#### 方法 A: 通过 Cloudflare Dashboard
1. 将代码推送到 GitHub 仓库
2. 在 [Cloudflare Pages](https://pages.cloudflare.com) 上连接你的仓库
3. 设置构建配置：
   - **构建命令**: `pnpm build`
   - **输出目录**: `out`
   - **Node.js 版本**: `20.x` （重要：必须使用 Node.js 20 或更高版本）

#### 方法 B: 使用 Wrangler CLI
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署（确保先运行 pnpm build）
pnpm build
wrangler pages deploy out --project-name=angelzhengjy-website

# 或者使用配置文件部署
wrangler deploy
```

**配置文件**: `wrangler.toml` - 使用 `pages_build_output_dir` 配置

### 3. 其他静态托管平台

由于项目支持静态导出，你也可以部署到：
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- 任何支持静态文件的托管服务

## 🛠 构建命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本（静态导出）
pnpm build

# 构建后的文件在 out/ 目录中
```

## 📝 注意事项

1. **Node.js 版本**: 必须使用 Node.js 20.0.0 或更高版本（Next.js 15 要求）
2. **图片优化**: 静态导出模式下，Next.js 图片优化被禁用（`unoptimized: true`）
3. **API 路由**: 静态导出不支持 API 路由
4. **动态路由**: 需要使用 `generateStaticParams` 预生成所有路径
5. **Headers**: 静态导出不支持自定义 headers
6. **Cloudflare Pages**: 使用 `pages_build_output_dir` 而不是 `[assets]`

## 🔧 故障排除

如果遇到构建错误：

1. **Node.js 版本错误**: 确保使用 Node.js 20.0.0 或更高版本
2. 清理缓存：`rm -rf .next out node_modules && pnpm install`
3. 检查是否有使用了不兼容静态导出的功能
4. 确保 `out/` 目录在部署前已生成：运行 `pnpm build`

### Cloudflare Pages 特定问题：
- 如果看到 "Node.js version required" 错误，在构建设置中设置环境变量：
  - `NODE_VERSION`: `20`
- 确保 `wrangler.toml` 使用正确的配置格式

## 🌐 当前部署状态

- **Vercel**: [https://vercel.com/ding113s-projects/v0-angelzhengjy-website](https://vercel.com/ding113s-projects/v0-angelzhengjy-website)
- **v0.dev 项目**: [https://v0.dev/chat/projects/wUWJm9o3c6c](https://v0.dev/chat/projects/wUWJm9o3c6c) 