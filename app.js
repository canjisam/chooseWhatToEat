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

    setTimeout(() => {
        generateText();
    },500);
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

async function generateText() {
    const prompt = document.getElementById('result').textContent + "先整理对这个食物的理解，根据这个理解返回一个用于AI生成图片的提示词，只返回提示词的详细描述，不要返回任何其他内容。";

    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        document.getElementById('generatedText').innerHTML = `<p>提示词:${text}</p>`;
        // 使用生成的文本作为提示词生成图片
        generateImage(text);
    } catch (error) {
        console.error('Error generating text:', error);
        // alert('生成文本失败');
    }
}

async function generateImage(prompt) {
    try {
        const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageUrl = response.url;
        document.getElementById('generated-img').innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
    } catch (error) {
        console.error('Error generating image:', error);
        // alert('生成图片失败');
    }
}