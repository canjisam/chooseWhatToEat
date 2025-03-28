// Removed: const foodCategories = { ... };
// Added below to load the foodCategories JSON dynamically:
let foodCategories = {};
fetch('./foodCategories.json')
	.then(response => response.json())
	.then(data => { foodCategories = data; });

function getRandomFood(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function animateSelection(callback) {
    let count = 0;
    const animation = setInterval(() => {
        callback();
        if (++count > 10) clearInterval(animation);
    }, 100);
}

function chooseByCategory() {
    const category = getRandomFood(Object.keys(foodCategories));
    animateSelection(() => {
        document.getElementById('result').textContent = `${category} · ${getRandomFood(foodCategories[category])}`;
    });
}

function chooseAll() {
    const allFoods = Object.entries(foodCategories).flatMap(([category, foods]) =>
        foods.map(food => `${category} · ${food}`)
    );
    animateSelection(() => {
        document.getElementById('result').textContent = getRandomFood(allFoods);
    });
}

function generateParamImage() {
    // Show loading message
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'block';

    // Set image source to parameterized prompt URL
    const param = document.getElementById('result').textContent.split(' · ')[1] || '今天吃什么？';
    // Ensure the parameter is URL-safe
    const safeParam = encodeURIComponent(param);
    // Set the image source to the generated image URL
    const url = `https://image.pollinations.ai/prompt/${safeParam}?width=360&height=360&seed=42&model=flux`;

    const img = document.getElementById("generated-img");
    img.onload = () => {
        // Hide loading message when image is loaded
        loadingMessage.style.display = 'none';
    };
    img.onerror = () => {
        // Hide loading message and show error if image fails to load
        loadingMessage.style.display = 'none';
        alert('图片加载失败，请重试！');
    };
    img.src = url;
}

document.addEventListener('copy', function(e) {
    const selection = window.getSelection().toString();
    if (selection) {
        const notification = document.getElementById('copy-notification');
        notification.textContent = `内容来自【今天吃什么？随机选择器】\n${selection}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2500);
    }
});