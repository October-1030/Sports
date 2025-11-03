# 儿童运动天赋评估调查表

一个现代化的儿童运动天赋评估系统，采用纯前端技术实现，支持多维度评估和智能推荐。

## 🚀 功能特性

- **多维度评估**: 遗传潜力、当前能力、专项技能、身体状况、心理特征
- **智能评分**: 基于科学算法的综合评分系统
- **项目推荐**: 根据评估结果推荐适合的运动项目
- **响应式设计**: 支持移动端和桌面端
- **数据持久化**: 自动保存，防止数据丢失
- **多种导出**: 支持JSON、PDF、打印等多种导出方式

## 📦 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **类型系统**: TypeScript
- **构建工具**: Webpack
- **测试框架**: Jest
- **样式**: 自定义CSS主题系统

## 🛠️ 开发环境

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
# 或
npm start
```

访问 http://localhost:5500

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 详细输出
npm run test:verbose
```

## 🧪 测试配置

项目已配置完整的Jest测试环境：

### 测试文件结构

```
__tests__/
├── setup.test.js      # 测试环境设置和验证
└── scoring.test.js    # 评分引擎测试
```

### 测试覆盖

- ✅ 基础功能测试
- ✅ 遗传潜力评分
- ✅ 当前能力评分
- ✅ 专项技能评分
- ✅ 身体状况评分
- ✅ 心理特征评分
- ✅ 路径等级判定
- ✅ 边界条件测试
- ✅ 配置覆盖测试

### 测试工具

项目提供了丰富的测试工具函数：

```javascript
// 创建模拟评估输入数据
const mockData = testUtils.createMockAssessmentInput();

// 等待异步操作
await testUtils.waitFor(100);

// 模拟用户输入
testUtils.simulateInput(element, 'value');
```

## 📁 项目结构

```
sports-talent-form/
├── index.html              # 主页面
├── app.js                  # 主应用逻辑
├── submit.js               # 提交处理
├── serve-local.js          # 本地服务器
├── package.json            # 项目配置
├── jest.config.js          # Jest配置
├── tsconfig.json           # TypeScript配置
├── domain/                 # 业务逻辑
│   ├── types.js           # 数据类型定义
│   ├── scoring.config.js  # 评分配置
│   └── scoring.js         # 评分引擎
├── src/domain/            # TypeScript版本
│   ├── types.ts
│   ├── scoring.config.ts
│   └── scoring.ts
├── themes/                # 样式主题
│   └── cartoon.css
└── __tests__/            # 测试文件
    ├── setup.test.js
    └── scoring.test.js
```

## 🎨 主题系统

项目采用模块化的主题系统，支持：

- 卡通主题 (`themes/cartoon.css`)
- 响应式设计
- 统一的颜色和间距系统
- 可扩展的主题架构

## 📊 评估维度

### 1. 遗传潜力 (25%)
- 父母身高基因
- 家族运动背景
- 遗传特质分析

### 2. 当前能力 (25%)
- 基础运动技能
- 运动频率
- 兴趣偏好

### 3. 专项技能 (20%)
- 水上运动能力
- 球类运动技能
- 田径项目表现

### 4. 身体状况 (15%)
- 健康状况评估
- 运动优势分析
- 体型特征

### 5. 心理特征 (15%)
- 性格特点
- 应对挫折能力
- 团队合作倾向

## 🔧 配置说明

### Jest配置

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/domain', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### TypeScript配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 🚀 部署

项目为纯前端实现，可直接部署到任何静态文件服务器：

1. 构建项目（可选）
2. 上传所有文件到服务器
3. 配置服务器支持SPA路由（如需要）

## 📝 开发规范

- 使用ES6+语法
- 遵循TypeScript类型定义
- 编写完整的测试用例
- 保持代码覆盖率在80%以上
- 使用语义化的提交信息

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues]
- 邮箱: [your-email@example.com]

---

**注意**: 本系统仅用于专业运动天赋评估，请确保数据安全和隐私保护。
