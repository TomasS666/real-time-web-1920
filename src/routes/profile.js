const express = require('express');
const router = express.Router();
const path = require('path');

const flash = require('express-flash')

router.get('/profile', isLoggedIn, checkUserRole, (req, res) => {
    res.render("profile.ejs", {
        title: "Welcome",
        session: req.session
    })
})

function checkUserRole(req, res, next){
  if(req.session.userRole == "Artist"){
    res.render("artist_dashboard.ejs", {
      title: "Welcome",
      session: req.session
  })
  }else{
    res.render("profile.ejs", {
      title: "Welcome",
      session: req.session
  })
  }
}

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