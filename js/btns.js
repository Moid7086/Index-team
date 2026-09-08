const btnmoi = document.getElementById("btnmoi");
const btnbeto = document.getElementById("btnbeto");
const btnluis = document.getElementById("btnluis");


if(btnmoi){
    btnmoi.addEventListener("click", () =>{
        window.location.href ="moipracticas/mainpage.html"
    } )
}
if(btnbeto){
    btnbeto.addEventListener("click", () =>{
        window.location.href ="betopracticas/mainpage.html"
    } )
}
if(btnluis){
    btnluis.addEventListener("click", () =>{
        window.location.href ="luispracticas/mainpage.html"
    } )
}