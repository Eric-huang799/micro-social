/**
 * editor.js - 编辑器核心逻辑
 * 管理 CodeMirror 编辑器、关卡切换、代码运行和验证
 */

// ===== 状态管理 =====
let currentChallenge = 0;
let currentFile = 'html';
let editor = null;
let completedChallenges = new Set();

// 每个关卡的代码缓存
let codeCache = {};

// ===== 初始化 =====
function init() {
    // 加载进度
    loadProgress();

    // 初始化 CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
        autoCloseBrackets: true,
        matchBrackets: true,
        extraKeys: {
            'Ctrl-Enter': runCode,
            'Cmd-Enter': runCode,
            'Ctrl-S': function() { saveCurrentCode(); setStatus('💾 已保存', 'info'); }
        }
    });

    // 编辑器变化时自动运行
    let debounceTimer;
    editor.on('change', () => {
        saveCurrentCode();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runCode, 800);
    });

    // 渲染关卡列表
    renderChallengeList();

    // 加载第一个关卡
    loadChallenge(currentChallenge);
}

// ===== 关卡管理 =====
function loadChallenge(index) {
    if (index < 0 || index >= CHALLENGES.length) return;

    currentChallenge = index;
    const challenge = CHALLENGES[index];

    // 初始化代码缓存
    if (!codeCache[challenge.id]) {
        codeCache[challenge.id] = {
            html: challenge.initialCode.html,
            css: challenge.initialCode.css,
            js: challenge.initialCode.js
        };
    }

    // 更新 UI
    document.getElementById('challenge-badge').textContent = challenge.badge;
    document.getElementById('challenge-title').textContent = challenge.title;
    document.getElementById('challenge-difficulty').innerHTML =
        '<span>难度：</span><span class="stars">' + '⭐'.repeat(challenge.difficulty) + '</span>';
    document.getElementById('challenge-desc').innerHTML = challenge.description;
    document.getElementById('challenge-hints').innerHTML = challenge.hints;
    document.getElementById('challenge-indicator').textContent =
        `${index + 1} / ${CHALLENGES.length}`;

    // 更新检查清单
    renderChecklist(challenge);

    // 切换到 HTML 文件
    switchFile('html');

    // 更新关卡列表高亮
    renderChallengeList();

    // 运行代码
    setTimeout(runCode, 100);

    // 清除状态消息
    setStatus('', '');

    // 保存进度
    saveProgress();
}

function prevChallenge() {
    if (currentChallenge > 0) {
        loadChallenge(currentChallenge - 1);
    }
}

function nextChallenge() {
    if (currentChallenge < CHALLENGES.length - 1) {
        loadChallenge(currentChallenge + 1);
    }
}

function goNextChallenge() {
    closeModal();
    nextChallenge();
}

// ===== 文件切换 =====
function switchFile(type) {
    // 保存当前文件的代码
    saveCurrentCode();

    currentFile = type;
    const challenge = CHALLENGES[currentChallenge];
    const code = codeCache[challenge.id];

    // 更新编辑器内容和语言模式
    const modes = {
        html: 'htmlmixed',
        css: 'css',
        js: 'javascript'
    };

    editor.setOption('mode', modes[type]);
    editor.setValue(code[type] || '');

    // 更新 tab 高亮
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
}

function saveCurrentCode() {
    if (!editor) return;
    const challenge = CHALLENGES[currentChallenge];
    if (!codeCache[challenge.id]) return;
    codeCache[challenge.id][currentFile] = editor.getValue();
}

// ===== Tab 切换 =====
function switchTab(tab) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
}

// ===== 代码运行 =====
function runCode() {
    saveCurrentCode();

    const challenge = CHALLENGES[currentChallenge];
    const code = codeCache[challenge.id];

    const html = code.html || '';
    const css = code.css || '';
    const js = code.js || '';

    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}<\/script>
