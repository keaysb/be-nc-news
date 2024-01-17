const {removeCommentById} = require('../models/comments.model')
const {checkExists} = require('../utils/utils')

exports.deleteCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    const commentIdExistence = checkExists('comments', 'comment_id', comment_id)
    const deleteQuery = removeCommentById(comment_id)
    Promise.all([deleteQuery, commentIdExistence]).then(() => {
        res.status(204).send()
    }).catch(next)
}