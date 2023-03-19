DROP TABLE IF EXISTS specificMovies;

CREATE TABLE IF NOT EXISTS specificMovies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(10000),
    comment VARCHAR(10000)

);