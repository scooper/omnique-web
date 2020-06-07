'use strict'

// TODO: Add proper logging to EVERYTHING, log to a file stored in the appdata folder, just a basic text file generated based on the current date
//       so add a new one once the app recognises it is a new day (e.g. <date>.log, <nextdate>.log). All logs are timestamped, create a helper for this

var mongoose = require('mongoose');
var path = require('path')
var Schema = mongoose.Schema;

// class definition for easily creating and serialising product objects locally
class Product {
    constructor(id, name, description, images, categories, price, testProduct, state = null) {
        this.id = id
        this.name = name
        this.description = description
        this.images = images
        this.categories = categories
        this.price = price
        this.testProduct = testProduct
    }
}

// mongoose product schema
var ProductSchema = new Schema({
    _id: String,
    name: String,
    description: String,
    images: [String],
    categories: [String],
    price: Number,
    testProduct: Boolean,
    entryDate: { type: Date, default: new Date() },
    updated: Date
});

// product schema object
var ProductDB = mongoose.model('Product', ProductSchema)

// data access logic and conversion to Product class
class ProductDal {
    // saves a new product into DB
    static saveProduct(newProduct) {
        var newDBProduct = new ProductDB({
            _id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            images: newProduct.images.reduce((n, o) => (n.push(path.basename(o)), n), []),
            categories: newProduct.categories,
            price: newProduct.price,
            testProduct: newProduct.testProduct,
            updated: new Date()
        })

        newDBProduct.save((err) => {
            if (err) throw err
            console.log('Successfuly created DB product!')
        })
    }

    // updates product in DB
    static updateProduct(product) {
        ProductDB.findByIdAndUpdate(product.id, {
            name: product.name,
            description: product.description,
            images: product.images.reduce((n, o) => (n.push(path.basename(o)), n), []),
            categories: product.categories,
            price: product.price,
            testProduct: product.testProduct,
            updated: new Date()
        }, (err) => {
                if (err) throw err
                console.log('Sucessfuly updated DB product!')
        })
    }

    // deletes product from DB
    static deleteProduct(id) {
        ProductDB.findByIdAndDelete(id, (err) => {
            if (err) throw err
            console.log('Sucessfuly deleted DB product!')
        })
    }

    // get all products from DB (does care if they are new products) maybe this can be more clever down the line
    static async getProductsConverted() {
        var products = await ProductDB.find().lean()
        return products.reduce((n, o) => (n.push(this.schemaToProduct(o)), n), [])
    }

    // simple converter from schema to local product
    static schemaToProduct(schemaProduct) {
        return new Product(schemaProduct._id, schemaProduct.name, schemaProduct.description, schemaProduct.images, schemaProduct.categories, schemaProduct.price, schemaProduct.testProduct)
    }
}

module.exports = { ProductDal, Product }