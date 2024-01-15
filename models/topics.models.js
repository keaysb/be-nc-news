const db = require('../db/connection')

exports.fetchTopics = () => {
    let query = `SELECT * FROM topics`

    return db.query(query)
}