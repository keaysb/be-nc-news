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
const {getArticleById} = require('./controllers/article.controller')

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/article/:article_id', getArticleById)

app.use(handleCustomErrors.handleCustomErrors);
app.use(handlePsqlErrors.handlePsqlErrors);
app.use(handleServerErrors.handleServerErrors);

module.exports = app