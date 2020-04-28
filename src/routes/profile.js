const express = require('express');
const router = express.Router();
const path = require('path');

const Show = require('../models/show.js')

const flash = require('express-flash')

router.get('/profile', isLoggedIn, checkUserRole, (req, res) => {

    res.render("profile.ejs", {
        title: "Welcome",
        session: req.session
    })
})

function checkUserRole(req, res, next){
  if(req.session.userRole == "Artist"){
    
    Show.findById('5ea63b9313c98f3c4c5bfc3d',  function (err, show) {
      console.log(show) 
    })


    res.render("artist_dashboard.ejs", {
      title: "Welcome",
      session: req.session,
      scripts: ['socket.io.js','add_show.js']
  })
  }else{

    

getShows(req, res, next)


  //   res.render("profile.ejs", {
  //     title: "Welcome",
  //     session: req.session,
  //     shows: shows,
  //     scripts: ['socket.io.js','add_show.js']
  // })
  }
}


async function getShows(req, res, next) {
  const shows = await Show.find({})

  console.log(shows)

  res.render("profile.ejs", {
    title: "Welcome",
    session: req.session,
    shows: shows,
    scripts: ['socket.io.js','add_show.js']
  })
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