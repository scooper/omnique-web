/* *
 * This is where we will get product information from our DB in various forms
 */

var Product = require('../models/Product')

async function getProductsByName(parString: string, includeTestProducts: boolean = false) {
    return await Product.find
        .where('name').like(parString)
        .where('testProduct').equals(includeTestProducts)
}

async function getProducts(includeTestProducts: boolean = false) {
    return await Product.find().lean().where('testProduct').equals(includeTestProducts)

}

export {getProductsByName, getProducts}

