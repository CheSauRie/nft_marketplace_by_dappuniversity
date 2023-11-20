const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    url: {
        type: String
    },
    title: {
        type: String
    },
    asin: {
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
    breadcrumbs: {
        type: String
    },
    images_list: {
        type: Array
    }, 
    features: {
        type: Array
    }
}, {collection: 'shoes'})

module.exports = mongoose.model('Product', productSchema);