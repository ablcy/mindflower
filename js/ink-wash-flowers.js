// 水墨手绘风格花卉插图 - 心流花园
// 使用SVG创建中国传统水墨画风格的花卉插图

const InkWashFlowers = {
    // 生成花卉SVG - 水墨手绘风格
    createFlowerSVG(flowerType, stage, size = 200) {
        const flower = FlowerManager.flowerTypes.find(f => f.id === flowerType);
        if (!flower) return '';
        
        const stageNames = ['seed', 'sprout', 'leaf', 'bud', 'bloom', 'full'];
        const currentStage = stageNames[stage] || 'seed';
        
        // 根据花卉类型和生长阶段生成对应的SVG
        switch(flowerType) {
            case 'sunflower': return this.drawSunflower(currentStage, size);
            case 'rose': return this.drawRose(currentStage, size);
            case 'chrysanthemum': return this.drawChrysanthemum(currentStage, size);
            case 'lotus': return this.drawLotus(currentStage, size);
            case 'tulip': return this.drawTulip(currentStage, size);
            case 'peony': return this.drawPeony(currentStage, size);
            case 'jasmine': return this.drawJasmine(currentStage, size);
            case 'azalea': return this.drawAzalea(currentStage, size);
            case 'lavender': return this.drawLavender(currentStage, size);
            case 'orchid': return this.drawOrchid(currentStage, size);
            default: return this.drawDefault(currentStage, size);
        }
    },
    
    // 水墨画笔触效果 - 使用SVG滤镜
    getInkFilter() {
        return `
            <defs>
                <filter id="ink-wash" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                    <feGaussianBlur stdDeviation="0.5"/>
                </filter>
                <filter id="ink-bleed">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.7"/>
                    </feComponentTransfer>
                </filter>
            </defs>
        `;
    },
    
    // 向日葵 - 水墨风格
    drawSunflower(stage, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        // 根据生长阶段绘制
        if (stage === 'seed') {
            // 种子阶段 - 简单的一颗种子
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="8" ry="10" fill="#2c2c2c" opacity="0.8" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX-2} ${centerY-10} Q ${centerX} ${centerY-15} ${centerX+2} ${centerY-10}" stroke="#2c2c2c" stroke-width="1" fill="none" opacity="0.6"/>`;
        } else if (stage === 'sprout') {
            // 发芽阶段 - 破土而出
            svg += `<path d="M ${centerX} ${size-30} Q ${centerX-5} ${centerY+20} ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="12" ry="8" fill="#5a7247" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf') {
            // 长叶阶段 - 茎和叶子
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-30}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX-25} ${centerY-10} ${centerX-20} ${centerY+15}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX+25} ${centerY-10} ${centerX+20} ${centerY+15}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<circle cx="${centerX}" cy="${centerY-20}" r="8" fill="#c4a535" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'bud') {
            // 花苞阶段
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-40}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-20} Q ${centerX-30} ${centerY-30} ${centerX} ${centerY-40}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-50}" rx="15" ry="20" fill="#c4a535" opacity="0.8" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-50}" rx="10" ry="15" fill="#8B4513" opacity="0.6" filter="url(#ink-wash)"/>`;
        } else {
            // 开花/茂盛阶段 - 完整的向日葵
            const petalCount = stage === 'bloom' ? 12 : 16;
            const petalLength = stage === 'bloom' ? 30 : 40;
            
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY+30}" stroke="#2c2c2c" stroke-width="3" fill="none" filter="url(#ink-wash)"/>`;
            
            // 花瓣
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * 360 / petalCount) * Math.PI / 180;
                const x1 = centerX + Math.cos(angle) * 20;
                const y1 = centerY - 50 + Math.sin(angle) * 20;
                const x2 = centerX + Math.cos(angle) * (20 + petalLength);
                const y2 = centerY - 50 + Math.sin(angle) * (20 + petalLength);
                
                svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c4a535" stroke-width="4" stroke-linecap="round" opacity="0.8" filter="url(#ink-wash)"/>`;
            }
            
            // 花心
            svg += `<circle cx="${centerX}" cy="${centerY-50}" r="25" fill="#8B4513" opacity="0.8" filter="url(#ink-wash)"/>`;
            svg += `<circle cx="${centerX}" cy="${centerY-50}" r="20" fill="#2c2c2c" opacity="0.6" filter="url(#ink-wash)"/>`;
            
            // 叶子
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX-40} ${centerY-20} ${centerX-30} ${centerY+20}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX+40} ${centerY-20} ${centerX+30} ${centerY+20}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    // 玫瑰 - 水墨风格
    drawRose(stage, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        if (stage === 'seed') {
            svg += `<circle cx="${centerX}" cy="${centerY}" r="6" fill="#2c2c2c" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'sprout') {
            svg += `<path d="M ${centerX} ${size-30} Q ${centerX+5} ${centerY+20} ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="10" ry="7" fill="#c41e3a" opacity="0.6" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-10} Q ${centerX-20} ${centerY-15} ${centerX-15} ${centerY}" stroke="#5a7247" stroke-width="1.5" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-10} Q ${centerX+20} ${centerY-15} ${centerX+15} ${centerY}" stroke="#5a7247" stroke-width="1.5" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<circle cx="${centerX}" cy="${centerY-25}" r="8" fill="#c41e3a" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'bud') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-30}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-10} Q ${centerX-25} ${centerY-20} ${centerX-15} ${centerY+10}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-40}" rx="12" ry="18" fill="#c41e3a" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else {
            // 开花阶段 - 玫瑰花朵
            const petalLayers = stage === 'bloom' ? 3 : 4;
            
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            
            // 玫瑰花花瓣 - 层层叠叠
            for (let layer = 0; layer < petalLayers; layer++) {
                const radius = 15 + layer * 10;
                const petalCount = 5 + layer;
                
                for (let i = 0; i < petalCount; i++) {
                    const angle = (i * 360 / petalCount + layer * 30) * Math.PI / 180;
                    const x = centerX + Math.cos(angle) * radius * 0.3;
                    const y = centerY - 40 + Math.sin(angle) * radius * 0.3;
                    
                    svg += `<ellipse cx="${x}" cy="${y}" rx="${radius/2}" ry="${radius/3}" fill="#c41e3a" opacity="${0.9 - layer*0.2}" filter="url(#ink-wash)" transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"/>`;
                }
            }
            
            // 叶子
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX-35} ${centerY-15} ${centerX-25} ${centerY+20}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY} Q ${centerX+35} ${centerY-15} ${centerX+25} ${centerY+20}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    // 菊花 - 水墨风格
    drawChrysanthemum(stage, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        if (stage === 'seed') {
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="5" ry="7" fill="#2c2c2c" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'sprout') {
            svg += `<path d="M ${centerX} ${size-30} Q ${centerX-3} ${centerY+15} ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="8" ry="12" fill="#ffa500" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-25}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-10} Q ${centerX-22} ${centerY-15} ${centerX-18} ${centerY+10}" stroke="#5a7247" stroke-width="1.5" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<circle cx="${centerX}" cy="${centerY-30}" r="10" fill="#ffa500" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'bud') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-35}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<circle cx="${centerX}" cy="${centerY-45}" r="15" fill="#ffa500" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else {
            // 开花阶段 - 菊花花瓣
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            
            // 菊花花瓣 - 细长的花瓣
            const petalCount = stage === 'bloom' ? 20 : 30;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * 360 / petalCount) * Math.PI / 180;
                const innerX = centerX + Math.cos(angle) * 15;
                const innerY = centerY - 45 + Math.sin(angle) * 15;
                const outerX = centerX + Math.cos(angle) * 40;
                const outerY = centerY - 45 + Math.sin(angle) * 40;
                
                svg += `<line x1="${innerX}" y1="${innerY}" x2="${outerX}" y2="${outerY}" stroke="#ffa500" stroke-width="3" stroke-linecap="round" opacity="0.8" filter="url(#ink-wash)"/>`;
            }
            
            // 花心
            svg += `<circle cx="${centerX}" cy="${centerY-45}" r="15" fill="#8B4513" opacity="0.7" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    // 荷花 - 水墨风格
    drawLotus(stage, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        if (stage === 'seed') {
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="4" ry="6" fill="#2c2c2c" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'sprout') {
            // 荷花发芽 - 水面上的嫩芽
            svg += `<ellipse cx="${centerX}" cy="${centerY+40}" rx="50" ry="10" fill="#87ceeb" opacity="0.3" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY+30} Q ${centerX+5} ${centerY+10} ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="10" ry="15" fill="#ffb6c1" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf') {
            // 长叶子 - 荷叶
            svg += `<ellipse cx="${centerX}" cy="${centerY+50}" rx="60" ry="15" fill="#87ceeb" opacity="0.3" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY+40} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            // 荷叶
            svg += `<ellipse cx="${centerX-30}" cy="${centerY+20}" rx="25" ry="15" fill="#5a7247" opacity="0.6" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX+30}" cy="${centerY+25}" rx="20" ry="12" fill="#5a7247" opacity="0.6" filter="url(#ink-wash)"/>`;
        } else if (stage === 'bud') {
            // 花苞
            svg += `<ellipse cx="${centerX}" cy="${centerY+50}" rx="60" ry="15" fill="#87ceeb" opacity="0.3" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY+40} L ${centerX} ${centerY-30}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-40}" rx="12" ry="20" fill="#ffb6c1" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else {
            // 开花阶段 - 荷花
            svg += `<ellipse cx="${centerX}" cy="${centerY+60}" rx="70" ry="20" fill="#87ceeb" opacity="0.3" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY+50} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            
            // 荷花花瓣 - 粉色
            const petalCount = stage === 'bloom' ? 10 : 14;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * 360 / petalCount) * Math.PI / 180;
                const x = centerX + Math.cos(angle) * 30;
                const y = centerY - 40 + Math.sin(angle) * 30;
                
                svg += `<ellipse cx="${x}" cy="${y}" rx="10" ry="20" fill="#ffb6c1" opacity="0.8" filter="url(#ink-wash)" transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"/>`;
            }
            
            // 荷叶
            svg += `<ellipse cx="${centerX-40}" cy="${centerY+30}" rx="35" ry="20" fill="#5a7247" opacity="0.6" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX+40}" cy="${centerY+35}" rx="30" ry="18" fill="#5a7247" opacity="0.6" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    // 郁金香 - 水墨风格
    drawTulip(stage, size) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        if (stage === 'seed') {
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="4" ry="6" fill="#2c2c2c" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'sprout') {
            svg += `<path d="M ${centerX} ${size-30} Q ${centerX} ${centerY+20} ${centerX} ${centerY}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY}" rx="8" ry="12" fill="#ff69b4" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-5} L ${centerX-30} ${centerY+15}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY-5} L ${centerX+30} ${centerY+15}" stroke="#5a7247" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-25}" rx="10" ry="15" fill="#ff69b4" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else if (stage === 'bud') {
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-30}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-40}" rx="12" ry="20" fill="#ff69b4" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else {
            // 开花阶段 - 郁金香杯状花
            svg += `<path d="M ${centerX} ${size-20} L ${centerX} ${centerY-20}" stroke="#2c2c2c" stroke-width="2" fill="none" filter="url(#ink-wash)"/>`;
            
            // 郁金香花朵 - 杯状
            svg += `<ellipse cx="${centerX}" cy="${centerY-45}" rx="20" ry="30" fill="#ff69b4" opacity="0.8" filter="url(#ink-wash)"/>`;
            svg += `<ellipse cx="${centerX}" cy="${centerY-35}" rx="15" ry="20" fill="#ff1493" opacity="0.6" filter="url(#ink-wash)"/>`;
            
            // 叶子
            svg += `<path d="M ${centerX} ${centerY} L ${centerX-35} ${centerY+20}" stroke="#5a7247" stroke-width="2.5" fill="none" filter="url(#ink-wash)"/>`;
            svg += `<path d="M ${centerX} ${centerY} L ${centerX+35} ${centerY+20}" stroke="#5a7247" stroke-width="2.5" fill="none" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    // 为简洁起见，其他花卉使用类似模式
    // 实际使用时会完整实现所有10种花卉
    
    drawPeony(stage, size) { return this.drawRose(stage, size); },
    drawJasmine(stage, size) { return this.drawChrysanthemum(stage, size); },
    drawAzalea(stage, size) { return this.drawRose(stage, size); },
    drawLavender(stage, size) { return this.drawSimpleFlower(stage, size, '#9b59b6'); },
    drawOrchid(stage, size) { return this.drawSimpleFlower(stage, size, '#e74c3c'); },
    
    // 简单花卉绘制函数（用于尚未详细实现的花卉）
    drawSimpleFlower(stage, size, color) {
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
        svg += this.getInkFilter();
        
        if (stage === 'seed' || stage === 'sprout') {
            svg += `<circle cx="${centerX}" cy="${centerY}" r="8" fill="${color}" opacity="0.7" filter="url(#ink-wash)"/>`;
        } else if (stage === 'leaf' || stage === 'bud') {
            svg += `<circle cx="${centerX}" cy="${centerY-20}" r="15" fill="${color}" opacity="0.8" filter="url(#ink-wash)"/>`;
        } else {
            // 简单花朵
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * Math.PI / 180;
                const x = centerX + Math.cos(angle) * 25;
                const y = centerY - 40 + Math.sin(angle) * 25;
                svg += `<ellipse cx="${x}" cy="${y}" rx="8" ry="12" fill="${color}" opacity="0.8" filter="url(#ink-wash)"/>`;
            }
            svg += `<circle cx="${centerX}" cy="${centerY-40}" r="15" fill="${color}" opacity="0.9" filter="url(#ink-wash)"/>`;
        }
        
        svg += `</svg>`;
        return svg;
    },
    
    drawDefault(stage, size) {
        return this.drawSunflower(stage, size);
    }
};

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InkWashFlowers;
}
