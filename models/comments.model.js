const db = require("../db/connection");

exports.removeCommentById = (id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1;`;
  return db.query(query, [id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateCommentByCommentId = (id, votes) => {
  const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;
  return db.query(query, [votes, id]).then(({ rows }) => {
    return rows[0];
  });
};
