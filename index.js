'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const data = require('./MovieData/data.json')

require('dotenv').config();



const client = new pg.Client(process.env.DATABASE_URL);

const server = express();

server.use(cors());
server.use(express.json());


// console.log(process.env.DATABASE_URL)
const PORT = process.env.PORT;



// routes
server.get('/', homePage);
server.get('/favorite', favPage);
server.get('/trending', trenPage);
server.get('/search', search);
server.get('/latest', latest);
server.get('/upcoming', upcoming);
server.get('/getMovies', getMovies);
server.post('/getMovies', addMovie);
server.put('/updateMovies/:id', updateMovies);
server.delete('/getMovies/:id', deleteMOvies);
server.get('/getMovies/:id', dataBaseMovies);
server.get('*', notFoundHandler)
server.use(errorHandler);

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function TrendingMov(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
// functions 
function homePage(req, res) {
    const movie = new Movie(data.title, data.poster_path, data.overview);
    res.json(movie);
}

function favPage(req, res) {
    res.send('Welcome to Favorite Page');

}

function trenPage(req, res) {
    try {

        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((item) => {
                    let trending = new TrendingMov(item.id, item.title, item.release_date, item.poster_path, item.overview);
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
        errorHandler(error, req, res);
    }
}

function search(req, res) {
    try {
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
        errorHandler(error, req, res);
    }

}
function latest(req, res) {
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/movie/latest?api_key=${APIKey}&language=en-US`;
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
        errorHandler(error, req, res);
    }

}

function upcoming(req, res) {
    try {
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
        errorHandler(error, req, res);
    }

}

function getMovies(req, res) {
    //return all specific movie 
    const sql = `SELECT * FROM specificMovies`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })


}
function addMovie(req, res) {
    const mov = req.body;
    console.log(mov);
    const sql = `INSERT INTO specificMovies (title,release_date,poster_path,overview ) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [mov.title, mov.release_date, mov.poster_path, mov.overview];
    client.query(sql, values)
        .then(() => {
            res.send('your data was added');
        }).catch((err) => {
            errorHandler(err, req, res);

        })
}
function updateMovies(req, res) {
    const id = req.params.id;
    const sql = `UPDATE specificMovies SET overview=$1 WHERE id=${id} RETURNING *`;
    const values = [req.body.overview];
    client.query(sql, values)
        .then((data) => {
            res.status(200).send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

function deleteMOvies(req, res) {

    const id = req.params.id;
    const sql = `DELETE FROM specificMovies WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(204).json({});
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })

}
function dataBaseMovies(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM specificMovies WHERE id = ${id}`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })


}

//handle error 
function notFoundHandler (req, res){
    res.status(404).send("page not found error")
}


function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error
    }
    res.status(500).send(err);
}



// http://localhost:3000
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT}`);
        });
    })

