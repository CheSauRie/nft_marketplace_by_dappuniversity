const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String
    },
    customerName: {
        type: String
    },
    address: {
        type: String
    },
}, {collection: 'customers'})

module.exports = mongoose.model('Customer', customerSchema);

