// js/weather.js - 天气系统

const WeatherManager = {
    currentWeather: 'sunny', // sunny, rainy, cloudy
    city: '北京',
    
    // 天气图标映射
    weatherIcons: {
        sunny: '☀️',
        rainy: '🌧️',
        cloudy: '☁️'
    },
    
    // 天气名称映射
    weatherNames: {
        sunny: '晴天',
        rainy: '雨天',
        cloudy: '多云'
    },
    
    // 生长速度加成
    growthBonuses: {
        sunny: { min: 1.0, max: 1.2 },
        rainy: { min: 1.2, max: 1.5 },
        cloudy: { min: 0.9, max: 1.1 }
    },
    
    // 初始化
    init(city) {
        this.city = city || '北京';
        this.fetchWeather();
    },
    
    // 获取天气数据（模拟API，实际应该使用真实天气API）
    async fetchWeather() {
        // 模拟API调用
        // 实际项目中应该使用：
        // - OpenWeatherMap API
        // - 和风天气 API
        // - 高德天气 API
        
        // 这里使用随机天气模拟
        const weatherTypes = ['sunny', 'rainy', 'cloudy'];
        const randomIndex = Math.floor(Math.random() * weatherTypes.length);
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.currentWeather = weatherTypes[randomIndex];
        this.saveToStorage();
        
        return {
            weather: this.currentWeather,
            icon: this.weatherIcons[this.currentWeather],
            name: this.weatherNames[this.currentWeather],
            bonus: this.getGrowthBonus()
        };
    },
    
    // 设置城市
    setCity(city) {
        this.city = city;
        this.saveToStorage();
        return this.fetchWeather();
    },
    
    // 获取生长加成
    getGrowthBonus() {
        const bonus = this.growthBonuses[this.currentWeather];
        // 返回随机加成值（模拟真实天气变化）
        return bonus.min + Math.random() * (bonus.max - bonus.min);
    },
    
    // 更新天气显示
    updateWeatherDisplay() {
        const weatherInfo = document.getElementById('weather-info');
        const weatherDisplay = document.getElementById('weather-display');
        const bonus = this.getGrowthBonus();
        
        if (weatherInfo) {
            weatherInfo.innerHTML = `
                <span>${this.weatherIcons[this.currentWeather]}</span>
                <span class="growth-bonus">生长 +${Math.round(bonus * 100)}%</span>
            `;
        }
        
        if (weatherDisplay) {
            weatherDisplay.innerHTML = `
                <span class="weather-icon">${this.weatherIcons[this.currentWeather]}</span>
                <span class="weather-text">${this.weatherNames[this.currentWeather]} 生长 +${Math.round(bonus * 100)}%</span>
            `;
        }
    },
    
    // 保存到本地存储
    saveToStorage() {
        const weatherData = {
            currentWeather: this.currentWeather,
            city: this.city,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('weatherData', JSON.stringify(weatherData));
    },
    
    // 从本地存储加载
    loadFromStorage() {
        const saved = localStorage.getItem('weatherData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentWeather = data.currentWeather || 'sunny';
                this.city = data.city || '北京';
            } catch (e) {
                console.error('Failed to load weather data:', e);
            }
        }
    },
    
    // 获取当前天气信息
    getCurrentWeather() {
        return {
            weather: this.currentWeather,
            icon: this.weatherIcons[this.currentWeather],
            name: this.weatherNames[this.currentWeather],
            bonus: this.getGrowthBonus(),
            city: this.city
        };
    }
};

// 初始化时加载保存的天气数据
WeatherManager.loadFromStorage();
