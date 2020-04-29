module.exports = function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next()
    } else {
        console.log('not logged in')
        req.flash("warning", "Not logged in")
        res.redirect('/login')
    }
}