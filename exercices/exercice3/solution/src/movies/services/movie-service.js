const awsSdk = require('aws-sdk');
const uuid = require('uuid/v4');

const dynamoDBClient = new awsSdk.DynamoDB.DocumentClient();

module.exports.getMovies = () => {
    const scanParams = {
        TableName: process.env.DYNAMODB_TABLE,
    };
    return dynamoDBClient.scan(scanParams).promise().then((dbResult) => dbResult.Items);
};

module.exports.putMovie = (movie) => {
    // Génération d'un identifiant si il n'existe pas dans l'objet
    if (!movie.id) {
        movie.id = uuid();
    }
    // Préparation des paramètres de l'appel DynamoDB.put
    const putParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: movie
    };
    return dynamoDBClient.put(putParams).promise();
};
