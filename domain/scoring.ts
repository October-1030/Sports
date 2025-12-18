/**
 * FutureStars ID v6.0 评分引擎
 * 基于 PRD v6.0 设计，支持家庭实测场景
 */

// ============ 类型定义 ============

export interface SafetyCheck {
    heartCondition: boolean;  // 心脏问题（红线）
    asthma: boolean;          // 哮喘
    allergies: string[];      // 过敏史
    injuries: string[];       // 骨骼/关节损伤
    vision: 'normal' | 'glasses' | 'contacts';
}

export type BodyType = 'ecto' | 'meso' | 'endo';
export type AthleticLevel = 'pro' | 'school' | 'amateur' | 'none';
export type TraitLevel = 'top' | 'good' | 'normal';

export interface ParentProfile {
    height: number;
    bodyType: BodyType;
    athleticLevel: AthleticLevel;
}

export interface InheritedTraits {
    explosive: TraitLevel;    // 爆发力（短跑/弹跳）
    endurance: TraitLevel;    // 耐力
    coordination: TraitLevel; // 协调性
}

export interface ChildProfile {
    gender: 'male' | 'female';
    birthDate: string;        // YYYY-MM 格式
    height: number;           // cm
    weight: number;           // kg
    armSpan: number;          // 臂展 cm（必填）
    sittingHeight?: number;   // 坐高 cm（选填）
}

export interface HomeTests {
    standingJump: number;     // 立定跳远 cm（必测）
    balanceTime?: number;     // 闭眼单脚站 秒（二选一）
    tappingCount?: number;    // 20秒击打次数（二选一）
    flexibility: number;      // 坐位体前屈 cm（必测）
    sprintTime?: number;      // 30米冲刺 秒（选测）
    sprintSkipped: boolean;   // 是否跳过冲刺
}

export interface MindsetProfile {
    coachability: number;     // 受教性 1-5
    resilience: number;       // 抗压性 1-5
    competitiveness: number;  // 竞争欲 1-5
}

export interface AssessmentInput {
    safety: SafetyCheck;
    father: ParentProfile;
    mother: ParentProfile;
    traits: InheritedTraits;
    child: ChildProfile;
    tests: HomeTests;
    mindset: MindsetProfile;
    contact: string;
}

export type TierLevel = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface SportRecommendation {
    name: string;
    nameEn: string;
    matchScore: number;
    reason: string;
    icon: string;
}

export interface AssessmentResult {
    // 安全状态
    safetyPassed: boolean;
    safetyWarnings: string[];

    // 核心指标
    apeIndex: number;           // 臂展 - 身高
    predictedHeight: number;    // 预测成年身高
    predictedHeightRange: [number, number]; // 预测范围

    // 五维得分 (0-100)
    scores: {
        speed: number;          // 速度
        power: number;          // 爆发力
        coordination: number;   // 协调/灵敏
        genetic: number;        // 遗传潜力
        mindset: number;        // 心理韧性
    };

    // 综合评估
    overallScore: number;
    tierLevel: TierLevel;
    tierLabel: string;

    // 推荐项目
    recommendations: SportRecommendation[];

    // 元数据
    speedIsProjected: boolean;  // 速度是否为推算值
    timestamp: string;
}

// ============ 常量配置 ============

const CONFIG = {
    // 体型与运动能力关联
    bodyTypeTraits: {
        ecto: { agility: 10, endurance: 10, power: -5, strength: -5 },
        meso: { power: 15, speed: 15, agility: 5, strength: 10 },
        endo: { strength: 15, stability: 10, power: 5, agility: -5 }
    },

    // 竞技水平加分
    athleticLevelBonus: {
        pro: 20,
        school: 12,
        amateur: 6,
        none: 0
    },

    // 遗传特质加分
    traitBonus: {
        top: 15,
        good: 8,
        normal: 0
    },

    // 立定跳远评分标准 (cm -> 分数)
    jumpScoring: {
        male: [
            { min: 200, score: 100 },
            { min: 180, score: 90 },
            { min: 160, score: 80 },
            { min: 140, score: 70 },
            { min: 120, score: 60 },
            { min: 100, score: 50 },
            { min: 0, score: 40 }
        ],
        female: [
            { min: 180, score: 100 },
            { min: 160, score: 90 },
            { min: 140, score: 80 },
            { min: 120, score: 70 },
            { min: 100, score: 60 },
            { min: 80, score: 50 },
            { min: 0, score: 40 }
        ]
    },

    // 30米冲刺评分 (秒 -> 分数，越小越好)
    sprintScoring: {
        baseline: 4.5, // 基准时间（秒）
        multiplier: 20  // 每超过0.1秒扣多少分
    },

    // Tier 等级阈值
    tierThresholds: {
        tier1: 85,  // 精英潜力
        tier2: 70,  // 竞技储备
        tier3: 55,  // 兴趣培养
        tier4: 0    // 基础发展
    },

    // 身高预测参数
    heightPrediction: {
        maleMultiplier: 1.0,
        femaleMultiplier: 0.923,
        geneticWeight: 0.7,
        environmentWeight: 0.3
    }
};

