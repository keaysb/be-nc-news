const {fetchTopics, insertTopic} = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    fetchTopics().then(({rows})=> {
        res.status(200).send({topics : rows})
    }).catch(next)
}

exports.postTopic = (req, res, next) => {
    insertTopic(req.body).then(topic => {
        res.status(201).send({topic})
    }).catch(next)
}