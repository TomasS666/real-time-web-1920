const express = require('express');
const router = express.Router();
const path = require('path');

const flash = require('express-flash')

router.get('/profile', isLoggedIn, (req, res) => {
    res.render("profile.ejs", {
        session: req.session
    })
})

function isLoggedIn(req, res, next){
    if(req.session.user){
      return next()
    }else{
      console.log('not logged in')
      req.flash("warning", "Not logged in")
      res.redirect('/login')
    }
  }

module.exports = router