// ============ 核心评分函数 ============

/**
 * 主评估函数
 */
export function evaluate(input: AssessmentInput): AssessmentResult {
    // 1. 安全检查
    const { passed: safetyPassed, warnings: safetyWarnings } = checkSafety(input.safety);

    // 2. 计算 Ape Index
    const apeIndex = calculateApeIndex(input.child);

    // 3. 预测成年身高
    const { predicted, range } = predictAdultHeight(input);

    // 4. 计算五维得分
    const scores = calculateDimensionScores(input);

    // 5. 计算综合得分
    const overallScore = calculateOverallScore(scores);

    // 6. 确定 Tier 等级
    const { level: tierLevel, label: tierLabel } = determineTier(overallScore);

    // 7. 生成运动推荐
    const recommendations = generateRecommendations(scores, apeIndex, input);

    return {
        safetyPassed,
        safetyWarnings,
        apeIndex,
        predictedHeight: predicted,
        predictedHeightRange: range,
        scores,
        overallScore,
        tierLevel,
        tierLabel,
        recommendations,
        speedIsProjected: input.tests.sprintSkipped,
        timestamp: new Date().toISOString()
    };
}

/**
 * 安全检查
 */
function checkSafety(safety: SafetyCheck): { passed: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // 心脏问题是绝对禁止
    if (safety.heartCondition) {
        return { passed: false, warnings: ['检测到心脏相关病史，请先咨询医生后再进行运动评估'] };
    }

    // 其他警告
    if (safety.asthma) {
        warnings.push('哮喘患者需注意运动环境，避免冷空气和过敏原');
    }

    if (safety.allergies && safety.allergies.length > 0) {
        warnings.push('存在过敏史，请在运动时注意环境因素');
    }

    if (safety.injuries && safety.injuries.length > 0) {
        warnings.push('有骨骼/关节损伤史，建议进行运动前热身');
    }

    return { passed: true, warnings };
}

/**
 * 计算 Ape Index（臂展优势指数）
 */
function calculateApeIndex(child: ChildProfile): number {
    return child.armSpan - child.height;
}

/**
 * 预测成年身高
 * 使用 FPH (Future Predicted Height) 公式
 */
function predictAdultHeight(input: AssessmentInput): { predicted: number; range: [number, number] } {
    const { father, mother, child } = input;

    // 基础遗传身高 (父母平均身高法)
    let geneticHeight: number;
    if (child.gender === 'male') {
        // 男孩：(父身高 + 母身高 × 1.08) / 2
        geneticHeight = (father.height + mother.height * 1.08) / 2;
    } else {
        // 女孩：(父身高 × 0.923 + 母身高) / 2
        geneticHeight = (father.height * 0.923 + mother.height) / 2;
    }

    // 体型调整
    let typeAdjustment = 0;
    if (father.bodyType === 'ecto' || mother.bodyType === 'ecto') {
        typeAdjustment += 2; // 外胚型倾向更高
    }
    if (father.bodyType === 'endo' || mother.bodyType === 'endo') {
        typeAdjustment -= 1;
    }

    // Ape Index 调整
    const apeIndex = calculateApeIndex(child);
    const apeAdjustment = apeIndex > 0 ? Math.min(apeIndex * 0.3, 3) : 0;

    const predicted = Math.round(geneticHeight + typeAdjustment + apeAdjustment);
    const range: [number, number] = [predicted - 4, predicted + 4];

    return { predicted, range };
}

/**
 * 计算五维得分
 */
function calculateDimensionScores(input: AssessmentInput): AssessmentResult['scores'] {
    const { father, mother, traits, child, tests, mindset } = input;

    // 1. 速度得分
    let speedScore: number;
    if (!tests.sprintSkipped && tests.sprintTime) {
        // 有实测数据
        speedScore = calculateSprintScore(tests.sprintTime);
    } else {
        // 用跳远 + 遗传推算
        const jumpScore = calculateJumpScore(tests.standingJump, child.gender);
        const geneticBoost = getBodyTypeSpeedBonus(father.bodyType, mother.bodyType);
        const traitBoost = CONFIG.traitBonus[traits.explosive] || 0;
        speedScore = jumpScore * 0.6 + geneticBoost + traitBoost;
    }

    // 2. 爆发力得分
    const powerScore = calculatePowerScore(tests.standingJump, child.gender, traits.explosive);

    // 3. 协调/灵敏得分
    const coordinationScore = calculateCoordinationScore(tests, traits.coordination);

    // 4. 遗传潜力得分
    const geneticScore = calculateGeneticScore(father, mother, traits);

    // 5. 心理韧性得分
    const mindsetScore = calculateMindsetScore(mindset);

    return {
        speed: clamp(Math.round(speedScore), 0, 100),
        power: clamp(Math.round(powerScore), 0, 100),
        coordination: clamp(Math.round(coordinationScore), 0, 100),
        genetic: clamp(Math.round(geneticScore), 0, 100),
        mindset: clamp(Math.round(mindsetScore), 0, 100)
    };
}

