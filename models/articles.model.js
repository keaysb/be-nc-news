const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    let query = `SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id, comments.comment_id`

    return db.query(query, [id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

exports.fetchArticles = (topic) => {
    let query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    `
    if (topic === undefined){
    } else{
        query += ` WHERE articles.topic = '${topic}'`
    }

    query += `GROUP BY articles.article_id ORDER BY articles.created_at 
    DESC;`

    return db.query(query).then(({rows}) => {
        return rows
    })
}


exports.fetchCommentsById = (id) => {
    const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db.query(query, [id]).then(({rows}) => {
        return rows
    })
}

exports.insertCommentById = (id, commentData) => {
    const query = `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`
    return db.query(query, [commentData.body, id, commentData.username]).then(({rows}) => {
        return rows[0]
    })
}

exports.updateArticleByArticleId = (id, votesData) => {
    const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`
    return db.query(query, [votesData, id]).then(({rows}) => {
        return rows[0]
        })
}