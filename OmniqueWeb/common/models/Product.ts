var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Product', ProductSchema);