/**
 * 30米冲刺评分
 */
function calculateSprintScore(time: number): number {
    const { baseline, multiplier } = CONFIG.sprintScoring;
    // 时间越短越好，基准4.5秒 = 80分
    const diff = time - baseline;
    return Math.max(40, 80 - diff * multiplier);
}

/**
 * 立定跳远评分
 */
function calculateJumpScore(distance: number, gender: 'male' | 'female'): number {
    const ranges = CONFIG.jumpScoring[gender];
    for (const range of ranges) {
        if (distance >= range.min) {
            return range.score;
        }
    }
    return 40;
}

/**
 * 体型对速度的加成
 */
function getBodyTypeSpeedBonus(fatherType: BodyType, motherType: BodyType): number {
    let bonus = 0;
    if (fatherType === 'meso') bonus += 10;
    if (motherType === 'meso') bonus += 10;
    if (fatherType === 'ecto') bonus += 5;
    if (motherType === 'ecto') bonus += 5;
    return bonus;
}

/**
 * 爆发力得分
 */
function calculatePowerScore(jump: number, gender: 'male' | 'female', explosive: TraitLevel): number {
    const baseScore = calculateJumpScore(jump, gender);
    const traitBonus = CONFIG.traitBonus[explosive] || 0;
    return baseScore + traitBonus;
}

/**
 * 协调性得分
 */
function calculateCoordinationScore(tests: HomeTests, coordination: TraitLevel): number {
    let baseScore = 60;

    // 闭眼单脚站
    if (tests.balanceTime) {
        if (tests.balanceTime >= 30) baseScore = 90;
        else if (tests.balanceTime >= 20) baseScore = 80;
        else if (tests.balanceTime >= 10) baseScore = 70;
        else baseScore = 60;
    }

    // 快速击打
    if (tests.tappingCount) {
        if (tests.tappingCount >= 60) baseScore = Math.max(baseScore, 90);
        else if (tests.tappingCount >= 50) baseScore = Math.max(baseScore, 80);
        else if (tests.tappingCount >= 40) baseScore = Math.max(baseScore, 70);
    }

    // 柔韧性加分
    if (tests.flexibility > 10) baseScore += 5;
    else if (tests.flexibility < -5) baseScore -= 5;

    // 遗传特质加分
    const traitBonus = CONFIG.traitBonus[coordination] || 0;

    return baseScore + traitBonus;
}

/**
 * 遗传潜力得分
 */
function calculateGeneticScore(father: ParentProfile, mother: ParentProfile, traits: InheritedTraits): number {
    let score = 50;

    // 父母竞技水平
    score += CONFIG.athleticLevelBonus[father.athleticLevel] / 2;
    score += CONFIG.athleticLevelBonus[mother.athleticLevel] / 2;

    // 体型优势
    if (father.bodyType === 'meso') score += 8;
    if (mother.bodyType === 'meso') score += 8;

    // 遗传特质
    score += CONFIG.traitBonus[traits.explosive] / 2;
    score += CONFIG.traitBonus[traits.endurance] / 2;
    score += CONFIG.traitBonus[traits.coordination] / 2;

    return score;
}

/**
 * 心理韧性得分
 */
function calculateMindsetScore(mindset: MindsetProfile): number {
    const { coachability, resilience, competitiveness } = mindset;
    // 各项权重：受教性 30%，抗压性 40%，竞争欲 30%
    const weighted = coachability * 0.3 + resilience * 0.4 + competitiveness * 0.3;
    // 1-5 分映射到 40-100 分
    return 40 + weighted * 12;
}

/**
 * 计算综合得分
 */
function calculateOverallScore(scores: AssessmentResult['scores']): number {
    // 加权平均：速度 25%，爆发力 25%，协调 15%，遗传 20%，心理 15%
    const weighted =
        scores.speed * 0.25 +
        scores.power * 0.25 +
        scores.coordination * 0.15 +
        scores.genetic * 0.20 +
        scores.mindset * 0.15;

    return Math.round(weighted);
}

