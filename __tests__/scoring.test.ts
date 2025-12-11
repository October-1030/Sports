import { calculateScore, determinePath, assessSportsSuitability, evaluate, validateInput, formatResult } from '../domain/scoring';
import { DEFAULT_SCORING_CONFIG } from '../domain/scoring.config';
import { AssessmentInput, AssessmentResult } from '../domain/types';

// 创建标准测试数据结构 - 修正为与评分引擎期望的格式匹配
const createValidInput = (): AssessmentInput => ({
    child: {
        name: "测试儿童",
        age: 10,
        gender: "male",
        height: 140,
        weight: 35,
        grade: "primary_4"
    },
    family: {
        father: 180,
        mother: 165
    },
    parents: {
        father: {
            sportExp: "amateur",
            traits: ["speed", "endurance"]
        },
        mother: {
            sportExp: "none",
            traits: ["flexibility"]
        }
    },
    development: {
        basicSkills: {
            balance: "good",
            coordination: "average",
            flexibility: "good",
            strength: "average",
            speed: "good",
            run: "good",
            jump: "average",
            throw: "average",
            climb: "good"
        },
        frequency: "3-4_times",
        interests: ["游泳", "篮球", "足球"],
        hasTraining: true
    },
    specialty: {
        aquatic: {
            hasContact: true,
            attitude: "positive",
            skills: ["basic_float"],
            startAge: 5
        },
        ball: ["basketball", "soccer"],
        track: ["running", "jump"],
        tech: []
    },
    physical: {
        health: {
            bodyType: "standard",
            hasSpecialCondition: false,
            hasCheckup: true,
            swimConcerns: []
        },
        strengths: []
    },
    psychology: {
        traits: ["competitive", "focused"],
        response: "strong",
        teamwork: "good"
    },
    observed: {
        highlights: ["speed", "coordination"]
    },
    goals: {
        purposes: ["health"],
        expectation: "hobby",
        trainingTime: ["3-4_times"],
        support: {
            budget: "sufficient",
            traffic: "convenient",
            time: "sufficient",
            atmosphere: "good"
        }
    }
});

describe('Scoring Engine Tests', () => {
    describe('Basic Functionality', () => {
        test('calculateScore function exists', () => {
            expect(typeof calculateScore).toBe('function');
        });

        test('determinePath function exists', () => {
            expect(typeof determinePath).toBe('function');
        });

        test('assessSportsSuitability function exists', () => {
            expect(typeof assessSportsSuitability).toBe('function');
        });

        test('evaluate function exists', () => {
            expect(typeof evaluate).toBe('function');
        });
    });

    describe('Score Calculation with Valid Data', () => {
        test('should handle valid input data without crashing', () => {
            const validInput = createValidInput();
            const result = evaluate(validInput);
            expect(result).toBeDefined();
            expect(result.scores).toBeDefined();
            expect(result.overall).toBeDefined();
        });

        test('should return an object with expected structure', () => {
            const validInput = createValidInput();
            const result = evaluate(validInput);
            expect(result).toBeInstanceOf(Object);
            expect(result.scores).toBeInstanceOf(Object);
            expect(typeof result.overall).toBe('number');
            expect(result.overall).not.toBeNaN();
            expect(result.pathway).toBeDefined();
            expect(result.suitableSports).toBeInstanceOf(Array);
        });

        test('calculateScore alias function works', () => {
            const validInput = createValidInput();
            const result = calculateScore(validInput);
            expect(result).toBeDefined();
            expect(result.scores).toBeDefined();
        });
    });

    describe('Path Determination', () => {
        test('should determine paths correctly with config', () => {
            const config = DEFAULT_SCORING_CONFIG;

            expect(determinePath(90, config)).toBe('elite');
            expect(determinePath(70, config)).toBe('competitive');
            expect(determinePath(50, config)).toBe('recreational');
            expect(determinePath(30, config)).toBe('hobby');
        });
    });

    describe('Debug Tests', () => {
        test('debug result structure', () => {
            const validInput = createValidInput();
            const result = evaluate(validInput);
            // console.log('Result overall:', result.overall);
            // console.log('Result scores:', result.scores);
            // console.log('Result pathway:', result.pathway);
            expect(result).toBeDefined();
        });
    });
});

