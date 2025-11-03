/**
 * 儿童运动天赋评估统一数据模型 - JavaScript版本
 * 使用JSDoc注释定义类型结构，与TypeScript版本保持一致
 * 注意：所有可枚举项使用英文值，中文标签由UI层负责映射
 */

// === 基础枚举类型 ===

/**
 * @typedef {'male' | 'female'} Gender
 */

/**
 * @typedef {'kindergarten_small' | 'kindergarten_medium' | 'kindergarten_large' | 'primary_1' | 'primary_2' | 'other'} GradeLevel
 * 幼儿园小班 | 幼儿园中班 | 幼儿园大班 | 小学一年级 | 小学二年级 | 其他
 */

/**
 * @typedef {'rarely' | '1-2_times' | '3-4_times' | '5plus_times'} ActivityFrequency
 * 几乎不运动 | 1-2次/周 | 3-4次/周 | 5次以上/周
 */

/**
 * @typedef {'excellent' | 'good' | 'average' | 'weak'} SkillLevel
 * 优秀 | 良好 | 一般 | 较弱
 */

/**
 * @typedef {'professional' | 'amateur' | 'rarely'} ParentSportExp  
 * 专业运动员 | 业余爱好者 | 较少运动
 */

/**
 * @typedef {'very_positive' | 'positive' | 'neutral' | 'slightly_afraid' | 'very_afraid'} WaterAttitude
 * 非常喜欢，主动要求下水 | 比较喜欢，不排斥下水 | 一般，无明显喜好 | 有点害怕，需要鼓励才能下水 | 非常害怕，拒绝接触水
 */

/**
 * @typedef {'not_learned' | 'parent_taught' | 'took_courses' | 'systematic'} SwimLearningStatus
 * 未学习 | 家长教导 | 参加过课程 | 系统学习
 */

/**
 * @typedef {'thin' | 'standard' | 'sturdy' | 'other'} BodyType
 * 偏瘦 | 标准 | 偏壮 | 其他
 */

/**
 * @typedef {'hobby' | 'recreational' | 'competitive' | 'elite'} PathwayLevel
 * 业余爱好级别(0-40分) | 兴趣培养级别(41-60分) | 竞技储备级别(61-80分) | 专业发展级别(81-100分)
 */

/**
 * @typedef {'aquatic' | 'ball_sports' | 'track_field' | 'technical'} SportType  
 * 水上项目 | 球类运动 | 田径项目 | 技巧项目(体操/舞蹈等)
 */

// === 核心数据结构 ===

/**
 * 儿童基本信息
 * @typedef {Object} ChildProfile
 * @property {string} name - 姓名
 * @property {Gender} gender - 性别
 * @property {number} age - 年龄（支持小数，如6.5岁）
 * @property {number} [height] - 身高(cm)
 * @property {number} [weight] - 体重(kg)
 * @property {GradeLevel} grade - 年级
 * @property {string} [gradeOther] - 当grade为'other'时的具体说明
 */

/**
 * 家族身高数据
 * @typedef {Object} FamilyHeights
 * @property {number} [father] - 父亲身高
 * @property {number} [mother] - 母亲身高
 * @property {number} [grandpa] - 爷爷身高
 * @property {number} [grandma] - 奶奶身高
 * @property {number} [wgrandpa] - 外公身高  
 * @property {number} [wgrandma] - 外婆身高
 */

/**
 * 父母运动特质
 * @typedef {Object} ParentTraits
 * @property {number} [height] - 身高
 * @property {ParentSportExp} [sportExp] - 运动经历
 * @property {string} [sport] - 擅长运动项目
 * @property {string} [job] - 职业
 * @property {string[]} traits - 运动潜质特点（多选）
 * @property {string} [traitsOther] - 其他特点描述
 * @property {string} [hiddenSport] - 可能适合但未系统训练的项目
 * @property {string} [examples] - 具体表现或例子
 */

/**
 * 父母运动基因
 * @typedef {Object} ParentGenes
 * @property {ParentTraits} father - 父亲信息
 * @property {ParentTraits} mother - 母亲信息
 */

/**
 * 基础运动技能
 * @typedef {Object} BasicSkills
 * @property {SkillLevel} run - 跑
 * @property {SkillLevel} jump - 跳
 * @property {SkillLevel} throw - 投掷
 * @property {SkillLevel} climb - 攀爬
 * @property {SkillLevel} balance - 平衡
 */

/**
 * 当前运动技能
 * @typedef {Object} CurrentSkills
 * @property {boolean} hasTraining - 是否参加过运动培训
 * @property {string} [trainingDesc] - 培训项目和时长描述
 * @property {ActivityFrequency} frequency - 每周运动频率
 * @property {string[]} interests - 感兴趣的运动项目（多选）
 * @property {string} [interestsOther] - 其他兴趣项目
 * @property {string} [ballOther] - 其他球类项目
 * @property {BasicSkills} basicSkills - 基础运动技能评估
 */

