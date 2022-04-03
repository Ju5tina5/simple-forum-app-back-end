const userDb = require('../models/userSchema');
const discussionDb = require('../models/discussionSchema');
const postsDb = require('../models/postSchema');

module.exports = {
    getPostByToken: async (req, res) => {
        const {token, page} = req.params;
        let skipAmount = (Number(page) - 1) * 10;
        if(isNaN(skipAmount)) return res.send({success: false, message: 'Number not provided'})
        try {
            let posts = await postsDb.find({discussion_token: token}).sort({timestamp: -1}).skip(skipAmount).limit(10)
            let modifiedPosts = [];
            for (let i = 0; i < posts.length; i++) {
                let user = await userDb.findOne({user_name: posts[i].creator_username}, {password: false, email: false})
                modifiedPosts.push({post: posts[i], creator: user})
            }
            res.send({success: true, modifiedPosts})
        }catch (e) {
            console.log(e)
        }
    },
    uploadNewPosts: async (req, res) => {
        const {user_name} = req.session;
        const {description, discussion_token} = req.body;


        let newDescription = description.replace(/(https?\:\/\/)?([^\.\s]+)?[^\.\s]+\.[^\s]+/gi, (match) => {
            if(match.includes('youtube') && match.includes('watch')){
                let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                let canUse = match.match(regExp);
                if(canUse && canUse[2].length === 11){
                    return '<iframe width="100%" height="200" src="//www.youtube.com/embed/' + canUse[2] + '"  allowfullscreen></iframe>'
                }
            }
            if(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(match)){
                return `<img src='${match}' alt>`
            }
        });
        try{
            const post = new postsDb();
            post.creator_username = user_name;
            post.description = newDescription;
            post.timestamp = Date.now();
            post.discussion_token = discussion_token
            await post.save();

            const updatedDiscussion = await discussionDb.findOneAndUpdate(
                {unique_token: discussion_token},
                {$set: {lastModified: Date.now()}, $inc: {post_count: 1}}, {new: true})

            res.send({success: true, updatedDiscussion})
        }catch (e) {
            console.log(e)
        }
    }
}