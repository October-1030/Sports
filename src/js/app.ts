import { evaluate, validateInput, formatResult } from '@domain/scoring';
import {
    AssessmentInput,
    AssessmentResult,
    SportType,
    Gender,
    GradeLevel,
    ActivityFrequency,
    SkillLevel,
    ParentSportExp,
    WaterAttitude,
    SwimLearningStatus,
    BodyType,
    PathwayLevel
} from '@domain/types';

// Declare Chart.js global
declare const Chart: any;

// ===== 全局变量 =====
let currentStep = 1;
const totalSteps = 5;
const formData: Record<string, any> = {};
let isDesktop = false;

// ===== 设备检测 =====
function detectDevice() {
    isDesktop = window.innerWidth >= 768;

    // 显示桌面端快捷键提示
    const keyboardHint = document.querySelector('.keyboard-hint') as HTMLElement;
    if (keyboardHint) {
        keyboardHint.style.display = isDesktop ? 'block' : 'none';
    }
}

// ===== 键盘快捷键支持 =====
function setupKeyboardShortcuts() {
    if (!isDesktop) return;

    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'Enter':
                e.preventDefault();
                nextStep();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previousStep();
                break;
            case 'Escape':
                e.preventDefault();
                if (currentStep > 1) previousStep();
                break;
        }
    });
}

// ===== 步骤管理 =====
(window as any).nextStep = function () {
    if (currentStep < totalSteps) {
        saveCurrentStepData();
        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (currentStepEl) currentStepEl.classList.remove('active');

        currentStep++;
        const nextStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (nextStepEl) nextStepEl.classList.add('active');

        updateStepIndicator();
        updateButtonState();
        window.scrollTo(0, 0);
    } else {
        showResults();
    }
};

(window as any).previousStep = function () {
    if (currentStep > 1) {
        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (currentStepEl) currentStepEl.classList.remove('active');

        currentStep--;
        const prevStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (prevStepEl) prevStepEl.classList.add('active');

        updateStepIndicator();
        updateButtonState();
        window.scrollTo(0, 0);
    }
};

function nextStep() {
    (window as any).nextStep();
}

function previousStep() {
    (window as any).previousStep();
}

function updateStepIndicator() {
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        const stepNumber = index + 1;
        dot.classList.remove('active', 'completed');

        if (stepNumber === currentStep) {
            dot.classList.add('active');
        } else if (stepNumber < currentStep) {
            dot.classList.add('completed');
        }
    });
}

function updateButtonState() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';

    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.textContent = '生成评估报告';
            nextBtn.innerHTML = '<i class="fas fa-chart-bar"></i> 生成评估报告';
        } else {
            nextBtn.innerHTML = '下一步 <i class="fas fa-arrow-right"></i>';
        }
    }
}

// ===== 表单交互 =====
// Expose to window for HTML event handlers
(window as any).selectRadio = function (element: HTMLElement, name: string, value: string, event: Event) {
    // 阻止事件冒泡，避免重复触发
    if (event) {
        event.stopPropagation();
    }

    // 移除所有选中状态
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        const radioItem = input.closest('.radio-item');
        if (radioItem) radioItem.classList.remove('selected');
        (input as HTMLInputElement).checked = false;
    });

    // 如果点击的是radio本身，它已经自动选中了
    // 只有点击外层div时才需要手动选中
    const radio = element.querySelector('input[type="radio"]') as HTMLInputElement;
    if (event && (event.target as HTMLElement).type !== 'radio') {
        if (radio) radio.checked = true;
    }

    element.classList.add('selected');
    formData[name] = value;
};