/**
 * 游泳技能
 * @typedef {Object} SwimSkills
 * @property {boolean} hasContact - 是否接触过游泳
 * @property {number} [startAge] - 开始接触游泳年龄
 * @property {WaterAttitude} [attitude] - 对水的态度
 * @property {string[]} skills - 已掌握的水中技能（多选）
 * @property {number} [holdBreathSec] - 憋气秒数
 * @property {number} [floatSec] - 漂浮秒数
 * @property {string} [skillsOther] - 其他技能
 * @property {SwimLearningStatus} [learningStatus] - 学习情况
 * @property {number} [courseTimes] - 课程次数
 * @property {string} [learnDuration] - 系统学习时长
 */

/**
 * 专项技能
 * @typedef {Object} SpecialtySkills
 * @property {SwimSkills} aquatic - 水上运动技能
 * @property {string[]} ball - 球类运动技能
 * @property {string[]} track - 田径项目技能
 * @property {string[]} tech - 技巧项目技能(体操/舞蹈等)
 */

/**
 * 健康信息
 * @typedef {Object} HealthInfo
 * @property {boolean} hasSpecialCondition - 是否有影响运动的特殊体质或疾病
 * @property {string} [specialDesc] - 特殊情况描述
 * @property {boolean} hasCheckup - 近一年是否体检
 * @property {string} [findings] - 体检发现
 * @property {string[]} swimConcerns - 影响游泳的情况（多选）
 * @property {number} [myopia] - 近视度数
 * @property {string} [healthOther] - 其他健康问题
 * @property {BodyType} bodyType - 体型评估
 * @property {string} [bodyTypeOther] - 其他体型描述
 */

/**
 * 身体优势
 * @typedef {Object} PhysicalAdvantages
 * @property {HealthInfo} health - 健康信息
 * @property {string[]} strengths - 当前运动表现优势（多选）
 */

/**
 * 观察到的天赋
 * @typedef {Object} ObservedTalents
 * @property {string[]} highlights - 表现突出的运动方面（多选）
 * @property {string} [highlightsOther] - 其他突出表现
 * @property {string} [examples] - 具体表现例子
 * @property {string} [ignored] - 被忽视的潜质
 */

/**
 * 运动心理特征
 * @typedef {Object} SportsPersonality
 * @property {string[]} traits - 运动相关性格特点（多选）
 * @property {string} [traitsOther] - 其他性格特点
 * @property {string} response - 面对困难/挫折的反应
 * @property {string} [responseOther] - 其他反应方式
 * @property {string} teamwork - 团队合作倾向
 * @property {string} [notes] - 特别说明
 */

/**
 * 家庭支持条件
 * @typedef {Object} SupportConditions
 * @property {string} traffic - 交通便利性
 * @property {string} budget - 经济投入
 * @property {string} time - 家长陪伴时间
 * @property {string} atmosphere - 家庭运动氛围
 */

/**
 * 发展目标
 * @typedef {Object} DevelopmentGoal
 * @property {string[]} purposes - 参加训练的目的（多选）
 * @property {string} [purposeOther] - 其他目的
 * @property {string} expectation - 对未来发展的期望
 * @property {string} [expectationOther] - 其他期望
 * @property {string[]} trainingTime - 能投入的训练时间（多选）
 * @property {string} [trainingTimeOther] - 其他时间安排
 * @property {SupportConditions} support - 家庭支持条件
 */

/**
 * 填写人信息
 * @typedef {Object} FillerInfo
 * @property {string} name - 填写人姓名
 * @property {string} relation - 与儿童关系
 * @property {string} phone - 联系电话
 * @property {string} date - 填写日期
 */

// === 评估输入与输出 ===

/**
 * 评估输入数据
 * @typedef {Object} AssessmentInput
 * @property {ChildProfile} child - 儿童基本信息
 * @property {FamilyHeights} family - 家族身高数据
 * @property {ParentGenes} parents - 父母运动基因
 * @property {CurrentSkills} development - 当前运动技能
 * @property {SpecialtySkills} specialty - 专项技能
 * @property {PhysicalAdvantages} physical - 身体优势
 * @property {ObservedTalents} observed - 观察到的天赋
 * @property {SportsPersonality} psychology - 运动心理特征
 * @property {DevelopmentGoal} goals - 发展目标
 * @property {FillerInfo} [filler] - 填写人信息（可选）
 */

/**
 * 评估得分
 * @typedef {Object} AssessmentScores
 * @property {number} genetic - 遗传潜力得分(0-100)
 * @property {number} current - 当前能力得分(0-100)
 * @property {number} specialty - 专项技能得分(0-100)
 * @property {number} physical - 身体优势得分(0-100)
 * @property {number} psychology - 心理特征得分(0-100)
 */

