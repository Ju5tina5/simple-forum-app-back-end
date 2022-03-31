const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const router = require('./routes/main')
require('dotenv').config();

app.use(express.json());
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})

// Cors validation
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

mongoose.connect(process.env.MONGO_DB)
    .then(res => {
        console.log('Connected to DB')
    }).catch(e => {
    console.log(e)
})

app.use('/', router);