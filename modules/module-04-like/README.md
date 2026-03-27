# Module 04: Like - 点赞系统

> 推文点赞功能

## 🎯 功能

- 点赞/取消点赞
- 点赞列表
- 点赞数统计

## 🗄️ 数据库表

```sql
CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);
```
