const bcrypt = require('bcrypt');
const userDb = require('../models/userSchema');
const discussionDb = require('../models/discussionSchema');
const postsDb = require('../models/postSchema');

module.exports = {
    loginUser: async (req, res) => {
        const {user_name, password} = req.body;
        const userExists = await userDb.findOne({user_name: user_name.toLowerCase()})
        if (!userExists) return res.send({success: false, message: "bad credentials"})
        const passMatch = await bcrypt.compare(password, userExists.password)
        if (passMatch) {
            req.session.user_name = userExists.user_name
            let userNameModified =  userExists.user_name.charAt(0).toUpperCase() + userExists.user_name.slice(1);
            return res.send({
                success: true,
                message: "Successfully logged in",
                user: {user_name: userNameModified, email: userExists.email, avatar: userExists.user_avatar, register_date: userExists.register_date}})
        }
        res.send({success: false, message: "bad credentials"})
    },
    registerUser: async (req, res) => {
        const {user_name, email, password} = req.body;

        const userNameExists = await userDb.findOne({user_name})
        if (userNameExists) return res.send({success: false, message: "User name already taken"})

        const userEmailExists = await userDb.findOne({email})
        if (userEmailExists) return res.send({success: false, message: "User with provided email already exists"})

        try{
            const user = new userDb();
            user.user_name = user_name.toLowerCase();
            user.email = email.toLowerCase();
            user.password =  await bcrypt.hash(password, 10);
            const createdUser = await user.save({new: true});
            let userNameModified =  createdUser.user_name.charAt(0).toUpperCase() + createdUser.user_name.slice(1);
            res.send({
                success: true,
                message: 'User registered',
                user: {user_name: userNameModified, email: createdUser.email, avatar: createdUser.user_avatar, register_date: createdUser.register_date}})
        } catch (e) {
            console.log(e)
        }
    },
    logOutUser: (req, res) => {
        try{
            req.session.destroy( () => {
                res.send({success: true})
            })
        }catch (e) {
            console.log(e)
        }
    },
    updateUserAvatar: async (req, res) => {
        const {avatar} = req.body;
        if(!avatar.includes('http')) res.send({success: false, message: 'Link not provided'});
        const {user_name} = req.session;
        const updatedUser = await userSchema.findOneAndUpdate({user_name}, {$set: {avatar: avatar}}, {new: true});
        res.send({success: true, user: {user_name: updatedUser.user_name, avatar: updatedUser.avatar, money: updatedUser.money}});
    },
    countUserData: async (req, res) => {
        const {user_name} = req.session;
        try{
            const user = await userDb.findOne({user_name: user_name}, {password: false});
            const topicsCount = await discussionDb.count({creator_username: user_name});
            const postsCount = await postsDb.count({creator_username: user_name});
            res.send({success: true, countData: {topicsCount, postsCount}})
        }catch (e) {
            res.send({success: false, message: e})
            console.log(e)
        }
    }
}