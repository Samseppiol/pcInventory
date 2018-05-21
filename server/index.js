const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const config = require('./config/config.json')
const app = express();


passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback"
    }, (accessToken, refreshToken, profile, cb) => {
        console.log('Access token:', accessToken)
        console.log('Refresh Token:', refreshToken)
        console.log('Profile:', profile)
    }
))
app.get('/', (req, res) => {
    res.send('Root page')
})
app.get('/success', (req, res) => {
    res.send('Successful Login!')
})
app.get('/auth/google', passport.authenticate('google', { scope: ['profile']}))

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
        res.redirect('/success')
    }
)


const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server listening on port: ${PORT}`));

