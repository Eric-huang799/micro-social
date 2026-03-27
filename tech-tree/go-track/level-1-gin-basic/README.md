# Level 1: Gin Basic - Go 语言基础

> 使用 Go + Gin 框架搭建高性能社交平台

## 📋 你将学到

- Go 语言基础语法
- Gin Web 框架
- Go 模板引擎 (html/template)
- 静态文件服务

## 🎯 最终效果

一个类似 X(Twitter) 界面的 Go Web 应用，渲染 HTML 模板。

## 📁 项目结构

```
level-1-gin-basic/
├── main.go              # 主程序
├── go.mod               # Go 模块
├── templates/           # HTML 模板
│   ├── base.html
│   ├── index.html
│   └── partials/
│       ├── sidebar.html
│       └── post.html
├── static/              # 静态文件
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
└── README.md
```

## 🚀 开始吧

### Step 1: 初始化 Go 模块

```bash
mkdir level-1-gin-basic
cd level-1-gin-basic
go mod init microsocial
go get -u github.com/gin-gonic/gin
```

### Step 2: 创建主程序 (main.go)

```go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// Post 推文结构体
type Post struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Handle   string `json:"handle"`
	Avatar   string `json:"avatar"`
	Content  string `json:"content"`
	Time     string `json:"time"`
	Likes    int    `json:"likes"`
	Comments int    `json:"comments"`
	Shares   int    `json:"shares"`
}

// Trend 热门话题
type Trend struct {
	Topic string `json:"topic"`
	Posts string `json:"posts"`
}

// UserSuggestion 推荐用户
type UserSuggestion struct {
	Name   string `json:"name"`
	Handle string `json:"handle"`
}

// 模拟数据
var mockPosts = []Post{
	{
		ID:       1,
		Username: "张三",
		Handle:   "@zhangsan",
		Avatar:   "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
		Content:  "今天开始学习 Go 语言全栈开发！💪 #GoLang #Gin",
		Time:     "2小时前",
		Likes:    42,
		Comments: 8,
		Shares:   3,
	},
	{
		ID:       2,
		Username: "李四",
		Handle:   "@lisi",
		Avatar:   "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
		Content:  "Go 语言的并发模型 goroutine 真的太强大了，性能无敌！",
		Time:     "5小时前",
		Likes:    128,
		Comments: 23,
		Shares:   15,
	},
}

var mockTrends = []Trend{
	{Topic: "#GoLang", Posts: "25.5K"},
	{Topic: "#Gin", Posts: "8.2K"},
	{Topic: "#后端开发", Posts: "15.6K"},
}

var mockSuggestions = []UserSuggestion{
	{Name: "Go语言小白", Handle: "@golang_newbie"},
	{Name: "后端大佬", Handle: "@backend_master"},
}

func main() {
	// 创建 Gin 路由
	r := gin.Default()
	
	// 加载模板
	r.LoadHTMLGlob("templates/**/*")
	
	// 静态文件服务
	r.Static("/static", "./static")
	
	// 首页路由
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title":       "Micro Social",
			"posts":       mockPosts,
			"trends":      mockTrends,
			"suggestions": mockSuggestions,
		})
	})
	
	// 用户页面
	r.GET("/user/:username", func(c *gin.Context) {
		username := c.Param("username")
		c.HTML(http.StatusOK, "user.html", gin.H{
			"username": username,
		})
	})
	
	// API 路由
	r.GET("/api/posts", getPosts)
	r.GET("/api/posts/:id", getPost)
	
	// 启动服务器
	r.Run(":8080")
}

// 获取所有推文
func getPosts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    mockPosts,
	})
}

// 获取单条推文
func getPost(c *gin.Context) {
	id := c.Param("id")
	// 简化处理，实际应该转换 id 并查找
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"id":      id,
	})
}
```

### Step 3: 基础模板 (templates/base.html)

```html
{{define "base.html"}}
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{.title}}</title>
    <link rel="stylesheet" href="/static/css/style.css">
{{block "head" .}}{{end}}
</head>
<body>
    <div class="container">
        {{template "partials/sidebar.html" .}}
        
        <main class="timeline">
            {{block "content" .}}{{end}}
        </main>
        
        {{template "partials/rightbar.html" .}}
    </div>
    
    <script src="/static/js/main.js"></script>
{{block "scripts" .}}{{end}}
</body>
</html>
{{end}}
```

