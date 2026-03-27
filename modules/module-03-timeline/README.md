# Module 03: Timeline - 时间线

> 首页信息流展示

## 🎯 功能

- 关注用户的时间线
- 所有人的公开时间线
- 个人主页时间线
- 分页加载

## 🗄️ 数据库表

```sql
CREATE TABLE follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);
```

## 🔌 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/timeline` | 关注的时间线 |
| GET | `/api/timeline/public` | 公开时间线 |
| GET | `/api/users/:id/posts` | 用户个人推文 |
