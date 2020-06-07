'use strict'

const path = require('path')
const fs = require('fs')
const Store = require('electron-store')

// new and old config code
const defaultConfig = require('./configs/defaultConfig.json')
const ConfigHelper = require('./helpers/configHelper')
// DB operations on products
const { ProductDal } = require('./DAL/Product')
// to minify images
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const DropboxLocation = ConfigHelper.getConfig().dropboxFilePath.value


// TODO: Scrap the stupid state thing I've added, we dont need it, just straight up do DB operations on ADD, UPDATE, DELETE and save to file for cache purposes
//       Instead of 'sync to DB' we'll have 'Download latest' which will just give us a newly updated file of products from the DB, overwriting our local file

class ProductData extends Store {
    constructor(settings) {
        super(settings)

        // initialize with products (from file)
        this.products = this.get('products') || []
    }

    async downloadProductsFromDB() {
        // FUTURE PLAN: figure out a clever way of knowing there have been changes, maybe a separate doc store with 'APP' IDs
        //              of each app using the service (saved in config) and if a change has occured after the current app's last change
        //              then we update

        // populate the products store with the current DB state (perhaps should be used on start, or manually)
        var products = await ProductDal.getProductsConverted()
        // append dropbox location so we have a real absolute path to work from (if it's in the DB it should be in dropbox too)
        for (var product of products) {
            product.images = product.images.reduce((n, o) => (n.push(DropboxLocation + '\\' + o), n), [])
        }
        this.products = products
        this.saveProducts()
        return Promise.resolve(this.products)
    }

    // function that takes a file path array and copies those files into the configured dropbox location
    // TODO: this should also make images smaller using imagemin
    async moveFilesToDropBox(files) {
        await imagemin(files, {
            destination: DropboxLocation,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ],
            glob: false
        }).then(() => {
            console.log('Images optimized')
        }, (err) => {
            console.log('Error: ', err)
        })
    }

    async deleteFilesFromDropBox(files) {
        for (var file of files) {
            var filename = path.basename(file)
            var dbFileLocation = DropboxLocation + '\\' + filename;
            if (fs.existsSync(dbFileLocation)) {         
                fs.unlink(dbFileLocation, (err) => {
                    if (err) throw err
                    console.log('Deleted Successfuly')
                })
            }
        }
    }

    saveProducts() {
        this.set('products', this.products)
        // returning 'this' allows method chaining
        return this
    }

    addProduct(product) {
        // do DB operation
        ProductDal.saveProduct(product)
        // add images to dropbox
        this.moveFilesToDropBox(product.images)
        // merge the existing products with the new product and save to file
        this.products = [...this.products, product]
        return this.saveProducts()
    }

    deleteProduct(product) {
        // do DB operation
        ProductDal.deleteProduct(product.id)
        this.deleteFilesFromDropBox(product.images)
        this.products = this.products.filter(p => p.id != product.id)
        return this.saveProducts()
    }

    updateProduct(product, oldProduct) {
        // TODO: do DB operation

        var toAdd = []
        var toDelete = []

        // check if both image arrays are the same, if so we skip
        // get diff of images
        var oldProductFiles = oldProduct.images.reduce((n, o) => (n.push(path.basename(o)), n), [])
        var productFiles = product.images.reduce((n, o) => (n.push(path.basename(o)), n), [])

        // get images that are in updated but not in old products (these are to add to dropbox)
        for (var image of product.images) {
            if (!(oldProductFiles.includes(path.basename(image))))
                toAdd.push(image)
        }

        // get images that are in old products but not in updated (these are to delete from dropbox)
        for (var image of oldProduct.images) {
            if (!(productFiles.includes(path.basename(image))))
                toDelete.push(image)
        }

        // db operation
        ProductDal.updateProduct(product)

        // perform dropbox operations
        this.deleteFilesFromDropBox(toDelete)
        this.moveFilesToDropBox(toAdd)

        // find index of product and update, save to file
        var index = this.products.findIndex(p => p.id == product.id)
        if(!(index < 0))
            this.products[index] = product

        return this.saveProducts()
    }
}

class ConfigData extends Store {
    constructor(settings) {
        super(settings)

        // initialize with products (from file)
        this.config = this.get('config') || defaultConfig
    }
}

module.exports = { ConfigData, ProductData }