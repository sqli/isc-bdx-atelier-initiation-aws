const movieService = require('../services/movie-service');

module.exports.handler = (event, context, callback) => {

    const movie = JSON.parse(event.body);
    movieService.putMovie(movie).then(() => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(movie)
        };

        callback(null, response);
    });
};
