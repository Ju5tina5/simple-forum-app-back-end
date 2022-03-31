const bcrypt = require('bcrypt');
const userDb = require('../models/userSchema');

module.exports = {
    loginUser: async (req, res) => {
        const {user_name, password} = req.body;
        const userExists = await userDb.findOne({user_name})
        if (!userExists) return res.send({success: false, message: "bad credentials"})
        const passMatch = await bcrypt.compare(password, userExists.password)
        if (passMatch) {
            req.session.user_name = userExists.user_name
            return res.send({success: true, message: "Successfully logged in", user: {user_name: userExists.user_name, email: userExists.email, avatar: userExists.avatar}})
        }
        res.send({success: false, message: "bad credentials"})
    },
    registerUser: async (req, res) => {
        const {user_name, email, password} = req.body;

        const userNameExists = await userSchema.findOne({user_name})
        if (userNameExists) return res.send({success: false, message: "User name already taken"})

        const userEmailExists = await userSchema.findOne({email})
        if (userEmailExists) return res.send({success: false, message: "User with provided email already exists"})

        try{
            const user = new userSchema();
            user.user_name = user_name;
            user.password =  await bcrypt.hash(password, 10);
            await user.save();

            res.send({success: true, message: 'User registered'})
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
}