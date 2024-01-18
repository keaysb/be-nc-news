const { response, path } = require('../app')
const {fetchArticleById, fetchArticles, fetchCommentsById, insertCommentById, updateArticleByArticleId} = require('../models/articles.model')
const {checkExists} = require('../utils/utils')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {comment_count} = req.query
    fetchArticleById(article_id, comment_count).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
    const {topic} = req.query
    fetchArticles(topic).then(articles => {
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
    const articleIdExistence = checkExists('articles', 'article_id', article_id)
    const postQuery = insertCommentById(article_id, req.body, next)
    Promise.all([postQuery, articleIdExistence]).then(response => {
        const comment = response[0]
        res.status(201).send({comment})
    }).catch(next)
}

exports.patchArticleByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    const articleIdExistence = checkExists('articles', 'article_id', article_id)
    const patchQuery = updateArticleByArticleId(article_id, inc_votes)
    Promise.all([patchQuery, articleIdExistence]).then(response => {
        const article = response[0]
        res.status(200).send({article})
    }).catch(next)
}