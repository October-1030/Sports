# 🤖 AI 助手启动指南

**本文档专门为 AI 助手（如 Claude）编写**
当用户说"开启这个项目"时，请按照以下流程操作。

---

## 📋 启动检查清单

### 1️⃣ 确认项目位置

```bash
cd D:\projects\sports-talent-form
# 或根据实际位置调整路径
```

### 2️⃣ 检查环境状态

**必须执行的检查：**

```bash
# 检查 Node.js 版本（需要 >= 14.0）
node --version

# 检查 npm 是否可用
npm --version

# 检查 node_modules 是否存在
ls node_modules/ || echo "需要安装依赖"

# 查看 Git 状态
git status
```

**期望输出：**
- Node.js: v14.0 或更高
- npm: 正常版本号
- node_modules: 存在且包含依赖
- Git: 干净的工作区（或有预期的更改）

### 3️⃣ 安装/更新依赖（如果需要）

**如果 node_modules 不存在或依赖过时：**

```bash
npm install
```

**如果已存在依赖，跳过此步骤。**

### 4️⃣ 运行测试验证

**启动前验证项目功能正常：**

```bash
npm test
```

**期望结果：**
```
Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total
```

**如果测试失败：**
- 报告给用户具体的错误信息
- 不要继续启动服务器
- 等待用户指示

### 5️⃣ 启动开发服务器

**在后台启动服务器：**

```bash
npm run dev
# 使用 run_in_background: true 参数
```

**等待服务器启动（约3秒）：**

```bash
sleep 3
```

**检查服务器输出：**

```bash
# 使用 BashOutput 工具检查启动日志
```

**期望输出：**
```
Serving "D:\projects\sports-talent-form" at http://127.0.0.1:5500
```

### 6️⃣ 向用户报告

**成功启动后，提供以下信息：**

```markdown
✅ 项目已成功启动！

📊 项目状态：
- 开发服务器: ✅ 运行中
- 访问地址: http://127.0.0.1:5500
- 测试状态: ✅ 26/26 通过
- Node.js 版本: [实际版本]

🔗 可用页面：
- 主页: http://127.0.0.1:5500
- 评估系统: http://127.0.0.1:5500/sports-talent-assessment.html

💡 提示：
- 修改文件会自动刷新浏览器
- 按 Ctrl+C 可停止服务器
- 运行 `npm test` 可验证功能
```

---

## 🔧 常见问题处理

### 端口被占用

**现象：** 错误信息包含 "EADDRINUSE" 或 "port 5500"

**处理方法：**

```bash
# 1. 查找占用端口的进程
netstat -ano | findstr :5500  # Windows
lsof -i :5500                 # macOS/Linux

# 2. 询问用户是否要：
#    a) 终止占用的进程
#    b) 使用其他端口
```

### 依赖安装失败

**现象：** npm install 报错

**处理方法：**

1. 检查网络连接
2. 建议使用镜像：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```
3. 清理缓存后重试：
   ```bash
   npm cache clean --force
   npm install
   ```

### 测试失败

**现象：** npm test 有失败的测试

**处理方法：**

1. 运行详细测试：
   ```bash
   npm run test:verbose
   ```
2. 报告给用户具体失败的测试和错误信息
3. 不要启动服务器，等待用户修复

### Git 工作区不干净

**现象：** git status 显示有未提交的更改

**处理方法：**

1. 列出更改的文件
2. 询问用户是否需要：
   - 提交更改
   - 暂存更改（stash）
   - 放弃更改
   - 继续启动（忽略 Git 状态）

---

## 📝 完整启动脚本

**将以下步骤整合为流畅的操作流程：**

```bash
# 1. 进入项目目录
cd D:\projects\sports-talent-form

# 2. 检查环境
node --version && npm --version

# 3. 检查依赖（如果 node_modules 不存在则安装）
if [ ! -d "node_modules" ]; then
  npm install
fi

# 4. 运行测试
npm test

# 5. 启动服务器（后台运行）
npm run dev &

# 6. 等待启动
sleep 3

# 7. 检查服务器状态
# 使用 BashOutput 工具
```

---

## 🎯 任务完成标志

**以下条件全部满足时，认为"开启项目"任务完成：**

- ✅ 开发服务器成功运行在 http://127.0.0.1:5500
- ✅ 所有测试通过（26/26）
- ✅ 向用户提供了访问地址和项目状态
- ✅ 没有错误或警告信息（或已处理）

---

## 🚫 什么时候不应该启动

**遇到以下情况，停止操作并询问用户：**

1. **不在项目目录中** - 无法找到 package.json
2. **Node.js 未安装** - node 命令不可用
3. **测试失败** - npm test 有错误
4. **严重的 Git 冲突** - 有 merge conflict
5. **用户明确要求其他操作** - 如"只运行测试"、"只安装依赖"

---

## 💡 额外提示

### 使用 TodoWrite 工具

启动项目时，创建 todo 列表追踪进度：

```javascript
[
  { content: "检查环境和依赖", status: "in_progress", activeForm: "检查环境和依赖" },
  { content: "运行测试验证", status: "pending", activeForm: "运行测试验证" },
  { content: "启动开发服务器", status: "pending", activeForm: "启动开发服务器" },
  { content: "验证服务器运行状态", status: "pending", activeForm: "验证服务器运行状态" }
]
```

### 并行执行

当检查多个独立信息时，使用并行工具调用：

```javascript
// 同时检查多个状态
Bash: node --version
Bash: npm --version
Bash: git status
```

### 背景服务器管理

- 启动服务器时使用 `run_in_background: true`
- 使用 `BashOutput` 工具检查服务器输出
- 记住服务器的 shell ID，以便后续管理

---

**最后更新：** 2025-11-03
**适用版本：** v1.0+
**维护者：** Claude Code
