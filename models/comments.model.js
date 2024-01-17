const db = require('../db/connection')

exports.removeCommentById = (id) => {
    const query = `DELETE FROM comments WHERE comment_id = $1;`
    return db.query(query, [id]).then(({rows}) => {
        return rows[0]
    })
}