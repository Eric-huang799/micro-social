# Level 2: Flask API - RESTful 后端服务

> 用 Flask 构建 RESTful API 服务

## 📋 前置要求

- 完成 [Level 1](../level-1-flask-basic/)

## 🎯 最终效果

- Flask RESTful API
- JSON 数据交互
- 请求验证
- Postman 测试

## 📁 项目结构

```
level-2-flask-api/
├── app.py
├── models.py
├── requirements.txt
└── README.md
```

## 🚀 开始

### Step 1: 安装依赖

```bash
pip install flask flask-cors
```

### Step 2: 创建 API (app.py)

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域

# 内存数据存储
posts = [
    {
        "id": 1,
        "username": "张三",
        "handle": "@zhangsan",
        "content": "第一条推文！",
        "likes": 5,
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 2,
        "username": "李四",
        "handle": "@lisi",
        "content": "Hello Flask!",
        "likes": 3,
        "created_at": datetime.now().isoformat()
    }
]

# 获取所有推文
@app.route('/api/posts', methods=['GET'])
def get_posts():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    start = (page - 1) * limit
    end = start + limit
    paginated_posts = posts[start:end]
    
    return jsonify({
        "success": True,
        "data": paginated_posts,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": len(posts),
            "pages": (len(posts) + limit - 1) // limit
        }
    })

# 获取单条推文
@app.route('/api/posts/<id>', methods=['GET'])
def get_post(id):
    post = next((p for p in posts if p["id"] == int(id)), None)
    if not post:
        return jsonify({"success": False, "error": "Not found"}), 404
    return jsonify({"success": True, "data": post})

# 发布推文
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data or 'content' not in data or 'username' not in data:
        return jsonify({
            "success": False,
            "error": "username and content are required"
        }), 400
    
    new_post = {
        "id": len(posts) + 1,
        "username": data['username'],
        "handle": data.get('handle', f"@{data['username']}"),
        "content": data['content'],
        "likes": 0,
        "created_at": datetime.now().isoformat()
    }
    
    posts.insert(0, new_post)
    
    return jsonify({"success": True, "data": new_post}), 201

# 点赞
@app.route('/api/posts/<id>/like', methods=['POST'])
def like_post(id):
    post = next((p for p in posts if p["id"] == int(id)), None)
    if not post:
        return jsonify({"success": False, "error": "Not found"}), 404
    
    post['likes'] += 1
    return jsonify({"success": True, "data": post})

# 删除推文
@app.route('/api/posts/<id>', methods=['DELETE'])
def delete_post(id):
    global posts
    post = next((p for p in posts if p["id"] == int(id)), None)
    if not post:
        return jsonify({"success": False, "error": "Not found"}), 404
    
    posts = [p for p in posts if p["id"] != int(id)]
    return jsonify({"success": True, "message": "Deleted"})

# 搜索推文
@app.route('/api/search', methods=['GET'])
def search_posts():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"success": False, "error": "Query required"}), 400
    
    results = [p for p in posts if query.lower() in p['content'].lower()]
    return jsonify({"success": True, "data": results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### Step 3: requirements.txt

```
flask==3.0.0
flask-cors==4.0.0
```

## 🧪 用 Postman 测试

### 获取所有推文
- **Method**: GET
- **URL**: `http://localhost:5000/api/posts`

### 发布新推文
- **Method**: POST
- **URL**: `http://localhost:5000/api/posts`
- **Body** → raw → JSON:
```json
{
    "username": "王五",
    "handle": "@wangwu",
    "content": "这是通过 Flask API 发布的推文！"
}
```

### 点赞
- **Method**: POST
- **URL**: `http://localhost:5000/api/posts/1/like`

### 搜索
- **Method**: GET
- **URL**: `http://localhost:5000/api/search?q=Flask`

## 📚 学习要点

### Flask RESTful 模式

| HTTP 方法 | URL | 功能 |
|-----------|-----|------|
| GET | `/api/posts` | 获取列表 |
| GET | `/api/posts/<id>` | 获取单个 |
| POST | `/api/posts` | 创建 |
| PUT | `/api/posts/<id>` | 更新 |
| DELETE | `/api/posts/<id>` | 删除 |

### 请求处理

```python
# 获取查询参数
page = request.args.get('page', 1, type=int)

# 获取 JSON 数据
data = request.get_json()

# 返回 JSON 响应
return jsonify({"data": posts})

# 设置状态码
return jsonify({"error": "Not found"}), 404
```

## ⏭️ 下一关

数据重启就消失？进入 Django 路线，学习全功能框架：[Level 3: Django Basic](../level-3-django-basic/)
