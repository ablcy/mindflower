// js/achievements.js - 成就系统

const AchievementManager = {
    achievements: [
        {
            id: 'first_flower',
            name: '初次开花',
            description: '完成第一朵花的培育',
            icon: '🏆',
            condition: (stats) => stats.totalFlowers >= 1,
            unlocked: false
        },
        {
            id: 'garden_master',
            name: '花园大师',
            description: '累计培育10朵花',
            icon: '🏅',
            condition: (stats) => stats.totalFlowers >= 10,
            unlocked: false
        },
        {
            id: 'focus_master',
            name: '专注达人',
            description: '累计专注24小时',
            icon: '🎯',
            condition: (stats) => stats.totalFocusTime >= 24 * 60 * 60, // 24小时（秒）
            unlocked: false
        },
        {
            id: 'early_bird',
            name: '早起鸟儿',
            description: '早上6-9点专注',
            icon: '🐦',
            condition: (stats) => stats.earlyBird,
            unlocked: false
        },
        {
            id: 'night_owl',
            name: '夜猫子',
            description: '晚上10点后专注',
            icon: '🦉',
            condition: (stats) => stats.nightOwl,
            unlocked: false
        },
        {
            id: 'speed_growth',
            name: '快速生长',
            description: '1小时内完成一朵花',
            icon: '⚡',
            condition: (stats) => stats.fastestFlower <= 3600, // 1小时内（秒）
            unlocked: false
        },
        {
            id: 'variety',
            name: '百花齐放',
            description: '培育5种不同花卉',
            icon: '🌈',
            condition: (stats) => stats.flowerTypes >= 5,
            unlocked: false
        },
        {
            id: 'dedication',
            name: '持之以恒',
            description: '连续7天专注',
            icon: '💎',
            condition: (stats) => stats.consecutiveDays >= 7,
            unlocked: false
        },
        {
            id: 'century',
            name: '百年好合',
            description: '累计专注100小时',
            icon: '💯',
            condition: (stats) => stats.totalFocusTime >= 100 * 60 * 60,
            unlocked: false
        },
        {
            id: 'gardener',
            name: '园丁大师',
            description: '累计培育50朵花',
            icon: '👑',
            condition: (stats) => stats.totalFlowers >= 50,
            unlocked: false
        }
    ],

    // 初始化
    init() {
        this.loadFromStorage();
    },

    // 检查成就
    checkAchievements(flowers, focusTime) {
        const stats = this.calculateStats(flowers, focusTime);
        const newUnlocks = [];

        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(stats)) {
                achievement.unlocked = true;
                newUnlocks.push(achievement);
            }
        });

        if (newUnlocks.length > 0) {
            this.saveToStorage();
            this.showUnlockNotification(newUnlocks);
        }

        return newUnlocks;
    },

    // 计算统计数据
    calculateStats(flowers, focusTime) {
        const totalFlowers = flowers.filter(f => FlowerManager.isFulyGrown(f)).length;
        
        // 计算花卉种类
        const flowerTypesSet = new Set();
        flowers.forEach(f => {
            if (FlowerManager.isFulyGrown(f)) {
                flowerTypesSet.add(f.typeId);
            }
        });

        // 计算最快开花时间
        let fastestFlower = Infinity;
        flowers.forEach(f => {
            if (FlowerManager.isFulyGrown(f)) {
                const plantedTime = new Date(f.plantedDate).getTime();
                const growthTime = f.totalFocusTime;
                if (growthTime < fastestFlower) {
                    fastestFlower = growthTime;
                }
            }
        });

        return {
            totalFlowers,
            totalFocusTime: focusTime,
            flowerTypes: flowerTypesSet.size,
            fastestFlower: fastestFlower === Infinity ? null : fastestFlower,
            earlyBird: this.checkEarlyBird(),
            nightOwl: this.checkNightOwl(),
            consecutiveDays: this.calculateConsecutiveDays(flowers)
        };
    },

    // 检查早起
    checkEarlyBird() {
        const hour = new Date().getHours();
        return hour >= 6 && hour < 9;
    },

    // 检查夜猫子
    checkNightOwl() {
        const hour = new Date().getHours();
        return hour >= 22 || hour < 6;
    },

    // 计算连续天数
    calculateConsecutiveDays(flowers) {
        if (flowers.length === 0) return 0;

        const dates = flowers.map(f => {
            const date = new Date(f.plantedDate);
            return date.toDateString();
        });

        const uniqueDates = [...new Set(dates)].sort();

        let maxConsecutive = 1;
        let currentConsecutive = 1;

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i - 1]);
            const currDate = new Date(uniqueDates[i]);
            const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentConsecutive++;
                maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
            } else {
                currentConsecutive = 1;
            }
        }

        return maxConsecutive;
    },

    // 显示解锁通知
    showUnlockNotification(unlocked) {
        unlocked.forEach(achievement => {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">${achievement.icon}</span>
                    <div class="notification-text">
                        <strong>成就解锁！</strong>
                        <p>${achievement.name}</p>
                    </div>
                </div>
            `;

            // 添加样式
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideDown 0.5s ease-out;
                max-width: 400px;
                width: 90%;
            `;

            document.body.appendChild(notification);

            // 3秒后移除
            setTimeout(() => {
                notification.style.animation = 'slideUp 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        });

        // 添加动画样式
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        transform: translate(-50%, -100%);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                    to {
                        transform: translate(-50%, -100%);
                        opacity: 0;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .notification-icon {
                    font-size: 40px;
                }
                .notification-text {
                    flex: 1;
                }
                .notification-text strong {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 5px;
                    opacity: 0.9;
                }
                .notification-text p {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                }
            `;
            document.head.appendChild(style);
        }
    },

    // 获取所有成就
    getAllAchievements() {
        return this.achievements;
    },

    // 保存到本地存储
    saveToStorage() {
        const data = this.achievements.map(a => ({
            id: a.id,
            unlocked: a.unlocked
        }));
        localStorage.setItem('achievements', JSON.stringify(data));
    },

    // 从本地存储加载
    loadFromStorage() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                data.forEach(savedAchievement => {
                    const achievement = this.achievements.find(a => a.id === savedAchievement.id);
                    if (achievement) {
                        achievement.unlocked = savedAchievement.unlocked;
                    }
                });
            } catch (e) {
                console.error('Failed to load achievements:', e);
            }
        }
    },

    // 获取解锁数量
    getUnlockedCount() {
        return this.achievements.filter(a => a.unlocked).length;
    }
};

// 初始化
AchievementManager.init();
