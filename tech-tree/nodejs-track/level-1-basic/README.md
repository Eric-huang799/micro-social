# Level 1: Basic - 静态页面

> 目标：搭建一个看起来像社交平台的静态页面

## 📋 你将学到

- HTML5 语义化标签
- CSS Flexbox/Grid 布局
- 响应式设计基础
- 模拟数据的展示

## 🎯 最终效果

一个类似 X(Twitter) 界面的静态页面，包含：
- 顶部导航栏
- 左侧菜单栏
- 中间时间线
- 右侧推荐栏
- 底部发布框

## 📁 项目结构

```
level-1-basic/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── mock-data.js    # 模拟数据
└── README.md           # 本文件
```

## 🚀 开始吧

### Step 1: 创建 HTML 骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Micro Social</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- 这里将填入页面内容 -->
    <script src="js/mock-data.js"></script>
</body>
</html>
```

### Step 2: 搭建页面布局

```html
<div class="container">
    <!-- 左侧导航 -->
    <nav class="sidebar-left">
        <div class="logo">🐦 Micro Social</div>
        <ul class="nav-menu">
            <li>🏠 首页</li>
            <li>🔍 探索</li>
            <li>🔔 通知</li>
            <li>✉️ 私信</li>
            <li>👤 我的</li>
        </ul>
        <button class="post-btn">发布</button>
    </nav>
    
    <!-- 中间时间线 -->
    <main class="timeline">
        <header>
            <h2>首页</h2>
        </header>
        
        <div class="post-box">
            <img src="avatar.jpg" alt="头像" class="avatar">
            <input type="text" placeholder="有什么新鲜事？" class="post-input">
            <button class="post-submit">发布</button>
        </div>
        
        <div id="posts-container"></div>
    </main>
    
    <!-- 右侧推荐 -->
    <aside class="sidebar-right">
        <div class="search-box">
            <input type="text" placeholder="搜索">
        </div>
        
        <div class="trends">
            <h3>热门话题</h3>
            <ul id="trends-list"></ul>
        </div>
        
        <div class="suggestions">
            <h3>推荐关注</h3>
            <ul id="suggestions-list"></ul>
        </div>
    </aside>
</div>
```

### Step 3: 添加样式 (css/style.css)

```css
/* 基础重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #000;
    color: #fff;
}

/* 容器布局 */
.container {
    display: flex;
    max-width: 1265px;
    margin: 0 auto;
}

/* 左侧导航 */
.sidebar-left {
    width: 251px;
    padding: 20px;
    border-right: 1px solid #2f3336;
    position: fixed;
    height: 100vh;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
}

.nav-menu li {
    list-style: none;
    padding: 15px 20px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 30px;
    transition: background 0.2s;
}

.nav-menu li:hover {
    background: #181818;
}

.post-btn {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.post-btn:hover {
    background: #1a8cd8;
}

/* 中间时间线 */
.timeline {
    flex: 1;
    margin-left: 251px;
    margin-right: 350px;
    border-right: 1px solid #2f3336;
    min-height: 100vh;
}

.timeline header {
    padding: 15px 20px;
    border-bottom: 1px solid #2f3336;
    position: sticky;
    top: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
}

.post-box {
    display: flex;
    padding: 15px 20px;
    border-bottom: 1px solid #2f3336;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 15px;
    background: #333;
}

.post-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    outline: none;
}

