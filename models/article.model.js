const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    const query = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(query, [id]).then(({rows}) => {
        return rows[0]
    })
}