let cart = [];
let total = 0;

// =======================
// Загрузка корзины
// =======================
const savedCart = localStorage.getItem("cart");
if (savedCart) {
    cart = JSON.parse(savedCart);
}

// =======================
// Сохранение корзины
// =======================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// =======================
// Добавление в корзину
// =======================
function addToCart(name, price) {
    const item = cart.find(cake => cake.name === name);
    if (item) {
        item.count = (item.count || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            count: 1
        });
    }
    saveCart();
    updateCart();
}

// =======================
// Обновление корзины
// =======================
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const totalText = document.getElementById("total");
    if (!cartItems || !totalText) return;

    cartItems.innerHTML = "";
    total = 0;

    cart.forEach((item, index) => {
        const sum = item.price * item.count;
        total += sum;

        cartItems.innerHTML += `
        <div class="cart-item">
            <h3>${item.name}</h3>
            <p>${item.price} ֏ × ${item.count}</p>
            <p><b>${sum} ֏</b></p>
            <button onclick="minusItem(${index})">➖</button>
            <button onclick="plusItem(${index})">➕</button>
            <button onclick="removeItem(${index})">❌ Удалить</button>
        </div>
        <hr>
        `;
    });

    totalText.innerText = total;
}

// =======================
// Увеличить количество
// =======================
function plusItem(index){
    cart[index].count++;
    saveCart();
    updateCart();
}

// =======================
// Уменьшить количество
// =======================
function minusItem(index){
    cart[index].count--;
    if(cart[index].count <= 0){
        cart.splice(index,1);
    }
    saveCart();
    updateCart();
}

// =======================
// Удалить товар
// =======================
function removeItem(index){
    cart.splice(index,1);
    saveCart();
    updateCart();
}

// =======================
// Промокод
// =======================
let promoUsed = false;
function promo(){
    if(promoUsed){
        alert("❌ Промокод уже использован.");
        return;
    }
    const code = document.getElementById("promo").value.trim();
    if(code === "SALE10"){
        total = Math.round(total * 0.9);
        document.getElementById("total").innerText = total;
        promoUsed = true;
        alert("✅ Скидка 10% применена!");
    } else {
        alert("❌ Неверный промокод.");
    }
}

// =======================
// Поиск
// =======================
function searchCakes(){
    const text = document.getElementById("search").value.toLowerCase().trim();
    const cakes = document.querySelectorAll(".cake");
    const notFound = document.getElementById("notFound");
    let found = false;

    cakes.forEach(cake => {
        if (cake.innerText.toLowerCase().includes(text)) {
            cake.style.display = "";
            found = true;
        } else {
            cake.style.display = "none";
        }
    });

    if(notFound) {
        if(found){
            notFound.style.display = "none";
        } else {
            notFound.style.display = "block";
        }
    }
}

// =======================
// 🧮 ЛОГИКА КАЛЬКУЛЯТОРА ТОРТА
// =======================
function calculateCakePrice() {
    const typeSelect = document.getElementById('cakeType');
    if (!typeSelect) return; 

    const pricePerKg = parseFloat(typeSelect.value);
    const weight = parseFloat(document.getElementById('cakeWeight').value) || 1;
    const tiersPrice = parseFloat(document.getElementById('cakeTiers').value);
    const decorPrice = parseFloat(document.getElementById('cakeDecor').value);

    const finalPrice = (pricePerKg * weight) + tiersPrice + decorPrice;
    document.getElementById('calcPrice').innerText = finalPrice;
}

function addCustomCakeToCart() {
    const typeSelect = document.getElementById('cakeType');
    const typeName = typeSelect.options[typeSelect.selectedIndex].text.split(' (')[0];
    const weight = document.getElementById('cakeWeight').value;
    const price = document.getElementById('calcPrice').innerText;

    const fullCustomName = `🔧 Свой торт (${typeName}, ${weight} кг)`;
    
    addToCart(fullCustomName, Number(price));
    alert(`Торт "${fullCustomName}" добавлен в корзину!`);
}

