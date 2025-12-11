/**
 * 运动天赋评估评分引擎 - TypeScript版本
 * 纯函数实现，输入 AssessmentInput，输出 AssessmentResult
 */

import {
    AssessmentInput,
    AssessmentResult,
    DimensionScores,
    DetailedScores,
    PathwayLevel,
    SportType,
    FamilyInfo,
    ParentInfo,
    BasicSkills,
    SpecialtyInfo,
    PhysicalInfo,
    PsychologyInfo,
    ScoringConfig
} from './types';

import { DEFAULT_SCORING_CONFIG } from './scoring.config';

// === 主评估函数 ===

/**
 * 运动天赋评估核心函数
 * @param input - 评估输入数据
 * @param config - 评分配置（可选，使用默认配置）
 * @returns 评估结果
 */
export function evaluate(input: AssessmentInput, config: Partial<ScoringConfig> = {}): AssessmentResult {
    // 合并配置
    const cfg = { ...DEFAULT_SCORING_CONFIG, ...config } as ScoringConfig;

    // 计算各维度详细得分
    const details = calculateDetails(input, cfg);

    // 计算各维度总分（应用上限控制）
    const scores = calculateDimensionScores(details, cfg);

    // 计算综合得分
    const overall = calculateOverallScore(scores, cfg);

    // 判定路径等级
    const pathway = determinePathway(overall, cfg);

    // 生成项目推荐
    const suitableSports = recommendSports(input, scores, details, cfg);

    // 生成建议列表
    const recommendations = generateRecommendations(scores, pathway, input, cfg);

    return {
        scores,
        overall,
        pathway,
        recommendations,
        suitableSports,
        details,
        timestamp: new Date().toISOString()
    };
}

// === 详细得分计算 ===

export function calculateDetails(input: AssessmentInput, cfg: ScoringConfig): DetailedScores {
    return {
        genetic: calculateGeneticDetails(input, cfg),
        current: calculateCurrentDetails(input, cfg),
        specialty: calculateSpecialtyDetails(input, cfg),
        physical: calculatePhysicalDetails(input, cfg),
        psychology: calculatePsychologyDetails(input, cfg)
    };
}

// 遗传潜力详细得分
function calculateGeneticDetails(input: AssessmentInput, cfg: ScoringConfig) {
    const heightGenes = calculateHeightGenesScore(input.family, cfg);
    const parentSports = calculateParentSportsScore(input.parents, cfg);

    return {
        heightGenes: Math.min(heightGenes, cfg.limits.genetic.heightGenes),
        parentSports: Math.min(parentSports, cfg.limits.genetic.parentSports)
    };
}

// 当前能力详细得分  
function calculateCurrentDetails(input: AssessmentInput, cfg: ScoringConfig) {
    const basicSkills = calculateBasicSkillsScore(input.development.basicSkills, cfg);
    const frequency = cfg.frequencyScores[input.development.frequency] || 0;
    const interests = calculateInterestsScore(input.development.interests, cfg);

    return {
        basicSkills: Math.min(basicSkills, cfg.limits.current.basicSkills),
        frequency: Math.min(frequency, cfg.limits.current.frequency),
        interests: Math.min(interests, cfg.limits.current.interests)
    };
}

// 专项技能详细得分
function calculateSpecialtyDetails(input: AssessmentInput, cfg: ScoringConfig) {
    const aquatic = calculateAquaticScore(input.specialty.aquatic, input.development.interests, cfg);
    const ball = calculateBallScore(input.specialty.ball, input.development.interests, cfg);
    const track = calculateTrackScore(input.specialty.track, input.development.basicSkills, input.development.interests, cfg);
    const tech = calculateTechScore(input.specialty.tech, input.observed.highlights, input.parents, cfg);

    return {
        aquatic: Math.min(aquatic, cfg.limits.specialty.aquatic),
        ball: Math.min(ball, cfg.limits.specialty.ball),
        track: Math.min(track, cfg.limits.specialty.track),
        tech: Math.min(tech, cfg.limits.specialty.tech)
    };
}

// 身体优势详细得分
function calculatePhysicalDetails(input: AssessmentInput, cfg: ScoringConfig) {
    const bodyType = cfg.bodyTypeScores[input.physical.health.bodyType] || 0;
    const strengths = calculateStrengthsScore(input.physical.strengths, cfg);
    const health = calculateHealthScore(input.physical.health, cfg);

    return {
        bodyType: Math.min(bodyType, cfg.limits.physical.bodyType),
        strengths: Math.min(strengths, cfg.limits.physical.strengths),
        health: Math.max(health, -cfg.limits.physical.health) // 健康是扣分项，限制扣分上限
    };
}

