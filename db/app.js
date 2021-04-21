const express = require('express');
const app = express();
// const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const elasticsearch = require('elasticsearch');
const bluebird = require('bluebird');
const redis = require('redis');
const static = express.static(__dirname + '/public');

const redisClient = redis.createClient();
redisClient.flushdb( async function (err, succeeded) {
  console.log(err, succeeded)
});

const elasticsearchClient = new elasticsearch.Client({
  host:'localhost:9200', // process.env.elasticsearchAddress
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

elasticsearchClient.indices.delete({
  index: '_all'
}, function(err, res) {

  if (err) {
      console.error(err.message);
  } else {
      console.log('Indexes have been deleted!');
  }
});

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INCREMENT SEARCHES IN REDIS SORTED SET
app.use(async (req, res, next) => {
  if (req._parsedUrl.pathname == '/recipes') {
    // if (req.query.SEARCH_TERM) {
    //   if (req.query.SEARCH_TERM.replace(/ /g,'') != '') {
    //     await redisClient.zincrbyAsync('searchCnt', 1, String(req.query.SEARCH_TERM));
    //   }
    // }
  
    if (req.body.id) {
      if (req.body.id.replace(/ /g,'') != '') {
        await redisClient.zincrbyAsync('recipeHits', 1, String(req.body.id));
      } 
    }
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