// =======================
// Подсказки для способов оплаты
// =======================
function togglePaymentMessage() {
    const paymentSelect = document.getElementById('payment');
    const note = document.getElementById('paymentNote');
    if (!paymentSelect || !note) return;
    
    const method = paymentSelect.value;
    if (method === 'idram') {
        note.innerText = "После оформления заказа переведите сумму на Idram ID: 098434363";
    } else if (method === 'card') {
        note.innerText = "Оплата онлайн временно недоступна. Выберите другой способ или ожидайте ссылку.";
    } else {
        note.innerText = "Вы сможете оплатить заказ курьеру наличными или картой при получении.";
    }
}

// =======================
// Красивое оформление заказа через WhatsApp
// =======================
function checkout(){
    if(cart.length === 0){
        alert("Корзина пустая.");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const dateInput = document.getElementById("deliveryDate");
    const commentInput = document.getElementById("comment");
    const paymentSelect = document.getElementById("payment");

    if(name === "" || phone === "" || address === ""){
        alert("Пожалуйста, заполните имя, телефон и адрес.");
        return;
    }

    const deliveryDate = dateInput && dateInput.value ? dateInput.value : "Не указана";
    const comment = commentInput ? commentInput.value.trim() : "";
    const paymentMethod = paymentSelect ? paymentSelect.options[paymentSelect.selectedIndex].text : "Не указан";

    // 1. Формируем список товаров с нумерацией
    let itemsList = "";
    cart.forEach((item, index) => {
        const itemSum = item.price * item.count;
        itemsList += `${index + 1}. *${item.name}*\n    └─ ${item.count} шт. × ${item.price} ֏ = *${itemSum} ֏*\n`;
    });

    // 2. Шаблон сообщения
    let message = `✨ *НОВЫЙ ЗАКАЗ: YG CAKES* ✨\n`;
    message += `────────────────────\n\n`;
    message += `👤 *Клиент:* ${name}\n`;
    message += `📞 *Телефон:* ${phone}\n`;
    message += `📍 *Адрес доставки:* ${address}\n`;
    message += `📅 *Дата получения:* ${deliveryDate}\n`;
    message += `💳 *Способ оплаты:* ${paymentMethod}\n`;
    
    if(comment) {
        message += `💬 *Комментарий:* _${comment}_\n`;
    }
    
    message += `\n────────────────────\n`;
    message += `🛒 *СОСТАВ ЗАКАЗА:*\n\n${itemsList}`;
    message += `────────────────────\n\n`;
    message += `💰 *ИТОГО К ОПЛАТЕ:* *${total} ֏*`;

    // 3. Открытие диалога WhatsApp напрямую с владельцем
    const whatsappUrl = `https://wa.me{encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Очистка корзины после отправки
    cart = [];
    saveCart();
    updateCart();
}

// =======================
// Анимация прокрутки карточек
// =======================
function checkScrollAnimation() {
    const cakes = document.querySelectorAll('.cake.fade-in');
    cakes.forEach(cake => {
        const cakePosition = cake.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.15;
        if (cakePosition < screenPosition) {
            cake.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkScrollAnimation);

// =======================
// Страница товара (Поддержка product.html)
// =======================
function openProduct(name,price,image){
    localStorage.setItem("productName",name);
    localStorage.setItem("productPrice",price);
    localStorage.setItem("productImage",image);
    window.location.href="product.html";
}

function loadProduct(){
    const block = document.getElementById("product");
    if(!block) return;

    const name = localStorage.getItem("productName");
    const price = localStorage.getItem("productPrice");
    const image = localStorage.getItem("productImage");

    block.innerHTML = `
    <img src="${image}" class="product-image" alt="${name}">
    <h1>${name}</h1>
    <h2>${price} ֏</h2>
    <p>Свежий домашний торт от YG Cakes. Изготавливается на заказ из качественных ингредиентов.</p>
    <button onclick="addToCart('${name}',${price})">🛒 Добавить в корзину</button>
    <br><br>
    <button onclick="history.back()">← Назад</button>
    `;
}

// =======================
// Загрузка сайта
// =======================
window.onload = function(){
    updateCart();
    loadProduct();
    togglePaymentMessage();
    calculateCakePrice(); 
    checkScrollAnimation();
}
