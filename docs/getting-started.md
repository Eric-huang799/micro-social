# 📚 快速开始指南

欢迎！本教程将带你从零开始搭建你的第一个社交平台。

## 🎯 本指南适合谁？

- ✅ 有基础编程概念（变量、函数、循环）
- ✅ 了解 HTML/CSS 基础
- ✅ 想在实战中学习的开发者

## 🛤️ 推荐学习路径

### 路径一：快速体验（30分钟）

想先看看效果？直接用预设模板：

```bash
git clone https://github.com/Eric-huang799/micro-social.git
cd micro-social/templates/minimal
npm install
npm start
```

浏览器访问 `http://localhost:3000`，搞定！

---

### 路径二：渐进学习（推荐）

按部就班，从基础到完整：

#### Step 1: Level 1 - 静态页面
**目标**: 做出能看的界面
**时间**: 1-2 小时
**成果**: 一个静态的社交页面

```bash
cd tech-tree/nodejs-track/level-1-basic
```

**学习内容**:
- HTML 结构搭建
- CSS 样式美化
- 模拟数据展示

---

#### Step 2: Level 2 - 动态 API
**目标**: 后端能响应请求
**时间**: 2-3 小时
**成果**: RESTful API 服务

```bash
cd tech-tree/nodejs-track/level-2-api
```

**学习内容**:
- Express.js 基础
- 路由设计
- JSON 数据交互
- Postman 测试

---

#### Step 3: Level 3 - 数据持久化
**目标**: 数据不丢失
**时间**: 2-3 小时
**成果**: 带数据库的完整后端

```bash
cd tech-tree/nodejs-track/level-3-database
```

**学习内容**:
- SQLite 数据库
- SQL 基础操作
- 数据模型设计

---

#### Step 4: Level 4 - 现代前端
**目标**: 前端现代化
**时间**: 3-4 小时
**成果**: React 单页应用

```bash
cd tech-tree/nodejs-track/level-4-frontend
```

**学习内容**:
- React 组件化
- Hooks 使用
- 前端路由
- API 调用

---

#### Step 5: Level 5 - 全栈整合
**目标**: 功能完整的社交平台
**时间**: 4-6 小时
**成果**: 类似 X 的完整应用

```bash
cd tech-tree/nodejs-track/level-5-fullstack
```

**学习内容**:
- 用户认证 (JWT)
- 全功能实现
- 部署上线

---

## 🔧 环境准备

### 必需软件

1. **Node.js** (v18 或更高)
   - 官网下载: https://nodejs.org
   - 验证: `node --version`

2. **代码编辑器**
   - 推荐: [VS Code](https://code.visualstudio.com/)
   - 可选: WebStorm, Sublime Text

3. **Git**
   - 官网: https://git-scm.com/
   - 验证: `git --version`

4. **浏览器**
   - 推荐: Chrome / Edge / Firefox
   - 必装插件: React Developer Tools

### 可选工具

- **Postman**: API 测试工具
- **DB Browser for SQLite**: 数据库可视化
- **Docker**: 容器化部署

---

## 🌐 局域网访问配置

### Windows

1. 查看本机 IP:
   ```powershell
   ipconfig
   # 找到 "IPv4 地址"，如 192.168.1.100
   ```

2. 启动服务时绑定所有 IP:
   ```javascript
   // server.js
   app.listen(3000, '0.0.0.0', () => {
     console.log('Server running on http://0.0.0.0:3000');
   });
   ```

3. 防火墙放行（如果需要）:
   ```powershell
   netsh advfirewall firewall add rule name="Micro Social" dir=in action=allow protocol=tcp localport=3000
   ```

### macOS / Linux

```bash
# 查看 IP
ifconfig

# 启动服务
npm start

# 同局域网设备访问
# http://你的IP:3000
```

---

## 📱 移动端访问

确保手机和电脑在同一 WiFi：

1. 电脑启动服务
2. 手机浏览器访问 `http://电脑IP:3000`
3. 享受你的私有社交平台！

---

## ❓ 常见问题

### Q: 端口被占用怎么办？
```bash
# 查找占用 3000 端口的进程
netstat -ano | findstr :3000

# 或者直接用其他端口
npm start -- --port 3001
```

### Q: 如何清空数据库？
```bash
# SQLite 数据库文件通常在项目根目录
rm database.sqlite
# 重启服务会自动重建
```

### Q: 如何备份数据？
```bash
# 直接复制数据库文件
cp database.sqlite database-backup.sqlite
```

---

## 🎓 下一步

选择你的路线：

- 🟢 [Node.js 路线](../tech-tree/nodejs-track/) - JavaScript 全栈
- 🔵 [Python 路线](../tech-tree/python-track/) - Python 后端
- 🟡 [Go 路线](../tech-tree/go-track/) - 高性能后端

或者：
- 📦 [使用预设模板](../templates/) - 快速开始
- 🔌 [学习独立模块](../modules/) - 自由组合

---

**准备好开始了吗？选择一个路线，Let's Go! 🚀**
