const { calculateScore, determinePath, assessSportsSuitability, evaluate } = require('../domain/scoring');
const ScoringConfig = require('../domain/scoring.config');

// 创建标准测试数据结构 - 修正为与评分引擎期望的格式匹配
const createValidInput = () => ({
  child: { 
    name: "测试儿童", 
    age: 10, 
    gender: "male" 
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
      speed: "good"
    },
    frequency: "3-4_times",
    interests: ["游泳", "篮球", "足球"]
  },
  specialty: {
    aquatic: {
      hasContact: true,
      attitude: "positive",
      skills: ["游泳基础"],
      startAge: 5
    },
    ball: ["篮球", "足球"],
    track: ["跑步", "跳跃"],
    tech: []
  },
  physical: {
    health: {
      bodyType: "normal",
      chronicIssues: "none", 
      injuries: "none",
      allergies: "none"
    },
    strengths: []
  },
  psychology: {
    traits: ["competitive", "focused"],
    response: "high", 
    teamwork: "good"
  },
  observed: {
    highlights: ["speed", "coordination"]
  },
  goals: {
    support: {
      budget: "中等"
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
      const config = ScoringConfig.DEFAULT_SCORING_CONFIG;
      
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
      console.log('Result overall:', result.overall);
      console.log('Result scores:', result.scores);
      console.log('Result pathway:', result.pathway);
      expect(result).toBeDefined();
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle empty specialty data', () => {
    const inputWithEmptySpecialty = {
      ...createValidInput(),
      specialty: {
        aquatic: {},
        ball: [],
        track: [],
        tech: []
      }
    };
    
    const result = evaluate(inputWithEmptySpecialty);
    expect(result).toBeDefined();
    expect(typeof result.overall).toBe('number');
    expect(result.overall).not.toBeNaN();
  });

  test('should handle minimal required data', () => {
    const minimalInput = {
      child: { name: "测试", age: 8, gender: "female" },
      family: { father: 175, mother: 160 },
      parents: {
        father: { sportExp: "none", traits: [] },
        mother: { sportExp: "none", traits: [] }
      },
      development: {
        basicSkills: {},
        frequency: "1-2_times",
        interests: []
      },
      specialty: {
        aquatic: {},
        ball: [],
        track: [],
        tech: []
      },
      physical: {
        health: { bodyType: "normal" },
        strengths: []
      },
      psychology: {
        traits: [],
        response: "medium",
        teamwork: "average"
      },
      observed: {
        highlights: []
      },
      goals: {
        support: { budget: "有限" }
      }
    };

    const result = evaluate(minimalInput);
    expect(result).toBeDefined();
    expect(typeof result.overall).toBe('number');
    expect(result.overall).not.toBeNaN();
  });

  test('should handle invalid scores gracefully', () => {
    const config = ScoringConfig.DEFAULT_SCORING_CONFIG;
    
    // 测试边界值
    expect(determinePath(-10, config)).toBe('hobby');
    expect(determinePath(0, config)).toBe('hobby');
    expect(determinePath(100, config)).toBe('elite');
    expect(determinePath(150, config)).toBe('elite');
    
    // 测试null/undefined
    expect(determinePath(null, config)).toBe('hobby');
    expect(determinePath(undefined, config)).toBe('hobby');
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

    const recommendations = assessSportsSuitability(validInput, mockScores, mockDetails, ScoringConfig.DEFAULT_SCORING_CONFIG);
    expect(recommendations).toBeInstanceOf(Array);
  });
});

describe('Input Validation', () => {
  test('validateInput function should be exported', () => {
    const { validateInput } = require('../domain/scoring');
    expect(typeof validateInput).toBe('function');
  });

  test('should validate required fields', () => {
    const { validateInput } = require('../domain/scoring');
    
    const incompleteInput = {
      child: { age: 10 }  // missing name
    };
    
    const result = validateInput(incompleteInput);
    expect(result).toBeDefined();
    expect(result.missingFields).toBeInstanceOf(Array);
  });

  test('should pass validation for complete input', () => {
    const { validateInput } = require('../domain/scoring');
    const validInput = createValidInput();
    
    const result = validateInput(validInput);
    expect(result).toBeDefined();
    expect(result.missingFields).toHaveLength(0);
  });
});

describe('Result Formatting', () => {
  test('formatResult function should be exported', () => {
    const { formatResult } = require('../domain/scoring');
    expect(typeof formatResult).toBe('function');
  });

  test('should format result properly', () => {
    const { formatResult } = require('../domain/scoring');
    const validInput = createValidInput();
    const result = evaluate(validInput);
    
    const formatted = formatResult(result);
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });
});
