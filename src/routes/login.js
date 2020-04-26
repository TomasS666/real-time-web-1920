const Artist = require('../models/artist.js');
const bcryptjs = require('bcryptjs');
const express = require('express');
const router = express.Router();
const flash = require('express-flash')
// Middleware
const loginValidation = require('../middleware/login-validation.js');

const User = require('../models/User_BASE');

router.get('/login', (req, res) => {
    /*   I check everywhere with my middleware authentication if someone is not logged in yet.
     *   If a user is not logged in, it renders the login page. 
     *   If you are logged in, and you go to the /login route, I made an exception down below.
     *   It redirects you to /my-profile where the my profile route is handled.
     */
    if (req.session.user) {
        return res.redirect('/profile');
    }

    /* Rendering login with a title, and offline to true.
     *  In the header I check if the property offline is given anyways.
     *  Based on that I render the logout button or not.
     *  Then I give a property of errors which holds the errors thrown by validation in the session.
     */
    res.render('login.ejs', {
        title: 'Login',
        offline: true,
        errors: req.session.errors,
        customMessage: req.session.customError
    });
    // Cleaning up the errors after they've been rendered.
    req.session.errors = null;
});


router.post('/login', loginValidation, findUser,  (req, res) => {
    console.log('test');

  


  
  
});



function findUser(req, res, next) {

    // const userrole = req.body.userrole
    // console.log(userrole + 'is trying to login')

      // User query where the input of the username, in my case the unique username which is the emailaddress.
    User.findOne({
        userName: req.body.username
    }).exec()
    //  Exec makes this query an full promise

    /*  Then get the result of the query. If the user evaluates to true, compare the input of the password field
     *   to the password of the user that has been found in the database.
     *   If the result equals to true, create a session
     *   Redirect to my profile, where the session can be used, if there is no session available there, the user
     *   will return to the login route.
     */
    .then((user) => {
       
        if (user) {
            console.log("user found?s")
            bcryptjs.compare(req.body.password, user.password)
                .then((result) => {
                    if (result === true) {
                        console.log('nice, logged in');
                        req.session.user = user.userName;
                        req.session.firstName = user.firstName;
                        console.log(req.session.user)

                        console.log('sending to my profile');

                        return res.status(200).redirect('/profile');
                    } else if (result !== true) {

                        req.session.customError = "Invalid Credentials";
                        console.log(err)
                        console.log('ik hoop dat je hier terecht komt')
                        // reject(new Error('Could not be authenticated'));
                        return res.render('/login')
                    } else {
                        throw 'errorrr';
                    }

                }).catch((err) => {
                    req.flash('warning', "Please try again")
                    res.redirect(req.get('referrer'))

                    // let errors = req.validationErrors();
                    // req.session.customError = "Invalid Credentials";
                    // console.log(err)
                    // console.log('ik hoop dat je hier terecht komt')
                    // // reject(new Error('Could not be authenticated'));
                    // return res.render('/login')
                })
        }
        else{
            throw "User can't be found";
        }
    })
    .catch(err => {
        console.log(err)
        console.log('come here')
        req.flash('info', 'Please try again')
        res.redirect('/login')
    })



}

module.exports = router;