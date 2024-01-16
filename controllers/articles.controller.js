const {fetchArticleById, fetchArticles, fetchCommentsById, insertCommentById} = require('../models/articles.model')
const {checkExists} = require('../utils/utils')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then(articles => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsById = (req, res, next) => {
    const {article_id} = req.params
    const articleIdExistence = checkExists('articles', 'article_id', article_id)
    const fetchQuery = fetchCommentsById(article_id)
    Promise.all([fetchQuery, articleIdExistence]).then(response => {
        const comments = response[0]
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentById = (req, res, next) => {
    const {article_id} = req.params
    insertCommentById(article_id, req.body).then(comment => {
        res.status(201).send({comment})
    }).catch(next)
}