/**
 * 详细得分分解
 * @typedef {Object} ScoreDetails
 * @property {Object} genetic - 遗传潜力详细得分
 * @property {number} genetic.heightGenes - 身高基因得分
 * @property {number} genetic.parentSports - 父母运动基因得分
 * @property {Object} current - 当前能力详细得分
 * @property {number} current.basicSkills - 基础技能得分
 * @property {number} current.frequency - 运动频率得分
 * @property {number} current.interests - 兴趣广度得分
 * @property {Object} specialty - 专项技能详细得分
 * @property {number} specialty.aquatic - 水上项目得分
 * @property {number} specialty.ball - 球类项目得分
 * @property {number} specialty.track - 田径项目得分
 * @property {number} specialty.tech - 技巧项目得分
 * @property {Object} physical - 身体优势详细得分
 * @property {number} physical.bodyType - 体型得分
 * @property {number} physical.strengths - 当前优势得分
 * @property {number} physical.health - 健康状况得分
 * @property {Object} psychology - 心理特征详细得分
 * @property {number} psychology.traits - 性格特点得分
 * @property {number} psychology.resilience - 抗挫折能力得分
 * @property {number} psychology.teamwork - 团队合作得分
 */

/**
 * 评估结果
 * @typedef {Object} AssessmentResult
 * @property {AssessmentScores} scores - 各维度得分
 * @property {number} overall - 综合得分(0-100)
 * @property {PathwayLevel} pathway - 推荐路径等级
 * @property {string[]} recommendations - 具体建议列表
 * @property {SportType[]} suitableSports - 适合项目数组
 * @property {ScoreDetails} details - 详细得分分解
 * @property {string} timestamp - 评估时间戳
 */

// === 开发/测试用例数据 ===

/**
 * 示例输入数据，用于开发和单元测试
 * @type {AssessmentInput}
 */
const EXAMPLE_INPUT = {
  child: {
    name: "张小明",
    gender: "male",
    age: 6.5,
    height: 120,
    weight: 22,
    grade: "kindergarten_large"
  },
  family: {
    father: 175,
    mother: 162,
    grandpa: 172,
    grandma: 158,
    wgrandpa: 170,
    wgrandma: 160
  },
  parents: {
    father: {
      height: 175,
      sportExp: "amateur",
      sport: "篮球",
      job: "工程师",
      traits: ["爆发力好", "协调性强", "反应速度快"],
      traitsOther: "",
      hiddenSport: "游泳",
      examples: "打篮球投篮准确率高，跑步速度快"
    },
    mother: {
      height: 162,
      sportExp: "amateur", 
      sport: "瑜伽",
      job: "教师",
      traits: ["柔韧性好", "平衡感好", "身体恢复快"],
      traitsOther: "",
      hiddenSport: "舞蹈",
      examples: "瑜伽动作标准，平衡感极佳"
    }
  },
  development: {
    hasTraining: true,
    trainingDesc: "游泳 6个月，体操 10次",
    frequency: "3-4_times",
    interests: ["游泳", "篮球", "田径项目"],
    interestsOther: "",
    ballOther: "",
    basicSkills: {
      run: "good",
      jump: "excellent", 
      throw: "good",
      climb: "good",
      balance: "excellent"
    }
  },
  specialty: {
    aquatic: {
      hasContact: true,
      startAge: 5,
      attitude: "positive",
      skills: ["水中憋气", "水中漂浮", "打水/蹬腿", "自由泳"],
      holdBreathSec: 15,
      floatSec: 10,
      skillsOther: "",
      learningStatus: "systematic",
      courseTimes: 20,
      learnDuration: "6个月"
    },
    ball: ["篮球基础", "运球"],
    track: ["短跑", "跳远"],
    tech: ["基础体操动作"]
  },
  physical: {
    health: {
      hasSpecialCondition: false,
      specialDesc: "",
      hasCheckup: true,
      findings: "各项指标正常",
      swimConcerns: [],
      myopia: undefined,
      healthOther: "",
      bodyType: "standard",
      bodyTypeOther: ""
    },
    strengths: ["速度", "协调性", "平衡感"]
  },
  observed: {
    highlights: ["速度型能力", "协调性", "水中适应能力"],
    highlightsOther: "",
    examples: "跑30米用时5.2秒，水中能自然漂浮10秒",
    ignored: "节奏感很好，可能适合韵律体操"
  },
  psychology: {
    traits: ["活泼好动，精力充沛", "有竞争意识，挑战性强", "坚持性好，不易放弃"],
    traitsOther: "",
    response: "积极面对，主动尝试",
    responseOther: "",
    teamwork: "两者都适应",
    notes: "对新运动项目学习很快"
  },
  goals: {
    purposes: ["增强体质/健康需求", "培养运动兴趣", "奠定专业基础"],
    purposeOther: "",
    expectation: "体教结合（运动与学业平衡）",
    expectationOther: "",
    trainingTime: ["每周3-4次", "寒暑假可增加训练量"],
    trainingTimeOther: "",
    support: {
      traffic: "方便",
      budget: "充足", 
      time: "充足",
      atmosphere: "浓厚"
    }
  }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EXAMPLE_INPUT
  };
} else if (typeof window !== 'undefined') {
  window.EXAMPLE_INPUT = EXAMPLE_INPUT;
}