const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    buyer: String,
    seller: String,
    status: String,
    totalPrice: Number,
    items: Array,
    // Add any other fields you need
}, {collection: 'payments'});

module.exports = mongoose.model('Payment', paymentSchema);