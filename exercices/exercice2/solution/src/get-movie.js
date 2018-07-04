'use strict';

const movieService = require('./movie-service');

module.exports.handler = (event, context, callback) => {

    const movies = movieService.getMovies();
    const response = {
        statusCode: 200,
        body: JSON.stringify(movies)
    };

    callback(null, response);
};
