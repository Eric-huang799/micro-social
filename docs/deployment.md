# 部署指南

> 将你的社交平台部署到局域网使用

## 🎯 场景

### 宿舍共享
```
路由器
├── 你的电脑 (192.168.1.100) ← 服务器
├── 室友 A 手机
├── 室友 B 电脑
└── ...所有人都能访问 http://192.168.1.100:3000
```

### 家庭内网
- 手机、平板、电视都能访问
- 不依赖互联网
- 数据完全私有

## 🚀 部署方式

### 方式一：直接运行

适合开发调试：

```bash
# 后端
cd server
npm install
npm start

# 前端
cd client
npm install
npm start
```

### 方式二：Docker（推荐）

```bash
# 单容器
docker build -t micro-social .
docker run -p 3000:3000 -v $(pwd)/data:/app/data micro-social

# 或使用 docker-compose
docker-compose up -d
```

### 方式三：PM2 进程管理

生产环境推荐：

```bash
npm install -g pm2
pm2 start server.js --name micro-social
pm2 startup
pm2 save
```

## 🌐 局域网访问

### 获取本机 IP

**Windows:**
```powershell
ipconfig | findstr "IPv4"
```

**macOS/Linux:**
```bash
ifconfig | grep inet
```

### 绑定所有网卡

确保服务器监听 `0.0.0.0`：

```javascript
// server.js
app.listen(3000, '0.0.0.0', () => {
    console.log('http://0.0.0.0:3000');
});
```

### 防火墙设置

**Windows:**
```powershell
# 允许端口
netsh advfirewall firewall add rule name="Micro Social" dir=in action=allow protocol=tcp localport=3000
```

## 📱 移动端访问

确保手机和电脑在同一 WiFi：

1. 查看电脑 IP（如 192.168.1.100）
2. 手机浏览器访问 `http://192.168.1.100:3000`
3. 完成！

## 🔒 安全建议

1. **修改默认 JWT 密钥**
2. **启用 HTTPS**（使用 Nginx + Let's Encrypt 或自签名证书）
3. **限制访问**（可选：仅允许局域网 IP）
4. **定期备份数据库**

## 🐛 故障排查

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000
# 或
netstat -ano | findstr :3000
```

### 无法从其他设备访问
1. 检查防火墙
2. 确认绑定 `0.0.0.0`
3. 确认同一网段

### 数据库权限错误
```bash
# Linux/macOS 修复权限
chmod 755 data/
chmod 644 data/*.db
```
