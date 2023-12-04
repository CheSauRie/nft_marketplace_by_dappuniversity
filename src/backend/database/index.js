const express = require("express");
const Product = require("./models/Product.js")
const Payment = require("./models/Payment.js")
require("./db.js");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const Customer = require("./models/Customer.js");
var cors = require('cors')
const { SupportedAlgorithm } = require("ethers/lib/utils.js");
const { async } = require("q");
const { result } = require("underscore");
const WorkshopItem = require("./models/WorkshopItem.js");

require("dotenv").config();

var fs = require('fs');
var path = require('path');

var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

const port = 3001;
const app = express();
app.use(cors({
    origin: 'http://localhost:3000' // restricts CORS to this origin
}));
app.use(express.json());
app.use('/contractsData', express.static(path.join(__dirname, '../../frontend/contractsData')));



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

app.get('/workshop-item', async (req, res) => {
    try {
        const workshopItem = await WorkshopItem.find();
        res.json(workshopItem);
        console.log(workshopItem);
        console.log('Fetch successfully');
    } catch (error) {
        res.status(500).json({ error: 'Error fetching workshop item' })
    }
})

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

app.post('/create-item', upload.single('image') ,async (req, res) => {
    const {
        title,
        price,
        author,
    } = req.body;
    const brand = 'BOAT';
    const item = new WorkshopItem({
        title,
        price,
        brand,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        author,
    })
    try {
        await item.save();
        return res.status(200).send({ message: 'Create product successfull, please reload page' });
    } catch (err) {
        console.log('Error', err);
        return res.status(442).send({ error: err.message });
    }
})

app.post('/save-payment', async(req, res) => {
    const {buyer, seller, status, totalPrice, items} = req.body;
    const payment = new Payment({
        buyer,
        seller,
        status,
        totalPrice,
        items
    })
    console.log(payment);
    try {
        await payment.save();
        return res.status(200).send({ message: 'Save payment successfully'})
    } catch (err) {
        console.log(err);
        return res.status(442).send({message: err.message})
    }
})

app.get('/total-spent/:buyer', async (req, res) => {
    const buyer = req.params.buyer;
    try {
        Payment.aggregate([
            { $match: { buyer: buyer } },
            { $group: { _id: '$buyer', totalPrice: { $sum: '$totalPrice' } } }
        ])
        .then(result => {res.json(result);})
        .catch(err => console.error(err));
        
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products data' });
    }
});

app.get('/purchase/:buyer', async (req, res) => {
    try {
        const buyer = req.params.buyer;
        const payment_data = await Payment.find({buyer: buyer});
        console.log(payment_data);
        res.json(payment_data);
    } catch (error) {
        res.status(500).json({ error: 'Error loading purchases item' });
    }
})