// js/app.js - 主应用逻辑

const App = {
    currentScreen: 'splash-screen',
    flowers: [],
    currentFlower: null,
    isFocusing: false,
    timerInterval: null,
    remainingTime: 0,
    totalFocusTime: 0, // 今日专注时间（秒）
    
    // 初始化应用
    init() {
        console.log('初始化应用...');
        
        // 加载数据
        this.loadData();
        
        // 初始化天气
        WeatherManager.init(localStorage.getItem('city') || '北京');
        
        // 显示启动画面
        setTimeout(() => {
            this.hideScreen('splash-screen');
            this.showScreen('home-screen');
            this.updateHomeScreen();
        }, 2000);
        
        // 绑定事件
        this.bindEvents();
        
        // 更新统计
        this.updateStats();
        
        console.log('应用初始化完成');
    },
    
    // 绑定事件
    bindEvents() {
        // 监听页面可见性变化（处理应用后台运行）
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 应用进入后台，保存数据
                this.saveData();
            } else {
                // 应用回到前台，重新计算生长
                this.recalculateGrowth();
            }
        });
        
        // 监听beforeunload（保存数据）
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });
    },
    
    // 显示屏幕
    showScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active', 'screen-enter');
        });
        
        // 显示目标屏幕
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active', 'screen-enter');
            
            // 移除动画类
            setTimeout(() => {
                targetScreen.classList.remove('screen-enter');
            }, 400);
        }
        
        // 更新底部导航
        this.updateBottomNav(screenId);
        
        // 更新当前屏幕
        this.currentScreen = screenId;
        
        // 根据屏幕执行相应更新
        this.handleScreenChange(screenId);
    },
    
    // 隐藏屏幕
    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('active');
        }
    },
    
    // 更新底部导航
    updateBottomNav(screenId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.screen === screenId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 控制底部导航显示/隐藏
        const bottomNav = document.getElementById('bottom-nav');
        if (screenId === 'focus-screen') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
        }
    },
    
    // 处理屏幕切换
    handleScreenChange(screenId) {
        switch (screenId) {
            case 'home-screen':
                this.updateHomeScreen();
                break;
            case 'select-flower-screen':
                this.renderFlowerList();
                break;
            case 'achievements-screen':
                this.renderAchievements();
                break;
            case 'stats-screen':
                this.updateStats();
                break;
            case 'settings-screen':
                this.updateSettingsScreen();
                break;
        }
    },
    
    // 更新首页
    updateHomeScreen() {
        const gardenGrid = document.getElementById('garden-grid');
        const totalFlowersEl = document.getElementById('total-flowers');
        const totalFocusTimeEl = document.getElementById('total-focus-time');
        const achievementCountEl = document.getElementById('achievement-count');
        
        // 更新统计数据
        if (totalFlowersEl) {
            const grownFlowers = this.flowers.filter(f => FlowerManager.isFulyGrown(f)).length;
            totalFlowersEl.textContent = grownFlowers;
        }
        
        if (totalFocusTimeEl) {
            const totalHours = Math.floor(this.calculateTotalFocusTime() / 3600);
            totalFocusTimeEl.textContent = totalHours;
        }
        
        if (achievementCountEl) {
            achievementCountEl.textContent = AchievementManager.getUnlockedCount();
        }
        
        // 渲染花园
        if (gardenGrid) {
            if (this.flowers.length === 0) {
                gardenGrid.innerHTML = `
                    <div class="empty-garden">
                        <span class="empty-icon">🌱</span>
                        <p>还没有花朵</p>
                        <p>开始专注，培育你的第一朵花吧！</p>
                    </div>
                `;
            } else {
                gardenGrid.innerHTML = this.flowers.map(flower => this.createFlowerCard(flower)).join('');
            }
        }
    },
    
    // 创建花朵卡片
    createFlowerCard(flower) {
        const icon = FlowerManager.getCurrentIcon(flower);
        const stageName = FlowerManager.getStageName(flower.currentStage);
        const progress = FlowerManager.calculateTotalProgress(flower);
        
        return `
            <div class="flower-card flower-stage-${flower.currentStage}" onclick="app.openFlowerDetail('${flower.id}')">
                <span class="flower-card-icon">${icon}</span>
                <span class="flower-card-name">${flower.name}</span>
                <span class="flower-card-stage">${stageName}</span>
                <div class="flower-card-progress">
                    <div class="flower-card-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    },
    
    // 渲染花卉列表
    renderFlowerList() {
        const flowerList = document.getElementById('flower-list');
        if (!flowerList) return;
        
        const flowerTypes = FlowerManager.getAllFlowerTypes();
        
        flowerList.innerHTML = flowerTypes.map(type => `
            <div class="flower-option" onclick="app.selectFlower('${type.id}')">
                <span class="flower-option-icon">${type.icon}</span>
                <span class="flower-option-name">${type.name}</span>
                <span class="flower-option-desc">${type.description}</span>
            </div>
        `).join('');
    },
    
    // 选择花卉
    selectFlower(flowerTypeId) {
        // 创建新花朵
        const flower = FlowerManager.createFlower(flowerTypeId);
        this.currentFlower = flower;
        
        // 跳转到专注屏幕
        this.showScreen('focus-screen');
        
        // 初始化专注界面
        this.initFocusScreen(flower);
    },
    
    // 初始化专注界面
    initFocusScreen(flower) {
        const flowerType = FlowerManager.getFlowerTypeById(flower.typeId);
        const focusFlower = document.getElementById('focus-flower');
        const growthStageLabel = document.getElementById('growth-stage-label');
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSeconds = document.getElementById('timer-seconds');
        
        if (focusFlower) {
            focusFlower.textContent = FlowerManager.getCurrentIcon(flower);
            focusFlower.classList.remove('growing');
        }
        
        if (growthStageLabel) {
            growthStageLabel.textContent = FlowerManager.getStageName(flower.currentStage);
        }
        
        // 设置计时器
        const defaultTime = parseInt(localStorage.getItem('defaultFocusTime') || '25') * 60;
        this.remainingTime = defaultTime;
        this.updateTimerDisplay();
        
        // 更新天气显示
        WeatherManager.updateWeatherDisplay();
    },
    
    // 开始专注
    startFocus() {
        if (this.isFocusing) return;
        
        this.isFocusing = true;
        this.currentFlower.isGrowing = true;
        this.currentFlower.stageStartTime = Date.now();
        
        // 更新按钮状态
        const startBtn = document.querySelector('.control-btn.primary');
        if (startBtn) {
            startBtn.textContent = '专注中...';
            startBtn.disabled = true;
        }
        
        // 添加生长动画
        const focusFlower = document.getElementById('focus-flower');
        if (focusFlower) {
            focusFlower.classList.add('growing');
        }
        
        // 开始计时器
        this.timerInterval = setInterval(() => {
            this.tickTimer();
        }, 1000);
        
        // 保存数据
        this.saveData();
    },
    
    // 暂停专注
    pauseFocus() {
        if (!this.isFocusing) return;
        
        this.isFocusing = false;
        
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 更新按钮状态
        const startBtn = document.querySelector('.control-btn.primary');
        if (startBtn) {
            startBtn.textContent = '▶️ 继续';
            startBtn.disabled = false;
        }
        
        // 移除生长动画
        const focusFlower = document.getElementById('focus-flower');
        if (focusFlower) {
            focusFlower.classList.remove('growing');
            focusFlower.classList.add('focus-pause');
        }
        
        // 保存数据
        this.saveData();
    },
    
    // 停止专注
    stopFocus() {
        if (!confirm('确定要放弃当前花朵吗？')) return;
        
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.isFocusing = false;
        this.currentFlower = null;
        
        // 返回首页
        this.showScreen('home-screen');
    },
    
    // 计时器滴答
    tickTimer() {
        this.remainingTime--;
        
        // 更新花朵生长
        this.updateFlowerGrowth(1);
        
        // 更新计时器显示
        this.updateTimerDisplay();
        
        // 检查是否结束
        if (this.remainingTime <= 0) {
            this.completeFocus();
        }
        
        // 保存数据（每10秒保存一次）
        if (this.remainingTime % 10 === 0) {
            this.saveData();
        }
    },
    
    // 更新花朵生长
    updateFlowerGrowth(deltaTime) {
        if (!this.currentFlower || !this.currentFlower.isGrowing) return;
        
        const weather = WeatherManager.getCurrentWeather();
        const updatedFlower = FlowerManager.updateFlowerGrowth(
            this.currentFlower,
            deltaTime,
            weather.bonus
        );
        
        this.currentFlower = updatedFlower;
        
        // 更新界面
        const focusFlower = document.getElementById('focus-flower');
        const growthStageLabel = document.getElementById('growth-stage-label');
        
        if (focusFlower) {
            const oldIcon = focusFlower.textContent;
            const newIcon = FlowerManager.getCurrentIcon(updatedFlower);
            
            if (oldIcon !== newIcon) {
                focusFlower.textContent = newIcon;
                focusFlower.classList.add('flower-grow');
                setTimeout(() => focusFlower.classList.remove('flower-grow'), 800);
            }
            
            // 更新阶段样式
            focusFlower.className = `focus-flower growing flower-stage-${updatedFlower.currentStage}`;
        }
        
        if (growthStageLabel) {
            growthStageLabel.textContent = FlowerManager.getStageName(updatedFlower.currentStage);
        }
        
        // 检查是否完成
        if (FlowerManager.isFulyGrown(updatedFlower)) {
            this.completeFlower();
        }
    },
    
    // 更新计时器显示
    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSeconds = document.getElementById('timer-seconds');
        const timerProgress = document.getElementById('timer-progress');
        
        if (timerMinutes) {
            timerMinutes.textContent = minutes.toString().padStart(2, '0');
        }
        
        if (timerSeconds) {
            timerSeconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        // 更新进度环
        if (timerProgress) {
            const defaultTime = parseInt(localStorage.getItem('defaultFocusTime') || '25') * 60;
            const progress = 283 - (this.remainingTime / defaultTime) * 283;
            timerProgress.style.strokeDashoffset = progress;
        }
    },
    
    // 完成专注
    completeFocus() {
        // 停止计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.isFocusing = false;
        
        // 添加到花朵列表
        if (this.currentFlower) {
            this.flowers.push(this.currentFlower);
            this.saveData();
        }
        
        // 显示完成动画
        alert('🎉 专注完成！花朵已存入花园！');
        
        // 返回首页
        this.currentFlower = null;
        this.showScreen('home-screen');
    },
    
    // 完成花朵培育
    completeFlower() {
        if (!this.currentFlower) return;
        
        // 播放完成动画
        const focusFlower = document.getElementById('focus-flower');
        if (focusFlower) {
            focusFlower.classList.add('flower-complete');
        }
        
        // 显示通知
        setTimeout(() => {
            alert('🎉 恭喜！你的花朵已经完全绽放！');
            
            // 添加到花朵列表
            this.flowers.push(this.currentFlower);
            this.saveData();
            
            // 检查成就
            AchievementManager.checkAchievements(this.flowers, this.calculateTotalFocusTime());
            
            // 返回首页
            this.currentFlower = null;
            this.isFocusing = false;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            this.showScreen('home-screen');
        }, 1500);
    },
    
    // 打开花朵详情
    openFlowerDetail(flowerId) {
        const flower = this.flowers.find(f => f.id === flowerId);
        if (!flower) return;
        
        this.currentFlower = flower;
        
        // 更新详情界面
        const detailFlowerName = document.getElementById('detail-flower-name');
        const detailFlowerDisplay = document.getElementById('detail-flower-display');
        const detailVariety = document.getElementById('detail-variety');
        const detailStage = document.getElementById('detail-stage');
        const detailFocusTime = document.getElementById('detail-focus-time');
        const detailPlantDate = document.getElementById('detail-plant-date');
        const detailProgress = document.getElementById('detail-progress');
        
        if (detailFlowerName) detailFlowerName.textContent = '花朵详情';
        if (detailFlowerDisplay) {
            detailFlowerDisplay.textContent = FlowerManager.getCurrentIcon(flower);
            detailFlowerDisplay.className = `detail-flower-display flower-stage-${flower.currentStage}`;
        }
        if (detailVariety) detailVariety.textContent = flower.name;
        if (detailStage) detailStage.textContent = FlowerManager.getStageName(flower.currentStage);
        if (detailFocusTime) detailFocusTime.textContent = Math.floor(flower.totalFocusTime / 60) + ' 分钟';
        if (detailPlantDate) {
            const date = new Date(flower.plantedDate);
            detailPlantDate.textContent = date.toISOString().split('T')[0];
        }
        if (detailProgress) {
            const progress = FlowerManager.calculateTotalProgress(flower);
            detailProgress.style.width = progress + '%';
            detailProgress.className = `progress-fill stage-${flower.currentStage}`;
        }
        
        // 显示详情屏幕
        this.showScreen('flower-detail-screen');
    },
    
    // 继续专注
    continueFocus() {
        if (!this.currentFlower) return;
        
        // 检查是否已完成
        if (FlowerManager.isFulyGrown(this.currentFlower)) {
            alert('这朵花已经完全绽放了！');
            return;
        }
        
        // 跳转到专注屏幕
        this.showScreen('focus-screen');
        this.initFocusScreen(this.currentFlower);
    },
    
    // 删除花朵
    deleteFlower() {
        if (!this.currentFlower) return;
        
        if (!confirm('确定要删除这朵花吗？此操作不可恢复。')) return;
        
        const index = this.flowers.findIndex(f => f.id === this.currentFlower.id);
        if (index > -1) {
            this.flowers.splice(index, 1);
            this.saveData();
        }
        
        this.currentFlower = null;
        this.showScreen('home-screen');
    },
    
    // 渲染成就列表
    renderAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        const achievements = AchievementManager.getAllAchievements();
        
        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-desc">${achievement.description}</span>
                </div>
            </div>
        `).join('');
    },
    
    // 更新统计
    updateStats() {
        const todayFocus = document.getElementById('today-focus');
        const weekFocus = document.getElementById('week-focus');
        const totalFocus = document.getElementById('total-focus');
        const totalFlowersStats = document.getElementById('total-flowers-stats');
        
        if (todayFocus) {
            const todaySeconds = this.calculateTodayFocusTime();
            todayFocus.textContent = Math.floor(todaySeconds / 60) + ' 分钟';
        }
        
        if (weekFocus) {
            const weekSeconds = this.calculateWeekFocusTime();
            weekFocus.textContent = Math.floor(weekSeconds / 60) + ' 分钟';
        }
        
        if (totalFocus) {
            const totalSeconds = this.calculateTotalFocusTime();
            totalFocus.textContent = Math.floor(totalSeconds / 3600) + ' 小时';
        }
        
        if (totalFlowersStats) {
            const grownFlowers = this.flowers.filter(f => FlowerManager.isFulyGrown(f)).length;
            totalFlowersStats.textContent = grownFlowers + ' 朵';
        }
    },
    
    // 计算今日专注时间
    calculateTodayFocusTime() {
        const today = new Date().toDateString();
        let total = 0;
        
        this.flowers.forEach(flower => {
            const plantedDate = new Date(flower.plantedDate).toDateString();
            if (plantedDate === today) {
                total += flower.totalFocusTime;
            }
        });
        
        return total;
    },
    
    // 计算本周专注时间
    calculateWeekFocusTime() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        let total = 0;
        this.flowers.forEach(flower => {
            const plantedDate = new Date(flower.plantedDate);
            if (plantedDate >= weekStart) {
                total += flower.totalFocusTime;
            }
        });
        
        return total;
    },
    
    // 计算总专注时间
    calculateTotalFocusTime() {
        let total = 0;
        this.flowers.forEach(flower => {
            total += flower.totalFocusTime;
        });
        return total;
    },
    
    // 更新设置屏幕
    updateSettingsScreen() {
        const cityInput = document.getElementById('city-input');
        const defaultFocusTime = document.getElementById('default-focus-time');
        
        if (cityInput) {
            cityInput.value = localStorage.getItem('city') || '北京';
        }
        
        if (defaultFocusTime) {
            defaultFocusTime.value = localStorage.getItem('defaultFocusTime') || '25';
        }
        
        WeatherManager.updateWeatherDisplay();
    },
    
    // 保存城市
    saveCity() {
        const cityInput = document.getElementById('city-input');
        if (!cityInput) return;
        
        const city = cityInput.value.trim();
        if (!city) {
            alert('请输入城市名称');
            return;
        }
        
        localStorage.setItem('city', city);
        WeatherManager.setCity(city).then(() => {
            WeatherManager.updateWeatherDisplay();
            alert('城市设置已保存！');
        });
    },
    
    // 保存默认专注时间
    saveDefaultFocusTime() {
        const defaultFocusTime = document.getElementById('default-focus-time');
        if (!defaultFocusTime) return;
        
        const time = parseInt(defaultFocusTime.value);
        if (isNaN(time) || time < 1 || time > 180) {
            alert('请输入1-180之间的数字');
            return;
        }
        
        localStorage.setItem('defaultFocusTime', time.toString());
        alert('默认专注时间已保存！');
    },
    
    // 切换暗色模式
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    },
    
    // 播放声音
    playSound(type) {
        // 实际项目中应该使用真实的音频文件
        // 这里使用 Web Audio API 生成简单的音效
        console.log('播放声音：', type);
        alert(`正在播放${type}音效...（实际项目中会播放真实音频）`);
    },
    
    // 停止声音
    stopSound() {
        console.log('停止声音');
        alert('已停止播放');
    },
    
    // 打开设置
    openSettings() {
        this.showScreen('settings-screen');
    },
    
    // 重新计算生长
    recalculateGrowth() {
        if (!this.currentFlower || !this.currentFlower.isGrowing) return;
        
        const now = Date.now();
        const elapsed = (now - this.currentFlower.stageStartTime) / 1000;
        
        if (elapsed > 0) {
            this.updateFlowerGrowth(elapsed);
        }
    },
    
    // 保存数据
    saveData() {
        const data = {
            flowers: this.flowers,
            currentFlower: this.currentFlower,
            version: 'v0.0.1'
        };
        localStorage.setItem('flowerAppData', JSON.stringify(data));
    },
    
    // 加载数据
    loadData() {
        const saved = localStorage.getItem('flowerAppData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.flowers = data.flowers || [];
                this.currentFlower = data.currentFlower || null;
            } catch (e) {
                console.error('Failed to load data:', e);
            }
        }
        
        // 加载暗色模式
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
