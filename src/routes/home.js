const express = require('express');
const router = express.Router();
const path = require('path')
// const serverSetup = require("../server-setup")
// const http = serverSetup.http
// const io = serverSetup.io


router.get('/', (req, res, next)=>{

// Based on this source, for a better understanding 
// Gonna test it to try the peers, and then write my own logic  
// https://tsh.io/blog/how-to-write-video-chat-app-using-webrtc-and-nodejs/

    res.sendFile(path.resolve(__dirname,'../static/index.html'))
    
})



module.exports = router