const format = require('pg-format');
const db = require('../db/connection')

exports.checkExists =  (table, column, value) => {
    const query = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    return db.query(query, [value]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
    });
  };