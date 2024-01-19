const db = require('../db/connection')

exports.fetchTopics = () => {
    const query = `SELECT * FROM topics`
    return db.query(query)
}

exports.insertTopic = (topicData) => {
    const query = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`
    return db.query(query, [topicData.slug, topicData.description]).then(({rows}) => {
        return rows[0]
    })
}
