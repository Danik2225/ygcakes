let cart = [];
let total = 0;

// ==========================================
// 1. УПРАВЛЕНИЕ КОРЗИНОЙ И ПАМЯТЬЮ
// ==========================================
const savedCart = localStorage.getItem("cart");
if (savedCart) {
    cart = JSON.parse(savedCart);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

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
        <div class="cart-item" style="padding: 10px 0;">
            <h3>${item.name}</h3>
            <p>${item.price} ֏ × ${item.count}</p>
            <p><b>${sum} ֏</b></p>
            <button onclick="minusItem(${index})">➖</button>
            <button onclick="plusItem(${index})">➕</button>
            <button onclick="removeItem(${index})">❌ Удалить</button>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee;">
        `;
    });

    totalText.innerText = total;
}

function plusItem(index){
    cart[index].count++;
    saveCart();
    updateCart();
}

function minusItem(index){
    cart[index].count--;
    if(cart[index].count <= 0){
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

function removeItem(index){
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// ==========================================
// 2. ПРОМОКОДЫ И ПОИСК
// ==========================================
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
        notFound.style.display = found ? "none" : "block";
    }
}

// ==========================================
// 3. 🧮 КАЛЬКУЛЯТОР СВОЕГО ТОРТА
// ==========================================
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

// ==========================================
// 4. ОФОРМЛЕНИЕ ЗАКАЗА И ЗАПИСЬ В АДМИНКУ
// ==========================================
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

function checkout(){
    if(cart.length === 0){
        alert("Корзина пустая.");
        return;
    }

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const dateInput = document.getElementById("deliveryDate");
    const commentInput = document.getElementById("comment");
    const paymentSelect = document.getElementById("payment");

    if(!nameInput || !phoneInput || !addressInput){
        alert("Ошибка: Поля оформления не найдены в HTML коде!");
        return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    if(name === "" || phone === "" || address === ""){
        alert("Пожалуйста, заполните имя, телефон и адрес.");
        return;
    }

    const deliveryDate = dateInput && dateInput.value ? dateInput.value : "Не указана";
    const comment = commentInput ? commentInput.value.trim() : "";
    const paymentMethod = paymentSelect ? paymentSelect.options[paymentSelect.selectedIndex].text : "Не указан";

  // ===============================
// Отправка заказа на сервер
// ===============================
fetch("/api/orders", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
        email: "",
        total: total
    })
})
.then(response => response.json())
.then(result => {

    if (result.success) {

        alert("✅ Заказ успешно оформлен!");

    } else {

        alert("❌ Ошибка сохранения заказа.");

    }

})
.catch(err => {

    console.error(err);

    alert("❌ Сервер недоступен.");

});

    // Отправка в WhatsApp (открывает окно, но не мешает работе сайта)
    let itemsList = "";
    cart.forEach((item, index) => {
        itemsList += `${index + 1}. *${item.name}* — ${item.count} шт.\n`;
    });
    let message = `✨ *НОВЫЙ ЗАКАЗ: YG CAKES* ✨\n👤 Клиент: ${name}\n📞 Телефон: ${phone}\n📍 Адрес: ${address}\n📅 Дата: ${deliveryDate}\n💳 Оплата: ${paymentMethod}\n💬 Коммент: ${comment}\n🛒 Состав:\n${itemsList}💰 Сумма: ${total} ֏`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Очистка формы и корзины
    nameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    if(commentInput) commentInput.value = "";
    
    cart = [];
    saveCart();
    updateCart();
}

// ==========================================
// 5. АВТОРИЗАЦИЯ ДЛЯ ВХОДА В АДМИНКУ
// ==========================================
function openAdminModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
        modal.style.display = "block";
        document.getElementById("loginError").style.display = "none";
    }
}

function closeAdminModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
        modal.style.display = "none";
        document.getElementById("adminLogin").value = "";
        document.getElementById("adminPassword").value = "";
    }
}

function checkAdminCredentials() {
    const loginInput = document.getElementById("adminLogin").value.trim();
    const passwordInput = document.getElementById("adminPassword").value.trim();
    const errorText = document.getElementById("loginError");

    const correctLogin = "admin";
    const correctPassword = "yana777"; 

    if (loginInput === correctLogin && passwordInput === correctPassword) {
        window.location.href = "admin.html";
    } else {
        errorText.innerText = "❌ Неверное имя или пароль!";
        errorText.style.display = "block";
    }
}

// ==========================================
// 6. СВЯЗЬ АДМИНКИ С КАТАЛОГОМ НА ГЛАВНОЙ
// ==========================================
function renderCustomCakesOnMainPage() {
    const container = document.getElementById("customCakesContainer");
    if (!container) return;

    const customCatalog = JSON.parse(localStorage.getItem("customCatalog")) || [];
    container.innerHTML = "";

    customCatalog.forEach(cake => {
        container.innerHTML += `
            <div class="cake fade-in visible">
                <img src="${cake.image}" alt="${cake.name}" onclick="openProduct('${cake.name}', ${cake.price}, '${cake.image}')">
                <h3>${cake.name}</h3>
                <p>${cake.price} ֏</p>
                <button onclick="addToCart('${cake.name}', ${cake.price})">Добавить</button>
            </div>
        `;
    });
}

function openProduct(name, price, image){
    localStorage.setItem("productName", name);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("productImage", image);
    window.location.href = "product.html";
}

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

// Инициализация
window.addEventListener("DOMContentLoaded", () => {
    updateCart();
    renderCustomCakesOnMainPage();
});
window.addEventListener('scroll', checkScrollAnimation);
