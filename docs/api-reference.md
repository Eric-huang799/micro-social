# API 参考文档

> Micro Social 后端 API 完整文档

## 🔐 认证

所有需要认证的接口需在 Header 中携带：

```
Authorization: Bearer <token>
```

---

## 👤 用户认证

### 注册
```http
POST /api/auth/register
```

**请求体：**
```json
{
    "username": "张三",
    "email": "zhangsan@example.com",
    "password": "password123"
}
```

**响应：**
```json
{
    "user": {
        "id": 1,
        "username": "张三",
        "handle": "@zhangsan",
        "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 登录
```http
POST /api/auth/login
```

**请求体：**
```json
{
    "email": "zhangsan@example.com",
    "password": "password123"
}
```

---

## 📝 推文

### 获取推文列表
```http
GET /api/posts?page=1&limit=10
```

**响应：**
```json
{
    "posts": [
        {
            "id": 1,
            "content": "Hello World!",
            "username": "张三",
            "handle": "@zhangsan",
            "likes": 5,
            "created_at": "2024-01-01T00:00:00Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "pages": 10
    }
}
```

### 发布推文
```http
POST /api/posts
Authorization: Bearer <token>
```

**请求体：**
```json
{
    "content": "推文内容"
}
```

### 点赞/取消点赞
```http
POST /api/posts/:id/like
Authorization: Bearer <token>
```

---

## 👥 用户

### 获取用户信息
```http
GET /api/users/:id
```

### 关注/取消关注
```http
POST /api/users/:id/follow
Authorization: Bearer <token>
```

### 获取关注列表
```http
GET /api/users/:id/following
```

### 获取粉丝列表
```http
GET /api/users/:id/followers
```

---

## 💬 评论

### 获取评论
```http
GET /api/posts/:id/comments
```

### 发表评论
```http
POST /api/posts/:id/comments
Authorization: Bearer <token>
```

**请求体：**
```json
{
    "content": "评论内容"
}
```

---

## 🔍 搜索

### 搜索推文
```http
GET /api/search?q=关键词
```

### 搜索用户
```http
GET /api/users/search?q=关键词
```

---

## 📊 状态码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 🔄 WebSocket 事件

连接：`ws://localhost:3001`

### 客户端发送

| 事件 | 说明 |
|------|------|
| `new_post` | 发布新推文 |
| `like_post` | 点赞推文 |

### 服务端推送

| 事件 | 说明 |
|------|------|
| `post_created` | 新推文通知 |
| `post_liked` | 点赞通知 |
| `new_notification` | 新通知 |
