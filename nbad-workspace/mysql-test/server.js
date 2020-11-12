const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
// const encryptPassword = require('encrypt-password')
const bodyParser = require("body-parser");
const dateFormat = require("dateformat");


const port = process.env.port || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host :'sql9.freemysqlhosting.net',
    user :'sql9374359',
    password:'TQB7tWEbjs',
    database:'sql9374359'
});
app.get('/', async (req, res) => {
    //Delete for loop
    connection.connect();
    connection.query('SELECT * FROM budget', function (error, results, fields) {
    connection.end();
    if(error) throw error;
    res.json(results);
    });
});
app.post('/api/signup', async (req, res) => {
    console.log("Username:"+req.body);
    const {username, password} =req.body;
    const date = transformDate(new Date());
    console.log(date);
    const salt=await bcrypt.genSalt();
    const pwd = await bcrypt.hash(password, salt);
    console.log(pwd);
    connection.connect();
    connection.query('INSERT INTO user VALUES ("", ?, ?, ?)', [username, pwd, date], function (error, results, fields) {
    connection.end();
    if(error) throw error;
    res.json("User Signed Up");
    });
});


function transformDate(date){
    var day= dateFormat(date, "yyyy-mm-dd");
    return day;
}

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});