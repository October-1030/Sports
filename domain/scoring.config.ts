/**
 * 运动天赋评估评分配置文件 - TypeScript版本
 * 包含所有权重、阈值、打分表、映射表等可配置参数
 */

import {
    ActivityFrequency,
    SkillLevel,
    ParentSportExp,
    WaterAttitude,
    BodyType,
    PathwayLevel,
    SportType
} from './types';

// === 评分权重配置 ===

export const DEFAULT_WEIGHTS = {
    genetic: 0.25,      // 遗传占25% - 基础潜力重要但非决定性
    current: 0.20,      // 当前能力20% - 现有基础
    specialty: 0.25,    // 专项技能25% - 专业方向评估核心
    physical: 0.15,     // 身体优势15% - 体质基础
    psychology: 0.15    // 心理特征15% - 运动心理素质
};

// === 各维度最高分限制 ===

export const SCORE_LIMITS = {
    genetic: {
        heightGenes: 40,       // 身高基因最多40分
        parentSports: 60,      // 父母运动基因最多60分
        maxTotal: 100         // 遗传总分100分
    },
    current: {
        basicSkills: 50,       // 基础技能最多50分 
        frequency: 25,         // 运动频率最多25分
        interests: 25,         // 兴趣广度最多25分
        maxTotal: 100         // 当前能力总分100分
    },
    specialty: {
        aquatic: 100,         // 单项专项最多100分
        ball: 100,
        track: 100,
        tech: 100,
        maxTotal: 100         // 取各专项最高分，不累加
    },
    physical: {
        bodyType: 30,         // 体型最多30分
        strengths: 50,        // 当前优势最多50分
        health: 20,           // 健康状况最多20分（实际是扣分项）
        maxTotal: 100         // 身体优势总分100分
    },
    psychology: {
        traits: 60,           // 性格特点最多60分
        resilience: 25,       // 抗挫折最多25分
        teamwork: 15,         // 团队合作最多15分
        maxTotal: 100         // 心理特征总分100分
    }
};

// === 身高基因评分表 ===

export const HEIGHT_SCORING = {
    // 父亲身高评分区间 (基于中国男性身高分布)
    fatherRanges: [
        { min: 0, max: 165, score: 5 },      // 较矮
        { min: 166, max: 170, score: 10 },    // 偏矮  
        { min: 171, max: 175, score: 15 },    // 中等
        { min: 176, max: 180, score: 25 },    // 偏高
        { min: 181, max: 185, score: 35 },    // 高
        { min: 186, max: 999, score: 40 }     // 很高
    ],
    // 母亲身高评分区间 (基于中国女性身高分布)  
    motherRanges: [
        { min: 0, max: 155, score: 5 },      // 较矮
        { min: 156, max: 160, score: 10 },    // 偏矮
        { min: 161, max: 165, score: 15 },    // 中等  
        { min: 166, max: 170, score: 25 },    // 偏高
        { min: 171, max: 175, score: 35 },    // 高
        { min: 176, max: 999, score: 40 }     // 很高
    ],
    grandparentBonus: 0.1  // 祖辈每超出标准1cm，额外加0.1分
};

// === 运动频率评分表 ===

export const FREQUENCY_SCORES: Record<ActivityFrequency, number> = {
    'rarely': 2,        // 几乎不运动 - 2分
    '1-2_times': 8,     // 1-2次/周 - 8分  
    '3-4_times': 18,    // 3-4次/周 - 18分
    '5plus_times': 25   // 5次以上/周 - 25分 (满分)
};

// === 技能水平评分表 ===

export const SKILL_LEVEL_SCORES: Record<SkillLevel, number> = {
    'excellent': 10,    // 优秀 - 10分
    'good': 7,         // 良好 - 7分
    'average': 4,      // 一般 - 4分  
    'weak': 1          // 较弱 - 1分
};

// === 父母运动经历评分表 ===

export const PARENT_SPORT_EXP_SCORES: Record<ParentSportExp, number> = {
    'professional': 20, // 专业运动员 - 20分
    'amateur': 12,     // 业余爱好者 - 12分
    'rarely': 3        // 较少运动 - 3分
};

// === 水上运动态度评分表 ===

export const WATER_ATTITUDE_SCORES: Record<WaterAttitude, number> = {
    'very_positive': 25,    // 非常喜欢 - 25分
    'positive': 18,         // 比较喜欢 - 18分  
    'neutral': 10,          // 一般 - 10分
    'slightly_afraid': 5,   // 有点害怕 - 5分
    'very_afraid': 0        // 非常害怕 - 0分
};

// === 体型评分表 ===

