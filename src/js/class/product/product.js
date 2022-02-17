export class Product{
    constructor(name, price, brand, availability, stock, img){
        this.name = name;
        this.price = parseFloat(price);
        this.brand = brand;
        this.availability = availability;
        this.stock = parseInt(stock);
        this.img = img;
    }

    updateStock(amount){
        this.stock = this.stock - amount

        if(this.stock == 0){
            this.availability = false
        }
    }

    addArticlesList(productList){
        if($('#articles-list')){
            productList.forEach(function(product){
                $('#articles-list').append(`<article>
                <div class="product-content">
                    <div class="product-image"> 
                        <img src="${product.img}" class="prodcut-image" alt="tenis nike" title="producto">
                    </div>
        
                    <div class="product-details">
                        <div class="product-info">
                            <h3 class="name">
                                <a href="./product-details.html">
                                    ${product.name}
                                </a>
                            </h3>
                            <p class="price-container">
                                <span>$${product.price} USD</span>
                            </p>
                        </div>
                    </div>   
        
                    <div class="product-interaction">
                        <div class="rating">
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                        </div>
                        <div class="shopping-buttons">
                            <a href="./product-details.html">
                                <button class="btn btn-lg btn-block see-more">  
                                    <i class="fa fa-eye"></i>
                                    ver más
                                </button>
                            </a>
                            <button class="btn btn-lg btn-block buy" data-name="${product.name}" data-price="${product.price}"> 
                                <i class="fa fa-shopping-cart"></i>
                                Agregar al carrito
                            </button>
                        </div>
                    </div>                    
                </div>
            </article> `
                );
            })
        }    
    }
}   
