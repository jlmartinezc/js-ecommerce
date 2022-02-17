import { Product } from './class/product/product.js';
import { Cart } from "./class/cart/cart.js";
import { User } from "./class/user/user.js";

let userData = new User();
let cartData = new Cart();
let productData = new Product();
let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
let productList = [
    new Product("xbox serie x", 499, "Microsoft", true, 10, "../multimedia/images/products/product-13.webp" ),
    new Product("Oculus Rift", 299, "Oculus VR", true, 5, "../multimedia/images/products/product-1.webp"),
    new Product("Nike Presto", 175, "Nike", true, 15, "../multimedia/images/products/product-3.webp" ),
    new Product("Nike Dri-FIT Legend", 20, "Nike", true, 100, "../multimedia/images/products/product-14.webp" ),
    new Product("Adidas Badge of Sport", 20, "Adidas", true, 50, "../multimedia/images/products/product-15.webp" ),
    new Product("Nike Pro Warm", 50, "Nike", true, 75, "../multimedia/images/products/product-16.webp" ),
    new Product("Nike Presto", 175, "Nike", true, 35,"../multimedia/images/products/product-3.webp" ),
    new Product("Nike React Infinity Run Flyknit 2", 150, "Nike", true, 25,"../multimedia/images/products/product-12.webp" ),
    new Product("Nike React Infinity Run FK 2 Be True", 150, "Nike", true, 20,"../multimedia/images/products/product-11.webp" ),
    new Product("Nintendo switch promo", 284, "Nintendo", true, 10,"./src/multimedia/images/products/product-2.webp" )
];

$(window).on('load', load);
$(document).on('click','.buy', newItemCart);
$(document).on('click','.btnUpdate', updateItemSelected);
$(document).on('click','.remove', removeItem);
$('#addUser').on('click', validateUser);
$('#clearCart').on('click', cartData.removeCart);
$('#userName').on('keyup', userData.validateModalUser);
$('#countries').on('change', updateCurrency);
$('#checkout').on("click", checkout);
$('#btnNews').on("click", newsletter);



function load() {
    let user = sessionStorage.getItem('userInfo');
    let currency = JSON.stringify({ 'currencyName': 'USD', 'CurrencyValue': 1 });
    let cart = sessionStorage.getItem('shoppingCart');

    (!sessionStorage.getItem('currency')) ? sessionStorage.setItem('currency', currency): cartData.updateCurrencycart;    
    (cart) ? cartData.showProducts() : '';
    (user) ? userData.printUser(user) : '';

    productData.addArticlesList(productList);
    cartData.loadCart();
    cartData.loadCurrenyCountries();

    (!user) 
    ? userData.getDataUser() 
    : $('#userPromo').prepend(`<h2>!Hola ${user}, estos productos te pueden interesar¡</h2>`);
}

function validateUser() {
    let user = $('#userName').val().trim();

    if(user && user.length){
        userData.saveUserInfo(user);
        userData.printUser(user);
        $('#userPromo').prepend(`<h2>!Hola ${user}, estos productos te pueden interesar¡</h2>`);

        $("#staticBackdrop").modal('hide'); 
    }
    else {
        $("#userName").addClass('is-invalid');
        $("#userHelp").fadeIn(500);  
    }
}

function newItemCart(e){
    e.preventDefault();

    let product = e.target;
    let item = {'name': product.dataset.name, 'price': parseInt(product.dataset.price)};
    let result = cartData.addItemToCart(productList, item);

    if(result){
        $(this).css('background-color', 'green');
        $(this).html('<i class="fa fa-check" aria-hidden="true"></i> Producto agregado');
        
        setTimeout(() => { 
            $(this).css('background-color', '#FB9B50');
            $(this).html('<i class="fa fa-shopping-cart"></i> Agregar al carrito');
        }, 1250);
    }
}

function updateItemSelected(e){
    e.preventDefault();

    let product = e.target;
    let item = {'name': product.dataset.name, 'operation': product.dataset.operation};

    cartData.updateSelectedItem(productList, item);
}

function removeItem(e){
    let product = e.target;
    let item = product.dataset.name;
   
    cartData.removeItemCart(item);
}

function updateCurrency() {
    cartData.changeCurrencies();
}

function checkout(){
    let productsCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    
    productsCart.forEach(function(product){
        let result = productList.filter(items => items.name.includes(product.name));
        (result.length >= 1) ? result[0].updateStock(product.amount) : '';
    });

    cartData.checkout();
}

function newsletter(e) {
    e.preventDefault();    

    let newsletter = $('#emailNewsLetter').val().trim();
    let result = emailReg.test( newsletter );

    if(newsletter && newsletter.length && result){
        $("#messagePopUp").text('Muchas gracias, tu email ha sido agregado al newsletter');
        $("#messageModel").modal('show');

        $('#emailNewsLetter').val('') 
    }
    else {
        $("#messagePopUp").text('Ingresa un email valido');
        $("#messageModel").modal('show');
    }
}