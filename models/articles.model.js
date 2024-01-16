const db = require('../db/connection')

exports.fetchArticleById = (id) => {
    const query = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(query, [id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0]
    })
}

exports.fetchArticles = () => {
    const query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at 
    DESC;`
    return db.query(query).then(({rows}) => {
        rows.forEach(article => {
            article.comment_count = Number(article.comment_count)
        })
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