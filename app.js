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
    },1500);
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
        notification.textContent = `内容来自【@canjisam今天吃什么？随机选择器】\n${selection}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2500);
    }
});

async function generateText() {
    const foodText = document.getElementById('result').textContent;
    const basePrompt = `你只要告诉我提示词是什么，不要返回任何其他内容。你先对${foodText}这个食物进行理解和外貌特征想象，尽可能详细地返回一个可以用于AI生成这个关键词相关的图片的提示词。`;
    try {
        //const systemToken = '- Role: AI绘画家 - Background: 用户需要根据关键词生成AI绘画的提示词，以便通过AI工具创作出符合要求的绘画作品。 - Profile: 你是一位精通绘画技巧和视觉艺术的AI绘画家，对各种食物的外观特征有着精准的把握，能够将食物的形状、颜色、质感等细节转化为清晰的绘画指令。 - Skills: 你具备丰富的绘画知识，包括色彩理论、构图原则、光影效果等，能够将抽象的关键词转化为具体的视觉元素，并以简洁明了的语言表达出来。 - Goals: 根据用户提供的关键词，生成详细的AI绘画提示词，帮助用户通过AI工具绘制出具有逼真感和艺术感的食物图像。 - Constrains: 提示词应简洁明了，避免过于复杂或模糊的描述，确保AI绘画工具能够准确理解和执行。 - OutputFormat: 文字描述，包括食物的形状、颜色、质感、光影效果等关键绘画元素。 - Workflow: 1. 确定关键词所对应的食物名称。 2. 分析该食物的典型外观特征，包括形状、颜色、质感等。 3. 将这些特征转化为具体的绘画描述，确保语言简洁明了，便于AI工具理解和执行。 - Examples: - 关键词：苹果 提示词：“绘制一个红富士苹果，形状为圆形，表面光滑，颜色为鲜红色，带有少量绿色斑点，顶部有绿色的叶子，背景为简单的白色，光影效果突出苹果的立体感。” - 关键词：汉堡 提示词：“绘制一个三层汉堡，最底层是金黄色的面包，中间夹有生菜、番茄片、牛肉饼和芝士片，最上层是面包，面包表面有芝麻，整体颜色丰富，质感逼真，背景为木质餐桌，光影效果自然。” - 关键词：寿司 提示词：“绘制一份寿司拼盘，包括三文鱼寿司、黄瓜寿司和加州卷。寿司形状为长条形，米饭为白色，三文鱼为橙红色，黄瓜为绿色，加州卷上有蟹肉棒和牛油果，背景为日式风格的木盘，光影效果突出食材的新鲜感。” ';
        // 构建文本生成API参数
        const params = new URLSearchParams({
            model: 'midijourney',  
            //seed: Math.floor(Math.random() * 1000000), 
            //json: 'true',      
            //system: encodeURIComponent(systemToken), 
            private: 'true'    
        });

        const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(basePrompt)}?${params.toString()}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let text;
        if (params.get('json') === 'true') {
            const jsonResponse = await response.json();
            text = jsonResponse.text || jsonResponse.response || jsonResponse.message;
        } else {
            text = await response.text();
        }

        document.getElementById('generatedText').innerHTML = `<p>提示词: ${text}</p>`;
        document.getElementById('generated-img').innerHTML = '<p>正在生成图片...</p>';
        generateImage(text);
        
    } catch (error) {
        console.error('Error generating text:', error);
        document.getElementById('generatedText').innerHTML = '<p>生成提示词失败，请重试</p>';
    }
}

async function generateImage(prompt) {
    try {
        const params = new URLSearchParams({
            model: 'flux',    // 使用 turbo 模型进行快速生成
            width: '512',      
            height: '512',
            // seed: Math.floor(Math.random() * 1000000),
            safe: 'true',      
            enhance: 'true',   
            nologo: 'true',    
            private: 'true'    
        });
        

        const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageUrl = response.url;
        document.getElementById('generated-img').innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
        document.getElementById('saveImageBtn').style.display = 'block'; // 显示保存按钮
    } catch (error) {
        console.error('Error generating image:', error);
        document.getElementById('generatedText').innerHTML = '<p>生成图片失败，请重试</p>';
        document.getElementById('saveImageBtn').style.display = 'none'; // 隐藏保存按钮
    }
}

async function saveImage() {
    try {
        const img = document.querySelector('#generated-img img');
        if (!img) {
            throw new Error('No image found');
        }

        // 创建一个临时的a标签用于下载
        const link = document.createElement('a');
        const foodName = document.getElementById('result').textContent.replace(/[\/\\:*?"<>|]/g, '_');
        link.download = `食物图片_${foodName}_${new Date().getTime()}.png`;
        
        // 使用fetch获取图片并转换为blob
        const response = await fetch(img.src);
        const blob = await response.blob();
        link.href = URL.createObjectURL(blob);
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        // 显示下载成功通知
        const notification = document.getElementById('copy-notification');
        notification.textContent = '图片保存成功！';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2500);
    } catch (error) {
        console.error('Error saving image:', error);
        alert('保存图片失败，请重试');
    }
}