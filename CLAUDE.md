# Claude 项目指南

这是 FutureStars ID v6.0 儿童运动天赋评估系统的项目文档，专门为 Claude AI 助手编写。

## 项目概述

**项目名称：** FutureStars ID - 儿童运动天赋评估系统
**版本：** v6.0
**技术栈：** 纯前端（HTML/CSS/JavaScript + TypeScript）
**主要功能：** 家庭实测场景下的多维度运动天赋评估
**GitHub：** https://github.com/October-1030/Sports

## 核心文件结构

```
sports-talent-form/
├── index.html                # 主应用（单文件，含HTML/CSS/JS）
├── package.json              # npm 配置
├── vite.config.ts            # Vite 构建配置
├── tsconfig.json             # TypeScript 配置
├── jest.config.js            # Jest 测试配置
├── CLAUDE.md                 # 本文档
├── WORK_LOG.md               # 工作日志
├── domain/                   # 核心业务逻辑
│   └── scoring.ts            # v6.0 评分引擎（TypeScript）
└── __tests__/                # 测试文件
    └── setup.test.js         # 环境测试
```

## 开发环境命令

| 命令 | 功能 |
|------|------|
| `npm run dev` | 启动开发服务器 (http://localhost:5500) |
| `npm run build` | 构建生产版本 |
| `npm test` | 运行测试 |

## 表单流程（6步）

| Step | 名称 | 内容 |
|------|------|------|
| 0 | Landing Page | Hero区、特色卡片、开始按钮 |
| 1 | 安全准入 | 健康状况多选、心脏红线阻断 |
| 2 | 家族遗传图谱 | 父母身高、运动特质 |
| 3 | 儿童身体硬件 | 性别、出生日期、身高体重臂展 |
| 4 | 家庭运动实测 | 闭眼单脚站/快速击打、立定跳远、坐位体前屈、30米冲刺 |
| 5 | 心理与认知 | 受教性、抗压性、竞争欲滑块 |
| 结果 | 公众号引导 | 二维码、3步指引 |

## 评分引擎（domain/scoring.ts）

### 五维评分
- **速度** (speed) - 30米冲刺或推算
- **爆发力** (power) - 立定跳远
- **协调性** (coordination) - 闭眼单脚站/快速击打
- **遗传潜力** (genetic) - 父母运动背景
- **心理韧性** (mindset) - 受教性/抗压性/竞争欲

### 主要函数
- `evaluate(input)` - 主评估函数，返回 AssessmentResult
- `formatResult(result)` - 格式化结果为可读文本

### Tier 等级
- Tier 1: 85+ 精英潜力
- Tier 2: 70-84 竞技储备
- Tier 3: 55-69 兴趣培养
- Tier 4: <55 基础发展

## 待完成工作

- [ ] 评分引擎对接前端
- [ ] EmailJS 实际配置
- [ ] 公众号二维码图片
- [ ] GIF 动作演示素材
- [ ] 移动端适配测试
- [ ] 表单验证完善
- [ ] 编写新版测试用例

## 启动项目

```bash
cd D:\projects\sports-talent-form
npm run dev
# 访问 http://localhost:5500
```

---

**最后更新：** 2025-12-15
**项目状态：** v6.0 开发中，需对接评分引擎
