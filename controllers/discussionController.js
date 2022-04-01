const discussionDb = require('../models/discussionSchema');
const { v4: uuidv4 } = require('uuid');
const topicSearchValues = require('../helpers/topicSearchValues.json');

module.exports = {
    getLatestDiscussionsByTopic: async (req, res) => {
        const {searchValue} = req.params;
        if(topicSearchValues.find(x => x.name === searchValue)){
            const latestData = await discussionDb.find({topic_name: searchValue}).sort({timestamp: -1}).limit(5)
            res.send({success: true, latestData})
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
    }
}