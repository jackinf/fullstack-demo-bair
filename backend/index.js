// express app
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

// CREATE
app.post('/api/bikes', async (req, res) => {
    const bike = req.body;

    // Validation
    if (!bike.brand || !bike.model || !bike.year || !bike.price) {
        res.status(400).send('Missing required fields: brand, model, year (number), price (decimal)');
        return;
    }

    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db('bikes');
    const result = await db.collection('data').insertOne({
        brand: bike.brand,
        model: bike.model,
        year: parseInt(bike.year),
        price: parseFloat(bike.price)
    });

    res.send(result);
});

// GET
app.get('/api/bikes', async (req, res) => {
    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db('bikes');
    const result = await db.collection('data').find().toArray();

    res.send(result);
});

// GET SINGLE
app.get('/api/bikes/:id', async (req, res) => {
    const id = req.params.id;
    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db('bikes');

    const result = await db.collection('data').findOne({ _id: new ObjectId(id) });

    res.send(result);
});

// UPDATE
app.put('/api/bikes/:id', async (req, res) => {
    const id = req.params.id;
    const bike = req.body;

    // Validation
    if (!bike.brand || !bike.model || isNaN(bike.year) || isNaN(bike.price)) {
        res.status(400).send('Missing required fields: brand, model, year (number), price (decimal)');
        return;
    }

    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db('bikes');
    const result = await db.collection('data').updateOne({ _id: new ObjectId(id) }, {
        $set: {
            brand: bike.brand,
            model: bike.model,
            year: parseInt(bike.year),
            price: parseFloat(bike.price)
        }
    });

    res.send(result);
});

// DELETE
app.delete('/api/bikes/:id', async (req, res) => {
    const id = req.params.id;

    const client = await MongoClient.connect(mongoConnectionString);
    const db = client.db('bikes');
    const result = await db.collection('data').deleteOne({ _id: new ObjectId(id) });

    res.send(result);
});

const port = 8000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
