const express = require('express');
const router = express.Router();


router.get('/logout', (req, res)=>{
    req.session.destroy();
    console.log('Session destroyed');
    res.redirect('/login');
})

module.exports = router;