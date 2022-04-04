const express = require('express');
const router = express.Router();
//user data manipulation/verification
const {validateEmail, validateUser, validateUserSession, validatePassword, validateTwoPasswords, validateLink} = require('../middleware/userDataValidator');
const {loginUser,
    registerUser,
    logOutUser,
    updateUserAvatar,
    countUserData,
    getUserWrittenItems,
    deleteUser,
    changeUserPassword,
    deleteActivities }
    = require('../controllers/userController');

//discussion data
const {validateDiscussionData} = require('../middleware/discussionDataValidator');
const {getLatestDiscussionsByTopic, uploadNewDiscussion, deleteDiscussion, updateDiscussion,
    getDiscussionsByTopicAndAmount, getFavoriteDiscussions, getSingleDiscussion
} = require('../controllers/discussionController');

//posts data
const {getPostByToken, uploadNewPosts, deletePost} = require('../controllers/postsController');
const {validatePostData} = require('../middleware/postDataValidator');

//user paths
router.get('/logout', logOutUser);
router.post('/register', validateEmail, validateUser, registerUser)
router.post('/login', validateUser, loginUser)
router.post('/avatarChangeRequest', validateUserSession, validateLink, updateUserAvatar)
router.post('/requestUserDeletion', validateUserSession, validatePassword, deleteUser)
router.post('/requestUserPasswordChange', validateUserSession, validatePassword, validateTwoPasswords, changeUserPassword)
router.get('/getUserData', validateUserSession, countUserData);
router.get('/getUserCreatedItems/:number/:type', validateUserSession, getUserWrittenItems);
router.get('/deleteUserActivity', validateUserSession, deleteActivities)

//discussion paths
router.get('/getLatestDiscussionsByTopic/:searchValue', getLatestDiscussionsByTopic);
router.get('/requestDiscussionDeletion/:uniqueToken', validateUserSession, deleteDiscussion);
router.get('/getSingleDiscussion/:token', getSingleDiscussion);
router.post('/uploadNewDiscussion', validateUserSession, validateDiscussionData, uploadNewDiscussion);
router.post('/updateDiscussion/:token', validateUserSession, validateDiscussionData, updateDiscussion);
router.get('/getDiscussions/:topic/:page', getDiscussionsByTopicAndAmount)
router.post('/getFavoriteItems', getFavoriteDiscussions)

//posts paths
router.get('/getPosts/:token/:page', getPostByToken)
router.get('/requestPostDeletion/:id', validateUserSession, deletePost)
router.post('/createPost', validateUserSession, validatePostData, uploadNewPosts)

module.exports = router;