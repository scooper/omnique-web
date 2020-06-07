'use strict'

const $ = require('jquery')
const { remote, ipcRenderer } = require('electron')
const { Product } = require('../DAL/Product')
const { v4 } = require('uuid')

var selectedProduct = null

$(document).ready(function() {

    $('.file-choose').click(async function (e) {
        e.preventDefault()
        $(this).addClass("loading")

        var path = await remote.dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections']
        })

        $(this).removeClass("loading")

        var text = ''
        for (var file of path.filePaths) {
            // first iteration
            if (text == '')
                text = file
            else
                text = text + '\n' + file
        }
        $(this).siblings('textarea').val(text)
    })

})

ipcRenderer.on('mode', (event, product) => {
    // were updating information so populate fields
    if (product != null) {
        selectedProduct = product
        $('#title').text('Edit')
        $('#save-edit').append($('<button>').addClass('update btn').text('UPDATE'))
        $('#save-edit').append($('<button>').addClass('delete btn btn-error').text('DELETE'))

        // populate fields
        fieldsFromProduct(product)

        // add listeners
        $('.update').click(function (e) {
            e.preventDefault()
            let oldProduct = Object.assign({}, selectedProduct)
            var updatedProduct = updateProductFromFields(selectedProduct)
            ipcRenderer.send('update-product', updatedProduct, oldProduct)
        })

        $('.delete').click(function (e) {
            e.preventDefault()
            ipcRenderer.send('delete-product', selectedProduct)
        })

    }
    else { // we're adding a new product so all we need to do
        $('#title').text('Add')
        $('#save-edit').append($('<button>').addClass('add btn').text('ADD'))

        // add listener
        $('.add').click(function (e) {
            e.preventDefault()

            var newProduct = newProductFromFields()
            ipcRenderer.send('add-product', newProduct)
        })
    }
})

function fieldsFromProduct(product) {
    $('#name').val(product.name)
    $('#description').val(product.description)
    $('#price').val(product.price)
    var images = product.images.join('\n')
    $('#images').val(images)
    // select categories
    for (var category of product.categories) {
        $('option[value=' + category + ']').prop('selected', true)
        console.log(category)
    }
    // get the value of this being 'checked' or not
    if (product.testProduct)
        $('#testProduct').attr('checked', 'checked')
}

function updateProductFromFields(product) {
    product.name = $('#name').val()
    product.description = $('#description').val()
    product.price = parseFloat($('#price').val())
    product.images = $('#images').val().split('\n')
    var categories = []
    var selectedCategories = $('#categories option:selected')
    // loop chosen categories, add to array
    for (var category of selectedCategories) {
        categories.push($(category).val())
    }
    product.categories = categories
    // get the value of this being 'checked' or not
    product.testProduct = ($('#testProduct:checked').val() == 'testProd')
    return product
}

function newProductFromFields() {
    var name = $('#name').val()
    var description = $('#description').val()
    var price = parseFloat($('#price').val())
    var images = $('#images').val().split('\n')
    // select chosen categories and push to array
    var categories = []
    var selectedCategories = $('#categories option:selected')
    for (var category of selectedCategories) {
        categories.push($(category).val())
    }
    // get the value of this being 'checked' or not
    var isTestProduct = ($('#testProduct:checked').val() == 'testProd')
    return new Product(v4(), name, description, images, categories, price, isTestProduct)
}
