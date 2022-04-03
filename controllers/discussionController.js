const discussionDb = require('../models/discussionSchema');
const postsDb = require('../models/postSchema');
const { v4: uuidv4 } = require('uuid');
const topicSearchValues = require('../helpers/topicSearchValues.json');

module.exports = {
    getLatestDiscussionsByTopic: async (req, res) => {
        const {searchValue} = req.params;
        if(topicSearchValues.find(x => x.name === searchValue)){
            const latestData = await discussionDb.find({topic_name: searchValue}).sort({timestamp: -1}).limit(5)
            res.send({success: true, latestData});
        }else{
            res.send({success: false, message: 'No topic found'})
        }
    },
    uploadNewDiscussion: async (req, res) => {
        const {user_name} = req.session;
        const {topic_name, title, description} = req.body;

        const find = await discussionDb.findOne({title: title.toLowerCase()})

        if(find) return res.send({success: false, message: 'Discussion with same subject already exists'})

        try{
            const discuss = new discussionDb()
            discuss.creator_username = user_name;
            discuss.topic_name = topic_name;
            discuss.title = title.toLowerCase();
            discuss.description = description;
            discuss.unique_token = uuidv4();
            discuss.lastModified = Date.now();
            await discuss.save();
            res.send({success: true, message: 'Discussion created'})
        } catch (e) {
            console.log(e)
            res.send({success: false, message: 'Error' + e})
        }
    },
    deleteDiscussion: async (req, res) => {
        const {uniqueToken} = req.params;

        const foundDiscussion = await discussionDb.findOne({unique_token: uniqueToken});
        if(!foundDiscussion) return res.send({success: false, message: 'No discussion found'})

        try{
            await postsDb.deleteMany({discussion_token: uniqueToken});
            await discussionDb.deleteOne({unique_token: uniqueToken})
            res.send({success: true, message: 'Item deleted'})
        }catch (e) {
            console.log(e)
        }
    },
    updateDiscussion: async (req, res) => {
        const {token} = req.params;
        const { topic_name, title, description} = req.body;

        const foundDiscussion = await discussionDb.findOne({unique_token: token});
        if(!foundDiscussion) return res.send({success: false, message: 'No discussion found'})

        try {
            const updatedDiscussion = await discussionDb.findOneAndUpdate(
                {unique_token: token},
                {$set: {topic_name, title, description, lastModified: Date.now()}}, {new: true})
            res.send({success: true, message: 'Discussion updated', updatedDiscussion})
        }catch (e) {
            console.log(e)
        }
    },
    getDiscussionsByTopicAndAmount: async (req, res) => {
        const {topic, page} = req.params;
        let skipAmount = (Number(page) - 1) * 10;
        if(isNaN(skipAmount)) return res.send({success: false, message: 'Number not provided'})
        let foundDiscussions;
        let discussionsCount;
        try{
            if(topic === 'All'){
                discussionsCount = await discussionDb.count();
                foundDiscussions = await discussionDb.find().sort({timestamp: -1}).skip(skipAmount).limit(10)
                res.send({success: true, foundDiscussions, discussionsCount})
            }else{
                if(!topicSearchValues.find( x => x.name === topic )) return res.send({success: false, message: 'Topic not found'})
                discussionsCount = await discussionDb.count({topic_name: topic});
                foundDiscussions = await discussionDb.find({topic_name: topic}).sort({timestamp: -1}).skip(skipAmount).limit(10)
                res.send({success: true, foundDiscussions, discussionsCount})
            }
        }catch (e) {
            console.log(e)
        }
    },
    getFavoriteDiscussions: async (req, res) => {
        const {page} = req.params;
        const {localFavorites} = req.body;
        let skipAmount = (Number(page) - 1) * 10;
        let returnData = [];
        try{
            for (let i = skipAmount; i < localFavorites.length; i++) {
                let foundDiscussion = await discussionDb.findOne({unique_token: localFavorites[i]});
                if(foundDiscussion) returnData.push(foundDiscussion)
            }
            res.send({success: true, returnData})
        }catch (e) {
            console.log(e)
        }
    }
}