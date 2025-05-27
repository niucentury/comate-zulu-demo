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

// 初始化花朵并收集坐标
let pathPoints = [];
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
video.addEventListener('canplay', () => {
    console.log('视频已加载');
    video.play().catch(e => console.error('自动播放失败:', e));
});
