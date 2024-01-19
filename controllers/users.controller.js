const {fetchUsers, fetchUserByUsername} = require('../models/users.model')
const {checkExists} = require('../utils/utils')

exports.getUsers = (req, res, next) => {
    fetchUsers().then(users => {
        res.status(200).send({users})
    }).catch(next)
}

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params
    const usernameExistence = checkExists('users', 'username', username)
    const fetchQuery = fetchUserByUsername(username)
    Promise.all([fetchQuery, usernameExistence]).then(response => {
        const user = response[0]
        res.status(200).send({user})
    }).catch(next)
}