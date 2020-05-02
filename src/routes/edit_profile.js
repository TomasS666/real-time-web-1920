const express = require('express');
const router = express.Router();
const path = require('path')
// const serverSetup = require("../server-setup")
// const http = serverSetup.http
// const io = serverSetup.io


router.get('/', (req, res, next)=>{

    res.render('edit_profile.ejs')
    
})



module.exports = router