describe('Edge Cases and Error Handling', () => {
    test('should handle empty specialty data', () => {
        const inputWithEmptySpecialty = {
            ...createValidInput(),
            specialty: {
                aquatic: {
                    hasContact: false,
                    attitude: "neutral",
                    skills: []
                },
                ball: [],
                track: [],
                tech: []
            }
        } as AssessmentInput;

        const result = evaluate(inputWithEmptySpecialty);
        expect(result).toBeDefined();
        expect(typeof result.overall).toBe('number');
        expect(result.overall).not.toBeNaN();
    });

    test('should handle minimal required data', () => {
        // Construct a minimal valid input
        const minimalInput: AssessmentInput = {
            child: { name: "测试", age: 8, gender: "female" },
            family: { father: 175, mother: 160 },
            parents: {
                father: { sportExp: "rarely", traits: [] },
                mother: { sportExp: "rarely", traits: [] }
            },
            development: {
                basicSkills: {},
                frequency: "1-2_times",
                interests: [],
                hasTraining: false
            },
            specialty: {
                aquatic: { hasContact: false, attitude: 'neutral', skills: [] },
                ball: [],
                track: [],
                tech: []
            },
            physical: {
                health: { bodyType: "standard", hasSpecialCondition: false, hasCheckup: false, swimConcerns: [] },
                strengths: []
            },
            psychology: {
                traits: [],
                response: "average",
                teamwork: "average"
            },
            observed: {
                highlights: []
            },
            goals: {
                purposes: [],
                expectation: "hobby",
                trainingTime: [],
                support: { budget: "limited", traffic: "average", time: "average", atmosphere: "average" }
            }
        };

        const result = evaluate(minimalInput);
        expect(result).toBeDefined();
        expect(typeof result.overall).toBe('number');
        expect(result.overall).not.toBeNaN();
    });

    test('should handle invalid scores gracefully', () => {
        const config = DEFAULT_SCORING_CONFIG;

        // 测试边界值
        expect(determinePath(-10, config)).toBe('hobby');
        expect(determinePath(0, config)).toBe('hobby');
        expect(determinePath(100, config)).toBe('elite');
        expect(determinePath(150, config)).toBe('elite');

        // 测试null/undefined - TS prevents this, but runtime might not
        expect(determinePath(null as any, config)).toBe('hobby');
        expect(determinePath(undefined as any, config)).toBe('hobby');
    });
});

describe('Score Range Validation', () => {
    test('overall score should be within valid ranges', () => {
        const validInput = createValidInput();
        const result = evaluate(validInput);

        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
    });

    test('dimension scores should be within valid ranges', () => {
        const validInput = createValidInput();
        const result = evaluate(validInput);

        // 各维度分数应该在合理范围内
        expect(result.scores.genetic).toBeGreaterThanOrEqual(0);
        expect(result.scores.current).toBeGreaterThanOrEqual(0);
        expect(result.scores.specialty).toBeGreaterThanOrEqual(0);
        expect(result.scores.physical).toBeGreaterThanOrEqual(-20); // 身体可能有负分（健康扣分）
        expect(result.scores.psychology).toBeGreaterThanOrEqual(0);

        // 各维度分数不应该是NaN
        expect(result.scores.genetic).not.toBeNaN();
        expect(result.scores.current).not.toBeNaN();
        expect(result.scores.specialty).not.toBeNaN();
        expect(result.scores.physical).not.toBeNaN();
        expect(result.scores.psychology).not.toBeNaN();
    });
});

describe('Sports Recommendation', () => {
    test('should return sports recommendations', () => {
        const validInput = createValidInput();
        const result = evaluate(validInput);

        expect(result.suitableSports).toBeInstanceOf(Array);
        expect(result.recommendations).toBeInstanceOf(Array);
    });

    test('should handle assessSportsSuitability function directly', () => {
        const validInput = createValidInput();
        const mockScores = {
            genetic: 75,
            current: 70,
            specialty: 65,
            physical: 60,
            psychology: 70
        };
        const mockDetails = {
            genetic: { heightGenes: 30, parentSports: 45 },
            specialty: { aquatic: 70, ball: 65, track: 60, tech: 20 }
        };

        const recommendations = assessSportsSuitability(validInput, mockScores, mockDetails, DEFAULT_SCORING_CONFIG);
        expect(recommendations).toBeInstanceOf(Array);
    });
});

describe('Input Validation', () => {
    test('validateInput function should be exported', () => {
        expect(typeof validateInput).toBe('function');
    });

    test('should validate required fields', () => {

        const incompleteInput = {
            child: { age: 10 }  // missing name
        } as any;

        const result = validateInput(incompleteInput);
        expect(result).toBeDefined();
        expect(result.missingFields).toBeInstanceOf(Array);
    });

    test('should pass validation for complete input', () => {
        const validInput = createValidInput();

        const result = validateInput(validInput);
        expect(result).toBeDefined();
        expect(result.missingFields).toHaveLength(0);
    });
});

describe('Result Formatting', () => {
    test('formatResult function should be exported', () => {
        expect(typeof formatResult).toBe('function');
    });

    test('should format result properly', () => {
        const validInput = createValidInput();
        const result = evaluate(validInput);

        const formatted = formatResult(result);
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
    });
});
