const express = require('express');
const router = express.Router();
//user data manipulation/verification
const {validateEmail, validateUser, validateUserSession} = require('../middleware/userDataValidator');
const {loginUser, registerUser, logOutUser, updateUserAvatar, countUserData, getUserWrittenItems} = require('../controllers/userController')

//discussion data
const {validateDiscussionData} = require('../middleware/discussionDataValidator');
const {getLatestDiscussionsByTopic, uploadNewDiscussion} = require('../controllers/discussionController');

//user paths
router.get('/logout', logOutUser);
router.post('/register', validateEmail, validateUser, registerUser)
router.post('/login', validateUser, loginUser)
router.post('/updateAvatar', validateUserSession, updateUserAvatar)
router.get('/getUserData', validateUserSession, countUserData);
router.get('/getUserCreatedItems/:number/:type', validateUserSession, getUserWrittenItems);


//discussion paths
router.get('/getLatestDiscussionsByTopic/:searchValue', getLatestDiscussionsByTopic);
router.post('/uploadNewDiscussion', validateUserSession, validateDiscussionData, uploadNewDiscussion);

module.exports = router;