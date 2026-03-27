/**
 * challenges.js - 关卡配置
 * 每个关卡包含：标题、描述、初始代码、提示、验证条件
 */

const CHALLENGES = [
    // ===== 关卡 1：HTML 骨架 =====
    {
        id: 1,
        title: "搭建页面骨架",
        badge: "HTML 基础",
        difficulty: 1,
        description: `
            <h3>🎯 目标</h3>
            <p>创建社交平台的基本 HTML 结构。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>创建一个 <code>&lt;div class="container"&gt;</code> 作为最外层容器</li>
                <li>在容器内添加三个区域：
                    <ul>
                        <li><code>&lt;nav class="sidebar"&gt;</code> 左侧导航</li>
                        <li><code>&lt;main class="timeline"&gt;</code> 中间时间线</li>
                        <li><code>&lt;aside class="rightbar"&gt;</code> 右侧栏</li>
                    </ul>
                </li>
                <li>在导航栏中添加 Logo 和菜单项</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <ul>
                <li>使用语义化标签：<code>&lt;nav&gt;</code>、<code>&lt;main&gt;</code>、<code>&lt;aside&gt;</code></li>
                <li>Logo 可以用 emoji + 文字：<code>🐦 Micro Social</code></li>
                <li>菜单项用 <code>&lt;ul&gt;</code> + <code>&lt;li&gt;</code></li>
            </ul>
            <pre>&lt;nav class="sidebar"&gt;
  &lt;div class="logo"&gt;🐦 Micro Social&lt;/div&gt;
  &lt;ul&gt;
    &lt;li&gt;🏠 首页&lt;/li&gt;
    ...
  &lt;/ul&gt;
&lt;/nav&gt;</pre>
        `,
        initialCode: {
            html: `<!-- 关卡 1: 搭建页面骨架 -->
<!-- 在这里编写你的 HTML -->

<div class="container">
    <!-- 👈 左侧导航 -->
    
    <!-- 📰 中间时间线 -->
    
    <!-- 👉 右侧栏 -->
    
</div>`,
            css: `/* 先不用管 CSS，后面的关卡会教 */
body {
    font-family: -apple-system, sans-serif;
    margin: 0;
    background: #000;
    color: #fff;
}`,
            js: `// 先不用管 JS，后面的关卡会教`
        },
        checks: [
            { name: "包含 container 容器", test: (doc) => doc.querySelector('.container') !== null },
            { name: "包含 nav.sidebar 导航栏", test: (doc) => doc.querySelector('nav.sidebar') !== null },
            { name: "包含 main.timeline 时间线", test: (doc) => doc.querySelector('main.timeline') !== null },
            { name: "包含 aside.rightbar 右侧栏", test: (doc) => doc.querySelector('aside.rightbar') !== null },
            { name: "导航栏有 Logo", test: (doc) => { const nav = doc.querySelector('nav.sidebar'); return nav && nav.querySelector('.logo') !== null; }},
            { name: "导航栏有菜单列表", test: (doc) => { const nav = doc.querySelector('nav.sidebar'); return nav && nav.querySelector('ul') !== null; }}
        ]
    },

    // ===== 关卡 2：CSS 布局 =====
    {
        id: 2,
        title: "三栏布局",
        badge: "CSS 布局",
        difficulty: 1,
        description: `
            <h3>🎯 目标</h3>
            <p>用 CSS Flexbox 实现经典的三栏布局。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>使用 <code>display: flex</code> 让三个区域横向排列</li>
                <li>左侧导航栏宽度 <code>250px</code></li>
                <li>中间时间线 <code>flex: 1</code> 自动填充</li>
                <li>右侧栏宽度 <code>350px</code></li>
                <li>设置深色背景和分隔线</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>.container {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    border-right: 1px solid #333;
}

.timeline {
    flex: 1;
    border-right: 1px solid #333;
}

.rightbar {
    width: 350px;
}</pre>
        `,
        initialCode: {
            html: `<div class="container">
    <nav class="sidebar">
        <div class="logo">🐦 Micro Social</div>
        <ul>
            <li>🏠 首页</li>
            <li>🔍 探索</li>
            <li>🔔 通知</li>
            <li>✉️ 私信</li>
            <li>👤 我的</li>
        </ul>
    </nav>
    
    <main class="timeline">
        <h2>首页</h2>
        <p>这里将显示推文...</p>
    </main>
    
    <aside class="rightbar">
        <h3>热门话题</h3>
        <p>#编程</p>
    </aside>
</div>`,
            css: `/* 关卡 2: 用 Flexbox 实现三栏布局 */
body {
    font-family: -apple-system, sans-serif;
    margin: 0;
    background: #000;
    color: #fff;
}

/* 在下面写你的 CSS */
.container {
    /* 提示：display: flex */
}

.sidebar {
    /* 提示：固定宽度 250px */
}

.timeline {
    /* 提示：flex: 1 */
}

.rightbar {
    /* 提示：固定宽度 350px */
}`,
            js: ``
        },
        checks: [
            { name: "container 使用 flex 布局", test: (doc, code) => code.css.includes('display') && code.css.includes('flex') },
            { name: "sidebar 设置了宽度", test: (doc, code) => /\.sidebar\s*\{[^}]*width\s*:/s.test(code.css) },
            { name: "timeline 使用 flex: 1", test: (doc, code) => /\.timeline\s*\{[^}]*flex\s*:/s.test(code.css) },
            { name: "rightbar 设置了宽度", test: (doc, code) => /\.rightbar\s*\{[^}]*width\s*:/s.test(code.css) },
            { name: "有分隔线 (border)", test: (doc, code) => code.css.includes('border') }
        ]
    },

    // ===== 关卡 3：推文卡片 =====
    {
        id: 3,
        title: "推文卡片组件",
        badge: "HTML + CSS",
        difficulty: 2,
        description: `
            <h3>🎯 目标</h3>
            <p>创建一个推文卡片，包含头像、用户名、内容和操作按钮。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>创建 <code>&lt;div class="post"&gt;</code> 推文容器</li>
                <li>添加头像（用 <code>&lt;img&gt;</code> 或 emoji 代替）</li>
                <li>显示用户名、@handle、发布时间</li>
                <li>显示推文内容</li>
                <li>添加底部操作栏：💬 评论、🔄 转发、❤️ 点赞</li>
                <li>用 CSS 美化卡片</li>
            </ol>
        `,
        hints: `
            <h3>💡 HTML 结构</h3>
            <pre>&lt;div class="post"&gt;
  &lt;div class="post-avatar"&gt;😀&lt;/div&gt;
  &lt;div class="post-body"&gt;
    &lt;div class="post-header"&gt;
      &lt;strong&gt;张三&lt;/strong&gt;
      &lt;span class="handle"&gt;@zhangsan&lt;/span&gt;
      &lt;span class="time"&gt;2小时前&lt;/span&gt;
    &lt;/div&gt;
    &lt;p class="post-content"&gt;内容...&lt;/p&gt;
    &lt;div class="post-actions"&gt;
      &lt;span&gt;💬 8&lt;/span&gt;
      &lt;span&gt;🔄 3&lt;/span&gt;
      &lt;span&gt;❤️ 42&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>
        `,
        initialCode: {
            html: `<div class="container">
    <main class="timeline">
        <header class="timeline-header">
            <h2>首页</h2>
        </header>
        
        <!-- 在下面创建推文卡片 -->
        <!-- 至少创建 2 条推文 -->
        
    </main>
</div>`,
            css: `body {
    font-family: -apple-system, sans-serif;
    margin: 0;
    background: #000;
    color: #fff;
}

.timeline {
    max-width: 600px;
    margin: 0 auto;
}

.timeline-header {
    padding: 16px;
    border-bottom: 1px solid #333;
}

/* 在下面美化推文卡片 */
.post {
    /* 提示：用 flex 布局 */
}`,
            js: ``
        },
        checks: [
            { name: "至少有 2 条推文", test: (doc) => doc.querySelectorAll('.post').length >= 2 },
            { name: "推文包含头像区域", test: (doc) => doc.querySelector('.post-avatar') !== null || doc.querySelector('.post img') !== null },
            { name: "推文包含用户名", test: (doc) => { const p = doc.querySelector('.post'); return p && (p.querySelector('strong') !== null || p.querySelector('.username') !== null); }},
            { name: "推文包含内容", test: (doc) => doc.querySelector('.post-content') !== null || doc.querySelector('.post p') !== null },
            { name: "推文包含操作栏", test: (doc) => doc.querySelector('.post-actions') !== null },
            { name: "推文使用了 flex 布局", test: (doc, code) => /\.post\s*\{[^}]*display\s*:\s*flex/s.test(code.css) }
        ]
    },

    // ===== 关卡 4：发布框 =====
    {
        id: 4,
        title: "发布推文框",
        badge: "表单 + CSS",
        difficulty: 1,
        description: `
            <h3>🎯 目标</h3>
            <p>创建一个"有什么新鲜事？"的发布框。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>创建 <code>&lt;div class="post-box"&gt;</code></li>
                <li>添加头像</li>
                <li>添加文本输入框 <code>&lt;textarea&gt;</code></li>
                <li>添加"发布"按钮，蓝色圆角</li>
                <li>CSS 美化：按钮 hover 效果、输入框无边框</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>.post-box {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #333;
    gap: 12px;
}

textarea {
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    resize: none;
    outline: none;
    font-size: 18px;
}

.post-btn {
    background: #1d9bf0;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    cursor: pointer;
    font-weight: bold;
    align-self: flex-end;
}</pre>
        `,
        initialCode: {
            html: `<div class="container">
    <main class="timeline">
        <header class="timeline-header">
            <h2>首页</h2>
        </header>
        
        <!-- 在这里创建发布框 -->
        
        
        <!-- 示例推文 -->
        <div class="post">
            <div class="post-avatar">😀</div>
            <div class="post-body">
                <div class="post-header">
                    <strong>张三</strong>
                    <span class="handle">@zhangsan</span>
                </div>
                <p class="post-content">今天天气不错！</p>
                <div class="post-actions">
                    <span>💬 3</span>
                    <span>🔄 1</span>
                    <span>❤️ 12</span>
                </div>
            </div>
        </div>
    </main>
</div>`,
            css: `body {
    font-family: -apple-system, sans-serif;
    margin: 0;
    background: #000;
    color: #fff;
}

.timeline { max-width: 600px; margin: 0 auto; }
.timeline-header { padding: 16px; border-bottom: 1px solid #333; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-avatar { font-size: 36px; }
.post-body { flex: 1; }
.post-header { margin-bottom: 4px; }
.handle { color: #888; margin-left: 8px; }
.post-actions { display: flex; gap: 40px; color: #888; margin-top: 12px; }

/* 在下面美化发布框 */
`,
            js: ``
        },
        checks: [
            { name: "包含发布框 .post-box", test: (doc) => doc.querySelector('.post-box') !== null },
            { name: "包含文本输入 textarea", test: (doc) => doc.querySelector('.post-box textarea') !== null || doc.querySelector('.post-box input') !== null },
            { name: "包含发布按钮", test: (doc) => { const box = doc.querySelector('.post-box'); return box && box.querySelector('button') !== null; }},
            { name: "发布按钮有蓝色背景", test: (doc, code) => code.css.includes('#1d9bf0') || code.css.includes('rgb(29, 155, 240)') || code.css.includes('blue') }
        ]
    },

    // ===== 关卡 5：导航栏美化 =====
    {
        id: 5,
        title: "导航栏美化",
        badge: "CSS 进阶",
        difficulty: 2,
        description: `
            <h3>🎯 目标</h3>
            <p>美化左侧导航栏，添加 hover 效果和高亮样式。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>Logo 字体加大加粗</li>
                <li>菜单项去掉默认圆点</li>
                <li>菜单项添加 padding 和 hover 背景效果</li>
                <li>菜单项圆角化 <code>border-radius: 25px</code></li>
                <li>添加一个蓝色的"发布"按钮</li>
                <li>导航栏固定在左侧 (<code>position: fixed</code>)</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar li {
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.2s;
}

.sidebar li:hover {
    background: #1a1a1a;
}</pre>
        `,
        initialCode: {
            html: `<div class="container">
    <nav class="sidebar">
        <div class="logo">🐦 Micro Social</div>
        <ul>
            <li>🏠 首页</li>
            <li>🔍 探索</li>
            <li>🔔 通知</li>
            <li>✉️ 私信</li>
            <li>👤 我的</li>
        </ul>
        <button class="sidebar-post-btn">发布</button>
    </nav>
    
    <main class="timeline">
        <header><h2>首页</h2></header>
        <div class="post">
            <div class="post-avatar">😀</div>
            <div class="post-body">
                <strong>示例用户</strong>
                <p>导航栏看起来好多了！</p>
            </div>
        </div>
    </main>
</div>`,
            css: `body {
    font-family: -apple-system, sans-serif;
    margin: 0;
    background: #000;
    color: #fff;
}

.container { display: flex; min-height: 100vh; }
.timeline { flex: 1; border-left: 1px solid #333; }
.timeline header { padding: 16px; border-bottom: 1px solid #333; }
.post { display: flex; padding: 16px; gap: 12px; }
.post-avatar { font-size: 36px; }

/* 在下面美化导航栏 */
.sidebar {
    width: 250px;
    padding: 16px;
}

.logo {
    /* 美化 Logo */
}
`,
            js: ``
        },
        checks: [
            { name: "菜单去掉默认样式 (list-style)", test: (doc, code) => code.css.includes('list-style') },
            { name: "菜单项有 hover 效果", test: (doc, code) => code.css.includes(':hover') },
            { name: "菜单项有圆角", test: (doc, code) => code.css.includes('border-radius') },
            { name: "有发布按钮", test: (doc) => doc.querySelector('.sidebar-post-btn') !== null || doc.querySelector('.sidebar button') !== null },
            { name: "发布按钮有蓝色背景", test: (doc, code) => code.css.includes('#1d9bf0') || code.css.includes('blue') }
        ]
    },

    // ===== 关卡 6：JavaScript 动态渲染 =====
    {
        id: 6,
        title: "JavaScript 动态渲染",
        badge: "JavaScript",
        difficulty: 2,
        description: `
            <h3>🎯 目标</h3>
            <p>用 JavaScript 动态渲染推文列表，不再写死 HTML。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>在 JS 中创建一个推文数据数组</li>
                <li>用 <code>forEach</code> 或 <code>map</code> 遍历数组</li>
                <li>动态生成 HTML 并插入到页面中</li>
                <li>至少渲染 3 条推文</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>const posts = [
    { username: "张三", handle: "@zhangsan", content: "Hello!", likes: 5 },
    // 更多推文...
];

const container = document.getElementById('posts');

posts.forEach(post => {
    container.innerHTML += \`
        &lt;div class="post"&gt;...&lt;/div&gt;
    \`;
});</pre>
        `,
        initialCode: {
            html: `<div class="container">
    <main class="timeline">
        <header><h2>首页</h2></header>
        
        <!-- 推文将由 JS 动态渲染到这里 -->
        <div id="posts"></div>
    </main>
</div>`,
            css: `body { font-family: -apple-system, sans-serif; margin: 0; background: #000; color: #fff; }
.timeline { max-width: 600px; margin: 0 auto; }
.timeline header { padding: 16px; border-bottom: 1px solid #333; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-avatar { font-size: 36px; }
.post-body { flex: 1; }
.handle { color: #888; margin-left: 8px; }
.post-content { margin: 8px 0; line-height: 1.5; }
.post-actions { display: flex; gap: 40px; color: #888; }
.post-actions span { cursor: pointer; }
.post-actions span:hover { color: #1d9bf0; }`,
            js: `// 关卡 6: 用 JS 动态渲染推文
// 1. 创建推文数据数组
// 2. 遍历数组生成 HTML
// 3. 插入到 #posts 容器中

const posts = [
    // 在这里添加推文数据对象
    // { username: "...", handle: "...", content: "...", likes: 0 }
];

// 获取容器
const container = document.getElementById('posts');

// 渲染推文
`
        },
        checks: [
            { name: "JS 中定义了推文数组", test: (doc, code) => code.js.includes('[') && (code.js.includes('username') || code.js.includes('content')) },
            { name: "使用了 forEach 或 map", test: (doc, code) => code.js.includes('forEach') || code.js.includes('map') || code.js.includes('for') },
            { name: "使用了 innerHTML 或 insertAdjacentHTML", test: (doc, code) => code.js.includes('innerHTML') || code.js.includes('insertAdjacentHTML') || code.js.includes('appendChild') },
            { name: "页面渲染了至少 3 条推文", test: (doc) => doc.querySelectorAll('.post').length >= 3 }
        ]
    },

    // ===== 关卡 7：点赞功能 =====
    {
        id: 7,
        title: "点赞功能",
        badge: "JavaScript 交互",
        difficulty: 2,
        description: `
            <h3>🎯 目标</h3>
            <p>实现点击❤️按钮可以点赞/取消点赞。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>给每个点赞按钮添加点击事件</li>
                <li>点击后点赞数 +1</li>
                <li>再次点击取消点赞 -1</li>
                <li>点赞后❤️变红色</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>function toggleLike(btn, postId) {
    const liked = btn.classList.toggle('liked');
    const countEl = btn.querySelector('.count');
    let count = parseInt(countEl.textContent);
    countEl.textContent = liked ? count + 1 : count - 1;
}</pre>
            <p>CSS 部分：</p>
            <pre>.like-btn.liked { color: #f91880; }</pre>
        `,
        initialCode: {
            html: `<div class="timeline">
    <header><h2>首页</h2></header>
    <div id="posts"></div>
</div>`,
            css: `body { font-family: -apple-system, sans-serif; margin: 0; background: #000; color: #fff; }
.timeline { max-width: 600px; margin: 0 auto; }
.timeline header { padding: 16px; border-bottom: 1px solid #333; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-avatar { font-size: 36px; }
.post-body { flex: 1; }
.handle { color: #888; margin-left: 8px; }
.post-content { margin: 8px 0; }
.post-actions { display: flex; gap: 40px; color: #888; }
.action-btn { cursor: pointer; background: none; border: none; color: #888; font-size: 14px; transition: color 0.2s; }
.action-btn:hover { color: #1d9bf0; }

/* 点赞按钮样式 - 在下面添加已点赞状态 */
`,
            js: `const posts = [
    { id: 1, username: "张三", avatar: "😀", content: "学会点赞功能了！", likes: 5, liked: false },
    { id: 2, username: "李四", avatar: "😎", content: "JavaScript 真好玩", likes: 12, liked: false },
    { id: 3, username: "王五", avatar: "🤓", content: "局域网社交平台搭建中...", likes: 8, liked: false },
];

const container = document.getElementById('posts');

function render() {
    container.innerHTML = posts.map(post => \`
        <div class="post">
            <div class="post-avatar">\${post.avatar}</div>
            <div class="post-body">
                <strong>\${post.username}</strong>
                <p class="post-content">\${post.content}</p>
                <div class="post-actions">
                    <button class="action-btn">💬 3</button>
                    <button class="action-btn">🔄 1</button>
                    <button class="action-btn like-btn \${post.liked ? 'liked' : ''}" 
                            onclick="toggleLike(\${post.id})">
                        ❤️ <span class="count">\${post.likes}</span>
                    </button>
                </div>
            </div>
        </div>
    \`).join('');
}

// 实现 toggleLike 函数
function toggleLike(postId) {
    // 在这里实现点赞逻辑
    // 1. 找到对应的 post
    // 2. 切换 liked 状态
    // 3. 更新 likes 数量
    // 4. 重新渲染
}

render();`
        },
        checks: [
            { name: "实现了 toggleLike 函数", test: (doc, code) => code.js.includes('toggleLike') && !code.js.includes('// 在这里实现点赞逻辑') },
            { name: "点赞改变了 liked 状态", test: (doc, code) => code.js.includes('.liked') || code.js.includes('liked =') || code.js.includes('liked=') },
            { name: "点赞更新了数量", test: (doc, code) => code.js.includes('likes') && (code.js.includes('++') || code.js.includes('+= 1') || code.js.includes('+ 1') || code.js.includes('- 1')) },
            { name: "调用了重新渲染", test: (doc, code) => { const fn = code.js.match(/function toggleLike[\s\S]*?\n\}/); return fn && fn[0].includes('render'); }},
            { name: "CSS 有已点赞样式 (.liked)", test: (doc, code) => code.css.includes('.liked') || code.css.includes('liked') }
        ]
    },

    // ===== 关卡 8：发布功能 =====
    {
        id: 8,
        title: "发布推文功能",
        badge: "JS 交互进阶",
        difficulty: 2,
        description: `
            <h3>🎯 目标</h3>
            <p>实现在发布框中输入内容并发布到时间线。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>获取输入框的内容</li>
                <li>点击发布按钮后，创建新推文并添加到列表开头</li>
                <li>发布后清空输入框</li>
                <li>空内容不能发布</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();
    
    if (!content) return; // 空内容不发布
    
    posts.unshift({
        id: Date.now(),
        username: "我",
        avatar: "🙂",
        content: content,
        likes: 0,
        liked: false
    });
    
    input.value = ''; // 清空输入框
    render();
}</pre>
        `,
        initialCode: {
            html: `<div class="timeline">
    <header><h2>首页</h2></header>
    
    <!-- 发布框 -->
    <div class="post-box">
        <div class="post-avatar">🙂</div>
        <div class="post-box-body">
            <textarea id="post-input" placeholder="有什么新鲜事？" rows="3"></textarea>
            <button class="post-btn" onclick="createPost()">发布</button>
        </div>
    </div>
    
    <div id="posts"></div>
</div>`,
            css: `body { font-family: -apple-system, sans-serif; margin: 0; background: #000; color: #fff; }
.timeline { max-width: 600px; margin: 0 auto; }
.timeline header { padding: 16px; border-bottom: 1px solid #333; }
.post-box { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-box-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.post-box textarea { background: transparent; border: none; color: #fff; font-size: 18px; resize: none; outline: none; }
.post-btn { align-self: flex-end; background: #1d9bf0; color: #fff; border: none; border-radius: 20px; padding: 8px 20px; cursor: pointer; font-weight: bold; }
.post-btn:hover { background: #1a8cd8; }
.post-avatar { font-size: 36px; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-body { flex: 1; }
.post-content { margin: 8px 0; }
.post-actions { display: flex; gap: 40px; color: #888; }`,
            js: `const posts = [
    { id: 1, username: "张三", avatar: "😀", content: "欢迎来到 Micro Social！", likes: 5, liked: false },
    { id: 2, username: "李四", avatar: "😎", content: "这是一个局域网社交平台", likes: 3, liked: false },
];

function render() {
    const container = document.getElementById('posts');
    container.innerHTML = posts.map(post => \`
        <div class="post">
            <div class="post-avatar">\${post.avatar}</div>
            <div class="post-body">
                <strong>\${post.username}</strong>
                <p class="post-content">\${post.content}</p>
                <div class="post-actions">
                    <span>💬 0</span>
                    <span>🔄 0</span>
                    <span>❤️ \${post.likes}</span>
                </div>
            </div>
        </div>
    \`).join('');
}

// 实现发布功能
function createPost() {
    // 在这里实现
    // 1. 获取输入框内容
    // 2. 检查是否为空
    // 3. 创建新推文添加到数组开头 (unshift)
    // 4. 清空输入框
    // 5. 重新渲染
}

render();`
        },
        checks: [
            { name: "实现了 createPost 函数", test: (doc, code) => code.js.includes('createPost') && !code.js.includes('// 在这里实现') },
            { name: "获取了输入框内容", test: (doc, code) => code.js.includes('post-input') || code.js.includes('getElementById') || code.js.includes('querySelector') },
            { name: "空内容检查", test: (doc, code) => code.js.includes('trim') || code.js.includes('!content') || code.js.includes('=== ""') || code.js.includes("=== ''") },
            { name: "使用 unshift 添加到开头", test: (doc, code) => code.js.includes('unshift') },
            { name: "清空输入框", test: (doc, code) => code.js.includes("value = ''") || code.js.includes('value = ""') || code.js.includes('value=""') || code.js.includes("value=''") },
            { name: "调用了 render()", test: (doc, code) => { const fn = code.js.match(/function createPost[\s\S]*?\n\}/); return fn && fn[0].includes('render'); }}
        ]
    },

    // ===== 关卡 9：本地存储 =====
    {
        id: 9,
        title: "数据持久化 (localStorage)",
        badge: "Web Storage",
        difficulty: 3,
        description: `
            <h3>🎯 目标</h3>
            <p>使用 localStorage 保存推文数据，刷新页面后不丢失。</p>
            
            <h3>📋 任务</h3>
            <ol>
                <li>每次数据变化时保存到 localStorage</li>
                <li>页面加载时从 localStorage 读取数据</li>
                <li>如果 localStorage 为空，使用默认数据</li>
            </ol>
        `,
        hints: `
            <h3>💡 提示</h3>
            <pre>// 保存数据
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 加载数据
function loadPosts() {
    const saved = localStorage.getItem('posts');
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultPosts; // 默认数据
}

// 初始化
let posts = loadPosts();</pre>
        `,
        initialCode: {
            html: `<div class="timeline">
    <header><h2>首页</h2></header>
    <div class="post-box">
        <div class="post-avatar">🙂</div>
        <div class="post-box-body">
            <textarea id="post-input" placeholder="有什么新鲜事？" rows="2"></textarea>
            <div class="post-box-actions">
                <button class="post-btn" onclick="createPost()">发布</button>
                <button class="clear-btn" onclick="clearData()">🗑️ 清空数据</button>
            </div>
        </div>
    </div>
    <div id="posts"></div>
    <div id="storage-status" class="storage-status"></div>
</div>`,
            css: `body { font-family: -apple-system, sans-serif; margin: 0; background: #000; color: #fff; }
.timeline { max-width: 600px; margin: 0 auto; }
.timeline header { padding: 16px; border-bottom: 1px solid #333; }
.post-box { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-box-body { flex: 1; }
.post-box textarea { width: 100%; background: transparent; border: none; color: #fff; font-size: 18px; resize: none; outline: none; }
.post-box-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
.post-btn { background: #1d9bf0; color: #fff; border: none; border-radius: 20px; padding: 8px 20px; cursor: pointer; font-weight: bold; }
.clear-btn { background: #21262d; color: #888; border: 1px solid #333; border-radius: 20px; padding: 8px 16px; cursor: pointer; font-size: 12px; }
.post-avatar { font-size: 36px; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #333; gap: 12px; }
.post-body { flex: 1; }
.post-content { margin: 8px 0; }
.post-actions { display: flex; gap: 40px; color: #888; }
.storage-status { text-align: center; padding: 8px; color: #3fb950; font-size: 12px; }`,
            js: `// 默认推文数据
const defaultPosts = [
    { id: 1, username: "系统", avatar: "🤖", content: "欢迎来到 Micro Social！试着发一条推文吧。", likes: 0 },
];

// 任务：实现 loadPosts 和 savePosts 函数

// 加载数据（从 localStorage 或使用默认数据）
function loadPosts() {
    // 在这里实现
    return defaultPosts;
}

// 保存数据到 localStorage
function savePosts() {
    // 在这里实现
}

let posts = loadPosts();

function render() {
    const container = document.getElementById('posts');
    container.innerHTML = posts.map(post => \`
        <div class="post">
            <div class="post-avatar">\${post.avatar}</div>
            <div class="post-body">
                <strong>\${post.username}</strong>
                <p class="post-content">\${post.content}</p>
                <div class="post-actions"><span>❤️ \${post.likes}</span></div>
            </div>
        </div>
    \`).join('');
    
    // 显示存储状态
    const status = document.getElementById('storage-status');
    const saved = localStorage.getItem('posts');
    status.textContent = saved ? '💾 数据已保存到 localStorage' : '⚠️ 数据未持久化';
}

function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();
    if (!content) return;
    posts.unshift({ id: Date.now(), username: "我", avatar: "🙂", content, likes: 0 });
    input.value = '';
    savePosts(); // 保存
    render();
}

function clearData() {
    localStorage.removeItem('posts');
    posts = [...defaultPosts];
    render();
}

render();`
        },
        checks: [
            { name: "loadPosts 使用了 localStorage.getItem", test: (doc, code) => code.js.includes('getItem') },
            { name: "loadPosts 使用了 JSON.parse", test: (doc, code) => code.js.includes('JSON.parse') },
            { name: "savePosts 使用了 localStorage.setItem", test: (doc, code) => code.js.includes('setItem') },
            { name: "savePosts 使用了 JSON.stringify", test: (doc, code) => code.js.includes('JSON.stringify') }
        ]
    },

    // ===== 关卡 10：完整成品 =====
    {
        id: 10,
        title: "🎉 完整社交平台",
        badge: "最终成品",
        difficulty: 3,
        description: `
            <h3>🎯 目标</h3>
            <p>把前面所有关卡的知识整合，完成一个完整的社交平台！</p>
            
            <h3>📋 要求</h3>
            <ol>
                <li>三栏布局（导航 + 时间线 + 右侧栏）</li>
                <li>发布推文功能</li>
                <li>点赞功能</li>
                <li>右侧热门话题</li>
                <li>数据持久化</li>
                <li>界面美观</li>
            </ol>
            
            <h3>🏆 完成后</h3>
            <p>点击右上角 <strong>📦 导出成品</strong> 下载你的项目！</p>
        `,
        hints: `
            <h3>💡 架构提示</h3>
            <p>把之前学到的全部整合：</p>
            <ul>
                <li>HTML: 三栏布局 + 发布框 + 推文卡片</li>
                <li>CSS: Flexbox 布局 + 暗色主题 + hover 效果</li>
                <li>JS: 数据渲染 + 点赞 + 发布 + localStorage</li>
            </ul>
            <p>这是你的自由发挥关卡，没有固定答案！</p>
        `,
        initialCode: {
            html: `<!-- 最终关卡：整合所有知识，构建完整社交平台 -->

<div class="container">
    <!-- 左侧导航 -->
    <nav class="sidebar">
        <div class="logo">🐦 Micro Social</div>
        <ul>
            <li class="active">🏠 首页</li>
            <li>🔍 探索</li>
            <li>🔔 通知</li>
            <li>✉️ 私信</li>
            <li>👤 我的</li>
        </ul>
        <button class="sidebar-btn" onclick="createPost()">发布</button>
    </nav>
    
    <!-- 中间时间线 -->
    <main class="timeline">
        <header class="tl-header"><h2>首页</h2></header>
        
        <div class="post-box">
            <div class="avatar">🙂</div>
            <div class="post-box-body">
                <textarea id="post-input" placeholder="有什么新鲜事？" rows="2"></textarea>
                <button class="post-btn" onclick="createPost()">发布</button>
            </div>
        </div>
        
        <div id="posts"></div>
    </main>
    
    <!-- 右侧栏 -->
    <aside class="rightbar">
        <div class="search-box">
            <input type="text" placeholder="🔍 搜索">
        </div>
        
        <div class="card">
            <h3>🔥 热门话题</h3>
            <div class="trend-item">#全栈开发 <small>12.5K 帖子</small></div>
            <div class="trend-item">#JavaScript <small>45.2K 帖子</small></div>
            <div class="trend-item">#局域网 <small>2.1K 帖子</small></div>
        </div>
        
        <div class="card">
            <h3>👥 推荐关注</h3>
            <div class="suggest-item">
                <span>😀 前端小白</span>
                <button class="follow-btn">关注</button>
            </div>
            <div class="suggest-item">
                <span>🤓 后端大佬</span>
                <button class="follow-btn">关注</button>
            </div>
        </div>
    </aside>
</div>`,
            css: `/* 🎨 最终成品样式 - 自由发挥！ */

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #000;
    color: #e7e9ea;
}

/* 三栏布局 */
.container { display: flex; max-width: 1200px; margin: 0 auto; min-height: 100vh; }

/* 左侧导航 */
.sidebar { width: 250px; padding: 16px; border-right: 1px solid #2f3336; }
.logo { font-size: 22px; font-weight: bold; padding: 12px; margin-bottom: 8px; }
.sidebar ul { list-style: none; }
.sidebar li { padding: 12px 20px; border-radius: 25px; font-size: 18px; cursor: pointer; transition: background 0.2s; }
.sidebar li:hover { background: #181818; }
.sidebar li.active { font-weight: bold; }
.sidebar-btn { width: 100%; margin-top: 16px; padding: 14px; background: #1d9bf0; color: #fff; border: none; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; }
.sidebar-btn:hover { background: #1a8cd8; }

/* 时间线 */
.timeline { flex: 1; border-right: 1px solid #2f3336; }
.tl-header { padding: 16px; border-bottom: 1px solid #2f3336; position: sticky; top: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10; }

/* 发布框 */
.post-box { display: flex; padding: 16px; border-bottom: 1px solid #2f3336; gap: 12px; }
.post-box-body { flex: 1; }
.post-box textarea { width: 100%; background: transparent; border: none; color: #fff; font-size: 18px; resize: none; outline: none; }
.post-btn { float: right; margin-top: 8px; background: #1d9bf0; color: #fff; border: none; border-radius: 20px; padding: 8px 20px; cursor: pointer; font-weight: bold; }

/* 推文卡片 */
.avatar { font-size: 36px; min-width: 48px; text-align: center; }
.post { display: flex; padding: 16px; border-bottom: 1px solid #2f3336; gap: 12px; transition: background 0.2s; }
.post:hover { background: rgba(255,255,255,0.03); }
.post-body { flex: 1; }
.post-header { margin-bottom: 4px; }
.handle { color: #71767b; margin-left: 8px; }
.time { color: #71767b; margin-left: 4px; }
.post-content { margin: 8px 0; line-height: 1.5; }
.post-actions { display: flex; gap: 48px; margin-top: 12px; }
.action-btn { background: none; border: none; color: #71767b; cursor: pointer; font-size: 13px; transition: color 0.2s; }
.action-btn:hover { color: #1d9bf0; }
.action-btn.liked { color: #f91880; }

/* 右侧栏 */
.rightbar { width: 350px; padding: 16px; }
.search-box input { width: 100%; padding: 12px 20px; background: #202327; border: 1px solid #2f3336; border-radius: 25px; color: #fff; outline: none; }
.search-box input:focus { border-color: #1d9bf0; }
.card { background: #16181c; border-radius: 16px; padding: 16px; margin-top: 16px; }
.card h3 { margin-bottom: 12px; font-size: 18px; }
.trend-item { padding: 8px 0; border-bottom: 1px solid #2f3336; }
.trend-item small { color: #71767b; display: block; }
.suggest-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.follow-btn { background: #eff3f4; color: #0f1419; border: none; border-radius: 20px; padding: 6px 16px; font-weight: bold; cursor: pointer; }
.follow-btn:hover { background: #d7dbdc; }`,
            js: `// 🚀 最终成品 - 完整功能实现

// 数据持久化
function loadPosts() {
    const saved = localStorage.getItem('micro-social-posts');
    if (saved) return JSON.parse(saved);
    return [
        { id: 1, username: "Micro Social", handle: "@microsocial", avatar: "🐦", content: "欢迎来到 Micro Social！这是你的私有社交平台 🎉", likes: 10, liked: false, time: "刚刚" },
        { id: 2, username: "张三", handle: "@zhangsan", avatar: "😀", content: "终于有自己的社交平台了，不用担心隐私问题！", likes: 5, liked: false, time: "1小时前" },
        { id: 3, username: "李四", handle: "@lisi", avatar: "😎", content: "在宿舍局域网里用，速度飞快！", likes: 8, liked: false, time: "2小时前" },
    ];
}

function savePosts() {
    localStorage.setItem('micro-social-posts', JSON.stringify(posts));
}

let posts = loadPosts();

function render() {
    const container = document.getElementById('posts');
    container.innerHTML = posts.map(post => \`
        <div class="post">
            <div class="avatar">\${post.avatar}</div>
            <div class="post-body">
                <div class="post-header">
                    <strong>\${post.username}</strong>
                    <span class="handle">\${post.handle}</span>
                    <span class="time">· \${post.time}</span>
                </div>
                <p class="post-content">\${post.content}</p>
                <div class="post-actions">
                    <button class="action-btn">💬 0</button>
                    <button class="action-btn">🔄 0</button>
                    <button class="action-btn \${post.liked ? 'liked' : ''}" onclick="toggleLike(\${post.id})">
                        \${post.liked ? '❤️' : '🤍'} \${post.likes}
                    </button>
                </div>
            </div>
        </div>
    \`).join('');
}

function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();
    if (!content) return;
    
    posts.unshift({
        id: Date.now(),
        username: "我",
        handle: "@me",
        avatar: "🙂",
        content: content,
        likes: 0,
        liked: false,
        time: "刚刚"
    });
    
    input.value = '';
    savePosts();
    render();
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        savePosts();
        render();
    }
}

render();`
        },
        checks: [
            { name: "三栏布局完整", test: (doc) => doc.querySelector('.sidebar') && doc.querySelector('.timeline') && doc.querySelector('.rightbar') },
            { name: "有发布框", test: (doc) => doc.querySelector('.post-box') !== null },
            { name: "有推文列表", test: (doc) => doc.querySelectorAll('.post').length >= 1 },
            { name: "有点赞功能", test: (doc, code) => code.js.includes('toggleLike') },
            { name: "有发布功能", test: (doc, code) => code.js.includes('createPost') },
            { name: "有数据持久化", test: (doc, code) => code.js.includes('localStorage') },
            { name: "右侧有热门话题", test: (doc) => doc.querySelector('.rightbar') && doc.querySelector('.card') },
            { name: "界面使用了暗色主题", test: (doc, code) => code.css.includes('#000') || code.css.includes('rgb(0') }
        ]
    }
];
