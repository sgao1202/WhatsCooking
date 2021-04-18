var elasticsearch = require('elasticsearch');

let elasticsearchClient = undefined;

module.exports = () => {
    elasticsearchClient = new elasticsearch.Client({
        host:'localhost:9200', // process.env.elasticsearchAddress
        log: 'trace',
        apiVersion: '7.2', // use the same version of your Elasticsearch instance
    });

    return elasticsearchClient;
};