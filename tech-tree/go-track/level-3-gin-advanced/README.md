# Level 3: Gin Advanced - Go 高级实现

> 使用 Go + Gin + GORM 构建完整的社交平台

## 📋 前置要求

- 完成 [Level 2](../level-2-gin-api/)

## 🎯 最终效果

- GORM 数据库操作
- JWT 身份认证
- WebSocket 实时通信
- 完整社交功能

## 📁 项目结构

```
level-3-gin-advanced/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   └── database.go
│   ├── handlers/
│   │   ├── auth.go
│   │   ├── post.go
│   │   └── websocket.go
│   ├── middleware/
│   │   └── auth.go
│   ├── models/
│   │   ├── user.go
│   │   └── post.go
│   └── websocket/
│       └── hub.go
├── go.mod
└── README.md
```

## 🚀 开始

### Step 1: 安装依赖

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/gorilla/websocket
go get -u golang.org/x/crypto/bcrypt
```

### Step 2: 配置文件 (internal/config/config.go)

```go
package config

import (
	"os"
)

type Config struct {
	Port      string
	Database  string
	JWTSecret string
}

func Load() *Config {
	return &Config{
		Port:      getEnv("PORT", "8080"),
		Database:  getEnv("DATABASE", "social.db"),
		JWTSecret: getEnv("JWT_SECRET", "your-secret-key"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
```

### Step 3: 数据库 (internal/database/database.go)

```go
package database

import (
	"log"
	"microsocial/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(dsn string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}
	
	// 自动迁移
	DB.AutoMigrate(&models.User{},&models.Post{},
		&models.Comment{},
		&models.Follow{},
	)
	
	log.Println("Database connected")
}
```

### Step 4: 模型 (internal/models/)

**user.go**

```go
package models

import (
	"time"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Username string `gorm:"uniqueIndex;not null" json:"username"`
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Password string `json:"-"` // 不返回密码
	Handle   string `gorm:"uniqueIndex" json:"handle"`
	Avatar   string `json:"avatar"`
	Bio      string `json:"bio"`
	
	Posts    []Post    `json:"posts,omitempty"`
	Likes    []Post    `gorm:"many2many:post_likes;" json:"-"`
	Followers []User   `gorm:"many2many:follows;joinForeignKey:FollowingID;JoinReferences:FollowerID" json:"followers,omitempty"`
	Following []User   `gorm:"many2many:follows;joinForeignKey:FollowerID;JoinReferences:FollowingID" json:"following,omitempty"`
}

func (u *User) SetPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hash)
	return nil
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
```

**post.go**

```go
package models

import (
	"time"
	"gorm.io/gorm"
)

type Post struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	UserID  uint   `json:"user_id"`
	User    User   `json:"user,omitempty"`
	Content string `gorm:"not null" json:"content"`
	Image   string `json:"image,omitempty"`
	
	Likes    []User    `gorm:"many2many:post_likes;" json:"-"`
	Comments []Comment `json:"comments,omitempty"`
}

func (p *Post) LikeCount(db *gorm.DB) int64 {
	var count int64
	db.Model(p).Association("Likes").Count(&count)
	return count
}

type Comment struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	
	PostID  uint   `json:"post_id"`
	UserID  uint   `json:"user_id"`
	User    User   `json:"user,omitempty"`
	Content string `json:"content"`
}

type Follow struct {
	FollowerID  uint `gorm:"primaryKey"`
	FollowingID uint `gorm:"primaryKey"`
	CreatedAt   time.Time
}
```

### Step 5: JWT 中间件 (internal/middleware/auth.go)

```go
package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"microsocial/internal/config"
)

type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint, email string) (string, error) {
	cfg := config.Load()
	
	claims := Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}

