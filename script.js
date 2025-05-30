// 生成50朵闪光花朵
const container = document.getElementById('heart-container');
const flowers = [];
const centerX = 150;
const centerY = 150;
const radius = 120;

// 心形曲线函数
function heartShape(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return { x: x * 10 + 160, y: y * 10 + 160 };
}

// 外部花朵图片路径
const flowerImages = [
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png",
    "images/6.png"
];

// 创建花朵元素
function createFlower(x, y, index) {
    const flower = document.createElement('img');
    flower.className = 'flower';
    flower.style.left = `${x + centerX}px`;
    flower.style.top = `${y + centerY}px`;
    
    // 随机选择花朵样式
    const flowerType = index % flowerImages.length;
    flower.src = flowerImages[flowerType];
    
    // 随机决定花朵大小：50%概率保持15px，50%概率放大到18.75px
    const size = Math.random() > 0.5 ? 15 : 18.75;
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    
    flower.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.3 + 0.7})`;
    
    // 闪光动画
    flower.style.animation = `sparkle ${Math.random() * 2 + 1}s infinite alternate`;
    flower.style.cursor = 'pointer';
    flower.style.pointerEvents = 'auto';  // 确保花朵可以接收点击事件
    
    container.appendChild(flower);
    return flower;
}

// 计算从2013.2.1到今天的天数
function calculateDays() {
    const startDate = new Date(2013, 1, 1); // 月份是0-based
    const today = new Date();
    const diffTime = today - startDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// 获取当前时间(24小时制)
function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().substring(0, 8);
}

// 创建天数和时间显示元素
function createDaysCounter() {
    const counterContainer = document.createElement('div');
    counterContainer.className = 'counter-container';
    counterContainer.style.position = 'absolute';
    counterContainer.style.top = '46%';
    counterContainer.style.left = '50%';
    counterContainer.style.transform = 'translate(-50%, -50%)';
    counterContainer.style.color = '#fff';
    counterContainer.style.textAlign = 'center';
    counterContainer.style.zIndex = '1000';
    counterContainer.id = 'counter-container';  // 添加ID以便后续操作
    let hue = 0;
    
    function updateGlowColor() {
        hue = (hue + 1) % 360;
        const color = `hsl(${hue}, 100%, 50%)`;
        counterContainer.style.textShadow = `
            0 0 5px #fff,
            0 0 10px ${color},
            0 0 20px ${color},
            0 0 30px ${color},
            0 0 40px ${color}
        `;
        counterContainer.style.transition = 'text-shadow 0.5s ease-in-out';
    }
    
    // 初始颜色
    updateGlowColor();
    // 每50毫秒更新一次颜色，实现平滑渐变
    setInterval(updateGlowColor, 50);
    
    counterContainer.style.width = '100%';
    counterContainer.style.padding = '0 20px';
    counterContainer.style.fontFamily = '"Arial Black", sans-serif';

    const daysCounter = document.createElement('div');
    daysCounter.textContent = `今天是我们认识的第${calculateDays()}天`;
    daysCounter.style.fontSize = '24px';
    daysCounter.style.marginBottom = '10px';

    const timeDisplay = document.createElement('div');
    timeDisplay.textContent = getCurrentTime();
    timeDisplay.style.fontSize = '24px';

    // 每秒更新时间
    setInterval(() => {
        timeDisplay.textContent = getCurrentTime();
    }, 1000);

    counterContainer.appendChild(daysCounter);
    counterContainer.appendChild(timeDisplay);
    document.querySelector('.phone-screen').appendChild(counterContainer);
    return counterContainer;  // 返回counterContainer以便后续使用
}

// 初始化花朵并收集坐标
let pathPoints = [];
const counterContainer = createDaysCounter();  // 保存counterContainer的引用

// 视频加载检测和事件处理
const video = document.getElementById('heart-video');
let currentVideoIndex = 0;  // 用于跟踪当前播放的视频
const videoSources = ['videos/1.mp4', 'videos/2.mp4'];  // 视频源列表

// 调整视频内容大小和位置
function adjustVideoSize() {
    if (video) {
        if (currentVideoIndex === 0) {  // 如果是 1.mp4
            video.style.transform = 'translate(-50%, -43%) scale(0.7)';  // 缩小视频内容并向下移动
        } else {  // 如果是 2.mp4
            video.style.transform = 'translate(-50%, -35%) scale(0.6)';  // 恢复原始大小和位置
        }
    }
}

// 切换视频源
function switchVideo() {
    if (video) {
        currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;  // 循环切换视频索引
        video.src = videoSources[currentVideoIndex];
        video.pause();  // 确保切换后视频暂停
        video.currentTime = 0;  // 重置视频到开始位置
        adjustVideoSize();  // 调整视频内容大小
        console.log(`切换到视频: ${videoSources[currentVideoIndex]}`);
    }
}

// 设置初始视频源
function initVideo() {
    if (video) {
        video.src = videoSources[currentVideoIndex];
        video.pause();  // 确保初始视频暂停
        video.currentTime = 0;  // 重置视频到开始位置
        adjustVideoSize();  // 调整视频内容大小
        console.log(`设置初始视频: ${videoSources[currentVideoIndex]}`);
    }
}

// 确保视频元素存在
if (video) {
    // 设置初始视频源
    initVideo();

    // 添加视频播放结束事件监听
    video.addEventListener('ended', function() {
        console.log('视频播放结束');
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.display = 'none';
            video.pause();
            video.currentTime = 0;
            // 显示文字
            if (counterContainer) {
                counterContainer.style.display = 'block';
            }
            // 切换视频源（但不自动播放）
            switchVideo();
        }
    });

    // 添加视频错误处理
    video.addEventListener('error', (e) => {
        console.error('视频加载失败:', e);
        const errorMsg = `视频加载失败: ${video.error.code}
        可能原因:
        1. 视频文件损坏
        2. 视频格式不支持
        3. 编码问题
        请检查视频文件是否存在且可播放`;
        alert(errorMsg);
        
        // 显示备用内容
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.innerHTML = '<div style="color:white;text-align:center;padding-top:50%">视频无法加载</div>';
            videoContainer.style.maskImage = 'none';
            videoContainer.style.webkitMaskImage = 'none';
            // 显示文字
            if (counterContainer) {
                counterContainer.style.display = 'block';
            }
        }
    });

    // 添加视频加载成功事件
    video.addEventListener('loadeddata', () => {
        console.log('视频数据已加载');
    });

    // 添加视频播放事件
    video.addEventListener('play', () => {
        console.log('视频开始播放');
    });

    // 添加视频暂停事件
    video.addEventListener('pause', () => {
        console.log('视频已暂停');
    });
}

// 修改花朵点击事件处理
for (let i = 0; i < 100; i++) {
    const t = (i / 100) * Math.PI * 2;
    const { x, y } = heartShape(t);
    const flower = createFlower(x, y, i);
    flowers.push(flower);
    pathPoints.push(`${x},${y}`);
    
    // 为每个花朵添加点击事件
    flower.addEventListener('click', () => {
        if (video) {
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                // 显示视频容器
                videoContainer.style.display = 'block';
                // 隐藏文字
                if (counterContainer) {
                    counterContainer.style.display = 'none';
                }
                // 确保视频从头开始播放
                video.currentTime = 0;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('视频播放被阻止:', e);
                        // 如果视频播放失败，重新显示文字
                        if (counterContainer) {
                            counterContainer.style.display = 'block';
                        }
                    });
                }
            }
        }
    });
}

// 创建动态SVG蒙版
const svgPath = `M${pathPoints.join(' L')} Z`;
const svgData = `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}" fill="white"/></svg>`;
const videoContainer = document.querySelector('.video-container');
videoContainer.style.maskImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgData)}')`;
videoContainer.style.webkitMaskImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgData)}')`;

