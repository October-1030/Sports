# Claude 项目指南

这是一个儿童运动天赋评估系统的项目文档，专门为 Claude AI 助手编写，方便快速理解项目结构和开发环境。

## 🚀 快速启动

**当用户说"开启这个项目"时：**
请查看 **[AI_STARTUP_GUIDE.md](AI_STARTUP_GUIDE.md)** 获取完整的启动流程和检查清单。

## 🎯 项目概述

**项目名称：** 儿童运动天赋评估系统
**技术栈：** 纯前端（HTML/CSS/JavaScript + TypeScript）
**主要功能：** 多维度评估儿童运动天赋，提供科学的运动项目推荐
**GitHub：** https://github.com/October-1030/Sports

## 📁 核心文件结构

```
sports-talent-form/
├── index.html                        # 🏠 主页面（导航页）
├── sports-talent-assessment.html     # 📋 完整评估系统（唯一版本）
├── package.json                      # 📦 npm 配置
├── jest.config.js                    # 🧪 Jest 测试配置
├── tsconfig.json                     # 📝 TypeScript 配置
├── .babelrc                          # 🔄 Babel 配置
├── .gitignore                        # 🚫 Git 忽略配置
├── AI_STARTUP_GUIDE.md               # 🤖 AI 助手启动指南
├── QUICK_START.md                    # ⚡ 用户快速开始
├── README.md                         # 📖 项目文档
├── CLAUDE.md                         # 📘 本文档
├── domain/                           # 🧠 核心业务逻辑
│   ├── scoring.js                   # ⚡ 评分引擎（主要逻辑）
│   ├── scoring.config.js            # ⚙️ 评分配置
│   └── types.js                     # 📋 数据类型定义
└── __tests__/                        # 🧪 测试文件
    ├── setup.test.js                # ✅ 环境测试
    └── scoring.test.js              # 📊 评分引擎测试
```

## 🚀 开发环境命令

| 命令 | 功能 | 何时使用 |
|------|------|----------|
| `npm run dev` | 启动开发服务器 (http://localhost:5500) | 开发调试时 |
| `npm test` | 运行所有测试 | 验证功能正常 |
| `npm run test:watch` | 监听模式测试 | 开发过程中持续测试 |
| `npm run test:coverage` | 生成测试覆盖率报告 | 检查代码质量 |
| `npm run test:verbose` | 详细测试输出 | 调试测试问题 |

## 🧠 核心业务逻辑

### 评估维度（5个维度）
1. **遗传潜力 (25%)** - 父母身高、家族运动背景
2. **当前能力 (25%)** - 基础运动技能、运动频率、兴趣
3. **专项技能 (20%)** - 游泳、球类、田径等专项能力
4. **身体状况 (15%)** - 健康状况、体型优势
5. **心理特征 (15%)** - 性格、抗挫折能力、团队合作

### 关键函数（domain/scoring.js）
- `evaluate(input, config)` - 主评估函数
- `calculateScore(data)` - 别名，测试用
- `determinePath(score, config)` - 路径等级判定
- `assessSportsSuitability(input, scores, details, config)` - 运动推荐

### 数据结构示例
```javascript
const assessmentInput = {
  child: { name: "张小明", age: 10, gender: "male" },
  family: { father: 180, mother: 165 },
  parents: {
    father: { sportExp: "professional", traits: ["speed"] },
    mother: { sportExp: "amateur", traits: ["flexibility"] }
  },
  development: { 
    frequency: "3-4_times", 
    interests: ["游泳", "篮球"] 
  },
  // ... 更多字段
};
```

## 🛠️ 开发提示

### 如果需要修改评分逻辑：
1. 查看 `domain/scoring.config.js` 了解配置参数
2. 修改 `domain/scoring.js` 中的计算函数
3. 运行 `npm test` 确保测试通过

### 如果需要修改UI：
1. 主要文件是 `sports-talent-assessment-responsive.html`
2. 样式采用内嵌CSS，支持响应式设计
3. 使用 `npm run dev` 启动服务器实时预览

### 如果需要添加新功能：
1. 先在 `domain/types.js` 定义数据类型
2. 在 `domain/scoring.js` 实现业务逻辑
3. 在 `__tests__/` 添加测试用例
4. 更新前端HTML页面

## 🧪 测试状态

- ✅ 基础环境测试通过
- ⚠️ 评分引擎测试需要完善（数据结构匹配问题）
- ✅ 开发服务器正常运行

## 🎨 UI特色

- 🎯 卡通风格设计，适合儿童主题
- 📱 完全响应式，支持移动端和桌面端
- 🎨 渐变色彩搭配，视觉友好
- 📊 实时评分反馈
- 💾 自动保存功能

## 🔧 常见操作

### 启动项目
```bash
cd D:\projects\sports-talent-form
npm run dev
# 访问 http://localhost:5500
```

### 运行测试
```bash
npm test                    # 运行一次
npm run test:watch         # 持续监听
```

### 查看覆盖率
```bash
npm run test:coverage
# 查看 coverage/ 目录下的报告
```

## 💡 与 Claude 对话建议

当您需要Claude帮助时，可以这样描述问题：

1. **功能相关：** "我需要修改评分算法中的遗传潜力计算逻辑"
2. **UI相关：** "我想调整评估表的样式，让它更现代化"
3. **测试相关：** "测试用例失败了，需要修复数据结构匹配问题"
4. **新功能：** "我想添加一个导出PDF报告的功能"

Claude会根据这个文档快速理解项目结构，并提供精准的帮助。

---

📝 **最后更新：** 2025-09-10  
🎯 **项目状态：** 开发环境已配置完成，可开始功能开发  
🔗 **访问地址：** http://localhost:5500 （需先运行 `npm run dev`）