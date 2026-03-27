# Module 02: Post - 推文系统

> 发布、编辑、删除推文功能

## 🎯 功能

- 发布文字推文
- 编辑推文
- 删除推文
- 推文列表

## 🗄️ 数据库表

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔌 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 获取推文列表 |
| POST | `/api/posts` | 发布推文 |
| PUT | `/api/posts/:id` | 编辑推文 |
| DELETE | `/api/posts/:id` | 删除推文 |
