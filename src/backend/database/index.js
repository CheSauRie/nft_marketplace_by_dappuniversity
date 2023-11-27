const express = require("express");
const Product = require("./models/Product.js")
require("./db.js");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Customer = require("./models/Customer.js");

require("dotenv").config();

const port = 3001;
const app = express();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const limit = 20;

app.use(bodyParser.json());

app.get('/product/:target', async (req, res) => {
    try {
        const target = req.params.target;
        console.log(target);
        let productsList;
        if (target == 'null' || target == ' ') {
            console.log('Check 1');
            productsList = await Product.find().limit(limit);
        } else {
            console.log('Check 2');
            productsList = await Product.find({ title: {$regex: target}}).limit(limit);
        }
        for (let object of productsList) {
            if (object.price != null) {
                const tempArr = object.price.split(" ");
                object.price = tempArr[0];
            }
        }
        res.json(productsList);
        console.log(productsList);
        console.log('Fetch successfully')
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products data' });
    }
});

app.get('/product/:name', async (req, res) => {

    try {
        const productName = req.params.name;
        const product = await Product.findOne({ title: productName });
        console.log(product);
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Error loading product detail' })
    }
});

app.get('/auth/:id', async (req, res) => {
    const metaMaskId = req.params.id;

    Customer.findOne({ customerId: metaMaskId })
        .then(
            async (savedCustomer) => {
                try {
                    if (savedCustomer) {
                        res.send({ message: true })
                    } else {
                        res.send({ message: false })
                    }
                } catch (err) {
                    return res.status(442).send({ error: err.message });
                }
            }
        )

});

app.post('/create-customer', async (req, res) => {
    const { customerId, customerName, address } = req.body;
    const customer = new Customer({
        customerId,
        customerName,
        address
    })
    try {
        await customer.save();
        return res.status(200).send({ message: 'Save info successfull, please reload page' });
    } catch (err) {
        console.log('Error', err);
        return res.status(442).send({ error: err.message });
    }
})