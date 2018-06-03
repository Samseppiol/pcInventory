const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const INVENTORY_TABLE = process.env.INVENTORY_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    console.log(dynamoDb);
}   else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }))

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/inventory/all', (req, res) => {
    res.send('All inventory page!');
})

app.get('/inventory/:componentName', (req, res) => {
    const params = {
        TableName: INVENTORY_TABLE,
        Key: {
            componentName: req.params.componentName,
        },
    }  
    console.log(req.params.componentName) 
    console.log(params) 

    dynamoDb.get(params, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ error: 'Could not get component'})
        }
        if (result.Item) {
            const {componentName, quantity, timestamp } = result.Item;
            res.json({ componentName, quantity, timestamp})
        } else {
            res.status(404).json({ error: "Component not found" })
        }
    })
});

app.post('/inventory/new', (req, res) => {
    const {componentName, quantity} = req.body;
    if (typeof componentName !== 'string') {
        res.status(400).json({ error: 'Component name must be a string.'});
    } else if (typeof quantity !== 'number') {
        res.status(400).json({ error: "Quantity must be a number"});
    }
    const timestamp = new Date();
    const params = {
        TableName: INVENTORY_TABLE,
        Item: {
            componentName: componentName,
            quantity: quantity,
            timestamp: timestamp
        },
    }

    dynamoDb.put(params, (err) => {
        if (err) {
            res.status(400).json({ error: 'Could not create component'})
        }
        res.json({ componentName, quantity, timestamp})
    })
})




module.exports.handler = serverless(app);