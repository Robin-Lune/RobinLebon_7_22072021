const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test_robin'
});

db.connect((err) => {
    if (err) {
        return console.error('error connecting: ' + err.stack);
    }
    console.log('Mysql connected');  
});

module.exports.getDB = () => {
    return db
}