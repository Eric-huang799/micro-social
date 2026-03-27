# Module 06: Follow - 关注系统

> 用户关注/粉丝功能

## 🎯 功能

- 关注/取消关注用户
- 关注列表
- 粉丝列表
- 互相关注检测

## 🗄️ 数据库表

```sql
CREATE TABLE follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);
```
