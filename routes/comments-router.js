const commentsRouter = require("express").Router();

const {
  deleteCommentByCommentId,
} = require("../controllers/comments.controller");

commentsRouter.route("/:comment_id").delete(deleteCommentByCommentId);

module.exports = commentsRouter;
