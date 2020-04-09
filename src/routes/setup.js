const express = require('express');
const router = express.Router();
const path = require('path')



router.get('/setup', (req, res, next)=>{
 
    res.render("setup.ejs")
    
})

module.exports = router;