// ===============================
// YG Cakes Admin Panel
// ===============================

let catalog = [];
let orders = [];

// ===============================
// Загрузка тортов
// ===============================
async function loadCakes() {

    try {

        const response = await fetch("/api/cakes");
        catalog = await response.json();

        renderCakes();

    } catch (err) {

        console.error(err);
        alert("Ошибка загрузки каталога.");

    }

}

// ===============================
// Загрузка заказов
// ===============================
async function loadOrders() {

    try {

        const response = await fetch("/api/orders");
        orders = await response.json();

        renderOrders();

    } catch (err) {

        console.error(err);
        alert("Ошибка загрузки заказов.");

    }

}
// ===============================
// Добавление торта
// ===============================
async function addCake() {

    const name = document.getElementById("cakeName").value.trim();
    const price = document.getElementById("cakePrice").value;
    const image = document.getElementById("cakeImage").files[0];

    if (!name || !price || !image) {
        alert("❌ Заполните все поля.");
        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {

        const response = await fetch("/api/cakes", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {

            alert("✅ Торт успешно добавлен!");

            document.getElementById("cakeName").value = "";
            document.getElementById("cakePrice").value = "";
            document.getElementById("cakeImage").value = "";

            loadCakes();

        } else {

            alert("Ошибка при добавлении.");

        }

    } catch (err) {

        console.error(err);
        alert("Ошибка соединения с сервером.");

    }

}
// ===============================
// Вывод тортов
// ===============================
function renderCakes() {

    const container = document.getElementById("adminCakesList");

    if (!container) return;

    if (catalog.length === 0) {

        container.innerHTML =
            `<h3 align="center">Пока нет тортов</h3>`;

        return;
    }

    container.innerHTML = "";

    catalog.forEach(cake => {

        container.innerHTML += `
        <div class="admin-item" style="display:flex;align-items:center;justify-content:space-between;border:1px solid #ddd;padding:10px;margin-bottom:10px;border-radius:8px;">

            <div style="display:flex;align-items:center;gap:15px;">

                <img src="${cake.image}"
                     style="width:60px;height:60px;object-fit:cover;border-radius:6px;">

                <div>

                    <strong>${cake.name}</strong>

                    <p style="margin:0;color:#f45b7e;">
                        ${cake.price} ֏
                    </p>

                </div>

            </div>

            <button onclick="deleteCake(${cake.id})"
                style="background:#dc3545;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;">

                ❌ Удалить

            </button>

        </div>
        `;

    });

}

// ===============================
// Удаление торта
// ===============================
async function deleteCake(id) {

    if (!confirm("Удалить этот торт?")) return;

    try {

        const response = await fetch(`/api/cakes/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (result.success) {

            loadCakes();

        } else {

            alert("Не удалось удалить торт.");

        }

    } catch (err) {

        console.error(err);
        alert("Ошибка соединения.");

    }

}
// ===============================
// Вывод заказов
// ===============================
function renderOrders() {

    const container = document.getElementById("adminOrdersList");

    if (!container) return;

    if (orders.length === 0) {

        container.innerHTML =
        `<h3 align="center">📦 Заказов нет</h3>`;

        return;

    }

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `

        <div class="admin-order-box"
        style="border:1px solid #ff8fab;
        padding:15px;
        margin-bottom:15px;
        border-radius:10px;
        background:#fffdfd;">

            <h4>📦 Заказ №${order.id}</h4>

            <p><b>Имя:</b> ${order.name}</p>

            <p><b>Телефон:</b> ${order.phone}</p>

            <p><b>Адрес:</b> ${order.address}</p>

            <p><b>Email:</b> ${order.email || "-"}</p>

            <p><b>Сумма:</b> ${order.total} ֏</p>

            <p><b>Статус:</b> ${order.status}</p>

            <button onclick="deleteOrder(${order.id})">

                ❌ Удалить

            </button>

        </div>

        `;

    });

}

// ===============================
// Удаление заказа
// ===============================
async function deleteOrder(id) {

    if (!confirm("Удалить заказ?")) return;

    try {

        const response = await fetch(`/api/orders/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (result.success) {

            loadOrders();

        } else {

            alert("Не удалось удалить заказ.");

        }

    } catch (err) {

        console.error(err);

        alert("Ошибка соединения с сервером.");

    }

}
// ===============================
// Загрузка при открытии страницы
// ===============================
window.onload = () => {

    loadCakes();
    loadOrders();

    const savedEmail = localStorage.getItem("adminEmail");

    if (savedEmail) {

        const emailInput = document.getElementById("email");

        if (emailInput) {
            emailInput.value = savedEmail;
        }

    }

};
