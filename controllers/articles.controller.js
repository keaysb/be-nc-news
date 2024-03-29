const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsById,
  insertCommentById,
  updateArticleByArticleId,
  insertArticle,
} = require("../models/articles.model");
const { checkExists } = require("../utils/utils");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  const fetchQuery = fetchArticles(topic, sort_by, order);
  if (topic !== undefined) {
    const topicsExistence = checkExists("topics", "slug", topic);
    Promise.all([fetchQuery, topicsExistence])
      .then((response) => {
        const articles = response[0];
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    fetchQuery
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdExistence = checkExists("articles", "article_id", article_id);
  const fetchQuery = fetchCommentsById(article_id);
  Promise.all([fetchQuery, articleIdExistence])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const articleIdExistence = checkExists("articles", "article_id", article_id);
  const postQuery = insertCommentById(article_id, req.body);
  Promise.all([postQuery, articleIdExistence])
    .then((response) => {
      const comment = response[0];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const articleIdExistence = checkExists("articles", "article_id", article_id);
  const patchQuery = updateArticleByArticleId(article_id, inc_votes);
  Promise.all([patchQuery, articleIdExistence])
    .then((response) => {
      const article = response[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