// 心理特征详细得分
function calculatePsychologyDetails(input: AssessmentInput, cfg: ScoringConfig) {
    const traits = calculateTraitsScore(input.psychology.traits, cfg);
    const resilience = cfg.resilienceScores[input.psychology.response] || 0;
    const teamwork = cfg.teamworkScores[input.psychology.teamwork] || 0;

    return {
        traits: Math.min(traits, cfg.limits.psychology.traits),
        resilience: Math.min(resilience, cfg.limits.psychology.resilience),
        teamwork: Math.min(teamwork, cfg.limits.psychology.teamwork)
    };
}

// === 具体评分计算函数 ===

// 身高基因得分
function calculateHeightGenesScore(family: FamilyInfo, cfg: ScoringConfig): number {
    let score = 0;

    // 父亲身高评分
    if (family.father) {
        const fatherRange = cfg.heightScoring.fatherRanges.find(
            r => family.father >= r.min && family.father <= r.max
        );
        score += fatherRange ? fatherRange.score : 0;
    }

    // 母亲身高评分  
    if (family.mother) {
        const motherRange = cfg.heightScoring.motherRanges.find(
            r => family.mother >= r.min && family.mother <= r.max
        );
        score += motherRange ? motherRange.score : 0;
    }

    // 祖辈身高加分 - 假设前提：男性170+、女性160+算超标
    const grandparentHeights = [
        { height: family.grandpa, standard: 170 },
        { height: family.wgrandpa, standard: 170 },
        { height: family.grandma, standard: 160 },
        { height: family.wgrandma, standard: 160 }
    ];

    grandparentHeights.forEach(({ height, standard }) => {
        if (height && height > standard) {
            score += (height - standard) * cfg.heightScoring.grandparentBonus;
        }
    });

    return score;
}

// 父母运动基因得分
function calculateParentSportsScore(parents: ParentInfo, cfg: ScoringConfig): number {
    let score = 0;

    // 父亲运动经历得分
    if (parents.father.sportExp) {
        score += cfg.parentSportExpScores[parents.father.sportExp] || 0;
    }

    // 母亲运动经历得分
    if (parents.mother.sportExp) {
        score += cfg.parentSportExpScores[parents.mother.sportExp] || 0;
    }

    // 父母运动特质得分
    const fatherTraits = parents.father.traits || [];
    const motherTraits = parents.mother.traits || [];
    const allTraits = [...fatherTraits, ...motherTraits];

    allTraits.forEach(trait => {
        score += cfg.personalityTraitScores[trait] || 0;
    });

    return score;
}

// 基础技能得分
function calculateBasicSkillsScore(basicSkills: BasicSkills, cfg: ScoringConfig): number {
    const skills: (keyof BasicSkills)[] = ['run', 'jump', 'throw', 'climb', 'balance'];
    let totalScore = 0;

    skills.forEach(skill => {
        if (basicSkills[skill]) {
            totalScore += cfg.skillLevelScores[basicSkills[skill]] || 0;
        }
    });

    return totalScore;
}

// 兴趣广度得分
function calculateInterestsScore(interests: string[], cfg: ScoringConfig): number {
    // 兴趣项目数量得分，每个兴趣2分，上限25分
    return Math.min((interests || []).length * 2, 25);
}

// 水上项目得分
function calculateAquaticScore(aquatic: SpecialtyInfo['aquatic'], interests: string[], cfg: ScoringConfig): number {
    let score = 0;

    // 基础接触分
    if (aquatic.hasContact) {
        score += cfg.specialtyScoring.aquatic.hasContactBonus;
    }

    // 态度得分
    if (aquatic.attitude) {
        score += cfg.waterAttitudeScores[aquatic.attitude] || 0;
    }

    // 技能得分
    const skillCount = (aquatic.skills || []).length;
    score += skillCount * 5; // 每项技能5分

    // 年龄加分 - 6岁前接触额外加分
    if (aquatic.startAge && aquatic.startAge < 6) {
        score += (6 - aquatic.startAge) * cfg.specialtyScoring.aquatic.ageFactorBonus;
    }

    // 学习状态加分
    if (aquatic.learningStatus) {
        score += cfg.specialtyScoring.aquatic.learningStatusBonus[aquatic.learningStatus] || 0;
    }

    // 兴趣匹配加分
    if (interests && interests.includes('游泳')) {
        score += 15;
    }

    return score;
}

