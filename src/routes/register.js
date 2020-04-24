const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Artist = require('../models/artist.js');
const bcryptjs = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('register.ejs', {
        title: 'Sign-up',
        offline: true,
        errors: req.session.errors
    });
    req.session.errors = null;
});

router.post('/register', (req, res) => {

    console.log("test")

    registerUser(req, res)
        .then(() => {
            req.session.errors = null;
            res.redirect('/login');
        })
        .catch((err) => console.log(`Following error occured: ${err.message}`));

    function registerUser(req, res) {
        return new Promise((resolve, reject) => {


            // Store hash in your password DB.
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {

                    // Store hash in your password DB.
                    let user = new Artist({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userName: req.body.emailaddress,
                        password: hash
                    });
                    console.log(user);

                    user.save((error) => {
                        console.log(error)
                    });

                    resolve('User has been added and saved to the db');
                });
            });
        });
    }


});

module.exports = router;