export const BODY_TYPE_SCORES: Record<BodyType, number> = {
    'thin': 15,        // 偏瘦 - 15分 (适合耐力项目)
    'standard': 25,    // 标准 - 25分 (最佳)
    'sturdy': 20,      // 偏壮 - 20分 (适合力量项目) 
    'other': 10        // 其他 - 10分 (需具体分析)
};

// === 专项技能评分配置 ===

export const SPECIALTY_SCORING = {
    aquatic: {
        hasContactBonus: 20,              // 接触过游泳基础20分
        attitudeWeight: 0.3,              // 态度占30%权重
        skillsWeight: 0.5,                // 技能占50%权重
        ageFactorBonus: 2,               // 每早1岁接触额外加2分
        learningStatusBonus: {           // 学习状态加分
            'not_learned': 0,
            'parent_taught': 5,
            'took_courses': 15,
            'systematic': 25
        } as Record<string, number>
    },
    ball: {
        interestBonus: 15,               // 对球类有兴趣加15分
        skillCount: 8                    // 每掌握一项球类技能8分
    },
    track: {
        basicSkillWeight: 2.5,           // 基础技能倍数 (跑跳投平均分*2.5)
        interestBonus: 12               // 对田径有兴趣加12分
    },
    tech: {
        coordinationBonus: 15,          // 协调性好加15分
        flexibilityBonus: 12,           // 柔韧性好加12分  
        balanceBonus: 18               // 平衡感好加18分
    }
};

// === 性格特点加分表 ===

export const PERSONALITY_TRAIT_SCORES: Record<string, number> = {
    // 积极特点加分
    '活泼好动，精力充沛': 12,
    '安静内敛，但运动专注': 10,
    '有竞争意识，挑战性强': 15,
    '坚持性好，不易放弃': 18,        // 最重要的运动品质
    '适应性强，学习新动作快': 15,
    '注意力集中，执行指令好': 12,

    // 身体素质相关
    '爆发力好': 8,
    '耐力出众': 8,
    '协调性强': 10,
    '平衡感好': 8,
    '反应速度快': 9,
    '柔韧性好': 7,
    '肌肉力量强': 8,
    '身体恢复快': 6,
    '学习动作快': 10
};

// === 抗挫折能力评分表 ===

export const RESILIENCE_SCORES: Record<string, number> = {
    '积极面对，主动尝试': 25,           // 最佳心理素质
    '需要鼓励后继续尝试': 15,           // 良好心理素质
    '容易放弃，需要较多引导': 5         // 需要培养心理素质
};

// === 团队合作评分表 === 

export const TEAMWORK_SCORES: Record<string, number> = {
    '喜欢团队活动': 15,               // 团队项目优势
    '更喜欢个人项目': 10,             // 个人项目优势
    '两者都适应': 15                 // 全面适应最佳
};

// === 路径等级阈值 ===

export const DEFAULT_THRESHOLDS: Record<PathwayLevel, { min: number, max: number }> = {
    hobby: { min: 0, max: 40 },          // 0-40分：业余爱好
    recreational: { min: 41, max: 60 },   // 41-60分：兴趣培养  
    competitive: { min: 61, max: 80 },    // 61-80分：竞技储备
    elite: { min: 81, max: 100 }         // 81-100分：专业发展
};

// === 项目推荐配置 ===

export const SPORT_RECOMMENDATIONS: Record<SportType, { minScore: number, requiredTraits: string[], preferredTraits: string[], description: string }> = {
    // 水上项目推荐
    'aquatic': {
        minScore: 50,
        requiredTraits: ['水中适应能力'],
        preferredTraits: ['耐力', '协调性', '柔韧性好'],
        description: '具备良好的水感和水上运动基础，适合游泳等水上项目发展'
    },

    // 球类运动推荐  
    'ball_sports': {
        minScore: 45,
        requiredTraits: ['协调性', '反应速度快'],
        preferredTraits: ['有竞争意识，挑战性强', '团队合作'],
        description: '手眼协调好，反应敏捷，适合球类运动培养'
    },

    // 田径项目推荐
    'track_field': {
        minScore: 40,
        requiredTraits: ['速度型能力'],
        preferredTraits: ['爆发力好', '坚持性好，不易放弃'],
        description: '基础运动能力强，速度或耐力突出，适合田径项目'
    },

    // 技巧项目推荐
    'technical': {
        minScore: 45,
        requiredTraits: ['协调性', '平衡能力'],
        preferredTraits: ['柔韧性好', '学习动作快', '节奏感'],
        description: '身体控制能力强，协调性和美感俱佳，适合体操舞蹈等技巧项目'
    }
};

