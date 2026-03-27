# Level 3: Database - 数据持久化

> 目标：使用 SQLite 让数据永久保存

## 📋 前置要求

- 完成 [Level 2](../level-2-api/)
- 了解基本 SQL 语句

## 🎯 最终效果

- 数据存储在 SQLite 数据库中
- 服务器重启数据不丢失
- 支持更复杂的数据查询

## 📁 项目结构

```
level-3-database/
├── server.js
├── database.js         # 数据库配置
├── package.json
├── social.db           # SQLite 数据库文件
└── README.md
```

## 🚀 开始

### Step 1: 安装依赖

```bash
npm install express cors better-sqlite3
```

### Step 2: 数据库配置 (database.js)

```javascript
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'social.db'));

// 初始化表
function initDatabase() {
    // 用户表
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            handle TEXT UNIQUE NOT NULL,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // 推文表
    db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
    
    console.log('✅ Database initialized');
}

// 插入示例数据
function seedData() {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (userCount.count === 0) {
        const insertUser = db.prepare('
            INSERT INTO users (username, handle, avatar) VALUES (?, ?, ?)
        ');
        
        const users = [
            ['张三', '@zhangsan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'],
            ['李四', '@lisi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi']
        ];
        
        users.forEach(user => insertUser.run(...user));
        
        const insertPost = db.prepare('
            INSERT INTO posts (user_id, content, likes) VALUES (?, ?, ?)
        ');
        
        insertPost.run(1, '第一条数据库持久化的推文！', 5);
        insertPost.run(2, 'SQLite 真轻量', 3);
        
        console.log('✅ Sample data inserted');
    }
}

module.exports = { db, initDatabase, seedData };
```

### Step 3: 更新服务器 (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const { db, initDatabase, seedData } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();
seedData();

// 获取所有推文（带用户信息）
app.get('/api/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const posts = db.prepare(`
        SELECT p.*, u.username, u.handle, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const total = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
    
    res.json({
        success: true,
        data: posts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// 发布推文
app.post('/api/posts', (req, res) => {
    const { user_id, content } = req.body;
    
    if (!user_id || !content) {
        return res.status(400).json({
            success: false,
            error: 'user_id and content are required'
        });
    }
    
    const result = db.prepare(
        'INSERT INTO posts (user_id, content) VALUES (?, ?)'
    ).run(user_id, content);
    
    const post = db.prepare(`
        SELECT p.*, u.username, u.handle, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({ success: true, data: post });
});

// 点赞
app.post('/api/posts/:id/like', (req, res) => {
    const result = db.prepare(
        'UPDATE posts SET likes = likes + 1 WHERE id = ?'
    ).run(req.params.id);
    
    if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    
    const post = db.prepare(`
        SELECT p.*, u.username, u.handle, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
    `).get(req.params.id);
    
    res.json({ success: true, data: post });
});

// 搜索推文
app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ success: false, error: 'Query required' });
    }
    
    const posts = db.prepare(`
        SELECT p.*, u.username, u.handle, u.avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.content LIKE ? OR u.username LIKE ?
        ORDER BY p.created_at DESC
    `).all(`%${q}%`, `%${q}%`);
    
    res.json({ success: true, data: posts });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
```

## 📚 学习要点

### SQLite 基础

```sql
-- 创建表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (username) VALUES ('张三');

-- 查询数据
SELECT * FROM users WHERE id = 1;

-- 更新数据
UPDATE users SET username = '李四' WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 1;
```

### better-sqlite3 方法

| 方法 | 说明 |
|------|------|
| `db.prepare(sql)` | 预编译 SQL |
| `.run()` | 执行 INSERT/UPDATE/DELETE |
| `.get()` | 获取单行结果 |
| `.all()` | 获取所有结果 |

## 🎯 挑战任务

1. **添加评论表** - 推文可以评论
2. **添加关注表** - 用户之间可以互相关注
3. **数据库迁移** - 使用 umzug 管理表结构变更
4. **性能优化** - 添加索引加速查询

## ⏭️ 下一关

后端搞定了，前端太简陋？进入 [Level 4: Frontend](../level-4-frontend/) 学习 React！
