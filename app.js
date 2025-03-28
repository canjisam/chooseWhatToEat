const foodCategories = {
    '中国传统菜系': [
        '宫保鸡丁', '麻婆豆腐', '鱼香肉丝', '回锅肉', '东坡肉', '红烧肉', '糖醋里脊', '清蒸鱼',
        '水煮鱼', '酸菜鱼', '红烧鲤鱼', '剁椒鱼头', '蒜蓉蒸虾', '椒盐虾', '油焖大虾', '白灼虾',
        '北京烤鸭', '脆皮烧鸭', '叉烧肉', '烧鹅', '盐焗鸡', '白切鸡', '口水鸡', '辣子鸡',
        '重庆辣子鸡', '新疆大盘鸡', '三杯鸡', '黄焖鸡', '啤酒鸭', '盐水鸭', '酱鸭', '烤鸭'
    ],
    '面食类': [
        '阳春面', '担担面', '重庆小面', '武汉热干面', '炸酱面', '葱油拌面', '阳春面', '板面',
        '刀削面', '兰州拉面', '山西刀削面', '河南烩面', '酸辣粉', '螺蛳粉', '米粉', '米线',
        '过桥米线', '炒米粉', '炒河粉', '沙茶面', '云吞面', '打卤面', '臊子面', '油泼面'
    ],
    '粥粉面饭': [
        '皮蛋瘦肉粥', '海鲜粥', '白粥', '小米粥', '南瓜粥', '绿豆粥', '八宝粥', '艇仔粥',
        '炒饭', '蛋炒饭', '扬州炒饭', '咖喱炒饭', '泰式炒饭', '韩式拌饭', '石锅拌饭', '盖浇饭',
        '卤肉饭', '鸡肉饭', '烤肉饭', '猪排饭', '牛肉饭', '三杯鸡饭', '鳗鱼饭', '烤鸭饭'
    ],
    '小吃点心': [
        '小笼包', '灌汤包', '生煎包', '锅贴', '饺子', '煎饺', '水饺', '蒸饺',
        '春卷', '炸春卷', '肠粉', '叉烧包', '糯米鸡', '烧卖', '虾饺', '凤爪',
        '油条', '馄饨', '云吞', '炸鸡翅', '鸡米花', '薯条', '炸串', '鱿鱼圈'
    ],
    '火锅系列': [
        '四川火锅', '重庆火锅', '潮汕牛肉火锅', '海鲜火锅', '羊蝎子火锅', '麻辣烫', '串串香', '涮羊肉',
        '菌菇火锅', '鸳鸯火锅', '牛肉火锅', '猪肚鸡火锅', '打边炉', '寿喜烧', '韩式部队火锅', '泰式火锅'
    ],
    '烧烤系列': [
        '烤羊肉串', '烤牛肉串', '烤鸡翅', '烤排骨', '烤生蚝', '烤玉米', '烤茄子', '烤韭菜',
        '烤金针菇', '烤面筋', '烤鱿鱼', '烤扇贝', '烤虾', '烤鱼', '烤馕', '烤冷面'
    ],
    '西式料理': [
        '牛排', '意大利面', '披萨', '汉堡', '三明治', '沙拉', '奶油蘑菇汤', '罗宋汤',
        '法式蜗牛', '德国猪肘', '西班牙海鲜饭', '希腊沙拉', '千层面', '通心粉', '焗饭', '烤鸡'
    ],
    '日韩料理': [
        '寿司', '刺身', '天妇罗', '乌冬面', '荞麦面', '亲子丼', '牛丼', '猪排饭',
        '韩式烤肉', '石锅拌饭', '泡菜汤', '参鸡汤', '海鲜豆腐汤', '冷面', '部队锅', '辣炒年糕'
    ],
    '东南亚料理': [
        '冬阴功汤', '咖喱鸡', '椰子鸡', '海南鸡饭', '叻沙', '炒粿条', '沙爹', '咖喱蟹',
        '越南河粉', '越南春卷', '菲律宾炒粉', '印尼炒饭', '马来西亚肉骨茶', '泰式炒河粉', '泰式炒饭', '泰式咖喱'
    ],
    '快餐连锁': [
        '肯德基', '麦当劳', '德克士', '华莱士', '必胜客', '永和大王', '真功夫', '吉野家',
        '味千拉面', '大快活', '大家乐', '仙跡岩', '老娘舅', '西贝莜面村', '沙县小吃', '兰州拉面'
    ],
    '创新菜品': [
        '分子料理', '创意寿司', 'fusion料理', '新中式料理', '养生套餐', '轻食套餐', '减脂餐', '能量碗',
        '沙拉碗', '果蔬汁', '蛋白质餐', '低脂餐', '无糖餐', '生酮餐', '素食套餐', '纯素餐'
    ]
};

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