// === 建议文案模板 ===

export const ADVICE_TEMPLATES: Record<string, Record<string, string[]>> = {
    genetic: {
        high: [
            '遗传基础优秀，身高潜力和运动基因都很不错，建议重点培养',
            '家族运动基因良好，孩子具备较好的先天运动潜质'
        ],
        medium: [
            '遗传基础中等，通过后天训练可以有很好的提升',
            '先天条件一般，但不妨碍通过科学训练取得好成绩'
        ],
        low: [
            '遗传基础相对较弱，建议注重兴趣培养和全面发展',
            '先天条件普通，更适合以健身和兴趣为导向的运动参与'
        ]
    },
    current: {
        high: [
            '当前运动基础扎实，基础技能发展均衡，继续保持',
            '运动参与积极，基础能力发展良好，可适当增加专项训练'
        ],
        medium: [
            '当前基础中等，建议增加运动频率，加强基础技能训练',
            '运动基础有一定积累，需要更系统的训练提升'
        ],
        low: [
            '运动基础较弱，建议从培养运动兴趣和基础动作开始',
            '需要大幅增加运动参与，先打好基础运动能力'
        ]
    },
    specialty: {
        high: [
            '专项技能突出，已具备较好的专业基础，可考虑专业化发展',
            '在某些专项上表现优异，建议深入发展该优势领域'
        ],
        medium: [
            '专项能力中等，可尝试多个项目，寻找最适合的专业方向',
            '具备一定专项基础，需要更多专业指导来提升技能'
        ],
        low: [
            '专项技能待开发，建议多尝试不同运动项目',
            '专项能力较弱，适合广泛接触各类运动，培养兴趣'
        ]
    },
    physical: {
        high: [
            '身体条件优秀，体型和身体素质都很适合运动发展',
            '身体优势明显，健康状况良好，具备专业发展的身体基础'
        ],
        medium: [
            '身体条件中等，通过训练可以有较好的身体素质提升',
            '身体基础一般，需要针对性的体能训练来改善'
        ],
        low: [
            '身体条件一般，建议注重健康管理和基础体能培养',
            '需要关注身体健康问题，以安全的运动参与为主'
        ]
    },
    psychology: {
        high: [
            '运动心理素质优秀，具备良好的运动性格和抗挫折能力',
            '心理特质很适合运动训练，能够承受训练压力并持续进步'
        ],
        medium: [
            '运动心理素质中等，需要适当的心理建设和鼓励',
            '心理特征基本适合运动，但需要培养更强的心理韧性'
        ],
        low: [
            '运动心理素质相对较弱，需要更多的心理支持和鼓励',
            '建议先培养运动兴趣和信心，逐步建立运动心理基础'
        ]
    },
    pathway: {
        hobby: [
            '适合以健身和娱乐为目的的业余运动参与',
            '建议保持运动习惯，享受运动带来的快乐和健康',
            '可参加社区或学校的业余运动活动'
        ],
        recreational: [
            '具备一定运动潜力，适合兴趣导向的运动培养',
            '建议参加正规的运动培训课程，培养一到两个运动专长',
            '可考虑参加青少年运动俱乐部或兴趣小组'
        ],
        competitive: [
            '运动潜力较好，具备竞技运动的发展基础',
            '建议接受专业教练指导，参与竞技性训练',
            '可考虑参加地区性比赛，积累比赛经验'
        ],
        elite: [
            '运动天赋突出，具备专业运动发展的潜力',
            '强烈建议接受专业体校或专业队的系统培养',
            '可考虑体教结合的发展路径，或专业运动员培养'
        ]
    }
};

// === 综合配置对象 ===

export const DEFAULT_SCORING_CONFIG = {
    weights: DEFAULT_WEIGHTS,
    limits: SCORE_LIMITS,
    heightScoring: HEIGHT_SCORING,
    frequencyScores: FREQUENCY_SCORES,
    skillLevelScores: SKILL_LEVEL_SCORES,
    parentSportExpScores: PARENT_SPORT_EXP_SCORES,
    waterAttitudeScores: WATER_ATTITUDE_SCORES,
    bodyTypeScores: BODY_TYPE_SCORES,
    specialtyScoring: SPECIALTY_SCORING,
    personalityTraitScores: PERSONALITY_TRAIT_SCORES,
    resilienceScores: RESILIENCE_SCORES,
    teamworkScores: TEAMWORK_SCORES,
    pathwayThresholds: DEFAULT_THRESHOLDS,
    sportRecommendations: SPORT_RECOMMENDATIONS,
    adviceTemplates: ADVICE_TEMPLATES
};
