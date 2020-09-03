
function log(products){
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
        console.table(output);
}

module.exports.log = log;
