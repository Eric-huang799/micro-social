# Go Track / Go 路线

欢迎来到 Go 语言技术路线！使用 Go 语言构建高性能社交平台。

## 🟡 为什么选择 Go?

```
高性能 ────────> 编译型语言，执行效率极高
    │
高并发 ────────> goroutine 轻松处理数万连接
    │
简洁 ──────────> 语法简单，代码可读性强
    │
部署简单 ──────> 单二进制文件，无依赖
```

## 🗺️ 路线规划

```
Level 1: Gin Basic ────────> 模板渲染 + 静态页面
    │
    ▼
Level 2: Gin API ──────────> RESTful API
    │
    ▼
Level 3: Gin Advanced ─────> GORM + JWT + WebSocket
```

## 📦 技术栈

| 组件 | 选择 | 说明 |
|------|------|------|
| Web 框架 | Gin | 最流行的 Go Web 框架 |
| ORM | GORM | 功能完善的 ORM |
| 数据库 | SQLite/PostgreSQL | 轻量或生产级 |
| 认证 | JWT | 无状态认证 |
| WebSocket | Gorilla | 成熟的 WebSocket 库 |
| 密码哈希 | bcrypt | 安全加密 |

## 🚀 快速开始

### 安装 Go

https://go.dev/dl/

### 验证安装

```bash
go version
# go version go1.21.0 windows/amd64
```

## 📁 目录

- [Level 1: Gin Basic](./level-1-gin-basic/) - 静态页面 + 模板
- [Level 2: Gin API](./level-2-gin-api/) - RESTful API
- [Level 3: Gin Advanced](./level-3-gin-advanced/) - 完整功能

## 📊 性能对比

| 特性 | Go | Node.js | Python |
|------|-----|---------|--------|
| 并发模型 | goroutine | Event Loop | Thread |
| 内存占用 | 低 | 中 | 高 |
| 启动速度 | 快 | 快 | 慢 |
| 部署复杂度 | 简单 | 中 | 中 |
| 开发效率 | 中 | 高 | 高 |

## 💡 适用场景

- ✅ 高并发场景
- ✅ 微服务架构
- ✅ 需要高性能的后端
- ✅ 学习系统编程概念

---

Build high-performance social platform with Go! 🚀
