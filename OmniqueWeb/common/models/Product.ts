var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    description: String,
    imagePaths: [String],
    price: Number,
    testProduct: Boolean,
    entryDate: Date,
    updated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Product', ProductSchema);