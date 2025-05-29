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
}

// 初始化花朵并收集坐标
let pathPoints = [];
createDaysCounter();
for (let i = 0; i < 100; i++) {
    const t = (i / 100) * Math.PI * 2;
    const { x, y } = heartShape(t);
    flowers.push(createFlower(x, y, i));
    pathPoints.push(`${x + centerX},${y + centerY}`);
}

// 创建动态SVG蒙版
const svgPath = `M${pathPoints.join(' L')} Z`;
const svgData = `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}" fill="white"/></svg>`;
const videoContainer = document.querySelector('.video-container');
videoContainer.style.maskImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgData)}')`;
videoContainer.style.webkitMaskImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgData)}')`;

// 视频加载检测
const video = document.getElementById('heart-video');
video.addEventListener('error', () => {
    console.error('视频加载失败');
    alert('视频加载失败，请检查videos/1.mp4文件');
});

// 处理自动播放
function handleAutoPlay() {
    const promise = video.play();
    if (promise !== undefined) {
        promise.catch(error => {
            // 自动播放失败时显示播放按钮
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            playButton.innerHTML = '▶';
            playButton.style.position = 'absolute';
            playButton.style.top = '50%';
            playButton.style.left = '50%';
            playButton.style.transform = 'translate(-50%, -50%)';
            playButton.style.fontSize = '50px';
            playButton.style.color = 'white';
            playButton.style.cursor = 'pointer';
            playButton.style.zIndex = '100';
            playButton.addEventListener('click', () => {
                video.play();
                playButton.remove();
            });
            document.querySelector('.video-container').appendChild(playButton);
        });
    }
}

// 页面交互后尝试播放
document.addEventListener('click', () => {
    handleAutoPlay();
}, { once: true });

video.addEventListener('canplay', () => {
    console.log('视频已加载');
    handleAutoPlay();
});

// 礼花效果
class Firework {
    constructor() {
        this.reset();
        this.particles = [];
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight;
        this.speed = Math.random() * 5 + 10;
        this.angle = Math.random() * Math.PI - Math.PI/2;
        this.velocity = {
            x: Math.sin(this.angle) * this.speed / 10,
            y: -Math.cos(this.angle) * this.speed
        };
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.radius = 2;
        this.life = 50 + Math.random() * 20;
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
                life: 50 + Math.random() * 50,
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
    const fireworks = Array(5).fill().map(() => new Firework());  // 增加礼花数量

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
