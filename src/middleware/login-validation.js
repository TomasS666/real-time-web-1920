const { check, validationResult } = require('express-validator/check');
const flash = require('express-flash')
console.log(check )
// function loginValidation(req, res, next) {
//     req.check('emailaddress', 'invalid emailaddress').not().isEmail()
//     req.check('password', 'Password needs to contain at least 5 characters').isLength({
//         min: 5
//     })
//     let errors = req.validationErrors();
//     if (errors) {
//         console.log(errors)
//     } else {
//         req.flash('error', errors)
//         res.redirect('/login')
//     }
// }

module.exports = [
    check('emailaddress', 'invalid emailaddress').not().isEmail(),
    check('password', 'Password needs to contain at least 5 characters').isLength({
        min: 5
    }),
    (req, res, next) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(422)
            console.log(errors.array())
            req.flash('warning', errors.array())
            res.redirect('/login')
        } else {
             next()
        } 
    }
]



