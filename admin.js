async function loadCakes() {

    const response = await fetch("/api/cakes");
    const cakes = await response.json();

    const list = document.getElementById("cakes");

    if (cakes.length === 0) {

        list.innerHTML = `
        <h3 align="center">
        Пока нет тортов
        </h3>
        `;

        return;

    }

    list.innerHTML = "";

    cakes.forEach(cake => {

        list.innerHTML += `

        <div class="cake">

            <img src="${cake.image}" width="250">

            <h3>${cake.name}</h3>

            <p>${cake.price} ֏</p>

            <button onclick="deleteCake(${cake.id})">
            🗑 Удалить
            </button>

        </div>

        `;

    });

}

async function addCake(){

    const name=document.getElementById("cakeName").value;

    const price=document.getElementById("cakePrice").value;

    const image=document.getElementById("cakeImage").files[0];

    if(!name || !price || !image){

        alert("Заполните все поля!");

        return;

    }

    const formData=new FormData();

    formData.append("name",name);

    formData.append("price",price);

    formData.append("image",image);

    await fetch("/api/cakes",{

        method:"POST",

        body:formData

    });

    document.getElementById("cakeName").value="";

    document.getElementById("cakePrice").value="";

    document.getElementById("cakeImage").value="";

    loadCakes();

}

async function deleteCake(id){

    if(!confirm("Удалить торт?")) return;

    await fetch("/api/cakes/"+id,{

        method:"DELETE"

    });

    loadCakes();

}

function saveEmail(){

    const email=document.getElementById("email").value;

    localStorage.setItem("adminEmail",email);

    alert("Почта сохранена.");

}

window.onload=()=>{

    loadCakes();

    const email=localStorage.getItem("adminEmail");

    if(email){

        document.getElementById("email").value=email;

    }

};