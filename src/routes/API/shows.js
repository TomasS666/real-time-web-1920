const express = require('express');
const router = express.Router();
const path = require('path')
const Show = require('../../models/show')
const isLoggedIn = require('../../middleware/is-logged-in')
// const serverSetup = require("../server-setup")
// const http = serverSetup.http
// const io = serverSetup.io





router.get('/shows/:artistid?', isLoggedIn, (req, res, next)=>{

//  Find all shows, excluse _id and __v field
//  Sub query Artist, withouth retrieving the ObjectID, hashed password, and additional non needed data


    Show.find({}, '-_id -__v')
        .populate('artist', '-_id -shows -password -userName -userRole -__v')
        .exec()
        
        .then(json => {

            return json
            
        })
        .then(json => res.json(json))
        .catch(err => console.log(err))
    
})



module.exports = router