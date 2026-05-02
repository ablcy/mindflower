// js/flowers.js - 花卉数据和逻辑

const FlowerManager = {
    // 花卉数据库
    flowerTypes: [
        {
            id: 'sunflower',
            name: '向日葵',
            icon: '🌻',
            description: '向着阳光生长',
            growthStages: ['🌱', '🌿', '🍃', '🌼', '🌻', '🌻'],
            growthTime: [10, 20, 20, 20, 30], // 每个阶段需要的时间（分钟）
            bonus: { sunny: 1.2, rainy: 1.0, cloudy: 1.0 }
        },
        {
            id: 'rose',
            name: '玫瑰',
            icon: '🌹',
            description: '爱之花朵',
            growthStages: ['🌱', '🌿', '🍃', '🌺', '🌹', '🌹'],
            growthTime: [15, 25, 20, 25, 35],
            bonus: { sunny: 1.0, rainy: 1.3, cloudy: 1.0 }
        },
        {
            id: 'chrysanthemum',
            name: '菊花',
            icon: '🌼',
            description: '秋日之花',
            growthStages: ['🌱', '🌿', '🍃', '🌾', '🌼', '🌼'],
            growthTime: [10, 20, 20, 20, 30],
            bonus: { sunny: 1.0, rainy: 1.2, cloudy: 1.1 }
        },
        {
            id: 'lotus',
            name: '荷花',
            icon: '🪷',
            description: '出淤泥而不染',
            growthStages: ['🌱', '🌿', '🍃', '🪻', '🪷', '🪷'],
            growthTime: [20, 30, 25, 30, 40],
            bonus: { sunny: 1.1, rainy: 1.5, cloudy: 1.0 }
        },
        {
            id: 'tulip',
            name: '郁金香',
            icon: '🌷',
            description: '荷兰国花',
            growthStages: ['🌱', '🌿', '🍃', '🌱', '🌷', '🌷'],
            growthTime: [10, 18, 18, 18, 25],
            bonus: { sunny: 1.3, rainy: 1.0, cloudy: 1.0 }
        },
        {
            id: 'peony',
            name: '牡丹',
            icon: '🌸',
            description: '花中之王',
            growthStages: ['🌱', '🌿', '🍃', '🌺', '🌸', '🌸'],
            growthTime: [20, 30, 25, 30, 45],
            bonus: { sunny: 1.2, rainy: 1.2, cloudy: 1.0 }
        },
        {
            id: 'jasmine',
            name: '茉莉花',
            icon: '🌺',
            description: '芬芳迷人',
            growthStages: ['🌱', '🌿', '🍃', '🌾', '🌺', '🌺'],
            growthTime: [10, 20, 15, 20, 25],
            bonus: { sunny: 1.0, rainy: 1.4, cloudy: 1.1 }
        },
        {
            id: 'azalea',
            name: '杜鹃花',
            icon: '🌺',
            description: '映山红',
            growthStages: ['🌱', '🌿', '🍃', '🌺', '🌺', '🌺'],
            growthTime: [12, 22, 20, 22, 32],
            bonus: { sunny: 1.1, rainy: 1.2, cloudy: 1.0 }
        },
        {
            id: 'lavender',
            name: '薰衣草',
            icon: '🌾',
            description: '紫色浪漫',
            growthStages: ['🌱', '🌿', '🍃', '🌾', '🌾', '🌾'],
            growthTime: [15, 25, 20, 25, 35],
            bonus: { sunny: 1.2, rainy: 1.1, cloudy: 1.0 }
        },
        {
            id: 'orchid',
            name: '兰花',
            icon: '🌸',
            description: '花中君子',
            growthStages: ['🌱', '🌿', '🍃', '🌼', '🌸', '🌸'],
            growthTime: [18, 28, 22, 28, 40],
            bonus: { sunny: 1.0, rainy: 1.3, cloudy: 1.2 }
        }
    ],

    // 获取所有花卉类型
    getAllFlowerTypes() {
        return this.flowerTypes;
    },

    // 根据ID获取花卉类型
    getFlowerTypeById(id) {
        return this.flowerTypes.find(f => f.id === id);
    },

    // 创建新花朵
    createFlower(flowerTypeId) {
        const flowerType = this.getFlowerTypeById(flowerTypeId);
        if (!flowerType) return null;

        return {
            id: Date.now().toString(),
            typeId: flowerTypeId,
            name: flowerType.name,
            icon: flowerType.icon,
            description: flowerType.description,
            currentStage: 0,
            growthProgress: 0, // 当前阶段的进度（0-100）
            totalFocusTime: 0, // 总专注时间（秒）
            plantedDate: new Date().toISOString(),
            isGrowing: false,
            stageStartTime: null,
            stageDurations: flowerType.growthTime.map(t => t * 60) // 转换为秒
        };
    },

    // 更新花朵生长
    updateFlowerGrowth(flower, deltaTime, weatherBonus = 1.0) {
        if (!flower.isGrowing) return flower;

        const updatedFlower = { ...flower };
        const currentStageDuration = updatedFlower.stageDurations[updatedFlower.currentStage];
        
        // 应用天气加成
        const adjustedDelta = deltaTime * weatherBonus;
        
        updatedFlower.totalFocusTime += deltaTime;
        updatedFlower.growthProgress += (adjustedDelta / currentStageDuration) * 100;

        // 检查是否进入下一阶段
        if (updatedFlower.growthProgress >= 100 && updatedFlower.currentStage < 5) {
            updatedFlower.growthProgress = 0;
            updatedFlower.currentStage += 1;
            
            // 如果到达最终阶段，停止生长
            if (updatedFlower.currentStage >= 5) {
                updatedFlower.isGrowing = false;
                updatedFlower.growthProgress = 100;
            }
        }

        return updatedFlower;
    },

    // 获取当前生长图标
    getCurrentIcon(flower) {
        const flowerType = this.getFlowerTypeById(flower.typeId);
        if (!flowerType) return '🌱';
        return flowerType.growthStages[flower.currentStage];
    },

    // 获取生长阶段名称
    getStageName(stage) {
        const stageNames = ['种子', '发芽', '长叶', '花苞', '开花', '茂盛'];
        return stageNames[stage] || '未知';
    },

    // 计算总生长进度
    calculateTotalProgress(flower) {
        const stageWeight = 100 / 6;
        return (flower.currentStage * stageWeight) + (flower.growthProgress / 6);
    },

    // 检查是否完成生长
    isFullyGrown(flower) {
        return flower.currentStage >= 5 && flower.growthProgress >= 100;
    },

    // 获取天气加成
    getWeatherBonus(flower, weather) {
        const flowerType = this.getFlowerTypeById(flower.typeId);
        if (!flowerType || !flowerType.bonus[weather]) return 1.0;
        return flowerType.bonus[weather];
    }
};
