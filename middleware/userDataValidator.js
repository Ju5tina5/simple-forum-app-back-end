const validate = require('email-validator');

module.exports = {
    validateEmail: (req, res, next) => {
        const {email} = req.body;
        if (!validate.validate(email)) {
            return res.send({success: false, message: 'Email not provided'})
        }
        next();
    },
    validateUser: (req, res, next) => {
        const {user_name, password, passwordTwo} = req.body
        if (user_name.length > 15 || user_name.length < 5) return res.send({
            success: false,
            message: 'User name length not correct'
        })
        if (password.length < 5) return res.send({success: false, message: "Bad credentials"})
        if (password.length > 100) return res.send({success: false, message: "Bad credentials"})
        if (passwordTwo && passwordTwo.length >= 0) {
            if (password !== passwordTwo) return res.send({success: false, message: "Passwords don't match"})
            if (password.length < 5) return res.send({success: false, message: "Password too short"})
            if (password.length > 100) return res.send({success: false, message: "Password too long"})
        }
        next();
    },
    validatePassword: (req, res, next) => {
        const {password} = req.body;
        if (password.length < 5) return res.send({success: false, message: "Bad credentials"})
        if (password.length > 100) return res.send({success: false, message: "Bad credentials"})
        next()
    },
    validateTwoPasswords: (req, res, next) => {
        const {newPassword, newPasswordRepeat} = req.body;

        if (newPassword !== newPasswordRepeat) return res.send({success: false, message: "Passwords don't match"})
        if (newPassword.length < 5) return res.send({success: false, message: "Password too short"})
        if (newPassword.length > 100) return res.send({success: false, message: "Password too long"})

        next()
    },
    validateUserSession: (req, res, next) => {
        const {user_name} = req.session;
        if (!user_name) return res.send({success: false, message: 'Not logged in'})
        next();
    },
    validateLink: (req, res, next) => {
        const {avatar} = req.body;
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(avatar)) return res.send({
            success: false,
            message: 'not an image link'
        })
        next()
    }
}