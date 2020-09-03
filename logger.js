
//prints the result in tables on console
function log(products, mostExpensiveProducts, cheapestProducts){

    let output = [];
    for(let category of products.keys())
    {
        output.push({category});

        products.get(category).forEach(function (product, index){
            output.push({
                Name: product.name,
                Price: product.price,
                "In stock": product.inStock,
            });
        });

    }
    console.log("All products (" + getNumberOfProducts(products) + ")");
    console.table(output);
    console.log("Most expensive product(s)");
    console.table(mostExpensiveProducts);
    console.log("Cheapest product(s)");
    console.table(cheapestProducts);
}

function getNumberOfProducts(products){
    let count = 0;
    for (let category of products.keys()){
        count += products.get(category).length;
    }
    return count;
}

module.exports.log = log;
