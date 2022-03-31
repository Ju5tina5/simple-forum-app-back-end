const express = require('express');
const router = express.Router();
//user data manipulation/verification
const {validateEmail, validateUser, validateUserSession} = require('../middleware/userDataValidator');
const {loginUser, registerUser, logOutUser, updateUserAvatar} = require('../controllers/userController')

//user paths
router.get('/logout', logOutUser);
router.post('/register', validateEmail, validateUser, registerUser)
router.post('/login', validateUser, loginUser)
router.post('/updateAvatar', validateUserSession, updateUserAvatar)


module.exports = router;