func AuthMiddleware() gin.HandlerFunc {
	cfg := config.Load()
	
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}
		
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header"})
			c.Abort()
			return
		}
		
		tokenString := parts[1]
		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})
		
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
		
		if claims, ok := token.Claims.(*Claims); ok && token.Valid {
			c.Set("userID", claims.UserID)
			c.Set("email", claims.Email)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
		}
	}
}
```

### Step 6: 认证处理器 (internal/handlers/auth.go)

```go
package handlers

import (
	"net/http"
	"microsocial/internal/database"
	"microsocial/internal/middleware"
	"microsocial/internal/models"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 检查用户是否存在
	var existingUser models.User
	if result := database.DB.Where("email = ?", req.Email).First(&existingUser); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}
	
	// 创建用户
	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Handle:   "@" + req.Username,
	}
	
	if err := user.SetPassword(req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	
	if result := database.DB.Create(&user); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	
	// 生成 token
	token, _ := middleware.GenerateToken(user.ID, user.Email)
	
	c.JSON(http.StatusCreated, gin.H{
		"user":  user,
		"token": token,
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 查找用户
	var user models.User
	if result := database.DB.Where("email = ?", req.Email).First(&user); result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	
	// 验证密码
	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	
	// 生成 token
	token, _ := middleware.GenerateToken(user.ID, user.Email)
	
	c.JSON(http.StatusOK, gin.H{
		"user":  user,
		"token": token,
	})
}

func GetMe(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	var user models.User
	if result := database.DB.First(&user, userID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	
	c.JSON(http.StatusOK, user)
}
```

### Step 7: 主程序 (cmd/server/main.go)

```go
package main

import (
	"microsocial/internal/config"
	"microsocial/internal/database"
	"microsocial/internal/handlers"
	"microsocial/internal/middleware"
	"microsocial/internal/websocket"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	
	// 连接数据库
	database.Connect(cfg.Database)
	
	// 创建路由
	r := gin.Default()
	r.Use(middleware.CORS())
	
	// 公开路由
	r.POST("/api/auth/register", handlers.Register)
	r.POST("/api/auth/login", handlers.Login)
	
	// 需要认证的路由
	authorized := r.Group("/api")
	authorized.Use(middleware.AuthMiddleware())
	{
		authorized.GET("/me", handlers.GetMe)
		
		// 推文
		authorized.GET("/posts", handlers.GetPosts)
		authorized.POST("/posts", handlers.CreatePost)
		authorized.POST("/posts/:id/like", handlers.LikePost)
		authorized.DELETE("/posts/:id", handlers.DeletePost)
		
		// 用户
		authorized.POST("/users/:id/follow", handlers.FollowUser)
	}
	
	// WebSocket
	hub := websocket.NewHub()
	go hub.Run()
	r.GET("/ws", func(c *gin.Context) {
		websocket.ServeWs(hub, c.Writer, c.Request)
	})
	
	// 启动服务器
	r.Run(":" + cfg.Port)
}
```

## 📚 学习要点

### GORM 基础

```go
// 创建
db.Create(&user)

// 查询
db.First(&user, 1)           // 按主键
db.Where("email = ?", email).First(&user)

// 更新
db.Model(&user).Update("name", "new_name")

// 删除
db.Delete(&user)

// 关联
user.Posts  // 获取用户的推文
post.Likes  // 获取点赞的用户
```

### JWT 认证流程

```
1. 用户登录 → 验证密码
2. 生成 JWT Token
3. 客户端存储 Token
4. 每次请求携带 Token (Authorization: Bearer xxx)
5. 服务端验证 Token
6. 返回受保护的数据
```

## 🚀 运行

```bash
# 设置环境变量（可选）
export PORT=8080
export JWT_SECRET=your-secret-key

# 运行
go run cmd/server/main.go
```

## 🎉 恭喜！

已完成 Go 路线的全部内容！

## 📊 性能优势

Go 相比 Node.js/Python：
- 更高的并发处理能力（goroutine）
- 更低的内存占用
- 更快的启动速度
- 编译型语言，部署简单

**Happy Coding with Go! 🚀**
