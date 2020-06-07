/* *
 * This is where we will get product information from our DB in various forms
 */

var Product = require('../models/Product')

export class ProductDal {
    public static createProduct(code: string, name: string, imagePaths: string[], price: number, testProduct: boolean = false): boolean {
        var product = new Product({ name: name, imagePaths: imagePaths, price: price, testProduct: testProduct, entryDate: new Date() });
        product.save(function (err) {
            if (err) {
                console.error("Error creating product: ", err);
                return false;
            }
        });
        console.log("Product sucessfully created.");
        return true;
    }

    public static updateProduct(id: string, name: string, imagePaths: string[], price: number, testProduct: boolean = false) {
        //
        Product.updateOne({ _id: id }, { name: name, imagePaths, price: price, testProduct: testProduct });
    }

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