// 球类项目得分
function calculateBallScore(ballSkills: string[], interests: string[], cfg: ScoringConfig): number {
    let score = 0;

    // 技能得分
    score += (ballSkills || []).length * cfg.specialtyScoring.ball.skillCount;

    // 兴趣匹配加分
    const ballInterests = (interests || []).filter(interest =>
        ['篮球', '足球', '网球', '羽毛球', '其他球类'].includes(interest)
    );

    if (ballInterests.length > 0) {
        score += cfg.specialtyScoring.ball.interestBonus;
    }

    return score;
}

// 田径项目得分  
function calculateTrackScore(trackSkills: string[], basicSkills: BasicSkills, interests: string[], cfg: ScoringConfig): number {
    let score = 0;

    // 基础技能相关性加分（跑、跳、投掷）
    const relevantSkills: (keyof BasicSkills)[] = ['run', 'jump', 'throw'];
    let relevantScoreSum = 0;
    relevantSkills.forEach(skill => {
        if (basicSkills[skill]) {
            relevantScoreSum += cfg.skillLevelScores[basicSkills[skill]] || 0;
        }
    });

    score += (relevantScoreSum / relevantSkills.length) * cfg.specialtyScoring.track.basicSkillWeight;

    // 兴趣匹配加分
    if (interests && interests.includes('田径项目')) {
        score += cfg.specialtyScoring.track.interestBonus;
    }

    // 具体技能得分
    score += (trackSkills || []).length * 8; // 每项田径技能8分

    return score;
}

// 技巧项目得分
function calculateTechScore(techSkills: string[], highlights: string[], parents: ParentInfo, cfg: ScoringConfig): number {
    let score = 0;

    // 基础技能得分
    score += (techSkills || []).length * 10; // 每项技巧10分

    // 相关突出能力加分
    const relevantHighlights = ['协调性', '平衡能力', '柔韧度', '节奏感'];
    relevantHighlights.forEach(highlight => {
        if (highlights && highlights.includes(highlight)) {
            switch (highlight) {
                case '协调性':
                    score += cfg.specialtyScoring.tech.coordinationBonus;
                    break;
                case '平衡能力':
                    score += cfg.specialtyScoring.tech.balanceBonus;
                    break;
                case '柔韧度':
                    score += cfg.specialtyScoring.tech.flexibilityBonus;
                    break;
                case '节奏感':
                    score += 10; // 节奏感加10分
                    break;
            }
        }
    });

    // 父母相关特质遗传加分
    const fatherTraits = parents.father.traits || [];
    const motherTraits = parents.mother.traits || [];
    const allParentTraits = [...fatherTraits, ...motherTraits];
    const relevantTraits = ['协调性强', '平衡感好', '柔韧性好'];

    relevantTraits.forEach(trait => {
        if (allParentTraits.includes(trait)) {
            score += 5; // 遗传特质每项加5分
        }
    });

    return score;
}

// 身体优势得分
function calculateStrengthsScore(strengths: string[], cfg: ScoringConfig): number {
    // 每项身体优势10分
    return (strengths || []).length * 10;
}

// 健康状况得分（负分项）
function calculateHealthScore(health: PhysicalInfo['health'], cfg: ScoringConfig): number {
    let penalty = 0;

    // 特殊疾病扣分
    if (health.hasSpecialCondition) {
        penalty -= 10;
    }

    // 影响游泳的健康问题扣分
    const concerns = health.swimConcerns || [];
    penalty -= concerns.length * 2; // 每项健康问题扣2分

    // 近视扣分
    if (health.myopia && health.myopia > 200) {
        penalty -= Math.min((health.myopia - 200) / 100, 5); // 200度以上开始扣分，最多扣5分
    }

    return penalty;
}

// 性格特质得分
function calculateTraitsScore(traits: string[], cfg: ScoringConfig): number {
    let score = 0;

    (traits || []).forEach(trait => {
        score += cfg.personalityTraitScores[trait] || 0;
    });

    return score;
}

// === 维度总分计算（应用上限控制）===

