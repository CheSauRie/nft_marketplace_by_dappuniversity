const mongoose = require("mongoose");

const workshopItemSchema = new mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    brand: {
        type: String
    },
    product_details: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String    
    },
    features: {
        type: Array
    },
    author: {
        type: Array
    }
}, {collection: 'workshopItems'})

module.exports = mongoose.model('WorkshopItem', workshopItemSchema);