(window as any).toggleCheckbox = function (element: HTMLElement, groupName: string, event: Event) {
    // 阻止事件冒泡，避免重复触发
    if (event) {
        event.stopPropagation();
    }

    const checkbox = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // 如果点击的是checkbox本身，它已经自动切换了，不需要再切换
    // 只有点击外层div时才需要手动切换
    if (event && (event.target as HTMLElement).type !== 'checkbox') {
        if (checkbox) checkbox.checked = !checkbox.checked;
    }

    const isChecked = checkbox ? checkbox.checked : false;

    if (isChecked) {
        element.classList.add('selected');
    } else {
        element.classList.remove('selected');
    }

    if (!formData[groupName]) {
        formData[groupName] = [];
    }

    const value = checkbox ? checkbox.value : '';
    if (isChecked && !formData[groupName].includes(value)) {
        formData[groupName].push(value);
    } else if (!isChecked) {
        formData[groupName] = formData[groupName].filter((v: string) => v !== value);
    }
};

function saveCurrentStepData() {
    const currentStepElement = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        const el = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (el.type === 'radio' || el.type === 'checkbox') {
            const checkEl = el as HTMLInputElement;
            if (checkEl.checked && checkEl.name) {
                if (checkEl.type === 'checkbox') {
                    if (!formData[checkEl.name]) formData[checkEl.name] = [];
                    if (!formData[checkEl.name].includes(checkEl.value)) {
                        formData[checkEl.name].push(checkEl.value);
                    }
                } else {
                    formData[checkEl.name] = checkEl.value;
                }
            }
        } else if (el.id && el.value) {
            formData[el.id] = el.value;
        }
    });
}

// ===== 结果生成 =====
function showResults() {
    saveCurrentStepData();
    const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (currentStepEl) currentStepEl.classList.remove('active');

    const resultStepEl = document.querySelector('.step[data-step="result"]');
    if (resultStepEl) resultStepEl.classList.add('active');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');

    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (generateBtn) generateBtn.style.display = 'inline-flex';

    calculateAndShowResults();
}

function calculateAndShowResults() {
    const score = calculateTotalScore();
    const totalScoreEl = document.getElementById('totalScore');
    if (totalScoreEl) totalScoreEl.textContent = score.toString();

    createRadarChart();
    generateRecommendations();
    generatePersonalizedAdvice();
}

function calculateTotalScore() {
    let score = 60;

    if (formData.speed === 'excellent') score += 10;
    else if (formData.speed === 'good') score += 7;
    else if (formData.speed === 'average') score += 4;

    if (formData.strength === 'excellent') score += 10;
    else if (formData.strength === 'good') score += 7;
    else if (formData.strength === 'average') score += 4;

    if (formData.coordination === 'excellent') score += 10;
    else if (formData.coordination === 'good') score += 7;
    else if (formData.coordination === 'average') score += 4;

    if (formData.learning_ability === 'fast') score += 8;
    else if (formData.learning_ability === 'normal') score += 5;

    if (formData.challenge_attitude === 'positive') score += 7;
    else if (formData.challenge_attitude === 'need_encourage') score += 4;

    if (formData.interests && formData.interests.length > 0) {
        score += formData.interests.length * 2;
    }

    return Math.min(score, 100);
}

function createRadarChart() {
    const canvas = document.getElementById('radarChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const speedScore = getScoreFromRating(formData.speed);
    const strengthScore = getScoreFromRating(formData.strength);
    const coordinationScore = getScoreFromRating(formData.coordination);
    const learningScore = formData.learning_ability === 'fast' ? 90 :
        formData.learning_ability === 'normal' ? 70 : 50;
    const attitudeScore = formData.challenge_attitude === 'positive' ? 90 :
        formData.challenge_attitude === 'need_encourage' ? 70 : 50;
    const interestScore = formData.interests ? Math.min(formData.interests.length * 20, 100) : 60;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['速度', '力量', '协调性', '学习能力', '挑战态度', '运动兴趣'],
            datasets: [{
                label: '能力评估',
                data: [speedScore, strengthScore, coordinationScore, learningScore, attitudeScore, interestScore],
                borderColor: '#ff7a45',
                backgroundColor: 'rgba(255, 122, 69, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#ff7a45',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#64748b'
                    },
                    grid: {
                        color: '#e2e8f0'
                    },
                    pointLabels: {
                        font: {
                            size: isDesktop ? 16 : 14,
                            family: '-apple-system, BlinkMacSystemFont, PingFang SC'
                        },
                        color: '#1e293b'
                    }
                }
            }
        }
    });
}

