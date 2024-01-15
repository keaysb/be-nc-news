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
const {getArticleById, getArticles} = require('./controllers/articles.controller')

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/article/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.use(handleCustomErrors.handleCustomErrors);
app.use(handlePsqlErrors.handlePsqlErrors);
app.use(handleServerErrors.handleServerErrors);

module.exports = app