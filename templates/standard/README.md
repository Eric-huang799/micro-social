# Standard Template - 标准版本

> 包含完整功能的社交应用，适合直接使用

## ✨ 功能

- ✅ 用户注册/登录
- ✅ 发布/点赞推文
- ✅ 评论系统
- ✅ 关注/粉丝
- ✅ SQLite 数据库
- ✅ React 前端

## 🚀 快速开始

```bash
cd templates/standard
docker-compose up
```

或手动：
```bash
# 后端
cd server && npm install && npm start

# 前端（新终端）
cd client && npm install && npm start
```

## 📁 结构

```
standard/
├── server/            # Express + SQLite
├── client/            # React 18
├── docker-compose.yml
└── README.md
```
