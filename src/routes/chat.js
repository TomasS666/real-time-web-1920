const express = require('express');
const router = express.Router();
const path = require('path')

const countries = require("../data/countries-shortcodes.json")


router.get('/', (req, res, next)=>{
 
    res.render("chat.ejs", {
        data: countries
    })
    
})

module.exports = router;