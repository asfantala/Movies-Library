'use strict';
const express = require('express');
const cors = require('cors');
const server = express();
const data = require('./data.json')
server.use(cors());
require('dotenv').config();
const axios = require('axios');
const pg = require('pg');
const PORT = 4000;

const client = new pg.Client(process.env.DATABASE_URL);
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function TrendingMov(id,title, release_date ,poster_path, overview) {
    this.id=id;
    this.title = title;
    this.release_date=release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
server.use(errorHandler);
server.use(express.json());

// routes
server.get('/', homePage);
server.get('/favorite', favPage);
server.get('/trending', trenPage);
server.get('/search', search);
server.get('/latest', latest);
server.get('/upcoming',upcoming);
server.get('/getMovies', getMovies);
server.post('/getMovies', addMovie);




// functions 
function homePage (req,res){
const movie = new Movie(data.title, data.poster_path, data.overview);
    res.json(movie);}

function favPage (req,res){
        res.send('Welcome to Favorite Page');

} 

function trenPage (req,res){
    try{

    const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`
        axios.get(url)
            .then((result) => {
    let mapResult = result.data.results.map((item) => {
        let trending= new TrendingMov(item.id,item.title, item.release_date ,item.poster_path,item.overview);
        return trending;
    })
    res.send(mapResult);
})
.catch((err) => {
    console.log("sorry", err);
    res.status(500).send(err);


}) 

    }
     catch (error) {
        errorHandler(error,req,res);
    }
}

function search(req,res){
    try{
        const APIKey = process.env.APIKey;
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`
            axios.get(url)
                .then((result) => {
        let mapResult = result.data.results;
        res.send(mapResult);
    })
    .catch((err) => {
        console.log("sorry", err);
        res.status(500).send(err);
    }) 
     }
         catch (error) {
            errorHandler(error,req,res);
        }

}
function latest(req,res){
    try{
        const APIKey = process.env.APIKey;
            const url = `https://api.themoviedb.org/3/tv/latest?api_key=${APIKey}&language=en-US&append_to_response=videos,images`
            axios.get(url)
                .then((result) => {
        let mapResult = result.data;
        res.send(mapResult);
    })
    .catch((err) => {
        console.log("sorry", err);
        res.status(500).send(err);
    
    
    }) 
    
        }
         catch (error) {
            errorHandler(error,req,res);
        }

}

function upcoming(req,res){
    try{
        const APIKey = process.env.APIKey;
            const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKey}&language=en-US&page=1
            `
            axios.get(url)
                .then((result) => {
        let mapResult = result.data.results;
        res.send(mapResult);
    })
    .catch((err) => {
        console.log("sorry", err);
        res.status(500).send(err);
    
    
    }) 
    
        }
         catch (error) {
            errorHandler(error,req,res);
        }

}

function getMovies(req,res){
    //return all specific movie 
    const sql = `SELECT * FROM specificMovies`;
    client.query(sql)
    .then((data)=>{
        res.send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}
function addMovie(req,res){
    const mov = req.body;
    console.log(mov);
    const sql = `INSERT INTO specificMovies (title,release_date,poster_path,overview ) VALUES ($1,$2,$3,$4) RETURNING *;`
    const values =[mov.title,mov.release_date,mov.poster_path,mov.overview];
client.query(sql,values)
.then(()=>{
res.send('your data was added');
}) .catch((err)=>{
    errorHandler(err,req,res);

})
}
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}

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
client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
    });

})
