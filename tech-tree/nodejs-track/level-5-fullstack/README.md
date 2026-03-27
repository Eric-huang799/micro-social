# Level 5: Full Stack - 完整社交平台

> 目标：实现完整的用户认证和所有社交功能

## 📋 前置要求

- 完成 [Level 4](../level-4-frontend/)

## 🎯 最终效果

- 完整的用户系统（注册/登录/密码加密）
- JWT 身份验证
- 所有社交功能（发推、点赞、评论、关注）
- 实时通知（WebSocket）
- 可部署到局域网使用

## 📁 项目结构

```
level-5-fullstack/
├── server/                  # 后端
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.js
│   │   ├── post.js
│   │   └── comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── websocket/
│   │   └── index.js
│   ├── server.js
│   └── package.json
├── client/                  # 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── api/
│   └── package.json
└── README.md
```

## 🚀 开始

### 后端 (server/)

#### 1. 安装依赖

```bash
cd server
npm init -y
npm install express cors better-sqlite3 bcrypt jsonwebtoken socket.io
npm install --save-dev nodemon
```

#### 2. 数据库模型 (models/)

**models/user.js**

```javascript
const { db } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static create({ username, email, password }) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const handle = `@${username.toLowerCase().replace(/\s/g, '')}`;
        
        const result = db.prepare(`
            INSERT INTO users (username, email, password, handle)
            VALUES (?, ?, ?, ?)
        `).run(username, email, hashedPassword, handle);
        
        return this.findById(result.lastInsertRowid);
    }
    
    static findById(id) {
        return db.prepare('SELECT id, username, email, handle, avatar, bio FROM users WHERE id = ?').get(id);
    }
    
    static findByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }
    
    static validatePassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    }
}

module.exports = User;
```

**models/post.js**

```javascript
const { db } = require('../config/database');

class Post {
    static getAll({ page = 1, limit = 10, userId = null }) {
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT p.*, u.username, u.handle, u.avatar,
                   (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                   (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
        `;
        
        if (userId) {
            query += ` WHERE p.user_id = ?`;
        }
        
        query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
        
        const params = userId ? [userId, limit, offset] : [limit, offset];
        return db.prepare(query).all(...params);
    }
    
    static create({ userId, content }) {
        const result = db.prepare(
            'INSERT INTO posts (user_id, content) VALUES (?, ?)'
        ).run(userId, content);
        
        return this.findById(result.lastInsertRowid);
    }
    
    static findById(id) {
        return db.prepare(`
            SELECT p.*, u.username, u.handle, u.avatar
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `).get(id);
    }
    
    static like(postId, userId) {
        try {
            db.prepare('INSERT INTO likes (post_id, user_id) VALUES (?, ?)').run(postId, userId);
            return { liked: true };
        } catch (e) {
            // 已点赞，取消点赞
            db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(postId, userId);
            return { liked: false };
        }
    }
}

module.exports = Post;
```

#### 3. 认证中间件 (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authMiddleware, JWT_SECRET };
```

#### 4. 路由 (routes/)

**routes/auth.js**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // 验证
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        // 创建用户
        const user = User.create({ username, email, password });
        
        // 生成 Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ user, token });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

// 登录
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = User.validatePassword(user, password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

**routes/posts.js**

```javascript
const express = require('express');
const Post = require('../models/post');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取推文列表
router.get('/', (req, res) => {
    const posts = Post.getAll({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    });
    res.json({ posts });
});

// 发布推文（需登录）
router.post('/', authMiddleware, (req, res) => {
    const post = Post.create({
        userId: req.userId,
        content: req.body.content
    });
    res.status(201).json({ post });
});

// 点赞（需登录）
router.post('/:id/like', authMiddleware, (req, res) => {
    const result = Post.like(req.params.id, req.userId);
    res.json(result);
});

module.exports = router;
```

#### 5. 主服务器 (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { initDatabase } = require('./config/database');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// WebSocket
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('new_post', (data) => {
        socket.broadcast.emit('post_created', data);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 初始化数据库
initDatabase();

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
```

### 前端 (client/)

#### 认证上下文 (src/context/AuthContext.jsx)

```jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // 验证 token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // 这里可以调用 /api/me 获取用户信息
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

## 🐳 Docker 部署

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  server:
    build: ./server
    ports:
      - "3001:3001"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - JWT_SECRET=change-this-in-production
    restart: unless-stopped

  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

## 🎉 恭喜！

你已经完成了 Micro Social 的所有关卡！现在你可以：

1. 在宿舍/家庭局域网内部署
2. 邀请朋友一起使用
3. 继续扩展功能（私信、群组、图片上传等）

## 📖 下一步

- 查看 [功能模块](../../modules/) 添加更多功能
- 阅读 [部署指南](../../docs/deployment.md) 了解更多部署方式
- 探索 [API 文档](../../docs/api-reference.md) 进行二次开发
