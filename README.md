# 🌐 Micro Social / 微型社交平台

[English](#english) | [中文](#中文)

---

# English

> A progressive, modular tutorial for building your own social platform like X/Twitter. Learn full-stack development step by step.

## 🎯 Vision

**Micro Social** is a progressive learning project that teaches you to build a Twitter-like social platform from scratch. Start small on your local network and experience the joy of full-stack development.

```
✅ No public IP required
✅ Zero deployment cost
✅ Own your data
✅ From beginner to full-stack
```

## 🗺️ Tech Tree Roadmap

Choose your learning path:

### 🟢 Node.js Track (Recommended for Beginners)

```
Level 1: Basic ────────────────────> Static Pages + Mock Data
    │
    ▼
Level 2: API ──────────────────────> RESTful API Fundamentals
    │
    ▼
Level 3: Database ─────────────────> SQLite Persistence
    │
    ▼
Level 4: Frontend ─────────────────> React Modern Frontend
    │
    ▼
Level 5: Full Stack ───────────────> Complete Implementation
```

### 🔵 Python Track

```
Flask: Basic ────────────> Static Pages
    │
    ▼
Flask: API ──────────────> RESTful API
    │
    ▼
Django: Basic ───────────> Full-Stack Framework
    │
    ▼
Django: Full ────────────> REST API + WebSocket
```

[Start Python Track →](./tech-tree/python-track/)

### 🟡 Go Track

```
Level 1: Gin Basic ────────> Templates + Static Pages
    │
    ▼
Level 2: Gin API ──────────> RESTful API
    │
    ▼
Level 3: Gin Advanced ─────> GORM + JWT + WebSocket
```

[Start Go Track →](./tech-tree/go-track/)

## 📦 Standalone Modules (Mix & Match)

After completing the basics, add features like building blocks:

| Module | Feature | Difficulty |
|--------|---------|------------|
| [Module 01](./modules/module-01-auth) | User Auth (Register/Login) | ⭐ |
| [Module 02](./modules/module-02-post) | Post Tweets | ⭐ |
| [Module 03](./modules/module-03-timeline) | Timeline Feed | ⭐⭐ |
| [Module 04](./modules/module-04-like) | Like System | ⭐ |
| [Module 05](./modules/module-05-comment) | Comments | ⭐⭐ |
| [Module 06](./modules/module-06-follow) | Follow/Fans | ⭐⭐⭐ |
| [Module 07](./modules/module-07-websocket) | Real-time Notifications | ⭐⭐⭐ |
| [Module 08](./modules/module-08-image) | Image Upload | ⭐⭐ |

## 🎮 Interactive Playground

**Learn by doing!** Open `playground/index.html` in your browser:

- 10 progressive challenges
- Built-in code editor + live preview
- Auto-save progress
- Export your finished project as ZIP

[Start Playground →](./playground/)

---

## 🚀 Quick Start

### Option 1: Ready-to-Use Templates

```bash
# Minimal - Best for learning basics
cd templates/minimal
npm install
npm start

# Standard - Complete common features
cd templates/standard
npm install
npm start

# Full-featured - All modules integrated
cd templates/full-featured
docker-compose up
```

### Option 2: Follow the Tech Tree

```bash
# Start from Level 1, upgrade step by step
cd tech-tree/nodejs-track/level-1-basic
# Follow README.md, then move to next level!
```

## 📱 Use Cases

### 💡 Dorm Room LAN
```
Roommate A (192.168.1.100) <──┐
                              ├──> Same WiFi, mutual access
Roommate B (192.168.1.101) <──┘
```

### 💡 Home Network
- Family photo sharing
- No third-party services required

### 💡 Small Team Internal
- Project team communication
- Internal knowledge sharing

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [🚀 Getting Started](./docs/getting-started.md) | Your first social platform |
| [📖 API Reference](./docs/api-reference.md) | API documentation |
| [🐳 Deployment](./docs/deployment.md) | Container deployment guide |

---

# 中文

> 模块化社交平台搭建教程 - 从零开始构建属于你的局域网社交应用

## 🎯 项目愿景

**Micro Social** 是一个渐进式学习项目，让你一步步搭建出类似 X(Twitter) 的社交平台。从小范围局域网使用开始，体验全栈开发的乐趣。

```
✅ 无需公网IP
✅ 零成本部署
✅ 数据自己掌控
✅ 从小白到全栈
```

## 🗺️ 科技树路线图

选择你的技术路线，按难度循序渐进：

### 🟢 Node.js 路线（推荐入门）

```
Level 1: Basic ────────────────────> 静态页面 + 模拟数据
    │
    ▼
Level 2: API ──────────────────────> RESTful API 基础
    │
    ▼
Level 3: Database ─────────────────> SQLite 数据持久化
    │
    ▼
Level 4: Frontend ─────────────────> React 现代前端
    │
    ▼
Level 5: Full Stack ───────────────> 完整功能实现
```

### 🔵 Python 路线

```
Flask 基础 ────────────> 静态页面
    │
    ▼
Flask API ─────────────> RESTful API
    │
    ▼
Django 基础 ───────────> 全功能框架
    │
    ▼
Django 完整 ───────────> REST API + WebSocket
```

[开始 Python 路线 →](./tech-tree/python-track/)

### 🟡 Go 路线

```
Level 1: Gin 基础 ────────> 模板渲染 + 静态页面
    │
    ▼
Level 2: Gin API ─────────> RESTful API
    │
    ▼
Level 3: Gin 高级 ────────> GORM + JWT + WebSocket
```

[开始 Go 路线 →](./tech-tree/go-track/)

## 📦 独立功能模块（自由组合）

完成基础后，像搭积木一样添加功能：

| 模块 | 功能 | 难度 |
|------|------|------|
| [Module 01](./modules/module-01-auth) | 用户注册/登录/认证 | ⭐ |
| [Module 02](./modules/module-02-post) | 发布推文 | ⭐ |
| [Module 03](./modules/module-03-timeline) | 时间线展示 | ⭐⭐ |
| [Module 04](./modules/module-04-like) | 点赞系统 | ⭐ |
| [Module 05](./modules/module-05-comment) | 评论系统 | ⭐⭐ |
| [Module 06](./modules/module-06-follow) | 关注/粉丝 | ⭐⭐⭐ |
| [Module 07](./modules/module-07-websocket) | 实时通知 | ⭐⭐⭐ |
| [Module 08](./modules/module-08-image) | 图片上传 | ⭐⭐ |

## 🎮 交互式练习平台

**边学边练！** 浏览器打开 `playground/index.html`：

- 10 个渐进式关卡
- 内置代码编辑器 + 实时预览
- 自动保存进度
- 一键导出成品 ZIP

[开始练习 →](./playground/)

---

## 🚀 快速启动

### 方案一：开箱即用

```bash
# 最简版本 - 适合学习基础
cd templates/minimal
npm install
npm start

# 标准版本 - 常用功能完整
cd templates/standard
npm install
npm start

# 全功能版本 - 所有模块集成
cd templates/full-featured
docker-compose up
```

### 方案二：按科技树学习

```bash
# 从 Level 1 开始，一步步升级
cd tech-tree/nodejs-track/level-1-basic
# 跟着 README.md 完成本关，然后进入下一关！
```

## 📱 使用场景

### 💡 宿舍局域网
```
室友 A (192.168.1.100) <──┐
                          ├──> 同一个 WiFi 内互相访问
室友 B (192.168.1.101) <──┘
```

### 💡 家庭内网
- 家人共享相册和动态
- 不依赖任何第三方服务

### 💡 小团队内部
- 项目组内部交流
- 内部知识分享

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [🚀 快速开始](./docs/getting-started.md) | 你的第一个社交平台 |
| [📖 API 文档](./docs/api-reference.md) | 接口参考手册 |
| [🐳 Docker 部署](./docs/deployment.md) | 容器化部署指南 |

---

## 🛠️ Tech Stack / 技术栈

- **Frontend**: React 18 + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite / PostgreSQL
- **Real-time**: Socket.io

## 📜 License / 许可证

MIT License

**Happy Coding! 🎉 / 祝编码愉快！**
