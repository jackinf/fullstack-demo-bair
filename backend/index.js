// express app
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require("./middlewares");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

// app.get('/liveness_check', (req, res) => res.status(200).send('OK'));
// app.get('/readiness_check', (req, res) => res.status(200).send('OK'));

app.get('/', (req, res) => res.send('Welcome to the Bikes API!'));

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
app.get('/api/bikes', authenticateToken, async (req, res) => {
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

/*
    * Authentication
 */

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || typeof username !== 'string' || username.trim() === '') {
        return res.status(400).send('Invalid username');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await MongoClient.connect(mongoConnectionString);
        const db = client.db('bikes');
        const usersCollection = db.collection('users');
        await usersCollection.insertOne({
            username,
            password: hashedPassword
        });
        res.status(201).send('User created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const client = await MongoClient.connect(mongoConnectionString);
        const db = client.db('bikes');
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.status(400).send('Login Failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in user');
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