</body>
</html>`;

    const iframe = document.getElementById('preview-frame');
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    iframe.onload = () => {
        URL.revokeObjectURL(url);
    };

    iframe.src = url;
}

// ===== 答案检查 =====
function checkChallenge() {
    saveCurrentCode();
    runCode();

    // 等待 iframe 加载
    setTimeout(() => {
        const challenge = CHALLENGES[currentChallenge];
        const code = codeCache[challenge.id];
        const iframe = document.getElementById('preview-frame');

        let doc;
        try {
            doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
            setStatus('⚠️ 无法检查预览内容', 'error');
            return;
        }

        let allPassed = true;
        const results = [];

        challenge.checks.forEach(check => {
            let passed = false;
            try {
                passed = check.test(doc, code);
            } catch (e) {
                passed = false;
            }
            results.push({ name: check.name, passed });
            if (!passed) allPassed = false;
        });

        // 更新检查清单
        renderChecklistResults(results);

        // 切换到检查 tab
        document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.tabs .tab')[2].classList.add('active');
        document.getElementById('tab-checklist').classList.remove('hidden');

        if (allPassed) {
            completedChallenges.add(challenge.id);
            saveProgress();
            updateProgress();
            renderChallengeList();

            setStatus('🎉 全部通过！', 'success');

            // 显示通关弹窗
            setTimeout(() => {
                if (currentChallenge === CHALLENGES.length - 1) {
                    document.getElementById('modal-title').textContent = '🏆 恭喜通关所有关卡！';
                    document.getElementById('modal-message').textContent =
                        '你已经掌握了搭建社交平台的基础知识！点击"导出成品"下载你的项目。';
                } else {
                    document.getElementById('modal-title').textContent = '🎉 恭喜通关！';
                    document.getElementById('modal-message').textContent =
                        `你已完成「${challenge.title}」！准备好迎接下一个挑战了吗？`;
                }
                document.getElementById('success-modal').classList.remove('hidden');
            }, 500);
        } else {
            const passed = results.filter(r => r.passed).length;
            setStatus(`✅ ${passed}/${results.length} 项通过`, passed > 0 ? 'info' : 'error');
        }
    }, 500);
}

function renderChecklist(challenge) {
    const container = document.getElementById('challenge-checklist');
    container.innerHTML = challenge.checks.map(check => `
        <div class="checklist-item">
            <span class="checklist-icon">⬜</span>
            <span>${check.name}</span>
        </div>
    `).join('');
}

function renderChecklistResults(results) {
    const container = document.getElementById('challenge-checklist');
    container.innerHTML = results.map(r => `
        <div class="checklist-item ${r.passed ? 'passed' : 'failed'}">
            <span class="checklist-icon">${r.passed ? '✅' : '❌'}</span>
            <span>${r.name}</span>
        </div>
    `).join('');
}

// ===== 关卡列表 =====
function renderChallengeList() {
    const container = document.getElementById('challenge-list-items');
    container.innerHTML = CHALLENGES.map((challenge, index) => {
        const isActive = index === currentChallenge;
        const isCompleted = completedChallenges.has(challenge.id);
        let classes = '';
        if (isActive) classes += ' active';
        if (isCompleted) classes += ' completed';

        return `
            <li class="${classes}" onclick="loadChallenge(${index})">
                <span class="status-icon">${isCompleted ? '✅' : isActive ? '▶️' : '⬜'}</span>
                <span>${challenge.title}</span>
            </li>
        `;
    }).join('');
}

// ===== 进度管理 =====
function loadProgress() {
    try {
        const saved = localStorage.getItem('playground-progress');
        if (saved) {
            const data = JSON.parse(saved);
            completedChallenges = new Set(data.completed || []);
            currentChallenge = data.currentChallenge || 0;
            codeCache = data.codeCache || {};
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
    updateProgress();
}

function saveProgress() {
    try {
        localStorage.setItem('playground-progress', JSON.stringify({
            completed: [...completedChallenges],
            currentChallenge: currentChallenge,
            codeCache: codeCache
        }));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
    updateProgress();
}

function updateProgress() {
    const total = CHALLENGES.length;
    const completed = completedChallenges.size;
    const percent = Math.round((completed / total) * 100);

    document.getElementById('progress-text').textContent = `进度: ${percent}%`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
}

// ===== 重置 =====
function resetChallenge() {
    if (!confirm('确定要重置当前关卡吗？代码将恢复到初始状态。')) return;

    const challenge = CHALLENGES[currentChallenge];
    codeCache[challenge.id] = {
        html: challenge.initialCode.html,
        css: challenge.initialCode.css,
        js: challenge.initialCode.js
    };

    switchFile(currentFile);
    saveProgress();
    runCode();
    setStatus('🔄 已重置', 'info');
}

// ===== 导出 =====
function exportProject() {
    const challenge = CHALLENGES[CHALLENGES.length - 1]; // 最后一关的代码
    const code = codeCache[challenge.id] || challenge.initialCode;

    const fullHTML = generateExportHTML(code);

    document.getElementById('export-code').textContent = fullHTML;
    document.getElementById('export-modal').classList.remove('hidden');
}

function generateExportHTML(code) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Micro Social - 我的社交平台</title>
    <style>
${code.css}
    </style>
</head>
<body>
${code.html}
    <script>
${code.js}
    <\/script>
</body>
</html>`;
}

function downloadProject() {
    const challenge = CHALLENGES[CHALLENGES.length - 1];
    const code = codeCache[challenge.id] || challenge.initialCode;

    // 尝试使用 JSZip
    if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        zip.file('index.html', generateExportHTML(code));
        zip.file('style.css', code.css || '');
        zip.file('script.js', code.js || '');
        zip.file('README.md', '# Micro Social\\n\\n我的社交平台，由 Micro Social Playground 生成。\\n\\n## 使用方式\\n\\n直接打开 `index.html` 即可！');

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'micro-social-project.zip';
            a.click();
            URL.revokeObjectURL(url);
        });
    } else {
        // 降级：下载单个 HTML 文件
        const fullHTML = generateExportHTML(code);
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'micro-social.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}

function copyCode() {
    const code = document.getElementById('export-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        setStatus('📋 已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级复制
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setStatus('📋 已复制到剪贴板', 'success');
    });
}

// ===== 预览尺寸 =====
function setPreviewSize(size) {
    const container = document.getElementById('preview-container');
    document.querySelectorAll('.preview-size-btn').forEach(btn => btn.classList.remove('active'));

    if (size === 'mobile') {
        container.classList.add('mobile');
        event.target.classList.add('active');
    } else {
        container.classList.remove('mobile');
        event.target.classList.add('active');
    }
}

// ===== 侧边栏 =====
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ===== 弹窗 =====
function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

function closeExportModal() {
    document.getElementById('export-modal').classList.add('hidden');
}

// ===== 状态消息 =====
function setStatus(msg, type) {
    const el = document.getElementById('status-msg');
    el.textContent = msg;
    el.className = 'status-msg ' + (type || '');
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
