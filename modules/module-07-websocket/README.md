# Module 07: WebSocket - 实时通知

> 实时推送新消息和通知

## 🎯 功能

- 新推文实时推送
- 点赞实时通知
- 评论实时通知
- 在线用户统计

## 📦 依赖

```bash
npm install socket.io
```

## 🔌 事件

### 客户端 → 服务端

| 事件 | 数据 |
|------|------|
| `join` | `{ userId }` |
| `new_post` | `{ post }` |
| `typing` | `{ room }` |

### 服务端 → 客户端

| 事件 | 数据 |
|------|------|
| `post_created` | `{ post }` |
| `notification` | `{ type, data }` |
| `user_online` | `{ count }` |
