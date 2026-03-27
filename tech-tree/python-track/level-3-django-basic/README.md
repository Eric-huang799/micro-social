# Level 3: Django Basic - Django 基础

> 使用 Django 全功能框架快速搭建社交平台

## 📋 前置要求

- Python 基础
- 了解 HTTP 和数据库基础

## 🎯 最终效果

- Django 项目结构
- Admin 管理后台
- ORM 数据库操作
- 模板渲染

## 📁 项目结构

```
level-3-django-basic/
├── microsocial/          # 项目配置
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── posts/                # 推文应用
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
├── users/                # 用户应用
│   └── ...
├── manage.py
└── README.md
```

## 🚀 开始

### Step 1: 创建 Django 项目

```bash
# 安装 Django
pip install django

# 创建项目
django-admin startproject microsocial
cd microsocial

# 创建应用
python manage.py startapp posts
python manage.py startapp users
```

### Step 2: 配置项目 (microsocial/settings.py)

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 你的应用
    'posts',
    'users',
]

# 允许所有主机访问（局域网）
ALLOWED_HOSTS = ['*']

# 数据库使用 SQLite（默认）
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 静态文件
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
```

### Step 3: 定义模型 (posts/models.py)

```python
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=280)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}"
    
    @property
    def like_count(self):
        return self.likes.count()

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
```

### Step 4: 视图 (posts/views.py)

```python
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Post

def home(request):
    """首页时间线"""
    posts = Post.objects.all()[:20]
    return render(request, 'posts/home.html', {'posts': posts})

def post_detail(request, post_id):
    """推文详情"""
    post = get_object_or_404(Post, id=post_id)
    return render(request, 'posts/detail.html', {'post': post})

@login_required
def create_post(request):
    """发布推文"""
    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Post.objects.create(user=request.user, content=content)
        return redirect('home')
    return render(request, 'posts/create.html')

@login_required
def like_post(request, post_id):
    """点赞/取消点赞"""
    post = get_object_or_404(Post, id=post_id)
    
    if request.user in post.likes.all():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'liked': liked,
            'count': post.like_count
        })
    
    return redirect('home')
```

### Step 5: URL 配置 (posts/urls.py)

```python
from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('', views.home, name='home'),
    path('post/<int:post_id>/', views.post_detail, name='detail'),
    path('post/create/', views.create_post, name='create'),
    path('post/<int:post_id>/like/', views.like_post, name='like'),
]
```

### Step 6: 主 URL 配置 (microsocial/urls.py)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),  # 内置登录/登出
]
```

### Step 7: 模板 (posts/templates/posts/home.html)

```html
{% extends 'base.html' %}

{% block content %}
<div class="timeline">
    <header>
        <h2>首页</h2>
    </header>
    
    {% if user.is_authenticated %}
    <form method="post" action="{% url 'posts:create' %}" class="post-box">
        {% csrf_token %}
        <input type="text" name="content" placeholder="有什么新鲜事？" maxlength="280">
        <button type="submit">发布</button>
    </form>
    {% endif %}
    
    <div class="posts">
        {% for post in posts %}
        <article class="post">
            <div class="post-header">
                <strong>{{ post.user.username }}</strong>
                <span class="time">{{ post.created_at|timesince }}前</span>
            </div>
            <p>{{ post.content }}</p>
            <div class="post-actions">
                <a href="{% url 'posts:like' post.id %}">
                    ❤️ {{ post.like_count }}
                </a>
            </div>
        </article>
        {% empty %}
        <p>还没有推文，来发布第一条吧！</p>
        {% endfor %}
    </div>
</div>
{% endblock %}
```

### Step 8: Admin 注册 (posts/admin.py)

```python
from django.contrib import admin
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'content', 'created_at', 'like_count']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
```

### Step 9: 运行

```bash
# 数据库迁移
python manage.py makemigrations
python manage.py migrate

# 创建管理员
python manage.py createsuperuser

# 运行服务器
python manage.py runserver 0.0.0.0:8000
```

访问：
- 首页：`http://localhost:8000`
- Admin：`http://localhost:8000/admin`

## 📚 学习要点

### Django MTV 模式

| 组件 | 作用 | 对应文件 |
|------|------|----------|
| Model | 数据模型 | `models.py` |
| Template | 视图模板 | `templates/` |
| View | 业务逻辑 | `views.py` |

### ORM 常用操作

```python
# 创建
Post.objects.create(user=user, content="Hello")

# 查询所有
posts = Post.objects.all()

# 条件查询
posts = Post.objects.filter(user__username="张三")

# 排序
posts = Post.objects.order_by('-created_at')

# 分页
posts = Post.objects.all()[:10]

# 关联查询
user.posts.all()  # 用户的所有推文
post.likes.all()  # 点赞的用户
```

## ⏭️ 下一关

进入 [Level 4: Django Full](../level-4-django-full/)，学习 Django REST Framework 和完整功能实现！
