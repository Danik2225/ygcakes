// Базы данных в localStorage
let catalog = JSON.parse(localStorage.getItem("customCatalog")) || [];
let orders = JSON.parse(localStorage.getItem("ordersList")) || [];

// ==========================================
// 1. ФУНКЦИЯ ДОБАВЛЕНИЯ ТОРТА
// ==========================================
function addCake() {
    const nameInput = document.getElementById("cakeName");
    const priceInput = document.getElementById("cakePrice");
    const imageInput = document.getElementById("cakeImage");

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);

    if (!name || !price || imageInput.files.length === 0) {
        alert("❌ Заполните все поля и выберите фото торта!");
        return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    // Переводим картинку в текстовый формат Base64, чтобы сохранить в память браузера
    reader.onloadend = function () {
        const base64Image = reader.result;

        // Создаем объект нового торта
        const newCake = {
            id: Date.now(), // Уникальный маркер для удаления
            name: name,
            price: price,
            image: base64Image
        };

        catalog.push(newCake);
        localStorage.setItem("customCatalog", JSON.stringify(catalog));

        alert(`✅ Торт "${name}" успешно добавлен в базу!`);
        
        // Очищаем форму
        nameInput.value = "";
        priceInput.value = "";
        imageInput.value = "";

        renderCakes();
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// ==========================================
// 2. ВЫВОД И УДАЛЕНИЕ ТОРТОВ
// ==========================================
function renderCakes() {
    const container = document.getElementById("adminCakesList");
    if (!container) return;

    if (catalog.length === 0) {
        container.innerHTML = `<h3 align="center" id="noCakesMessage">Пока нет тортов</h3>`;
        return;
    }

    container.innerHTML = "";
    catalog.forEach(cake => {
        container.innerHTML += `
            <div class="admin-item" style="display: flex; align-items: center; justify-content: space-between; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${cake.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <strong style="font-size: 16px;">${cake.name}</strong>
                        <p style="margin: 0; color: #f45b7e;">${cake.price} ֏</p>
                    </div>
                </div>
                <button onclick="deleteCake(${cake.id})" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">❌ Удалить</button>
            </div>
        `;
    });
}

function deleteCake(id) {
    if (confirm("Вы действительно хотите удалить этот торт из каталога?")) {
        catalog = catalog.filter(cake => cake.id !== id);
        localStorage.setItem("customCatalog", JSON.stringify(catalog));
        renderCakes();
    }
}

// ==========================================
// 3. ВЫВОД И УДАЛЕНИЕ ЗАКАЗОВ
// ==========================================
function renderOrders() {
    const container = document.getElementById("adminOrdersList");
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `<h3 align="center" id="noOrdersMessage">📦 Заказов нет</h3>`;
        return;
    }

    container.innerHTML = "";
    orders.forEach((order, index) => {
        let itemsHtml = "";
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemsHtml += `<li>${item.name} — ${item.count} шт. (${item.price} ֏)</li>`;
            });
        }

        container.innerHTML += `
            <div class="admin-order-box" style="border: 1px solid #ff8fab; padding: 15px; margin-bottom: 15px; border-radius: 10px; background: #fffdfd;">
                <h4>📦 Заказ №${index + 1} от ${order.date || 'Неизвестно'}</h4>
                <p>👤 <b>Имя:</b> ${order.name || 'Не указано'}</p>
                <p>📞 <b>Телефон:</b> ${order.phone || 'Не указан'}</p>
                <p>📍 <b>Адрес:</b> ${order.address || 'Не указан'}</p>
                <p>💳 <b>Оплата:</b> ${order.payment || 'Не указана'}</p>
                <p>💬 <b>Комментарий:</b> <i>${order.comment || 'Нет'}</i></p>
                <h5>🛒 Состав:</h5>
                <ul>${itemsHtml || '<li>Состав пуст</li>'}</ul>
                <p style="font-size: 16px;">💰 <b>Сумма заказа: <span style="color: #c23b61;">${order.total || 0} ֏</span></b></p>
                <button onclick="deleteOrder(${index})" style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Архивировать / Удалить заказ</button>
            </div>
        `;
    });
}

function deleteOrder(index) {
    if (confirm("Удалить этот заказ из панели?")) {
        orders.splice(index, 1);
        localStorage.setItem("ordersList", JSON.stringify(orders));
        renderOrders();
    }
}

// ==========================================
// 4. НАСТРОЙКА ПОЧТЫ
// ==========================================
function saveEmail() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) {
        alert("❌ Введите корректный адрес почты!");
        return;
    }

    localStorage.setItem("adminEmail", email);
    alert(`✅ Почта ${email} успешно сохранена для уведомлений!`);
}

// Инициализация при загрузке страницы admin.html
window.onload = function () {
    renderCakes();
    renderOrders();
    
    // Подгружаем сохраненную почту, если она есть
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
    }
};
