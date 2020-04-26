const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/profile', (req, res) => {
    res.render("profile.ejs", {
        session: req.session
    })
})

module.exports = router