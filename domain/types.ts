/**
 * 儿童运动天赋评估统一数据模型 - TypeScript版本
 */

// === 基础枚举类型 ===

export type Gender = 'male' | 'female';

/**
 * 幼儿园小班 | 幼儿园中班 | 幼儿园大班 | 小学一年级 | 小学二年级 | 其他
 */
export type GradeLevel = 'kindergarten_small' | 'kindergarten_medium' | 'kindergarten_large' | 'primary_1' | 'primary_2' | 'other';

/**
 * 几乎不运动 | 1-2次/周 | 3-4次/周 | 5次以上/周
 */
export type ActivityFrequency = 'rarely' | '1-2_times' | '3-4_times' | '5plus_times';

/**
 * 优秀 | 良好 | 一般 | 较弱
 */
export type SkillLevel = 'excellent' | 'good' | 'average' | 'weak';

/**
 * 专业运动员 | 业余爱好者 | 较少运动
 */
export type ParentSportExp = 'professional' | 'amateur' | 'rarely';

/**
 * 非常喜欢，主动要求下水 | 比较喜欢，不排斥下水 | 一般，无明显喜好 | 有点害怕，需要鼓励才能下水 | 非常害怕，拒绝接触水
 */
export type WaterAttitude = 'very_positive' | 'positive' | 'neutral' | 'slightly_afraid' | 'very_afraid';

/**
 * 未学习 | 家长教导 | 参加过课程 | 系统学习
 */
export type SwimLearningStatus = 'not_learned' | 'parent_taught' | 'took_courses' | 'systematic';

/**
 * 偏瘦 | 标准 | 偏壮 | 其他
 */
export type BodyType = 'thin' | 'standard' | 'sturdy' | 'other';

/**
 * 业余爱好级别(0-40分) | 兴趣培养级别(41-60分) | 竞技储备级别(61-80分) | 专业发展级别(81-100分)
 */
export type PathwayLevel = 'hobby' | 'recreational' | 'competitive' | 'elite';

/**
 * 水上项目 | 球类运动 | 田径项目 | 技巧项目(体操/舞蹈等)
 */
export type SportType = 'aquatic' | 'ball_sports' | 'track_field' | 'technical';

// === 核心数据结构 ===

/**
 * 儿童基本信息
 */
export interface ChildProfile {
    name: string;
    gender: Gender;
    age: number; // 支持小数，如6.5岁
    height?: number; // cm
    weight?: number; // kg
    grade: GradeLevel;
    gradeOther?: string;
}

/**
 * 家族身高数据
 */
export interface FamilyHeights {
    father?: number;
    mother?: number;
    grandpa?: number;
    grandma?: number;
    wgrandpa?: number;
    wgrandma?: number;
}

/**
 * 父母运动特质
 */
export interface ParentTraits {
    height?: number;
    sportExp?: ParentSportExp;
    sport?: string;
    job?: string;
    traits: string[];
    traitsOther?: string;
    hiddenSport?: string;
    examples?: string;
}

/**
 * 父母运动基因
 */
export interface ParentGenes {
    father: ParentTraits;
    mother: ParentTraits;
}

/**
 * 基础运动技能
 */
export interface BasicSkills {
    run: SkillLevel;
    jump: SkillLevel;
    throw: SkillLevel;
    climb: SkillLevel;
    balance: SkillLevel;
}

/**
 * 当前运动技能
 */
export interface CurrentSkills {
    hasTraining: boolean;
    trainingDesc?: string;
    frequency: ActivityFrequency;
    interests: string[];
    interestsOther?: string;
    ballOther?: string;
    basicSkills: BasicSkills;
}

/**
 * 游泳技能
 */
export interface SwimSkills {
    hasContact: boolean;
    startAge?: number;
    attitude?: WaterAttitude;
    skills: string[];
    holdBreathSec?: number;
    floatSec?: number;
    skillsOther?: string;
    learningStatus?: SwimLearningStatus;
    courseTimes?: number;
    learnDuration?: string;
}

/**
 * 专项技能
 */
export interface SpecialtySkills {
    aquatic: SwimSkills;
    ball: string[];
    track: string[];
    tech: string[];
}

/**
 * 健康信息
 */
export interface HealthInfo {
    hasSpecialCondition: boolean;
    specialDesc?: string;
    hasCheckup: boolean;
    findings?: string;
    swimConcerns: string[];
    myopia?: number;
    healthOther?: string;
    bodyType: BodyType;
    bodyTypeOther?: string;
}

/**
 * 身体优势
 */
export interface PhysicalAdvantages {
    health: HealthInfo;
    strengths: string[];
}

/**
 * 观察到的天赋
 */
export interface ObservedTalents {
    highlights: string[];
    highlightsOther?: string;
    examples?: string;
    ignored?: string;
}

/**
 * 运动心理特征
 */
export interface SportsPersonality {
    traits: string[];
    traitsOther?: string;
    response: string;
    responseOther?: string;
    teamwork: string;
    notes?: string;
}

/**
 * 家庭支持条件
 */
export interface SupportConditions {
    traffic: string;
    budget: string;
    time: string;
    atmosphere: string;
}

/**
 * 发展目标
 */
export interface DevelopmentGoal {
    purposes: string[];
    purposeOther?: string;
    expectation: string;
    expectationOther?: string;
    trainingTime: string[];
    trainingTimeOther?: string;
    support: SupportConditions;
}

/**
 * 填写人信息
 */
export interface FillerInfo {
    name: string;
    relation: string;
    phone: string;
    date: string;
}

// === 评估输入与输出 ===

/**
 * 评估输入数据
 */
export interface AssessmentInput {
    child: ChildProfile;
    family: FamilyHeights;
    parents: ParentGenes;
    development: CurrentSkills;
    specialty: SpecialtySkills;
    physical: PhysicalAdvantages;
    observed: ObservedTalents;
    psychology: SportsPersonality;
    goals: DevelopmentGoal;
    filler?: FillerInfo;
}

/**
 * 评估得分
 */
export interface AssessmentScores {
    genetic: number;
    current: number;
    specialty: number;
    physical: number;
    psychology: number;
}

/**
 * 详细得分分解
 */
export interface ScoreDetails {
    genetic: {
        heightGenes: number;
        parentSports: number;
    };
    current: {
        basicSkills: number;
        frequency: number;
        interests: number;
    };
    specialty: {
        aquatic: number;
        ball: number;
        track: number;
        tech: number;
    };
    physical: {
        bodyType: number;
        strengths: number;
        health: number;
    };
    psychology: {
        traits: number;
        resilience: number;
        teamwork: number;
    };
}

/**
 * 评估结果
 */
export interface AssessmentResult {
    scores: AssessmentScores;
    overall: number;
    pathway: PathwayLevel;
    recommendations: string[];
    suitableSports: SportType[];
    details: ScoreDetails;
    timestamp: string;
}

// === 开发/测试用例数据 ===

/**
 * 示例输入数据，用于开发和单元测试
 */
export const EXAMPLE_INPUT: AssessmentInput = {
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
