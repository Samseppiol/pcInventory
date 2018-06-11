const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const moment = require('moment');
const time = moment()

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
    const params = {
        TableName: INVENTORY_TABLE,
    }
 
    console.log(`Scanning ${params.TableName} table`)
    // Using a scan should be fine as the table should be a very small amount of records. 
    dynamoDb.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan the table with error", err)
            res.status(404).json({ error: "Table not found!" })
        } else if (data.Count === 0 ){
            res.status(404).json({ error: "No components found" })
        }
        else {
            console.log("Scan succeeded")
            res.json(data.Items)
        }
    });

    
})

app.get('/inventory/:componentName', (req, res) => {
    const params = {
        TableName: INVENTORY_TABLE,
        Key: {
            componentName: req.params.componentName,
        },
    }  

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
    const timestamp = time.format('YYYY-MM-DD HH:mm:ss Z')  
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
        console.log(timestamp)
        res.json({ componentName, quantity, timestamp })
    })
})

app.delete('/inventory/delete/:componentName', (req, res) => {
    const params = {
        TableName: INVENTORY_TABLE,
        Key: {
            componentName: req.params.componentName,
        },
    }
    
    dynamoDb.delete(params, (err, data) => {
        console.log(data)
        if (err) {
            console.error(`Unable to delete record: ${req.params.componentName}`)
            res.status(400).json({ error: `Could not delete component ${req.params.componentName}`})
        } else {
            console.log(`Delete of item ${req.params.componentName} succeeded.`)
            res.status(200).json({ message: `Delete of item ${req.params.componentName} successful`})
        }
    })
})




module.exports.handler = serverless(app);