export function calculateDimensionScores(details: DetailedScores, cfg: ScoringConfig): DimensionScores {
    const genetic = Math.min(
        details.genetic.heightGenes + details.genetic.parentSports,
        cfg.limits.genetic.maxTotal
    );

    const current = Math.min(
        details.current.basicSkills + details.current.frequency + details.current.interests,
        cfg.limits.current.maxTotal
    );

    // 专项取最高分，不累加
    const specialty = Math.min(
        Math.max(
            details.specialty.aquatic,
            details.specialty.ball,
            details.specialty.track,
            details.specialty.tech
        ),
        cfg.limits.specialty.maxTotal
    );

    const physical = Math.min(
        details.physical.bodyType + details.physical.strengths + details.physical.health,
        cfg.limits.physical.maxTotal
    );

    const psychology = Math.min(
        details.psychology.traits + details.psychology.resilience + details.psychology.teamwork,
        cfg.limits.psychology.maxTotal
    );

    return {
        genetic: Math.max(0, genetic), // 确保非负
        current: Math.max(0, current),
        specialty: Math.max(0, specialty),
        physical: Math.max(0, physical),
        psychology: Math.max(0, psychology)
    };
}

// === 综合得分计算 ===

export function calculateOverallScore(scores: DimensionScores, cfg: ScoringConfig): number {
    const overall =
        scores.genetic * cfg.weights.genetic +
        scores.current * cfg.weights.current +
        scores.specialty * cfg.weights.specialty +
        scores.physical * cfg.weights.physical +
        scores.psychology * cfg.weights.psychology;

    return Math.round(Math.max(0, Math.min(100, overall))); // 限制在0-100范围内，四舍五入
}

// === 路径等级判定 ===

export function determinePathway(overall: number, cfg: ScoringConfig): PathwayLevel {
    const thresholds = cfg.pathwayThresholds;

    if (overall >= thresholds.elite.min) return 'elite';
    if (overall >= thresholds.competitive.min) return 'competitive';
    if (overall >= thresholds.recreational.min) return 'recreational';
    return 'hobby';
}

// === 项目推荐 ===

export function recommendSports(input: AssessmentInput, scores: DimensionScores, details: DetailedScores, cfg: ScoringConfig): SportType[] {
    const recommendations: SportType[] = [];

    // 检查各专项得分和相关特质
    const specialtyScores = details.specialty;
    const highlights = input.observed.highlights || [];
    const fatherTraits = input.parents.father.traits || [];
    const motherTraits = input.parents.mother.traits || [];
    const traits = [...fatherTraits, ...motherTraits];

    // 水上项目推荐
    if (specialtyScores.aquatic >= cfg.sportRecommendations.aquatic.minScore) {
        const hasRequiredTraits = cfg.sportRecommendations.aquatic.requiredTraits.every(trait =>
            highlights.includes(trait)
        );
        if (hasRequiredTraits || specialtyScores.aquatic >= 70) { // 高分可忽略特质要求
            recommendations.push('aquatic');
        }
    }

    // 球类项目推荐
    if (specialtyScores.ball >= cfg.sportRecommendations.ball_sports.minScore) {
        const hasRequiredTraits = cfg.sportRecommendations.ball_sports.requiredTraits.some(trait =>
            highlights.includes(trait) || traits.includes(trait)
        );
        if (hasRequiredTraits || specialtyScores.ball >= 65) {
            recommendations.push('ball_sports');
        }
    }

    // 田径项目推荐
    if (specialtyScores.track >= cfg.sportRecommendations.track_field.minScore) {
        const hasRequiredTraits = cfg.sportRecommendations.track_field.requiredTraits.some(trait =>
            highlights.includes(trait)
        );
        if (hasRequiredTraits || specialtyScores.track >= 60) {
            recommendations.push('track_field');
        }
    }

    // 技巧项目推荐
    if (specialtyScores.tech >= cfg.sportRecommendations.technical.minScore) {
        const hasRequiredTraits = cfg.sportRecommendations.technical.requiredTraits.every(trait =>
            highlights.includes(trait)
        );
        if (hasRequiredTraits || specialtyScores.tech >= 70) {
            recommendations.push('technical');
        }
    }

    // 如果没有明显专项推荐，根据综合得分给出通用建议
    if (recommendations.length === 0) {
        if (scores.overall >= 60) {
            // 综合能力较好，推荐最高得分的专项
            const maxSpecialty = Math.max(
                specialtyScores.aquatic,
                specialtyScores.ball,
                specialtyScores.track,
                specialtyScores.tech
            );

            if (maxSpecialty === specialtyScores.aquatic) recommendations.push('aquatic');
            else if (maxSpecialty === specialtyScores.ball) recommendations.push('ball_sports');
            else if (maxSpecialty === specialtyScores.track) recommendations.push('track_field');
            else recommendations.push('technical');
        }
    }

    return recommendations;
}

