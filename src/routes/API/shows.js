const express = require('express');
const router = express.Router();
const path = require('path')
const Show = require('../../models/show')
const isLoggedIn = require('../../middleware/is-logged-in')
// const serverSetup = require("../server-setup")
// const http = serverSetup.http
// const io = serverSetup.io





router.get('/shows', isLoggedIn, (req, res, next)=>{

// Based on this source, for a better understanding 
// Gonna test it to try the peers, and then write my own logic  
// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

let test = null

//  Find all shows, excluse _id and __v field
    Show.find({}, '-_id -__v').exec()
        
        .then(json => {

            return json
            
        })
        .then(json => res.json(json))
        .catch(err => console.log(err))
    
})



module.exports = router