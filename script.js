let cart = [];
let total = 0;


// Загружаем корзину после открытия сайта
const savedCart = localStorage.getItem("cart");

if (savedCart) {
    cart = JSON.parse(savedCart);
}


// Сохраняем корзину
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// Добавить в корзину
function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    saveCart();

    updateCart();
}


// Обновление корзины
function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const totalText = document.getElementById("total");

    if (!cartItems || !totalText) return;

    cartItems.innerHTML = "";

    total = 0;


    cart.forEach((item, index) => {

        total += Number(item.price);


        cartItems.innerHTML += `

        <div class="cart-item">

            <h3>${item.name}</h3>

            <p>${item.price} ֏</p>


            <button onclick="removeItem(${index})">
                ❌ Удалить
            </button>

        </div>

        <hr>

        `;

    });


    totalText.innerText = total;

}


// Удалить товар
function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


// Промокод
function promo() {

    const code = document.getElementById("promo").value;


    if (code === "SALE10") {

        total = total * 0.9;

        document.getElementById("total").innerText =
            Math.round(total);


        alert("Промокод применён!");

    }

    else {

        alert("Промокод неверный.");

    }

}


// Оформление заказа
function checkout() {


    if (cart.length === 0) {

        alert("Корзина пустая.");

        return;

    }


    const name =
        document.getElementById("name").value;


    const phone =
        document.getElementById("phone").value;


    const address =
        document.getElementById("address").value;



    if(name === "" || phone === "" || address === "") {

        alert("Заполните все поля.");

        return;

    }



    const order = {

        name:name,

        phone:phone,

        address:address,

        items:cart,

        total:total

    };



    console.log("Новый заказ:", order);



    alert(
`Спасибо за заказ!

Имя: ${name}

Телефон: ${phone}

Адрес: ${address}

Сумма: ${total} ֏`
    );



    // очищаем корзину после заказа

    cart = [];

    saveCart();

    updateCart();

}



// Загружаем корзину при старте
updateCart();
