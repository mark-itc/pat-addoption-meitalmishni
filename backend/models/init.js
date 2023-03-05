const mysql = require('mysql2/promise');
const UsersDAO = require('./UsersDAO');
const PetsDAO = require('./PetsDAO');
const UsersPetsDAO = require('./UsersPetsDAO');
const SavedPetsDAO = require('./SavedPetsDAO');

let connection;

module.exports.initDB = async () => {

    connection = await mysql.createConnection({
        host: process.env.AWS_MYSQL_HOST,
        user: process.env.AWS_MYSQL_USER,
        password: process.env.AWS_MYSQL_PASSWORD,
        database: process.env.AWS_MYSQL_DB,
        multipleStatements: true
    });

    UsersDAO.InjectConnection(connection);
    PetsDAO.InjectConnection(connection);
    UsersPetsDAO.InjectConnection(connection);
    SavedPetsDAO.InjectConnection(connection);
}

module.exports.closeConneciton = async () => {
    connection.closeConneciton();
}