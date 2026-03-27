# Level 2: API - RESTful 后端服务

> 目标：用 Express.js 搭建后端 API 服务

## 📋 前置要求

- 完成 [Level 1](../level-1-basic/) 
- 了解 HTTP 基础概念（GET、POST、状态码）

## 🎯 最终效果

- 启动 Node.js 服务器
- 通过 API 获取/发布数据
- 用 Postman 测试接口

## 📁 项目结构

```
level-2-api/
├── server.js           # 主服务器文件
├── package.json        # 项目配置
└── README.md
```

## 🚀 开始

### Step 1: 初始化项目

```bash
mkdir level-2-api
cd level-2-api
npm init -y
npm install express cors
```

### Step 2: 创建服务器 (server.js)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
let posts = [
    {
        id: 1,
        username: "张三",
        handle: "@zhangsan",
        content: "第一条推文！",
        likes: 5,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        username: "李四",
        handle: "@lisi",
        content: "Hello World!",
        likes: 3,
        createdAt: new Date().toISOString()
    }
];

// 获取所有推文
app.get('/api/posts', (req, res) => {
    res.json({
        success: true,
        data: posts
    });
});

// 获取单条推文
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.json({ success: true, data: post });
});

// 发布新推文
app.post('/api/posts', (req, res) => {
    const { username, handle, content } = req.body;
    
    if (!username || !content) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username and content are required' 
        });
    }
    
    const newPost = {
        id: posts.length + 1,
        username,
        handle: handle || `@${username}`,
        content,
        likes: 0,
        createdAt: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    res.status(201).json({ success: true, data: newPost });
});

// 点赞
app.post('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    
    post.likes++;
    res.json({ success: true, data: post });
});

// 删除推文
app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    
    posts.splice(index, 1);
    res.json({ success: true, message: 'Deleted' });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
```

### Step 3: 运行服务器

```bash
node server.js
```

访问 `http://localhost:3000/api/posts` 查看效果。

## 🧪 用 Postman 测试

### 获取所有推文
- **Method**: GET
- **URL**: `http://localhost:3000/api/posts`

### 发布新推文
- **Method**: POST
- **URL**: `http://localhost:3000/api/posts`
- **Body** → raw → JSON:
```json
{
    "username": "王五",
    "handle": "@wangwu",
    "content": "这是通过 API 发布的推文！"
}
```

### 点赞
- **Method**: POST
- **URL**: `http://localhost:3000/api/posts/1/like`

### 删除推文
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/posts/1`

## 📚 学习要点

### Express 核心概念

| 概念 | 说明 | 示例 |
|------|------|------|
| `app.get()` | 处理 GET 请求 | `app.get('/posts', handler)` |
| `app.post()` | 处理 POST 请求 | `app.post('/posts', handler)` |
| `req.params` | URL 参数 | `/posts/:id` → `req.params.id` |
| `req.body` | 请求体数据 | POST 的 JSON 数据 |
| `res.json()` | 返回 JSON | `res.json({ data })` |
| `res.status()` | 设置状态码 | `res.status(404)` |

### RESTful API 设计

| 操作 | HTTP 方法 | 路径 |
|------|-----------|------|
| 获取列表 | GET | `/api/posts` |
| 获取单个 | GET | `/api/posts/:id` |
| 创建 | POST | `/api/posts` |
| 更新 | PUT/PATCH | `/api/posts/:id` |
| 删除 | DELETE | `/api/posts/:id` |

## 🎯 挑战任务

1. **添加分页** - `GET /api/posts?page=1&limit=10`
2. **搜索功能** - `GET /api/posts?search=关键词`
3. **排序功能** - 按时间、按点赞数排序
4. **数据验证** - 使用 express-validator 验证输入

## ⏭️ 下一关

数据重启就消失？进入 [Level 3: Database](../level-3-database/) 学习数据持久化！