/**
 * 确定 Tier 等级
 */
function determineTier(score: number): { level: TierLevel; label: string } {
    const { tier1, tier2, tier3 } = CONFIG.tierThresholds;

    if (score >= tier1) return { level: 'tier1', label: 'Tier 1 精英潜力' };
    if (score >= tier2) return { level: 'tier2', label: 'Tier 2 竞技储备' };
    if (score >= tier3) return { level: 'tier3', label: 'Tier 3 兴趣培养' };
    return { level: 'tier4', label: 'Tier 4 基础发展' };
}

/**
 * 生成运动推荐
 */
function generateRecommendations(
    scores: AssessmentResult['scores'],
    apeIndex: number,
    input: AssessmentInput
): SportRecommendation[] {
    const candidates: SportRecommendation[] = [];

    // 臂展优势项目
    if (apeIndex > 3) {
        candidates.push({
            name: '游泳',
            nameEn: 'Swimming',
            matchScore: 90 + Math.min(apeIndex, 10),
            reason: '臂展优势明显，非常适合游泳项目',
            icon: '🏊'
        });
        candidates.push({
            name: '篮球',
            nameEn: 'Basketball',
            matchScore: 85 + Math.min(apeIndex, 8),
            reason: '臂展优势有助于篮球防守和投篮',
            icon: '🏀'
        });
    }

    // 速度型项目
    if (scores.speed >= 80) {
        candidates.push({
            name: '短跑',
            nameEn: 'Sprint',
            matchScore: scores.speed,
            reason: '速度优势突出，适合短跑项目',
            icon: '🏃'
        });
        candidates.push({
            name: '足球',
            nameEn: 'Soccer',
            matchScore: scores.speed * 0.9,
            reason: '速度和爆发力适合足球边锋位置',
            icon: '⚽'
        });
    }

    // 爆发力型项目
    if (scores.power >= 80) {
        candidates.push({
            name: '跳远/跳高',
            nameEn: 'Track & Field Jumps',
            matchScore: scores.power,
            reason: '爆发力出色，适合田径跳跃项目',
            icon: '🦘'
        });
    }

    // 协调性项目
    if (scores.coordination >= 80) {
        candidates.push({
            name: '体操',
            nameEn: 'Gymnastics',
            matchScore: scores.coordination,
            reason: '协调性和柔韧性好，适合体操',
            icon: '🤸'
        });
        candidates.push({
            name: '网球/羽毛球',
            nameEn: 'Racket Sports',
            matchScore: scores.coordination * 0.95,
            reason: '协调性好，适合球拍类运动',
            icon: '🎾'
        });
    }

    // 综合型项目（总是推荐）
    candidates.push({
        name: '综合体能训练',
        nameEn: 'General Fitness',
        matchScore: 70,
        reason: '全面发展身体素质，为专项运动打基础',
        icon: '💪'
    });

    // 排序并返回前3个
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return candidates.slice(0, 3);
}

/**
 * 工具函数：限制数值范围
 */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// ============ 导出工具函数 ============

/**
 * 格式化结果为可读文本
 */
export function formatResult(result: AssessmentResult): string {
    const recommendations = result.recommendations
        .map((r, i) => `${i + 1}. ${r.icon} ${r.name} (匹配度: ${Math.round(r.matchScore)}%)`)
        .join('\n');

    return `
FutureStars ID 评估报告
======================

安全状态: ${result.safetyPassed ? '✅ 通过' : '⛔ 未通过'}
${result.safetyWarnings.length > 0 ? '注意事项: ' + result.safetyWarnings.join('; ') : ''}

核心指标:
- Ape Index: ${result.apeIndex > 0 ? '+' : ''}${result.apeIndex.toFixed(1)} cm
- 预测成年身高: ${result.predictedHeight} cm (${result.predictedHeightRange[0]}-${result.predictedHeightRange[1]} cm)

五维评分:
- 速度: ${result.scores.speed}${result.speedIsProjected ? ' (推算)' : ''}
- 爆发力: ${result.scores.power}
- 协调性: ${result.scores.coordination}
- 遗传潜力: ${result.scores.genetic}
- 心理韧性: ${result.scores.mindset}

综合评估: ${result.overallScore} 分
发展等级: ${result.tierLabel}

推荐项目:
${recommendations}

评估时间: ${new Date(result.timestamp).toLocaleString('zh-CN')}
    `.trim();
}

/**
 * 计算年龄
 */
export function calculateAge(birthDate: string): number {
    const [year, month] = birthDate.split('-').map(Number);
    const now = new Date();
    let age = now.getFullYear() - year;
    if (now.getMonth() + 1 < month) {
        age--;
    }
    return age;
}
