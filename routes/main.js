const express = require('express');
const router = express.Router();
//user data manipulation/verification
const {validateEmail, validateUser, validateUserSession} = require('../middleware/userDataValidator');
const {loginUser, registerUser, logOutUser, updateUserAvatar, countUserData} = require('../controllers/userController')

//discussion data
const {getLatestDiscussionsByTopic} = require('../controllers/discussionController');

//user paths
router.get('/logout', logOutUser);
router.post('/register', validateEmail, validateUser, registerUser)
router.post('/login', validateUser, loginUser)
router.post('/updateAvatar', validateUserSession, updateUserAvatar)
router.get('/getUserData', validateUserSession, countUserData);


//discussion paths
router.get('/getLatestDiscussionsByTopic/:searchValue', getLatestDiscussionsByTopic);

module.exports = router;