function getScoreFromRating(rating: string) {
    switch (rating) {
        case 'excellent': return 95;
        case 'good': return 80;
        case 'average': return 65;
        case 'poor': return 45;
        default: return 60;
    }
}

function generateRecommendations() {
    const recommendationList = document.getElementById('recommendationList');
    if (!recommendationList) return;

    const recommendations = getRecommendations();

    recommendationList.innerHTML = recommendations.map(rec => `
        <li class="recommendation-item">
            <div class="recommendation-icon">
                <i class="${rec.icon}"></i>
            </div>
            <div>
                <strong>${rec.sport}</strong>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 14px;">
                    ${rec.reason}
                </p>
            </div>
        </li>
    `).join('');
}

function getRecommendations() {
    const recommendations = [];

    if (formData.interests && formData.interests.includes('swimming')) {
        recommendations.push({
            sport: '游泳专项训练',
            reason: '您的孩子对游泳很感兴趣，适合深入发展',
            icon: 'fas fa-swimmer'
        });
    }

    if (formData.interests && formData.interests.includes('basketball')) {
        recommendations.push({
            sport: '篮球基础训练',
            reason: '球类运动有助于提高协调性和团队精神',
            icon: 'fas fa-basketball-ball'
        });
    }

    if (formData.speed === 'excellent') {
        recommendations.push({
            sport: '田径短跑',
            reason: '速度表现优秀，适合发展短跑项目',
            icon: 'fas fa-running'
        });
    }

    if (formData.coordination === 'excellent') {
        recommendations.push({
            sport: '体操/艺术体操',
            reason: '协调性优秀，适合技巧类运动',
            icon: 'fas fa-child'
        });
    }

    if (recommendations.length === 0) {
        recommendations.push(
            {
                sport: '综合体能训练',
                reason: '建立良好的运动基础，全面发展身体素质',
                icon: 'fas fa-dumbbell'
            },
            {
                sport: '趣味运动游戏',
                reason: '培养运动兴趣，在游戏中提高运动能力',
                icon: 'fas fa-gamepad'
            }
        );
    }

    return recommendations.slice(0, 3);
}

function generatePersonalizedAdvice() {
    const adviceContainer = document.getElementById('personalizedAdvice');
    if (!adviceContainer) return;

    const advice = getPersonalizedAdvice();

    adviceContainer.innerHTML = `
        <div style="background: var(--secondary); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
            <h4 style="margin-bottom: 8px; color: var(--text);">🎯 发展建议</h4>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6;">${advice.development}</p>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; border-radius: var(--radius); margin-bottom: 16px;">
            <h4 style="margin-bottom: 8px; color: var(--success);">💡 训练重点</h4>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6;">${advice.training}</p>
        </div>
        <div style="background: rgba(245, 158, 11, 0.1); padding: 16px; border-radius: var(--radius);">
            <h4 style="margin-bottom: 8px; color: var(--warning);">⚠️ 注意事项</h4>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6;">${advice.caution}</p>
        </div>
    `;
}

function getPersonalizedAdvice() {
    let development = '建议选择1-2个主要运动项目进行系统训练，同时保持多样化的运动体验。';
    let training = '重点培养基础运动技能，如跑、跳、投、攀爬等，为专项运动打好基础。';
    let caution = '注意运动强度适中，避免过早专业化训练，保护孩子的运动兴趣和身体健康。';

    if (formData.goal === 'professional') {
        development = '孩子有专业发展意愿，建议寻找专业教练，制定系统性训练计划。';
        training = '加强专项技能训练，同时注重体能和心理素质的全面提升。';
    } else if (formData.goal === 'health') {
        development = '以健康为主要目标，建议选择孩子喜欢的运动项目，重在坚持和享受。';
        training = '注重趣味性和多样性，培养终身运动习惯比技术水平更重要。';
    }

    if (formData.challenge_attitude === 'give_up_easily') {
        caution = '孩子容易放弃，建议选择趣味性强的项目，多给予鼓励和支持，循序渐进提升难度。';
    }

    return { development, training, caution };
}

