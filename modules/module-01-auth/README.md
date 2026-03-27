# Module 01: Auth - 用户认证系统

> 实现用户注册、登录、身份验证功能

## 🎯 功能概述

- 用户注册（用户名、邮箱、密码）
- 用户登录
- JWT Token 认证
- 密码加密存储
- 用户信息管理

## 📁 文件结构

```
module-01-auth/
├── backend/
│   ├── models/
│   │   └── user.js      # 用户模型
│   ├── middleware/
│   │   └── auth.js      # 认证中间件
│   ├── routes/
│   │   └── auth.js      # 认证路由
│   └── utils/
│       └── jwt.js       # JWT 工具
├── frontend/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── hooks/
│       └── useAuth.js
└── README.md
```

## 🔧 核心代码

### 后端

#### 用户模型 (models/user.js)

```javascript
const bcrypt = require('bcrypt');

class User {
    constructor(db) {
        this.db = db;
    }
    
    // 创建用户
    create({ username, email, password }) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const handle = `@${username.toLowerCase()}`;
        
        const stmt = this.db.prepare(`
            INSERT INTO users (username, email, password, handle)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(username, email, hashedPassword, handle);
        return this.findById(result.lastInsertRowid);
    }
    
    // 查找用户
    findByEmail(email) {
        return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }
    
    // 验证密码
    verifyPassword(user, password) {
        return bcrypt.compareSync(password, user.password);
    }
}

module.exports = User;
```

#### JWT 中间件 (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { authMiddleware, generateToken };
```

### 前端

#### Auth Context (context/AuthContext.jsx)

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', {
            email,
            password
        });
        
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return user;
    };

    const register = async (username, email, password) => {
        const response = await axios.post('/api/auth/register', {
            username,
            email,
            password
        });
        
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return user;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
```

## 📦 安装依赖

### 后端

```bash
npm install bcrypt jsonwebtoken
```

### 前端

```bash
npm install axios
```

## 🗄️ 数据库表

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 安全建议

1. **强密码策略**: 至少 8 位，包含大小写和数字
2. **JWT 过期**: 设置合理的过期时间
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **密码加密**: 使用 bcrypt，cost factor ≥ 10
5. **Token 刷新**: 长 token + 短 token 机制

## 🎯 扩展方向

- 邮箱验证
- 密码重置
- 第三方登录 (OAuth)
- 双因素认证 (2FA)
