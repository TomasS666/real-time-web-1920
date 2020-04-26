const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Artist = require('../models/artist.js');
const Visitor  = require('../models/visitor.js');
const bcryptjs = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register.ejs', {
        title: 'Sign-up',
        offline: true,
        errors: req.session.errors,
        script:[]
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
        .catch((err) => {
            console.log(`Following error occured: ${err.message}`)
            res.redirect(req.get('referrer'));
        });

    function registerUser(req, res) {
        return new Promise((resolve, reject) => {


            // Store hash in your password DB.
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {

                    let user = null;
                    if(req.body.userRole){

                         // Store hash in your password DB.
                        const data = {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            userName: req.body.emailaddress,
                            password: hash
                        }
                        
                        if(req.body.userRole == "artist"){
                            user = new Artist(data)
                        }else if(req.body.userRole == "visitor"){
                            user = new Visitor(data)
                        }else{
                            reject("not a valid userrole")
                        }
                    }else{
                        reject("Userrole not set")
                    }


                   
                 
                    if(user != null){
                        user.save((error, doc) => {
                            console.log(doc)
                        });
                    }else{
                        console.log("Couldn't save", user)
                    }
                   

                    resolve('User has been added and saved to the db');
                });
            });
        });
    }


});

module.exports = router;