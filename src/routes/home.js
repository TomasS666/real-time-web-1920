const express = require('express');
const router = express.Router();
const path = require('path')


const fetch = require('node-fetch');


router.get('/', (req, res, next)=>{


    res.sendFile(path.resolve(__dirname,'../static/index.html'))


    
    
})

module.exports = router;