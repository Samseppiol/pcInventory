const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const app = express();



app.get('/', (req, res) => {
    res.send('Hello World');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server listening on port: ${PORT}`));