### Step 4: 首页模板 (templates/index.html)

```html
{{define "index.html"}}
{{template "base.html" .}}

{{define "content"}}
<header>
    <h2>首页</h2>
</header>

<div class="post-box">
    <img src="/static/images/avatar.png" alt="头像" class="avatar">
    <input type="text" placeholder="有什么新鲜事？" class="post-input">
    <button class="post-submit">发布</button>
</div>

<div id="posts-container">
    {{range .posts}}
        {{template "partials/post.html" .}}
    {{end}}
</div>
{{end}}

{{end}}
```

### Step 5: 推文组件 (templates/partials/post.html)

```html
{{define "partials/post.html"}}
<div class="post">
    <img src="{{.Avatar}}" alt="{{.Username}}" class="avatar">
    <div class="post-content">
        <div class="post-header">
            <span class="username">{{.Username}}</span>
            <span class="handle">{{.Handle}}</span>
            <span class="time">{{.Time}}</span>
        </div>
        <div class="post-text">{{.Content}}</div>
        <div class="post-actions">
            <span>💬 {{.Comments}}</span>
            <span>🔄 {{.Shares}}</span>
            <span>❤️ {{.Likes}}</span>
        </div>
    </div>
</div>
{{end}}
```

### Step 6: 侧边栏 (templates/partials/sidebar.html)

```html
{{define "partials/sidebar.html"}}
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
{{end}}
```

### Step 7: 右侧栏 (templates/partials/rightbar.html)

```html
{{define "partials/rightbar.html"}}
<aside class="sidebar-right">
    <div class="search-box">
        <input type="text" placeholder="搜索">
    </div>
    
    <div class="trends">
        <h3>热门话题</h3>
        <ul>
            {{range .trends}}
            <li>
                <div>{{.Topic}}</div>
                <small>{{.Posts}} 帖子</small>
            </li>
            {{end}}
        </ul>
    </div>
    
    <div class="suggestions">
        <h3>推荐关注</h3>
        <ul>
            {{range .suggestions}}
            <li>
                <div>{{.Name}}</div>
                <small>{{.Handle}}</small>
            </li>
            {{end}}
        </ul>
    </div>
</aside>
{{end}}
```

## 📚 学习要点

### Go 基础语法

```go
// 变量声明
name := "张三"           // 短变量声明
var age int = 25       // 完整声明

// 结构体
type User struct {
    ID       int
    Username string
}

// 切片（动态数组）
posts := []Post{}
posts = append(posts, newPost)

// 循环
for i, post := range posts {
    fmt.Println(i, post.Content)
}

// 函数
func getPosts() []Post {
    return posts
}
```

### Gin 核心概念

| 方法 | 说明 | 示例 |
|------|------|------|
| `r.GET()` | 处理 GET 请求 | `r.GET("/posts", handler)` |
| `r.POST()` | 处理 POST 请求 | `r.POST("/posts", handler)` |
| `c.Param()` | URL 参数 | `c.Param("id")` |
| `c.Query()` | 查询参数 | `c.Query("page")` |
| `c.JSON()` | 返回 JSON | `c.JSON(200, data)` |
| `c.HTML()` | 返回 HTML | `c.HTML(200, "index.html", data)` |

### 模板语法

```html
{{.Variable}}        <!-- 输出变量 -->
{{range .Items}}     <!-- 循环 -->
    {{.Field}}
{{end}}
{{if .Condition}}    <!-- 条件 -->
    ...
{{end}}
{{template "name" .}} <!-- 引入子模板 -->
```

## 🚀 运行

```bash
go run main.go
```

访问 `http://localhost:8080`

## 🎯 挑战任务

1. **添加中间件** - 使用 Logger 记录请求
2. **表单处理** - 实现发布推文表单提交
3. **模板函数** - 自定义时间格式化函数
4. **分组路由** - 使用路由组组织 API

## ⏭️ 下一关

进入 [Level 2: Gin API](../level-2-gin-api/)，学习构建 RESTful API！
