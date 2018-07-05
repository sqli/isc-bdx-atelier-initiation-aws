const awsSdk = require('aws-sdk');
const uuid = require('uuid/v4');

const dynamoDBClient=   new awsSdk.DynamoDB.DocumentClient();

// async/await permet de rendre synchrone les appels
module.exports.getMovies = async () => {
    const scanParams = {
      TableName: process.env.DYNAMODB_TABLE,
    };
    const movies = await dynamoDBClient.scan(scanParams).promise();
    return movies;
};

module.exports.putMovie = async (movie) => {
    // Génération d'un identifiant si il n'existe pas dans l'objet
    if(!movie.id){
        movie.id = uuid();
    }
    // Préparation des paramètres de l'appel DynamoDB.put
    const putParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: movie
    };
    return await dynamoDBClient.put(putParams).promise();
};
