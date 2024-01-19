const articlesRouter = require("express").Router();

const {
  getArticleById,
  getArticles,
  getCommentsById,
  postCommentById,
  patchArticleByArticleId,
  postArticle
} = require("../controllers/articles.controller");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postCommentById);
module.exports = articlesRouter;
