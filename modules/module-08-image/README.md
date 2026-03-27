# Module 08: Image - 图片上传

> 推文图片上传功能

## 🎯 功能

- 单图/多图上传
- 图片压缩
- 生成缩略图
- 图片存储

## 📦 依赖

```bash
npm install multer sharp
```

## 🔌 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload` | 上传图片 |
| GET | `/uploads/:filename` | 获取图片 |

## 📁 存储结构

```
uploads/
├── original/      # 原图
└── thumbnail/     # 缩略图
```
