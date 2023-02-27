'use strict';
const express = require('express');
const cors = require('cors');
const server = express();
const data = require('./data.json')
server.use(cors());

const PORT = 4000;
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}



//home route
server.get('/', (req, res) => {
   
    const movie = new Movie(data.title, data.poster_path, data.overview);
    res.json(movie);
});

//favorite rout 
server.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page');
});

//handle error 
server.get('*', (req, res) => {
    res.status(404).send("page not found error")
});

// server.use(function(err, req, res, next){
//     res.sendStatus(500);
//     res.render('500');
// });
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}


// http://localhost:4000
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});