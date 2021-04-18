const express = require('express');
const app = express();
// const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

const static = express.static(__dirname + '/public');

// client.flushdb( async function (err, succeeded) {
//   console.log(err, succeeded)
// });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INCREMENT SEARCHES IN REDIS SORTED SET
app.use(async (req, res, next) => {
  if (req._parsedUrl.pathname == '/search') {
    if (req.query.SEARCH_TERM) {
      if (req.query.SEARCH_TERM.replace(/ /g,'') != '') {
        await client.zincrbyAsync('searchCnt', 1, String(req.query.SEARCH_TERM));
      }
    }
  
    if (req.body.SEARCH_TERM) {
      if (req.body.SEARCH_TERM.replace(/ /g,'') != '') {
        await client.zincrbyAsync('searchCnt', 1, String(req.body.SEARCH_TERM));
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
