# Level 1: Flask Basic - Python 静态页面

> 用 Flask 搭建静态社交平台页面

## 📋 你将学到

- Flask 基础
- Jinja2 模板引擎
- 静态文件服务
- 模拟数据渲染

## 🎯 最终效果

一个类似 X(Twitter) 界面的 Flask 应用，动态渲染模板。

## 📁 项目结构

```
level-1-flask-basic/
├── app.py              # Flask 主应用
├── templates/
│   ├── base.html       # 基础模板
│   ├── index.html      # 首页
│   └── partials/       # 组件模板
│       ├── sidebar.html
│       └── post.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
└── README.md
```

## 🚀 开始吧

### Step 1: 安装 Flask

```bash
pip install flask
```

### Step 2: 创建应用 (app.py)

```python
from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)

# 模拟数据
mock_posts = [
    {
        "id": 1,
        "username": "张三",
        "handle": "@zhangsan",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
        "content": "今天开始学习 Flask 全栈开发！💪 #Python #Flask",
        "time": "2小时前",
        "likes": 42,
        "comments": 8,
        "shares": 3
    },
    {
        "id": 2,
        "username": "李四",
        "handle": "@lisi", 
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
        "content": "Flask 的模板引擎 Jinja2 真的好用，比 Django 的灵活多了。",
        "time": "5小时前",
        "likes": 128,
        "comments": 23,
        "shares": 15
    },
    {
        "id": 3,
        "username": "王五",
        "handle": "@wangwu",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
        "content": "局域网部署的好处：数据在自己手里，不用担心隐私问题。🔒",
        "time": "昨天",
        "likes": 256,
        "comments": 45,
        "shares": 67
    }
]

mock_trends = [
    {"topic": "#Flask", "posts": "12.5K"},
    {"topic": "#Python", "posts": "45.2K"},
    {"topic": "#Web开发", "posts": "8.9K"},
    {"topic": "#局域网", "posts": "2.1K"}
]

mock_suggestions = [
    {"name": "Python小白", "handle": "@python_newbie"},
    {"name": "后端大佬", "handle": "@backend_master"},
    {"name": "全栈工程师", "handle": "@fullstack_dev"}
]

@app.route('/')
def index():
    return render_template('index.html', 
                         posts=mock_posts,
                         trends=mock_trends,
                         suggestions=mock_suggestions)

@app.route('/user/<username>')
def profile(username):
    # 简单的用户页面
    user_posts = [p for p in mock_posts if p['username'] == username]
    return render_template('profile.html', 
                         username=username,
                         posts=user_posts)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### Step 3: 基础模板 (templates/base.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Micro Social{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>
    <div class="container">
        {% include 'partials/sidebar.html' %}
        
        <main class="timeline">
            {% block content %}{% endblock %}
        </main>
        
        {% include 'partials/rightbar.html' %}
    </div>
    
    <script src="{{ url_for('static', filename='js/main.js') }}"></script>
</body>
</html>
```

### Step 4: 首页模板 (templates/index.html)

```html
{% extends 'base.html' %}

{% block content %}
<header>
    <h2>首页</h2>
</header>

<div class="post-box">
    <img src="{{ url_for('static', filename='images/default-avatar.png') }}" alt="头像" class="avatar">
    <input type="text" placeholder="有什么新鲜事？" class="post-input">
    <button class="post-submit">发布</button>
</div>

<div id="posts-container">
    {% for post in posts %}
        {% include 'partials/post.html' %}
    {% endfor %}
</div>
{% endblock %}
```

### Step 5: 推文组件 (templates/partials/post.html)

```html
<div class="post">
    <img src="{{ post.avatar }}" alt="{{ post.username }}" class="avatar">
    <div class="post-content">
        <div class="post-header">
            <span class="username">{{ post.username }}</span>
            <span class="handle">{{ post.handle }}</span>
            <span class="time">{{ post.time }}</span>
        </div>
        <div class="post-text">{{ post.content }}</div>
        <div class="post-actions">
            <span>💬 {{ post.comments }}</span>
            <span>🔄 {{ post.shares }}</span>
            <span>❤️ {{ post.likes }}</span>
        </div>
    </div>
</div>
```

### Step 6: 侧边栏 (templates/partials/sidebar.html)

```html
<nav class="sidebar-left">
    <div class="logo">🐦 Micro Social</div>
    <ul class="nav-menu">
        <li><a href="/">🏠 首页</a></li>
        <li><a href="#">🔍 探索</a></li>
        <li><a href="#">🔔 通知</a></li>
        <li><a href="#">✉️ 私信</a></li>
        <li><a href="#">👤 我的</a></li>
    </ul>
    <button class="post-btn">发布</button>
</nav>
```

### Step 7: 右侧栏 (templates/partials/rightbar.html)

```html
<aside class="sidebar-right">
    <div class="search-box">
        <input type="text" placeholder="搜索">
    </div>
    
    <div class="trends">
        <h3>热门话题</h3>
        <ul>
            {% for trend in trends %}
            <li>
                <div>{{ trend.topic }}</div>
                <small>{{ trend.posts }} 帖子</small>
            </li>
            {% endfor %}
        </ul>
    </div>
    
    <div class="suggestions">
        <h3>推荐关注</h3>
        <ul>
            {% for user in suggestions %}
            <li>
                <div>{{ user.name }}</div>
                <small>{{ user.handle }}</small>
            </li>
            {% endfor %}
        </ul>
    </div>
</aside>
```

## 📚 学习要点

### Flask 核心概念

| 概念 | 说明 | 示例 |
|------|------|------|
| `@app.route()` | 定义路由 | `@app.route('/')` |
| `render_template()` | 渲染模板 | `render_template('index.html')` |
| `url_for()` | 生成 URL | `url_for('static', filename='style.css')` |
| `{% extends %}` | 模板继承 | `{% extends 'base.html' %}` |
| `{% block %}` | 定义区块 | `{% block content %}` |
| `{{ variable }}` | 输出变量 | `{{ post.username }}` |
| `{% for %}` | 循环 | `{% for post in posts %}` |
| `{% if %}` | 条件 | `{% if posts %}` |

### 启动应用

```bash
python app.py
```

访问 `http://localhost:5000`

## 🎯 挑战任务

1. **添加用户页面** - 创建 `/user/<username>` 路由
2. **添加搜索功能** - 实现简单的搜索页面
3. **模板过滤器** - 自定义时间格式化过滤器
4. **静态文件优化** - 使用 Flask-Assets 压缩 CSS/JS

## ⏭️ 下一关

进入 [Level 2: Flask API](../level-2-flask-api/)，学习如何用 Flask 构建 RESTful API！
