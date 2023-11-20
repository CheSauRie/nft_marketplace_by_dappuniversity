const express = require("express");
const Product = require("./models/Product.js")
require("./db.js");

const mongoose = require("mongoose");

require("dotenv").config();

const port = 3001;
const app = express();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const limit = 20;

app.get('/product', async (req, res) => {
    try {
        const productsList = await Product.find().limit(limit);
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
        const product = await Product.findOne({title: productName});
        res.json({product});
    } catch (error) {
        res.status(500).json({error: 'Error loading product detail'})
    }
});