const URLCountry = "../../src/data/country.json";

export class Cart {
    constructor(){}
    
    accountValues() {
        let cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
        let actualCurrency = JSON.parse(sessionStorage.getItem('currency'));
        let priceIva = 0;
        let totalItem = 0;

        cart.forEach(function (item) {
            totalItem += item.amount;
            priceIva += parseFloat(
                (item.price + item.price * 0.19) * item.amount
            );
        });

        (totalItem == 0) ? $('#totalCount').html('') : $('#totalCount').html(totalItem);
        $('#totalCart').html(`${Number((priceIva).toFixed(1)).toLocaleString("en", {   
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })} ${actualCurrency.currencyName}`);
    }

    loadCart() {
        let cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
        cart && cart.length >= 1 ? $("#cartItems").removeAttr("disabled") : "";
    }

    loadCurrenyCountries() {
        let actualCurrency = JSON.parse(sessionStorage.getItem("currency"));

        $.ajax({
            url: URLCountry,
            dataType: "json",
            type: "GET",
            success: function (data) {
                data.forEach(function (currencies) {
                    let selected = (currencies.currency_code === actualCurrency.currencyName) ? 'selected' : '';

                    $("#countries").append(
                        `<option ${selected} value="${currencies.currency_code}">${currencies.currency_code} - ${currencies.country}</option>`
                    );
                });
            },
        });
    }

    changeCurrencies() {
        let self = this;
        let currencyCode = $("#countries").val();
        let actualCurrency = JSON.parse(sessionStorage.getItem('currency'));
    
        $.ajax({
            method: 'GET',
            url: `https://api.exchangerate-api.com/v4/latest/${actualCurrency.currencyName}`,
            success: function(data) {
                sessionStorage.setItem('currency', JSON.stringify({
                    'currencyName': currencyCode,
                    'CurrencyValue': data.rates[currencyCode]
                }));


                self.updateCurrencycart();
            },
        })
    }

    updateCurrencycart(){
        let self = this;
        let products = JSON.parse(sessionStorage.getItem('shoppingCart'));
        let actualCurrency = JSON.parse(sessionStorage.getItem('currency'));
    
        if(products) {
            products.forEach(function(product){
                product.price = parseFloat((product.price * actualCurrency.CurrencyValue).toFixed(2));
            });
            self.saveCart(products);
        
            if(actualCurrency.currencyName === 'USD'){
                sessionStorage.setItem('currency', JSON.stringify({
                    'currencyName': 'USD',
                    'CurrencyValue': 1
                }));
            }
            
            self.accountValues();
            self.showProducts();
        }
    }

    saveCart(item) { 
        sessionStorage.setItem('shoppingCart', JSON.stringify(item));
    }

    addItemToCart(productList, item) {
        let self = this;
        let actualCurrency = JSON.parse(sessionStorage.getItem('currency'));
        let itemList = productList.filter(product => product.name.includes(item.name));
        let cart = (sessionStorage.getItem('shoppingCart')) ? JSON.parse(sessionStorage.getItem('shoppingCart')) : [];
        let checkCart = cart.some(code => code.name === item.name); 

        $("#cartItems").removeAttr('disabled');
        
        if(checkCart){
            if(itemList[0].availability){
                cart.forEach(function(product){
    
                    if(product.name === item.name ) {
                        if(product.amount < itemList[0].stock){
                            product.amount++;
                            self.saveCart(cart);
                            self.showProducts();
                            return true;
                        }
                        else{
                            $("#messagePopUp").text('Lo sentimos, actualmente no disponemos de más stock');
                            $("#messageModel").modal('hide');

                            return false;
                        }
                    }
                });
            }
            else {
                $("#messagePopUp").text('Lo sentimos, actualmente no disponemos de más stock');
                $("#messageModel").modal('show');
    
                return false;
            }
        }
        else{
            if(itemList[0].availability){
                let itemCart = {
                    'name': item.name,
                    'amount': 1,
                    'price': parseFloat((item.price * actualCurrency.CurrencyValue).toFixed(2))
                };
                            
                cart.push(itemCart);
                self.saveCart(cart);
                self.showProducts();
                return true;
            }
        }        
    }

    showProducts(){
        let products = JSON.parse(sessionStorage.getItem('shoppingCart'));
        let actualCurrency = JSON.parse(sessionStorage.getItem('currency'));
    
        $("#showCart").html('');
    
        $("#showCart").append(`
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unidad</th>
            </tr>`
        );
    
        products.forEach(function(product){
            $("#showCart").append(`
                <tr>
                    <td>
                        ${product.name}
                    </td>
                    <td>
                        <div class="num-block skin-2">
                            <div class="num-in">
                                <span class="minus btnUpdate" data-operation="minus" data-name="${product.name}"></span>
                                <input type="text" class="in-num" value="${product.amount}" readonly="">
                                <span class="plus btnUpdate" data-operation="plus" data-name="${product.name}"></span>
                                <small class="remove" data-name="${product.name}">Remover</small>
                            </div>
                        </div>
                    </td>
                    <td>$ ${Number((product.price).toFixed(1)).toLocaleString("en", {   
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })} ${actualCurrency.currencyName}
                    </td>
                </tr>`
            );
        });

        this.accountValues();
    }

    updateSelectedItem(productList, item) {
        console.log(productList);
        let itemList = productList.filter(product => product.name.includes(item.name));
        let productsCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    

        console.log(productList);
        console.log(itemList);
        if(itemList[0].availability){
            productsCart.forEach(function(product) {
                if(product.name === item.name ) {
                    let result = productList.filter(product => product.name.includes(item.name));
    
                    if(item.operation === 'minus'){
                        if(product.amount > 1){
                            product.amount--;
                            this.saveCart(productsCart);
                            this.showProducts();
                        }
                    }
                    else{
                        if(product.amount < result[0].stock){
                            product.amount ++;
                            this.saveCart(productsCart);
                            this.showProducts();
                        }
                        else {
                            $("#messagePopUp").text('Lo sentimos, actualmente no disponemos de más stock');
                            $("#messageModel").modal('show');
                        }
                    }
                }
            }.bind(this));
        }
    }

    removeItemCart(item) {
        let cart = [];
        let productsCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    
        productsCart.forEach(function(product){
            cart = productsCart.filter(product => product.name !== item);
        });
    
        this.saveCart(cart);
        this.showProducts();
            
        if(cart.length === 0){
            this.removeCart();
            this.accountValues();
        }
    }

    removeCart(){
        $("#cartItems").attr("disabled", "");
        sessionStorage.removeItem('shoppingCart');
        $('#totalCount').html('');
        $('#totalCart').html(0);
        $("#showCart").html(''); 
        $("#cart").modal('hide');
    }

    checkout(){     
        this.removeCart();

        $("#cart").modal('hide');
        $("#messagePopUp").text('Gracias por su compra');
        $("#messageModel").modal('show');
    }
}
