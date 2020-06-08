/* *
 * This is where we will get product information from our DB in various forms
 */

var Product = require('../models/Product')

export class ProductDal {
    public static getProducts(parString: string, includeTestProducts: boolean = false) {
        //var filter = "/" + parString + "/i";
        //Product.find({ name: filter }, function (err, docs) {

        //});
        var products;
        Product.find
            .where('name').like(parString)
            .where('testProduct').equals(includeTestProducts)
            .exec(function (err, docs) {
                products = docs;
            });

        return products;
    }
}