// Expose to window for HTML event handlers
(window as any).generateReport = function () {
    const loading = document.querySelector('.loading') as HTMLElement || createLoadingElement();
    loading.style.display = 'flex';

    setTimeout(() => {
        try {
            // 1. 转换表单数据为评估引擎格式
            const assessmentInput = convertFormDataToAssessmentInput();
            console.log('评估输入数据:', assessmentInput);

            // 2. 调用评分引擎生成评估结果
            const result = evaluate(assessmentInput);
            console.log('评估结果:', result);

            // 3. 显示专业报告
            showProfessionalReport(result, assessmentInput);

            loading.style.display = 'none';
        } catch (error: any) {
            loading.style.display = 'none';
            console.error('生成报告时出错:', error);
            console.error('错误堆栈:', error.stack);
            alert('生成报告时出错\n\n错误详情: ' + error.message + '\n\n请打开浏览器控制台查看详细信息');
        }
    }, 1000);
};

// 转换表单数据为评估引擎格式
function convertFormDataToAssessmentInput(): AssessmentInput {
    return {
        child: {
            name: formData.childName || '未填写',
            gender: formData.gender === '男' ? 'male' : 'female',
            age: calculateAge(formData.birthDate) || 6,
            height: parseInt(formData.height) || undefined,
            weight: parseInt(formData.weight) || undefined,
            grade: 'kindergarten_large' // 默认值
        },
        family: {
            father: parseInt(formData.fatherHeight) || undefined,
            mother: parseInt(formData.motherHeight) || undefined
        },
        parents: {
            father: {
                sportExp: mapSportExp(formData.family_sports),
                traits: formData.family_sports || []
            },
            mother: {
                sportExp: mapSportExp(formData.family_sports),
                traits: []
            }
        },
        development: {
            hasTraining: formData.training && formData.training.length > 0,
            frequency: mapFrequency(formData.frequency),
            interests: formData.interests || [],
            basicSkills: {
                run: formData.speed || 'average',
                jump: formData.coordination || 'average',
                throw: formData.strength || 'average',
                climb: formData.coordination || 'average',
                balance: formData.coordination || 'average'
            }
        },
        specialty: {
            aquatic: {
                hasContact: formData.interests && formData.interests.includes('swimming'),
                attitude: 'positive',
                skills: formData.interests && formData.interests.includes('swimming') ? ['basic_float'] : []
            },
            ball: formData.interests ? formData.interests.filter((i: string) => ['basketball', 'soccer', 'tennis'].includes(i)) : [],
            track: formData.interests && formData.interests.includes('track') ? ['running'] : [],
            tech: formData.interests && formData.interests.includes('gymnastics') ? ['flexibility'] : []
        },
        physical: {
            health: {
                hasSpecialCondition: false,
                hasCheckup: true,
                swimConcerns: [],
                bodyType: 'standard'
            },
            strengths: ["速度", "协调性", "平衡感"] // Default or derived
        },
        observed: {
            highlights: ["速度型能力", "协调性"] // Default or derived
        },
        psychology: {
            traits: [],
            response: mapResilience(formData.challenge_attitude),
            teamwork: 'good'
        },
        goals: {
            purposes: ["增强体质/健康需求"],
            expectation: "体教结合（运动与学业平衡）",
            trainingTime: ["每周3-4次"],
            support: {
                traffic: "方便",
                budget: "充足",
                time: "充足",
                atmosphere: "浓厚"
            }
        }
    };
}

// 辅助映射函数
function mapSportExp(familySports: string[]): ParentSportExp {
    if (!familySports || familySports.length === 0) return 'rarely';
    if (familySports.includes('professional')) return 'professional';
    if (familySports.includes('amateur')) return 'amateur';
    return 'rarely';
}