.post-submit {
    padding: 8px 20px;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

/* 推文卡片 */
.post {
    padding: 15px 20px;
    border-bottom: 1px solid #2f3336;
    display: flex;
}

.post-content {
    flex: 1;
}

.post-header {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
}

.username {
    font-weight: bold;
}

.handle, .time {
    color: #71767b;
}

.post-text {
    margin-bottom: 10px;
    line-height: 1.5;
}

.post-actions {
    display: flex;
    gap: 50px;
    color: #71767b;
}

.post-actions span {
    cursor: pointer;
    transition: color 0.2s;
}

.post-actions span:hover {
    color: #1d9bf0;
}

/* 右侧栏 */
.sidebar-right {
    width: 350px;
    padding: 20px;
    position: fixed;
    right: calc((100vw - 1265px) / 2);
}

.search-box input {
    width: 100%;
    padding: 12px 20px;
    background: #202327;
    border: none;
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
}

.trends, .suggestions {
    background: #16181c;
    border-radius: 15px;
    margin-top: 20px;
    padding: 15px;
}

.trends h3, .suggestions h3 {
    margin-bottom: 15px;
}

.trends li, .suggestions li {
    list-style: none;
    padding: 10px 0;
    border-bottom: 1px solid #2f3336;
}

/* 响应式 */
@media (max-width: 1024px) {
    .sidebar-right {
        display: none;
    }
    .timeline {
        margin-right: 0;
    }
}

@media (max-width: 768px) {
    .sidebar-left {
        display: none;
    }
    .timeline {
        margin-left: 0;
    }
}
```

### Step 4: 模拟数据 (js/mock-data.js)

```javascript
// 模拟推文数据
const mockPosts = [
    {
        id: 1,
        username: "张三",
        handle: "@zhangsan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
        content: "今天开始学习全栈开发，目标是搭建一个社交平台！💪 #编程 #学习",
        time: "2小时前",
        likes: 42,
        comments: 8,
        shares: 3
    },
    {
        id: 2,
        username: "李四",
        handle: "@lisi",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
        content: "React Hooks 真的太好用了，useState 和 useEffect 解决了好多问题。",
        time: "5小时前",
        likes: 128,
        comments: 23,
        shares: 15
    },
    {
        id: 3,
        username: "王五",
        handle: "@wangwu",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
        content: "局域网部署的好处：数据在自己手里，不用担心隐私问题。🔒",
        time: "昨天",
        likes: 256,
        comments: 45,
        shares: 67
    }
];

// 热门话题
const mockTrends = [
    { topic: "#全栈开发", posts: "12.5K" },
    { topic: "#React", posts: "45.2K" },
    { topic: "#NodeJS", posts: "8.9K" },
    { topic: "#局域网", posts: "2.1K" }
];

// 推荐关注
const mockSuggestions = [
    { name: "前端小白", handle: "@frontend_newbie" },
    { name: "后端大佬", handle: "@backend_master" },
    { name: "全栈工程师", handle: "@fullstack_dev" }
];

// 渲染函数
function renderPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = mockPosts.map(post => `
        <div class="post">
            <img src="${post.avatar}" alt="${post.username}" class="avatar">
            <div class="post-content">
                <div class="post-header">
                    <span class="username">${post.username}</span>
                    <span class="handle">${post.handle}</span>
                    <span class="time">${post.time}</span>
                </div>
                <div class="post-text">${post.content}</div>
                <div class="post-actions">
                    <span>💬 ${post.comments}</span>
                    <span>🔄 ${post.shares}</span>
                    <span>❤️ ${post.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTrends() {
    const container = document.getElementById('trends-list');
    container.innerHTML = mockTrends.map(trend => `
        <li>
            <div>${trend.topic}</div>
            <small style="color: #71767b">${trend.posts} 帖子</small>
        </li>
    `).join('');
}

function renderSuggestions() {
    const container = document.getElementById('suggestions-list');
    container.innerHTML = mockSuggestions.map(user => `
        <li>
            <div>${user.name}</div>
            <small style="color: #71767b">${user.handle}</small>
        </li>
    `).join('');
}

// 页面加载时渲染
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    renderTrends();
    renderSuggestions();
});
```

## 🎉 运行项目

1. 创建上述文件
2. 用浏览器打开 `index.html`
3. 你应该能看到一个类似 X 的界面！

## 📖 学习要点

### HTML 语义化
- 使用 `<main>`、`<aside>`、`<nav>` 等语义标签
- 提高可访问性和 SEO

### CSS 技巧
- **Flexbox**: 一维布局（导航、按钮组）
- **Grid**: 二维布局（整体页面）
- **响应式**: 媒体查询适配不同屏幕
- **粘性定位**: `position: sticky` 实现吸顶效果

### JavaScript 基础
- 数组方法：`map()`、`join()`
- DOM 操作：`querySelector`、`innerHTML`
- 事件监听：`addEventListener`

## 🎯 挑战任务

完成基础后，尝试：

1. **添加黑夜/白天切换** - 修改 CSS 变量实现主题切换
2. **实现发布功能** - 点击发布按钮添加新推文（仅前端）
3. **添加动画** - 推文出现时的淡入动画
4. **本地存储** - 用 localStorage 保存发布的推文

## ⏭️ 下一关

准备好后，进入 [Level 2: API](../level-2-api/)，学习如何用 Express.js 构建后端服务！
