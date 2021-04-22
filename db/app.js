const express = require('express');
const app = express();
// const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const bluebird = require('bluebird');
const redis = require('redis');
const path = require('path')
const static = express.static(__dirname + '/public');

const redisClient = redis.createClient();
// redisClient.flushdb( async function (err, succeeded) {
//   if (err) {
//     console.log('Redis flush err:', err)
//   }
// });

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INCREMENT SEARCHES IN REDIS SORTED SET
app.use(async (req, res, next) => {
  let parse = path.parse(req._parsedUrl.pathname);

  if (parse.dir == '/recipes' && parse.base != 'popular') {  
    if (parse.base && parse.base.replace(/ /g,'') != '') {
      let res = await redisClient.zincrbyAsync('recipeHits', 1, String(parse.base));
      console.log(res);
    } 
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