function mapFrequency(freq: string): ActivityFrequency {
    const mapping: Record<string, ActivityFrequency> = {
        '1-2': '1-2_times',
        '3-4': '3-4_times',
        '5+': '5plus_times'
    };
    return mapping[freq] || 'rarely';
}

function mapResilience(attitude: string): string {
    const mapping: Record<string, string> = {
        'positive': 'strong',
        'need_encourage': 'average',
        'give_up_easily': 'needs_support'
    };
    return mapping[attitude] || 'average';
}

function calculateAge(birthDate: string): number | null {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// 显示专业报告（新窗口）
function showProfessionalReport(result: AssessmentResult, input: AssessmentInput) {
    const reportWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!reportWindow) {
        alert('请允许弹出窗口以查看报告');
        return;
    }

    const pathwayText: Record<PathwayLevel, string> = {
        'hobby': '业余爱好级别',
        'recreational': '兴趣培养级别',
        'competitive': '竞技储备级别',
        'elite': '专业发展级别'
    };

    // 运动项目名称映射函数
    const getSportName = (type: string) => {
        const mapping: Record<string, string> = {
            'swimming': '游泳',
            'basketball': '篮球',
            'soccer': '足球',
            'tennis': '网球',
            'track': '田径',
            'gymnastics': '体操',
            'aquatic': '水上运动',
            'ball_sports': '球类运动',
            'track_field': '田径运动',
            'technical': '技巧类运动'
        };
        return mapping[type] || type;
    };

    // 构建报告 HTML - 使用数组拼接避免超大模板字符串
    const htmlParts: string[] = [];

    htmlParts.push('<!DOCTYPE html>');
    htmlParts.push('<html lang="zh-CN">');
    htmlParts.push('<head>');
    htmlParts.push('    <meta charset="UTF-8">');
    htmlParts.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    htmlParts.push('    <title>儿童运动天赋评估报告 - ' + input.child.name + '<' + '/title>');
    htmlParts.push('    <style>');
    htmlParts.push('        * { margin: 0; padding: 0; box-sizing: border-box; }');
    htmlParts.push('        body {');
    htmlParts.push('            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;');
    htmlParts.push('            line-height: 1.6; color: #333; background: #f5f5f5; padding: 20px;');
    htmlParts.push('        }');
    htmlParts.push('        .report-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }');
    htmlParts.push('        .report-header { text-align: center; border-bottom: 3px solid #29CC57; padding-bottom: 20px; margin-bottom: 30px; }');
    htmlParts.push('        .report-title { font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }');
    htmlParts.push('        .report-subtitle { font-size: 14px; color: #64748b; }');
    htmlParts.push('        .child-info { background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }');
    htmlParts.push('        .info-item { display: flex; flex-direction: column; }');
    htmlParts.push('        .info-label { font-size: 12px; color: #64748b; margin-bottom: 4px; }');
    htmlParts.push('        .info-value { font-size: 16px; font-weight: 600; color: #1e293b; }');
    htmlParts.push('        .score-summary { background: linear-gradient(135deg, #29CC57 0%, #3de068 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }');
    htmlParts.push('        .overall-score { font-size: 64px; font-weight: 800; margin: 10px 0; }');
    htmlParts.push('        .pathway-level { font-size: 24px; font-weight: 600; margin-top: 10px; }');
    htmlParts.push('        .section { margin-bottom: 30px; }');
    htmlParts.push('        .section-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }');
    htmlParts.push('        .dimension-scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }');
    htmlParts.push('        .dimension-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #29CC57; }');
    htmlParts.push('        .dimension-name { font-size: 14px; color: #64748b; margin-bottom: 8px; }');
    htmlParts.push('        .dimension-score { font-size: 32px; font-weight: 700; color: #1e293b; }');
    htmlParts.push('        .sports-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }');
    htmlParts.push('        .sport-item { background: #f8fafc; padding: 15px; border-radius: 8px; border: 2px solid #e2e8f0; }');
    htmlParts.push('        .sport-name { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 5px; }');
    htmlParts.push('        .sport-match { font-size: 14px; color: #29CC57; font-weight: 600; }');
    htmlParts.push('        .recommendations { background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #ff7a45; }');
    htmlParts.push('        .recommendation-item { margin-bottom: 15px; padding-left: 20px; position: relative; }');
    htmlParts.push('        .recommendation-item::before { content: "•"; position: absolute; left: 0; color: #ff7a45; font-size: 20px; }');
    htmlParts.push('        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px; }');
    htmlParts.push('        .action-buttons { margin-top: 20px; text-align: center; }');
    htmlParts.push('        .btn { display: inline-block; padding: 12px 24px; margin: 0 10px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; border: none; transition: all 0.3s; }');
    htmlParts.push('        .btn-primary { background: linear-gradient(135deg, #29CC57 0%, #3de068 100%); color: white; }');
    htmlParts.push('        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(41, 204, 87, 0.3); }');
    htmlParts.push('        .btn-secondary { background: white; color: #1e293b; border: 2px solid #e2e8f0; }');
    htmlParts.push('        @media print { body { background: white; padding: 0; } .report-container { box-shadow: none; } .action-buttons { display: none; } }');
    htmlParts.push('    <' + '/style>');
    htmlParts.push('<' + '/head>');
    htmlParts.push('<body>');
    htmlParts.push('    <div class="report-container">');
    htmlParts.push('        <div class="report-header">');
    htmlParts.push('            <div class="report-title">儿童运动天赋评估报告<' + '/div>');
    htmlParts.push('            <div class="report-subtitle">专业版 · 生成时间: ' + new Date().toLocaleString('zh-CN') + '<' + '/div>');
    htmlParts.push('        <' + '/div>');

    // 儿童信息
    htmlParts.push('        <div class="child-info">');
    htmlParts.push('            <div class="info-item"><div class="info-label">姓名</div><div class="info-value">' + input.child.name + '</div><' + '/div>');
    htmlParts.push('            <div class="info-item"><div class="info-label">性别</div><div class="info-value">' + (input.child.gender === 'male' ? '男' : '女') + '</div><' + '/div>');
    htmlParts.push('            <div class="info-item"><div class="info-label">年龄</div><div class="info-value">' + input.child.age + ' 岁</div><' + '/div>');
    if (input.child.height) {
        htmlParts.push('            <div class="info-item"><div class="info-label">身高</div><div class="info-value">' + input.child.height + ' cm</div><' + '/div>');
    }
    if (input.child.weight) {
        htmlParts.push('            <div class="info-item"><div class="info-label">体重</div><div class="info-value">' + input.child.weight + ' kg</div><' + '/div>');
    }
    htmlParts.push('        <' + '/div>');

    // 综合评分
    htmlParts.push('        <div class="score-summary">');
    htmlParts.push('            <div style="font-size: 18px; opacity: 0.95;">综合评分<' + '/div>');
    htmlParts.push('            <div class="overall-score">' + result.overall + '<' + '/div>');
    htmlParts.push('            <div class="pathway-level">' + (pathwayText[result.pathway] || result.pathway) + '<' + '/div>');
    htmlParts.push('        <' + '/div>');

    // 维度得分
    htmlParts.push('        <div class="section">');
    htmlParts.push('            <div class="section-title">维度得分详情<' + '/div>');
    htmlParts.push('            <div class="dimension-scores">');
    htmlParts.push('                <div class="dimension-card"><div class="dimension-name">遗传潜力</div><div class="dimension-score">' + result.scores.genetic + '</div><' + '/div>');
    htmlParts.push('                <div class="dimension-card"><div class="dimension-name">当前能力</div><div class="dimension-score">' + result.scores.current + '</div><' + '/div>');
    htmlParts.push('                <div class="dimension-card"><div class="dimension-name">专项技能</div><div class="dimension-score">' + result.scores.specialty + '</div><' + '/div>');
    htmlParts.push('                <div class="dimension-card"><div class="dimension-name">身体状况</div><div class="dimension-score">' + result.scores.physical + '</div><' + '/div>');
    htmlParts.push('                <div class="dimension-card"><div class="dimension-name">心理特征</div><div class="dimension-score">' + result.scores.psychology + '</div><' + '/div>');
    htmlParts.push('            <' + '/div>');
    htmlParts.push('        <' + '/div>');

    // 推荐运动项目
    htmlParts.push('        <div class="section">');
    htmlParts.push('            <div class="section-title">推荐运动项目<' + '/div>');
    htmlParts.push('            <div class="sports-list">');
    result.suitableSports.slice(0, 6).forEach(sport => {
        htmlParts.push('                <div class="sport-item">');
        htmlParts.push('                    <div class="sport-name">' + getSportName(sport) + '<' + '/div>');
        // Removed matchScore because it's not available in the string array
        htmlParts.push('                    <div class="sport-match">强烈推荐<' + '/div>');
        htmlParts.push('                <' + '/div>');
    });
    htmlParts.push('            <' + '/div>');
    htmlParts.push('        <' + '/div>');

    // 专业建议
    htmlParts.push('        <div class="section">');
    htmlParts.push('            <div class="section-title">专业建议<' + '/div>');
    htmlParts.push('            <div class="recommendations">');
    result.recommendations.forEach(rec => {
        htmlParts.push('                <div class="recommendation-item">' + rec + '<' + '/div>');
    });
    htmlParts.push('            <' + '/div>');
    htmlParts.push('        <' + '/div>');

    // 页脚
    htmlParts.push('        <div class="footer">');
    htmlParts.push('            <p><strong>声明：</strong>本报告基于科学评估模型生成，仅供专业参考。<' + '/p>');
    htmlParts.push('            <p>最终训练方案应结合儿童实际情况，由专业教练制定。<' + '/p>');
    htmlParts.push('        <' + '/div>');

    // 操作按钮
    htmlParts.push('        <div class="action-buttons">');
    htmlParts.push('            <button class="btn btn-primary" onclick="window.print()">打印报告<' + '/button>');
    htmlParts.push('            <button class="btn btn-secondary" onclick="window.close()">关闭<' + '/button>');
    htmlParts.push('        <' + '/div>');
    htmlParts.push('    <' + '/div>');
    htmlParts.push('<' + '/body>');
    htmlParts.push('<' + '/html>');

    const reportHTML = htmlParts.join('\n');
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
}

