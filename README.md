# 🌐 Micro Social

> 模块化社交平台搭建教程 - 从零开始构建属于你的局域网社交应用

## 🎯 项目愿景

**Micro Social** 是一个渐进式学习项目，让你一步步搭建出类似 X(Twitter) 的社交平台。从小范围局域网使用开始，体验全栈开发的乐趣。

```
✅ 无需公网IP
✅ 零成本部署
✅ 数据自己掌控
✅ 从小白到全栈
```

---

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
Level 1: Flask Basic ──────────────> 轻量级 Web 框架
    │
    ▼
Level 2: Django ───────────────────> 全功能框架
```

### 🟡 Go 路线

```
Level 1: Gin Framework ────────────> 高性能 Web 服务
```

---

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

---

## 🚀 快速启动

### 方案一：开箱即用

直接下载预设模板：

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

---

## 🎨 个性化定制

不只是功能，还有外观：

- 🎨 [自定义主题指南](./docs/custom-themes.md)
- 🔌 [插件开发指南](./docs/plugin-development.md)
- 🌍 [多语言支持](./docs/i18n.md)

---

## 📱 使用场景

### 💡 宿舍局域网
```
室友 A (192.168.1.100:3000) <──┐
                              ├──> 同一个 WiFi 内互相访问
室友 B (192.168.1.101:3000) <──┘
```

### 💡 家庭内网
- 家人共享相册和动态
- 不依赖任何第三方服务

### 💡 小团队内部
- 项目组内部交流
- 内部知识分享

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [🚀 快速开始](./docs/getting-started.md) | 你的第一个社交平台 |
| [📖 API 文档](./docs/api-reference.md) | 接口参考手册 |
| [🐳 Docker 部署](./docs/deployment.md) | 容器化部署指南 |
| [❓ 常见问题](./docs/faq.md) | 遇到问题看这里 |

---

## 🛠️ 技术栈总览

### 前端
- **基础**: HTML5 + CSS3 + JavaScript
- **进阶**: React 18 + TailwindCSS
- **状态管理**: Zustand / Redux Toolkit

### 后端
- **运行时**: Node.js 18+ / Python 3.9+ / Go 1.20+
- **框架**: Express.js / Flask / Django / Gin
- **数据库**: SQLite (简单) / PostgreSQL (进阶)
- **实时**: WebSocket / Socket.io

### 部署
- **传统**: 直接运行 Node.js / Python
- **容器**: Docker + Docker Compose
- **反向代理**: Nginx (可选)

---

## 🤝 贡献指南

1. Fork 本项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📜 许可证

MIT License - 自由使用、修改、分发

---

## 💬 交流讨论

- 🐛 发现 Bug？提交 [Issue](../../issues)
- 💡 有新想法？开启 [Discussion](../../discussions)
- ⭐ 觉得有用？点个 Star 支持一下！

---

**Happy Coding! 🎉**

从零开始，搭建属于你的社交平台。
