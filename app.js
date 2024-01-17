const express = require('express')
const app = express()
app.use(express.json())

const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./error-handlers/index');

const {getTopics} = require('./controllers/topics.controller')
const {getApi} = require('./controllers/api.controller')
const {getArticleById, getArticles, getCommentsById, postCommentById,} = require('./controllers/articles.controller')

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/article/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postCommentById)

//app.patch('/api/articles/:article_id', patchArticleByArticleId)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app