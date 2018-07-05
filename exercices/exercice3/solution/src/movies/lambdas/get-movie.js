const movieService = require('../services/movie-service');

module.exports.handler = (event, context, callback) => {

    movieService.getMovies().then((movies) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(movies)
        };

        callback(null, response);
    });
};
