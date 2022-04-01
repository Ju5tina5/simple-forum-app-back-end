const discussionDb = require('../models/discussionSchema');
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
    }
}