# Level 4: Frontend - React 现代前端

> 目标：用 React 18 重构前端，实现组件化和状态管理

## 📋 前置要求

- 完成 [Level 3](../level-3-database/)
- 了解 ES6+ 语法

## 🎯 最终效果

- React 单页应用 (SPA)
- 组件化开发
- 现代化 UI
- 与后端 API 对接

## 📁 项目结构

```
level-4-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # 组件
│   │   ├── Sidebar.jsx
│   │   ├── Post.jsx
│   │   ├── PostList.jsx
│   │   └── Trends.jsx
│   ├── pages/             # 页面
│   │   ├── Home.jsx
│   │   └── Profile.jsx
│   ├── hooks/             # 自定义 Hooks
│   │   └── usePosts.js
│   ├── api/               # API 封装
│   │   └── index.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 开始

### Step 1: 创建 React 项目

```bash
npx create-react-app level-4-frontend
cd level-4-frontend
npm install axios react-router-dom
```

### Step 2: API 封装 (src/api/index.js)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const postAPI = {
    getAll: (page = 1, limit = 10) => 
        api.get(`/posts?page=${page}&limit=${limit}`),
    
    create: (data) => 
        api.post('/posts', data),
    
    like: (id) => 
        api.post(`/posts/${id}/like`),
    
    search: (query) => 
        api.get(`/search?q=${encodeURIComponent(query)}`)
};

export default api;
```

### Step 3: 自定义 Hook (src/hooks/usePosts.js)

```javascript
import { useState, useEffect } from 'react';
import { postAPI } from '../api';

export function usePosts(page = 1) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await postAPI.getAll(page);
                setPosts(response.data.data);
                setPagination(response.data.pagination);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const createPost = async (content, userId) => {
        try {
            const response = await postAPI.create({
                user_id: userId,
                content
            });
            setPosts([response.data.data, ...posts]);
            return response.data.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const likePost = async (postId) => {
        try {
            const response = await postAPI.like(postId);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, likes: response.data.data.likes }
                    : post
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    return { posts, loading, error, pagination, createPost, likePost };
}
```

### Step 4: 组件开发

**Post 组件** (src/components/Post.jsx)

```jsx
import React from 'react';
import './Post.css';

function Post({ post, onLike }) {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="post">
            <img 
                src={post.avatar || '/default-avatar.png'} 
                alt={post.username}
                className="post-avatar"
            />
            <div className="post-content">
                <div className="post-header">
                    <span className="post-username">{post.username}</span>
                    <span className="post-handle">{post.handle}</span>
                    <span className="post-time">{formatTime(post.created_at)}</span>
                </div>
                <p className="post-text">{post.content}</p>
                <div className="post-actions">
                    <button className="action-btn">
                        💬 评论
                    </button>
                    <button className="action-btn">
                        🔄 转发
                    </button>
                    <button 
                        className="action-btn like-btn"
                        onClick={() => onLike(post.id)}
                    >
                        ❤️ {post.likes}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;
```

**Post.css**

```css
.post {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #2f3336;
    transition: background 0.2s;
}

.post:hover {
    background: rgba(255,255,255,0.03);
}

.post-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
}

.post-content {
    flex: 1;
}

.post-header {
    margin-bottom: 4px;
}

.post-username {
    font-weight: 700;
    margin-right: 4px;
}

.post-handle,
.post-time {
    color: #71767b;
}

.post-text {
    margin: 8px 0;
    line-height: 1.5;
    font-size: 15px;
}

.post-actions {
    display: flex;
    gap: 48px;
    margin-top: 12px;
}

.action-btn {
    background: none;
    border: none;
    color: #71767b;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
}

.action-btn:hover {
    color: #1d9bf0;
}

.like-btn:hover {
    color: #f91880;
}
```

### Step 5: 主应用 (src/App.jsx)

```jsx
import React, { useState } from 'react';
import { usePosts } from './hooks/usePosts';
import Post from './components/Post';
import './App.css';

function App() {
    const [page, setPage] = useState(1);
    const [newPost, setNewPost] = useState('');
    const { posts, loading, error, pagination, createPost, likePost } = usePosts(page);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        
        await createPost(newPost, 1); // 临时使用 user_id = 1
        setNewPost('');
    };

    return (
        <div className="app">
            <header className="header">
                <h1>首页</h1>
            </header>

            <form className="post-form" onSubmit={handleSubmit}>
                <img 
                    src="/default-avatar.png" 
                    alt="avatar"
                    className="avatar"
                />
                <input
                    type="text"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="有什么新鲜事？"
                    className="post-input"
                />
                <button 
                    type="submit"
                    className="submit-btn"
                    disabled={!newPost.trim()}
                >
                    发布
                </button>
            </form>

            {loading && <div className="loading">加载中...</div>}
            {error && <div className="error">错误: {error}</div>}

            <div className="post-list">
                {posts.map(post => (
                    <Post key={post.id} post={post} onLike={likePost} />
                ))}
            </div>

            {pagination && (
                <div className="pagination">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        上一页
                    </button>
                    <span>{page} / {pagination.pages}</span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === pagination.pages}
                    >
                        下一页
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
```

## 📚 学习要点

### React 核心

| 概念 | 说明 |
|------|------|
| Component | 可复用的 UI 单元 |
| Props | 父传子的数据 |
| State | 组件内部状态 |
| Hooks | useState, useEffect 等 |
| JSX | 类 HTML 语法 |

### 自定义 Hook 优势

- 逻辑复用
- 分离 UI 和数据
- 便于测试

## 🎯 挑战任务

1. **添加路由** - 首页、个人页、搜索页
2. **状态管理** - 使用 Zustand 或 Redux Toolkit
3. **图片上传** - 集成图片上传功能
4. **无限滚动** - 替代分页组件

## ⏭️ 下一关

还差用户认证和一些高级功能？进入 [Level 5: Full Stack](../level-5-fullstack/) 完成最终版本！
