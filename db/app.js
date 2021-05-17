const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
const configRoutes = require('./routes');
const bluebird = require('bluebird');
const redis = require('redis');
const path = require('path')
const static = express.static(__dirname + '/public');
const isImage = require('is-image');
const { v4: uuidv4 } = require('uuid');
const recipeData = require('./data/recipes')
const multer = require("multer");
const fs = require("fs");
const e = require('express');

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
app.use(express.json({ limit: '50mb', extended: true}));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 100000000 }));

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
    let id = String(uuidv4());
    const uploadPath = path.join(__dirname, "public", "img", req.file.originalname);
    const idPath = path.join(__dirname, "public", "img", id);
    try {
      fs.renameSync(req.file.path, uploadPath, err => {throw 'file upload failed'});
      if (!isImage(uploadPath)) throw 'file is not an image';
      else {
        fs.renameSync(uploadPath, idPath, err => {throw 'file upload failed'});
        res
          .status(200)
          .contentType("text/plain")
          .send(String(id));
      }
    } catch {
      fs.unlink(uploadPath, err => {
        res
          .status(403)
          .contentType("text/plain")
          .send('file upload failed');
      });
    }
  }
);

app.get("/images/:imageId", (req, res) => {
  if (!req.params.imageId) {
    res.status(400).json({error: 'You must supply imageId'});
    return;
  }
  let imagePath = path.join(__dirname, "public", "img", req.params.imageId);
  try {
    if (fs.existsSync(path)) {}
  } catch(err) {
    res.status(404).json({error: 'image not found'});
    return;
  }
  res
    .contentType("image/png")
    .sendFile(path.join(imagePath))
});

configRoutes(app);

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});
