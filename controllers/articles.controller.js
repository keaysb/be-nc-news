const {fetchArticleById, fetchArticles, fetchCommentsById} = require('../models/articles.model')

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
    fetchCommentsById(article_id).then(comments => {
        res.status(200).send({comments})
    })
}