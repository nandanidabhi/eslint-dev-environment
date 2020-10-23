const express = require('express');
const app = express(); 

const jwt =  require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');
var decoded={};
var tokenCheck;

var verifyToken = function(req,res,next){
    var tokenValue = req.header('authorization').split(" ")[1];
    // console.log(tokenValue);
    if(!tokenValue){
        res.json({
            success: false,
            myContent: "Invalid Token. Please login again!"
        });
    }

    var authData = req.header('authorization').split(" ")[1];
    if(authData){
        tokenCheck = authData;
        try {
            decoded = jwt.verify(tokenCheck, secretKey);
            if(!decoded){
                res.json({
                    success: false,
                    myContent: "Invalid Token. Please login again!"
                });
            }
            if(!decoded.username){
                res.json({
                    success: false,
                    myContent: "Unauthorized User. Please check your credentials!"
                });
            }
            next();
          } catch(err) {
            // return res.status(400).send('<script>alert("'+err.toString()+'");</script>');
            res.json({
                success: false,
                myContent: err.toString()+" Please login again"
            });
          }
        }else{
            res.json({
                success: false,
                myContent: "Please login again"
            });
        }

};
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


const PORT = 3000;

const secretKey='My super secret Key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'Nandani',
        password: '123'
    },
    {
        id: 2,
        username: 'Dabhi',
        password: '456' 
    }
];
   

app.post('/api/login', (req, res) => {
    const {username, password } = req.body;
    let inside = false;
    for(let user of users){
        console.log("in Users"+users);
        if(username == user.username && password == user.password){
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' });
                res.json({
                    success: true,
                    err: null,
                    token
                });
                break;
            }
        }
        if(!inside){
            res.status(401).json({
                success: false,
                token: null,
                err: 'username or password is incorrect'
            });
        }
    });

app.get('/api/dashboard', verifyToken, (req, res) => {
    console.log(res);
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
});

app.get('/api/prices', (req, res) => {
    console.log(res);
    res.json({
        success: true,
        myContent: 'This is the price $3.99'
    });
});

app.get('/api/settings',verifyToken , (req, res) => {
    console.log(res);
    res.json({
        success: true,
        myContent: 'Welcome to Settings'
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err,req, res,next) {
    console.log(err.name == 'UnauthorizedError');
    console.log(err);
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Error number 2'
        });
    }
    else{
        next(err);
    }
});


app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});