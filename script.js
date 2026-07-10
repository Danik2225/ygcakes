let cart = [];
let total = 0;

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    updateCart();
}

function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const totalText = document.getElementById("total");

    cartItems.innerHTML = "";

    total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        cartItems.innerHTML += `
        <div class="cart-item">
            <b>${item.name}</b>
            <br>
            ${item.price} ֏
            <br>
            <button onclick="removeItem(${index})">
                ❌ Удалить
            </button>
            <hr>
        </div>
        `;

    });

    totalText.innerText = total;
}

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

function promo(){

    const code = document.getElementById("promo").value;

    if(code === "SALE10"){

        total = total * 0.9;

        document.getElementById("total").innerText =
            Math.round(total);

        alert("Промокод применён!");

    }else{

        alert("Промокод неверный.");

    }

}

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

    if(name==="" || phone==="" || address===""){

        alert("Заполните все поля.");

        return;

    }

    alert(
`Спасибо за заказ!

Имя: ${name}

Телефон: ${phone}

Адрес: ${address}

Сумма: ${Math.round(total)} ֏`
    );

}