// === 建议生成 ===

export function generateRecommendations(scores: DimensionScores, pathway: PathwayLevel, input: AssessmentInput, cfg: ScoringConfig): string[] {
    const recommendations: string[] = [];

    // 各维度建议
    const dimensionAdvice = {
        genetic: getScoreLevel(scores.genetic),
        current: getScoreLevel(scores.current),
        specialty: getScoreLevel(scores.specialty),
        physical: getScoreLevel(scores.physical),
        psychology: getScoreLevel(scores.psychology)
    };

    // 添加各维度具体建议
    Object.entries(dimensionAdvice).forEach(([dimension, level]) => {
        const templates = cfg.adviceTemplates[dimension];
        if (templates && templates[level] && templates[level].length > 0) {
            recommendations.push(templates[level][0]); // 取第一条建议
        }
    });

    // 添加路径建议
    const pathwayAdvice = cfg.adviceTemplates.pathway[pathway];
    if (pathwayAdvice && pathwayAdvice.length > 0) {
        recommendations.push(pathwayAdvice[0]);
    }

    // 待确认点：根据具体情况添加定制化建议
    // 假设前提：年龄小于5岁时建议以兴趣培养为主
    if (input.child.age < 5) {
        recommendations.push('年龄较小，建议以游戏化运动和兴趣培养为主，避免过早专业化训练');
    }

    // 待确认点：根据家庭支持条件给出建议
    if (input.goals.support.budget === '有限') {
        recommendations.push('考虑到家庭经济情况，建议选择成本相对较低的运动项目，如跑步、游泳等');
    }

    return recommendations;
}

// 辅助函数：得分等级判定
function getScoreLevel(score: number): string {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

// === 导出工具函数 ===

/**
 * 格式化评估结果为可读文本
 * @param result - 评估结果
 * @returns 格式化后的文本
 */
export function formatResult(result: AssessmentResult): string {
    const pathwayLabels: Record<PathwayLevel, string> = {
        hobby: '业余爱好级别',
        recreational: '兴趣培养级别',
        competitive: '竞技储备级别',
        elite: '专业发展级别'
    };

    const sportLabels: Record<SportType, string> = {
        aquatic: '水上项目',
        ball_sports: '球类运动',
        track_field: '田径项目',
        technical: '技巧项目'
    };

    const recommendedSports = result.suitableSports.map(sport => sportLabels[sport]).join('、') || '需要进一步观察';
    const recommendationList = result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');

    return `
运动天赋评估结果报告
===================

综合得分：${result.overall}分
发展路径：${pathwayLabels[result.pathway]}

各维度得分：
- 遗传潜力：${result.scores.genetic}分
- 当前能力：${result.scores.current}分  
- 专项技能：${result.scores.specialty}分
- 身体优势：${result.scores.physical}分
- 心理特征：${result.scores.psychology}分

推荐项目：${recommendedSports}

专业建议：
${recommendationList}

评估时间：${new Date(result.timestamp).toLocaleString()}
  `.trim();
}

/**
 * 验证输入数据完整性
 * @param input - 输入数据
 * @returns 验证结果和缺失字段
 */
export function validateInput(input: Partial<AssessmentInput>): { isValid: boolean; missingFields: string[]; warnings: string[] } {
    const missingFields: string[] = [];
    const warnings: string[] = [];

    // 必填字段检查
    if (!input.child || !input.child.name) missingFields.push('child.name');
    if (!input.child || !input.child.gender) missingFields.push('child.gender');
    if (!input.child || !input.child.age) missingFields.push('child.age');
    if (!input.development || !input.development.frequency) missingFields.push('development.frequency');

    // 警告字段检查
    if (!input.family || (!input.family.father && !input.family.mother)) {
        warnings.push('缺少父母身高信息，可能影响遗传潜力评估准确性');
    }

    if (!input.specialty || !input.specialty.aquatic || !input.specialty.aquatic.hasContact) {
        warnings.push('缺少游泳接触信息，专项评估可能不够全面');
    }

    return {
        isValid: missingFields.length === 0,
        missingFields,
        warnings
    };
}
