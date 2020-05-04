const express = require('express');
const router = express.Router();
const path = require('path');

// middleware
const isLoggedIn = require('../../middleware/is-logged-in')

const Show = require('../../models/show')
const Artist = require('../../models/artist')

const flash = require('express-flash')

router.get('/profile', isLoggedIn, checkUserRole, (req, res) => {

  res.render("profile.ejs", {
    title: "Welcome",
    session: req.session
  })
})

function checkUserRole(req, res, next) {
  if (req.session.user.userrole == "Artist") {

    // Show.findById('5ea63b9313c98f3c4c5bfc3d', function (err, show) {
    //   console.log(show)
    // })

    getShows(req.session.user)
      .then(shows =>{
        res.render("artist_dashboard.ejs", {
          title: "Welcome",
          session: req.session,
          shows: shows,
          scripts: ['socket.io.js', 'artist_events.js']
        })
      })


  } else if(req.session.user.userrole == "Visitor") {

    getShows()
      .then(shows => {
        res.render("profile.ejs", {
          title: "Welcome",
          session: req.session,
          shows: shows,
          scripts: ['socket.io.js', 'visitor_events.js']
        })
      })
  }else{
    req.flash('error', 'Sorry, something went wrong. Please try to login again.')
    res.redirect('/login')
  }
}


async function getShows(user) {



  if(user){
    console.log(`User is ${user.userName}`)
    const userShows = await Artist.findOne({userName: user.userName}).populate('shows').exec()
    // console.log(`populated? ${userShows}`)
      
    return userShows.shows
  }else{
    const shows = await Show.find({}).populate('artist')

    console.log(shows)
  
    return shows
  }

}



module.exports = router