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
    image: String,
    features: {
        type: Array
    },
    author: {
        type: String
    }
}, {collection: 'workshopItems'})

module.exports = mongoose.model('WorkshopItem', workshopItemSchema);

