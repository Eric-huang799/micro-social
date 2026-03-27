# Level 2: Gin API - Go RESTful 后端

> 使用 Go + Gin 构建高性能 RESTful API

## 📋 前置要求

- 完成 [Level 1](../level-1-gin-basic/)

## 🎯 最终效果

- RESTful API 服务
- JSON 数据处理
- 请求验证
- 中间件使用

## 📁 项目结构

```
level-2-gin-api/
├── main.go
├── handlers/
│   └── post.go
├── models/
│   └── post.go
├── middleware/
│   └── cors.go
├── go.mod
└── README.md
```

## 🚀 开始

### Step 1: 初始化项目

```bash
mkdir level-2-gin-api
cd level-2-gin-api
go mod init microsocial-api
go get -u github.com/gin-gonic/gin
go get -u github.com/google/uuid
```

### Step 2: 数据模型 (models/post.go)

```go
package models

import (
	"time"
	"github.com/google/uuid"
)

// Post 推文模型
type Post struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Handle    string    `json:"handle"`
	Content   string    `json:"content"`
	Likes     int       `json:"likes"`
	CreatedAt time.Time `json:"created_at"`
}

// CreatePostRequest 创建请求
type CreatePostRequest struct {
	Username string `json:"username" binding:"required"`
	Handle   string `json:"handle"`
	Content  string `json:"content" binding:"required,max=280"`
}

// Response 统一响应格式
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// NewPost 创建新推文
func NewPost(username, handle, content string) *Post {
	return &Post{
		ID:        uuid.New().String()[:8],
		Username:  username,
		Handle:    handle,
		Content:   content,
		Likes:     0,
		CreatedAt: time.Now(),
	}
}
```

### Step 3: 处理器 (handlers/post.go)

```go
package handlers

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"microsocial-api/models"
)

// 内存存储（线程安全）
var (
	posts = make(map[string]*models.Post)
	mu    sync.RWMutex
)

func init() {
	// 初始化一些数据
	post1 := models.NewPost("张三", "@zhangsan", "第一条推文！")
	post2 := models.NewPost("李四", "@lisi", "Hello Go!")
	posts[post1.ID] = post1
	posts[post2.ID] = post2
}

// GetPosts 获取所有推文
func GetPosts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	mu.RLock()
	defer mu.RUnlock()
	
	// 转换为切片
	var result []*models.Post
	for _, post := range posts {
		result = append(result, post)
	}
	
	// 分页逻辑（简化版）
	start := (page - 1) * limit
	end := start + limit
	if start > len(result) {
		start = len(result)
	}
	if end > len(result) {
		end = len(result)
	}
	
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data: gin.H{
			"posts": result[start:end],
			"pagination": gin.H{
				"page":  page,
				"limit": limit,
				"total": len(posts),
			},
		},
	})
}

// GetPost 获取单条推文
func GetPost(c *gin.Context) {
	id := c.Param("id")
	
	mu.RLock()
	defer mu.RUnlock()
	
	post, exists := posts[id]
	if !exists {
		c.JSON(http.StatusNotFound, models.Response{
			Success: false,
			Error:   "Post not found",
		})
		return
	}
	
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    post,
	})
}

// CreatePost 创建推文
func CreatePost(c *gin.Context) {
	var req models.CreatePostRequest
	
	// 绑定并验证请求数据
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	
	// 创建新推文
	post := models.NewPost(req.Username, req.Handle, req.Content)
	
	mu.Lock()
	posts[post.ID] = post
	mu.Unlock()
	
	c.JSON(http.StatusCreated, models.Response{
		Success: true,
		Data:    post,
	})
}

// LikePost 点赞
func LikePost(c *gin.Context) {
	id := c.Param("id")
	
	mu.Lock()
	defer mu.Unlock()
	
	post, exists := posts[id]
	if !exists {
		c.JSON(http.StatusNotFound, models.Response{
			Success: false,
			Error:   "Post not found",
		})
		return
	}
	
	post.Likes++
	
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    post,
	})
}

// DeletePost 删除推文
func DeletePost(c *gin.Context) {
	id := c.Param("id")
	
	mu.Lock()
	defer mu.Unlock()
	
	_, exists := posts[id]
	if !exists {
		c.JSON(http.StatusNotFound, models.Response{
			Success: false,
			Error:   "Post not found",
		})
		return
	}
	
	delete(posts, id)
	
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    gin.H{"message": "Deleted"},
	})
}

// SearchPosts 搜索推文
func SearchPosts(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Error:   "Query parameter 'q' is required",
		})
		return
	}
	
	mu.RLock()
	defer mu.RUnlock()
	
	var results []*models.Post
	for _, post := range posts {
		// 简单的字符串包含搜索
		if contains(post.Content, query) || contains(post.Username, query) {
			results = append(results, post)
		}
	}
	
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data:    results,
	})
}

// 辅助函数：字符串包含检查
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
```

### Step 4: 中间件 (middleware/cors.go)

```go
package middleware

import "github.com/gin-gonic/gin"

// CORS 跨域中间件
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	}
}
```

### Step 5: 主程序 (main.go)

```go
package main

import (
	"github.com/gin-gonic/gin"
	"microsocial-api/handlers"
	"microsocial-api/middleware"
)

func main() {
	// 设置 Gin 模式
	gin.SetMode(gin.ReleaseMode)
	
	// 创建路由
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.CORS())
	
	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
	
	// API 路由组
	api := r.Group("/api")
	{
		// 推文路由
		api.GET("/posts", handlers.GetPosts)
		api.GET("/posts/:id", handlers.GetPost)
		api.POST("/posts", handlers.CreatePost)
		api.POST("/posts/:id/like", handlers.LikePost)
		api.DELETE("/posts/:id", handlers.DeletePost)
		
		// 搜索
		api.GET("/search", handlers.SearchPosts)
	}
	
	// 启动服务器
	r.Run(":8080")
}
```

## 📚 学习要点

### Gin 请求处理

```go
// URL 参数
c.Param("id")           // /posts/:id

// 查询参数
c.Query("page")         // ?page=1
c.DefaultQuery("limit", "10")

// JSON 请求体
var req models.CreatePostRequest
c.ShouldBindJSON(&req)

// 返回 JSON
c.JSON(200, data)
c.JSON(404, gin.H{"error": "not found"})
```

### 数据验证

```go
type CreatePostRequest struct {
    Username string `json:"username" binding:"required"`      // 必填
    Content  string `json:"content" binding:"required,max=280"` // 必填，最多280字符
    Email    string `json:"email" binding:"required,email"`     // 必须是邮箱格式
}
```

### 并发安全

```go
var mu sync.RWMutex

// 读操作
mu.RLock()
value := data[key]
mu.RUnlock()

// 写操作
mu.Lock()
data[key] = value
mu.Unlock()
```

## 🧪 API 测试

### 获取推文列表
```bash
curl http://localhost:8080/api/posts
```

### 发布推文
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"username":"王五","content":"Go 语言真香！"}'
```

### 点赞
```bash
curl -X POST http://localhost:8080/api/posts/xxx/like
```

### 搜索
```bash
curl "http://localhost:8080/api/search?q=Go"
```

## 🎯 挑战任务

1. **添加用户认证** - JWT token 验证
2. **数据库集成** - 使用 GORM + SQLite
3. **日志中间件** - 记录请求日志
4. **错误处理** - 统一错误响应格式

## ⏭️ 下一关

进入 [Level 3: Gin Advanced](../level-3-gin-advanced/)，学习数据库、认证和 WebSocket！
