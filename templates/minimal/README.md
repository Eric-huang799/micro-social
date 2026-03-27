# Minimal Template - 最简版本

> 开箱即用的最简社交平台，适合快速体验和演示

## ✨ 特点

- ✅ 单文件实现
- ✅ 零配置运行
- ✅ 内存存储（重启清空）
- ✅ 纯 Express.js

## 🚀 快速开始

```bash
cd templates/minimal
npm install
npm start
```

访问 `http://localhost:3000`

## 📁 文件

```
minimal/
├── server.js          # 完整的后端+前端
├── package.json
└── README.md
```

## 📖 代码示例

一个文件搞定所有：

```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// 内存数据
let posts = [];

// API
app.get('/api/posts', (req, res) => res.json(posts));
app.post('/api/posts', (req, res) => {
    posts.unshift({ id: Date.now(), ...req.body, time: new Date() });
    res.json(posts[0]);
});

app.listen(3000, () => console.log('http://localhost:3000'));
```
