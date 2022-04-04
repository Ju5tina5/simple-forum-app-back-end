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
                user: {user_name: userNameModified, email: userExists.email, avatar: userExists.user_avatar, register_date: userExists.register_date, newActivity: userExists.newActivity}})
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
            await user.save({new: true});
            res.send({
                success: true,
                message: 'User registered'})
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
    deleteUser: async (req, res) => {
        const {password} = req.body;
        const {user_name} = req.session;

        const userExists = await userDb.findOne({user_name});
        if(!userExists) return res.send({success: 'false', message: 'User does not exist'})

        const match = await bcrypt.compare(password, userExists.password);
        if(match){
            try {
                await postsDb.deleteMany({creator_username: user_name})
                await discussionDb.deleteMany({creator_username: user_name})
                await userDb.deleteOne({user_name})
                res.send({success: false, message: `User ${user_name} removed from this God forsaken place`})
            }catch (e) {
                console.log(e)
            }
        }else{
            return res.send({success: false, message: 'Bad credentials'})
        }
    },
    changeUserPassword: async (req, res) => {
        const {password, newPassword} = req.body;
        const {user_name} = req.session;

        const userExists = await userDb.findOne({user_name});
        if(!userExists) return res.send({success: 'false', message: 'User does not exist'})

        const match = await bcrypt.compare(password, userExists.password);

        if(match){
            try{
                let hashPassword = await bcrypt.hash(newPassword, 10);
                await userDb.findOneAndUpdate({user_name}, {$set: {password: hashPassword}})
                res.send({success: true, message: 'Password successfully updated'})
            }catch (e) {
                console.log(e)
            }
        }else{
            return res.send({success: false, message: 'Bad credentials'})
        }

    },
    updateUserAvatar: async (req, res) => {
        const {avatar} = req.body;
        const {user_name} = req.session;
        try {
            const updatedUser = await userDb.findOneAndUpdate({user_name}, {$set: {user_avatar: avatar}}, {new: true});
            res.send({success: true, message: 'Avatar photo changed', avatar: updatedUser.user_avatar})
        }catch (e) {
            console.log(e)
            res.send({success: false, message: e})
        }
    },
    countUserData: async (req, res) => {
        const {user_name} = req.session;
        try{
            const topicsCount = await discussionDb.count({creator_username: user_name});
            const postsCount = await postsDb.count({creator_username: user_name});
            res.send({success: true, countData: {topicsCount, postsCount}})
        }catch (e) {
            res.send({success: false, message: e})
            console.log(e)
        }
    },
    getUserWrittenItems: async (req, res) => {
        const {number, type} = req.params
        const {user_name} = req.session;
        try{
            let data;
            if(type === 'discussions'){
                data = await discussionDb.find({creator_username: user_name}).sort({timestamp: -1}).limit(number);
                return res.send({success: true, userItems: data})
            }else if(type === 'posts'){
                let titles = [];
                data = await postsDb.find({creator_username: user_name}).sort({timestamp: -1}).limit(number);
                for (let i = 0; i < data.length; i++) {
                    let title = await discussionDb.findOne({unique_token: data[i].discussion_token}, {title: 1});
                    titles.push(title)
                }
                res.send({success: true, userItems: {data, titles}})
            }else{
                return res.send({success: false, message: 'No type'})
            }

        }catch (e) {
            res.send({success: false, message: e})
            console.log(e)
        }
    },
    deleteActivities: async (req, res) => {
        const {user_name} = req.session;
        try{
            await userDb.findOneAndUpdate({user_name}, {$set: {newActivity: []}})
            return res.send({success: true})
        }catch (e) {
            console.log(e)
        }
    }
}