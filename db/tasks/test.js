// var elasticsearch = require('elasticsearch');

// client = new elasticsearch.Client({
//     host:'localhost:9200', // process.env.elasticsearchAddress
//     log: 'trace',
//     apiVersion: '7.2', // use the same version of your Elasticsearch instance
// });

// client.indices.create({
//     index: 'WhatsCooking'
// }, function(err, resp, status) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("create", resp);
//     }
// });

// client.index({
//     index: 'test',
//     id: '1',
//     type: 'posts',
//     body: {
//         "PostName": "Integrating Elasticsearch Into Your Node.js Application",
//         "PostType": "Tutorial",
//         "PostBody": "This is the text of our tutorial about using Elasticsearch in your Node.js application.",
//     }
// }, function(err, resp, status) {
//     //console.log(resp);
// });

// client.search({
//     index: 'test',
//     type: 'posts',
//     q: 'PostName:Node.js'
// }).then(function(resp) {
//     console.trace(resp)
//     resp.hits.hits.forEach(hit => {
//         console.trace(hit)
//     });
// }, function(err) {
//     console.trace(err.message);
// });

async function main() {

    var auth = require('../auth');
    let pwd = await auth.hashPassword('stevens')
    console.log(pwd);
}

main()