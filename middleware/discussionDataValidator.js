module.exports = {
    validateDiscussionData: (req, res, next) => {
        const {topic_name, title, description} = req.body;
        const format = /[!@#$%^&*()+\-=\[\]{};':"\\|<>\/?]+/;

        if(topic_name.length === 0){
            return res.send({success: false, message: 'Subject Topic not provided'})
        }

        if (format.test(title)) {
            return res.send({success: false, message: "Subject can't contain special symbols"})
        }

        if( title.length < 5 || title.length > 100){
            return res.send({success: false, message: "Subject should be from 5 to 100 symbols long"})
        }
        if (description.length < 50 || description.length > 500) {
            return res.send({success: false, message: "Description should be from 50 to 500 symbols long"})
        }
        next()
    }
}