function createLoadingElement() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"><' + '/div>';
    document.body.appendChild(loading);
    return loading;
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function () {
    detectDevice();
    updateButtonState();
    setupKeyboardShortcuts();

    // 监听窗口大小变化
    window.addEventListener('resize', detectDevice);

    // 添加输入事件监听器
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', function (this: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
            if (this.id) {
                formData[this.id] = this.value;
            }
        });
    });

    // 添加一些演示数据
    setTimeout(() => {
        const childName = document.getElementById('childName') as HTMLInputElement;
        if (childName && childName.value === '') {
            childName.value = '小明';
            formData['childName'] = '小明';

            const birthDate = document.getElementById('birthDate') as HTMLInputElement;
            if (birthDate) { birthDate.value = '2015-05-15'; formData['birthDate'] = '2015-05-15'; }

            const height = document.getElementById('height') as HTMLInputElement;
            if (height) { height.value = '125'; formData['height'] = '125'; }

            const weight = document.getElementById('weight') as HTMLInputElement;
            if (weight) { weight.value = '28'; formData['weight'] = '28'; }

            const fatherHeight = document.getElementById('fatherHeight') as HTMLInputElement;
            if (fatherHeight) { fatherHeight.value = '175'; formData['fatherHeight'] = '175'; }

            const motherHeight = document.getElementById('motherHeight') as HTMLInputElement;
            if (motherHeight) { motherHeight.value = '160'; formData['motherHeight'] = '160'; }
        }
    }, 1000);
});
