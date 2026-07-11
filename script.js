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

function promo(){

    const code = document.getElementById("promo").value;

    if(code === "SALE10"){

        total = Math.round(total * 0.9);

        document.getElementById("total").innerText = total;

        alert("✅ Промокод применён!");

    }else{

        alert("❌ Промокод неверный.");

    }

}


// =======================
// Поиск
// =======================

function searchCakes(){

    const text = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

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

    if(found){
        notFound.style.display = "none";
    }else{
        notFound.style.display = "block";
    }

}
// =======================
// Оформление заказа
// =======================

function checkout(){

    if(cart.length === 0){

        alert("Корзина пустая.");

        return;

    }

    const name =
        document.getElementById("name").value;

    const phone =
        document.getElementById("phone").value;

    const address =
        document.getElementById("address").value;

    if(name === "" || phone === "" || address === ""){

        alert("Заполните все поля.");

        return;

    }

    const order = {

        name:name,
        phone:phone,
        address:address,
        items:cart,
        total:total,
        date:new Date().toLocaleString()

    };

    console.log(order);

    alert(
`Спасибо за заказ!

Имя: ${name}

Телефон: ${phone}

Адрес: ${address}

Сумма: ${total} ֏`
    );

    cart = [];

    saveCart();

    updateCart();

}


// =======================
// Страница товара
// =======================

function openProduct(name,price,image){

    localStorage.setItem("productName",name);
    localStorage.setItem("productPrice",price);
    localStorage.setItem("productImage",image);

    window.location.href="product.html";

}

function loadProduct(){

    const block=document.getElementById("product");

    if(!block) return;

    const name=localStorage.getItem("productName");
    const price=localStorage.getItem("productPrice");
    const image=localStorage.getItem("productImage");

    block.innerHTML=`

    <img src="${image}" class="product-image">

    <h1>${name}</h1>

    <h2>${price} ֏</h2>

    <p>
    Свежий домашний торт от YG Cakes.
    Изготавливается на заказ из качественных ингредиентов.
    </p>

    <button onclick="addToCart('${name}',${price})">
    🛒 Добавить в корзину
    </button>

    <br><br>

    <button onclick="history.back()">
    ← Назад
    </button>

    `;

}


// =======================
// Загрузка сайта
// =======================

window.onload=function(){

    updateCart();

    loadProduct();

}
