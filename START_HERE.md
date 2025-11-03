# 👋 从这里开始！

**给 AI 助手的超快速指引**

---

## 🎯 项目定位

**儿童运动天赋评估系统**
- 📍 位置: `D:\projects\sports-talent-form\`
- 🔗 GitHub: https://github.com/October-1030/Sports
- 🏠 访问: http://localhost:5500

---

## ⚡ 3秒理解项目

1. **这是什么？** 评估儿童运动天赋的Web应用
2. **技术栈？** HTML + JS + 科学评分引擎 + Jest测试
3. **怎么用？** `npm install` → `npm test` → `npm run dev`

---

## 📋 用户常见指令 → 你的操作

| 用户说 | 你要做 | 查看文档 |
|--------|--------|----------|
| "开启这个项目" | 完整启动流程 | [AI_STARTUP_GUIDE.md](AI_STARTUP_GUIDE.md) |
| "我换电脑了" | 3步快速部署 | [QUICK_START.md](QUICK_START.md) |
| "这项目是啥？" | 项目详情 | [README.md](README.md) |
| "怎么改评分？" | 查看评分引擎 | [CLAUDE.md](CLAUDE.md) |

---

## 🚀 快速启动（背下来！）

```bash
# 在项目目录
cd D:\projects\sports-talent-form

# 检查依赖（第一次需要安装）
test -d node_modules || npm install

# 运行测试（必须通过！）
npm test  # 期望: 26/26 passed

# 启动服务器
npm run dev  # 后台运行

# 3秒后检查
sleep 3 && BashOutput [shell_id]
```

**期望输出：** `Serving at http://127.0.0.1:5500`

---

## 🎨 核心文件（只需关注这些）

```
sports-talent-form/
├── 📄 index.html                    主页导航
├── 📄 sports-talent-assessment.html 评估系统
├── 📁 domain/
│   ├── scoring.js                   评分引擎★
│   └── scoring.config.js            配置参数★
└── 📁 __tests__/
    └── scoring.test.js              测试用例
```

**★ = 核心业务逻辑**

---

## ✅ 成功标志

- ✅ `npm test` → 26 passed
- ✅ `npm run dev` → 服务器运行
- ✅ 访问 http://127.0.0.1:5500 → 页面正常
- ✅ 向用户报告成功信息

---

## 🔥 重点提醒

1. **永远先运行测试** - 测试不过不要启动！
2. **使用后台模式** - `run_in_background: true`
3. **检查端口占用** - 5500可能被占用
4. **Git状态** - 启动前可以忽略未提交的更改

---

## 📚 完整文档架构

```
.claude-project        ← 你现在在这里（最简洁）
START_HERE.md          ← 快速参考
AI_STARTUP_GUIDE.md    ← 详细启动流程
QUICK_START.md         ← 用户指南
CLAUDE.md              ← 项目详情
README.md              ← 完整文档
```

**建议顺序：** 本文件 → AI_STARTUP_GUIDE.md → CLAUDE.md

---

**只看这一个文件，就能快速上手！** 🚀
