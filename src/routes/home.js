const express = require('express');
const router = express.Router();
const path = require('path')


const fetch = require('node-fetch');


router.get('/', (req, res, next)=>{

    res.header("Content-Type",'application/json');
fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=b19502fd05ce448c9f04c279f3a7dae8")
    .then(data => data.json())
    .then(data => {
        
    })
    .then(json => res.json(json))
 
    // res.render("chat.ejs")
    
})

module.exports = router;