# Level 4: Django Full - Django 完整实现

> 使用 Django REST Framework 构建完整的社交平台 API

## 📋 前置要求

- 完成 [Level 3](../level-3-django-basic/)

## 🎯 最终效果

- RESTful API
- JWT 认证
- 全功能社交特性
- 实时 WebSocket

## 📁 项目结构

```
level-4-django-full/
├── microsocial/
├── posts/
├── users/
├── api/                  # REST API
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── chat/                 # 私信
├── requirements.txt
└── README.md
```

## 🚀 开始

### Step 1: 安装依赖

```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt channels
```

requirements.txt:
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.3.1
channels==4.0.0
channels-redis==4.1.0
Pillow==10.1.0
```

### Step 2: 配置 (settings.py)

```python
INSTALLED_APPS = [
    # Django 默认
    'django.contrib.admin',
    'django.contrib.auth',
    ...
    # 第三方
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    # 你的应用
    'users',
    'posts',
    'api',
    'chat',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# JWT 配置
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# Channels (WebSocket)
ASGI_APPLICATION = 'microsocial.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

CORS_ALLOW_ALL_ORIGINS = True
```

### Step 3: 序列化器 (api/serializers.py)

```python
from rest_framework import serializers
from django.contrib.auth.models import User
from posts.models import Post, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        extra_kwargs = {'password': {'write_only': True}}

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    like_count = serializers.IntegerField(source='likes.count', read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'like_count', 'comment_count', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']
```

### Step 4: API 视图 (api/views.py)

```python
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from posts.models import Post, Comment
from .serializers import UserSerializer, PostSerializer, CommentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'token': str(refresh.access_token),
            'refresh': str(refresh)
        })

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        
        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True
        
        return Response({'liked': liked, 'count': post.likes.count()})
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)
```

### Step 5: URL 路由 (api/urls.py)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', UserViewSet.as_view({'post': 'register'})),
]
```

### Step 6: WebSocket 消费者 (chat/consumers.py)

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SocialConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("social", self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("social", self.channel_name)
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            "social",
            {
                "type": "social_message",
                "message": data
            }
        )
    
    async def social_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))
```

### Step 7: 运行

```bash
# 迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 运行（支持 WebSocket）
python manage.py runserver 0.0.0.0:8000
```

## 📚 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register/ | 注册 |
| POST | /api/auth/login/ | 登录 |
| GET | /api/posts/ | 推文列表 |
| POST | /api/posts/ | 发布推文 |
| POST | /api/posts/1/like/ | 点赞 |
| GET | /api/posts/1/comments/ | 评论列表 |

## 🎉 恭喜！

已完成 Python 路线的全部内容！
