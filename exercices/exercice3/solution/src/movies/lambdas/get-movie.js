'use strict';

const movieService = require('../services/movie-service');

module.exports.handler = (event, context, callback) => {

    const movies = movieService.getMovies();
    const response = {
        statusCode: 200,
        body: JSON.stringify(movies)
    };

    callback(null, response);
};
