'use strict'

const $ = require('jquery');
const { ipcRenderer } = require('electron')


const addProduct = () => {
    ipcRenderer.send('product-window')
}

const updateProduct = (id) => {
    ipcRenderer.send('product-window', id)
}

const showConfig = () => {
    ipcRenderer.send('config-window')
}

const downloadFromDB = () => {
    ipcRenderer.send('download-data')
    // set as loading (syncing)
    $('#sync').addClass('loading')
    // TODO: Add a receive event when it's done syncing and remove loading class
}

$('.createProduct').click(addProduct)
$('#config').click(showConfig)
$('#sync').click(downloadFromDB)

function makeProductDiv(product) {
    var container = $('<div>').addClass('product-container card text-left')
    $(container).append($('<div>').addClass('card-header').append($('<div>').addClass('card-title h5').html(product.name + ' - &pound;' + product.price)))
    $(container).append($('<div>').addClass('card-body').text(product.description))
    var editButton = $('<button>').addClass('btn btn-edit').text('Edit')
    var footer = $('<div>').addClass('card-footer').append(editButton)
    $(container).append(footer);
    // TODO: add some sort of image preview container
    $(editButton).click(() => {
        updateProduct(product.id)
    })

    return container
}

// on receive products
ipcRenderer.on('products', (event, products) => {
    // this may be a download to remove the loading class
    $('#sync').removeClass('loading')
    // get the productList div
    const productList = $('#productList')

    $(productList).empty()

    for (var product of products) {
        $(productList).append($(makeProductDiv(product)))
    }
    

    // build a list of items using the passed products
})

// on receive brand name
ipcRenderer.on('title', (event, title) => {
    // set title
    $('#title').text(title + ' Admin');
})