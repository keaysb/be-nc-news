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
    const query = `SELECT * FROM articles ORDER BY created_at DESC`
    return db.query(query).then(({rows}) => {
        const newArr = rows.map(article => {
            let counter = 0
            delete article.body
            return db.query(`SELECT * FROM comments`).then(res => {
                const comRow = res.rows
                comRow.forEach(com => {
                    if (com.article_id === article.article_id){
                        counter++
                    }
                })
                article.comment_count = counter
                return article
            })
        })
        
        return Promise.all(newArr)
    })
}

exports.fetchCommentsById = (id) => {
    const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db.query(query, [id]).then(({rows}) => {
        return rows
    })
}