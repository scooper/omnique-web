'use strict'

// Modules to control application life and create native browser window
const { app, ipcMain } = require('electron')
const ConfigHelper = require('./helpers/configHelper')
const path = require('path')

const Window = require('./Window')
const { ConfigData, ProductData } = require('./LocalData')
const env = process.env.NODE_ENV || 'development';
const mongoose = require('mongoose');

const config = ConfigHelper.getConfig();

if (env == 'development')
    require('electron-reload')(__dirname)

const productsData = new ProductData({ name: 'products'})

function main() {
    // init mongo TODO: this should be also be used when updating the config - in case the connectionstring changes, reload mongoDB connection
    mongoose.connect(config.mongodbConnectionString.value, { useNewUrlParser: true });
    var db = mongoose.connection;

    // product list window
    let mainWindow = new Window({
        file: path.join('render', 'index.html'),
    })

    // add product window
    let productWin
    let configWin

    // initialize with products
    mainWindow.once('show', () => {
        mainWindow.webContents.send('title', config.brandName.value)
        mainWindow.webContents.send('products', productsData.products)
    })

    //*************************
    // Main Events

    // create add product window
    ipcMain.on('product-window', (event, id = null) => {
        // if addproductWin does not already exist
        if (!productWin) {
            // create a new add product window
            productWin = new Window({
                file: path.join('render', 'product.html'),
                width: 800,
                height: 800,
                // close with the main window
                parent: mainWindow
            })

            productWin.setMenuBarVisibility(false)

            // cleanup
            productWin.on('closed', () => {
                productWin = null
            })
        }
        productWin.on('show', () => {
            var index = productsData.products.findIndex(p => p.id == id)
            var product = productsData.products[index] || null
            productWin.webContents.send('mode', product)
        })
    })

    // create config window
    ipcMain.on('config-window', (event) => {
        // if configWin does not already exist
        if (!configWin) {
            // create a new config window
            configWin = new Window({
                file: path.join('render', 'config.html'),
                width: 1000,
                height: 400,
                // close with the main window
                parent: mainWindow
            })

            configWin.setMenuBarVisibility(false)

            // cleanup
            configWin.on('closed', () => {
                configWin = null
            })
        }
    })

    //*************************
    // Product Events

    // add-product from add product window
    ipcMain.on('add-product', (event, product) => {
        var updatedproducts = productsData.addProduct(product).products

        mainWindow.send('products', updatedproducts)
        productWin.close()
    })

    // add-product from add product window
    ipcMain.on('update-product', (event, product, oldProduct) => {
        var updatedproducts = productsData.updateProduct(product, oldProduct).products

        mainWindow.send('products', updatedproducts)
        productWin.close()
    })

    // delete-product from product list window
    ipcMain.on('delete-product', (event, product) => {
        var updatedproducts = productsData.deleteProduct(product).products

        mainWindow.send('products', updatedproducts)
        productWin.close()
    })

    ipcMain.on('download-data', async (event) => {
        var updatedproducts
        try {
            updatedproducts = await productsData.downloadProductsFromDB()
        } catch (e) {
            console.log('Something went wrong!')
            updatedproducts = []
        }

        mainWindow.send('products', updatedproducts)
    })

    //*************************
    // Config Events

    // reload config window to get new config values
    ipcMain.on('reload-config-page', (event) => {
        app.quit()
    })
    
}

app.on('ready', main)

app.on('window-all-closed', function () {
    app.quit()
})