const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
const configRoutes = require('./routes');
const bluebird = require('bluebird');
const redis = require('redis');
const path = require('path')
const static = express.static(__dirname + '/public');

const multer = require("multer");
const fs = require("fs");

const handleError = (err, res) => {
  console.log(err)
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({dest: path.join(__dirname,"public","img")});

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

// https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
app.post(
  "/uploadImage",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const uploadPath = path.join(__dirname, "public", "img", req.file.originalname);

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {      

      fs.renameSync(req.file.path, uploadPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(req.file.path, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/images/:imageName", (req, res) => {
  if (!req.params.imageName) {
    res.status(400).json({error: 'You must supply imageName'});
    return;
  }
  let imagePath = path.join(__dirname, "public", "img", req.params.imageName);
  try {
    if (fs.existsSync(path)) {}
  } catch(err) {
    res.status(404).json({error: 'image not found'});
    return;
  }
  res.sendFile(path.join(imagePath));
});

configRoutes(app);

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});
