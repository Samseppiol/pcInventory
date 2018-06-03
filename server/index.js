const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/inventory/all', (req, res) => {
    res.send('All inventory page!');
})


module.exports.handler = serverless(app);