// 礼花效果
class Firework {
    constructor() {
        this.reset();
        this.particles = [];
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.speed = Math.random() * 5 + 20;
        this.angle = Math.random() * Math.PI - Math.PI/2;
        this.velocity = {
            x: Math.sin(this.angle) * this.speed / 10,
            y: -Math.cos(this.angle) * this.speed
        };
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.radius = 2;
        this.life = 28 + Math.random() * 8;
    }

    update() {
        this.velocity.y += 0.05;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life--;

        if (this.life <= 0 || this.y > window.innerHeight) {
            this.explode();
            this.reset();
        }
    }

    explode() {
        const particleCount = 50 + Math.floor(Math.random() * 30);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                radius: Math.random() * 2 + 1,
                color: this.color,
                velocity: {
                    x: Math.random() * 6 - 3,
                    y: Math.random() * 6 - 3
                },
                life: 30 + Math.random() * 20,
                friction: 0.95
            });
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.velocity.x *= p.friction;
            p.velocity.y *= p.friction;
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.life--;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }
}

// 初始化礼花效果
function initFireworks() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const fireworks = Array(3).fill().map(() => new Firework());  // 增加礼花数量

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach(firework => {
            firework.update();
            firework.draw(ctx);
        });
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 页面加载完成后初始化礼花
window.addEventListener('load', initFireworks);
