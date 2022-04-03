module.exports = {
    validatePostData: async (req, res, next) => {
        const {description} = req.body;

        if (description.length < 50 || description.length > 1000) {
            return res.send({success: false, message: "Description should be from 50 to 500 symbols long"})
        }
        next()
    }
}