const {
  removeCommentById,
  updateCommentByCommentId,
} = require("../models/comments.model");
const { checkExists } = require("../utils/utils");

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const commentIdExistence = checkExists("comments", "comment_id", comment_id);
  const deleteQuery = removeCommentById(comment_id);
  Promise.all([deleteQuery, commentIdExistence])
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const commentIdExistence = checkExists("comments", "comment_id", comment_id);
  const patchQuery = updateCommentByCommentId(comment_id, inc_votes);
  Promise.all([patchQuery, commentIdExistence])
    .then((response) => {
      const comment = response[0];
      res.status(200).send({ comment });
    })
    .catch(next);
};
