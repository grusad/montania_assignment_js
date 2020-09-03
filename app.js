
const logger = require("./logger")
const https = require("https");

let mostExpensiveProducts = [];
let cheapestProducts = [];

class Product {
    constructor(name, price, inStock, category){
        this.name = name;
        this.price = price;
        this.inStock = inStock;
        this.category = category;
    }
}

function getHttpResponse(callback){
     const URL = "https://dev14.ageraehandel.se/sv/api/product";
     let data = "";
     https.get(URL, function(res){
        let data = "";

        res.on("data", function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(JSON.parse(data));
        });
    })
}

// generate products from the provided data
function generateProducts(data){

    let items = new Map();

    for(index in data){
        let product = buildProduct(data[index]);
        let key = product.category;

        if(items.has(key)){
            items.get(key).push(product);
        }
        else {
            items.set(product.category, [product]);
        }
    }

    return items;
}

function sortProducts(products){
    for(let category of products.keys())
    {
        products.get(category).sort(function(a, b){
            return (a.name < b.name) ? -1 : 1;
        });
    }
}

//Inspect the price of current product and places it in the correct array. (Most or least expensive array)
function inspectProduct(product){
    if(mostExpensiveProducts.length > 0){
        let current = mostExpensiveProducts[0].price;
        if(product.price > current){
            mostExpensiveProducts = [product];
        }
        else if(product.price == current){
            mostExpensiveProducts.push(product);
        }
    }
    else{
        mostExpensiveProducts.push(product);
    }
    if(cheapestProducts.length > 0){
        let current = cheapestProducts[0].price;
        if (product.price < current){
            cheapestProducts = [product];
        }
        else if(product.price == current){
            cheapestProducts.push(product);
        }
    }
    else{
        cheapestProducts.push(product);
    }

}

//constructs and returns a Product object based of data provided
function buildProduct(itemData){

    let name = getPropertyFromData(itemData, "artiklar_benamning");
    let price = getPropertyFromData(itemData, "pris");
    let stock = getPropertyFromData(itemData, "lagersaldo");
    let category = getPropertyFromData(itemData, "artikelkategorier_id");
    let VAT = getPropertyFromData(itemData, "momssats");

    if(price != null && VAT != null) price *= VAT * 0.01 + 1.0;
    if(name == null) name = "[Unnamed]";
    if(category == null) category = "Uncategorized";
    stock = (stock > 0) ? "Yes" : "No";


    let product = new Product(name, price, stock, category);
    inspectProduct(product);
    return product;
}

function getPropertyFromData(source, property){
    if(!source.hasOwnProperty(property)){
        return null;
    }
    return source[property];
}

function run(){
    getHttpResponse(function(result){
        let products = generateProducts(result.products);
        sortProducts(products);
        logger.log(products, mostExpensiveProducts, cheapestProducts);
    });

}

run();
