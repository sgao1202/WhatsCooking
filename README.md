# WhatsCooking
WhatsCooking is a web application designed for people to share their culinary skills with one another. A user the application is able to create and share their own recipe, comment on a recipe, rate another user's recipe, and follow/view another user. The application was developed using the MERN stack (Mongo DB, Express, React, Node.js). For our additional technologies we utilized Docker, Elasticsearch, and Redis.

## Running Elasticsearch, Redis, and MongoDB
- Install docker on your machine based on your OS from https://docs.docker.com/get-docker/
- The root directory of the project has a docker-compose.yaml, which lists the image names, versions, ports for Elasticsearch, Redis, and MongoDB
- cd to this root directory and run the command docker-compose up

## Running the seed file, server, and client
1. Run 'npm install' on the command line in both the 'client' folder and 'db' folder.
2. Then run the seed file by accessing into the root directory for the 'db' folder and run the command 'npm run seed.'
3. Run 'npm start' in the root of the 'db' folder and the root of the 'client'.
4. The client application should then run on 'http://localhost:3000/' and the server should run on 'http://localhost:3001/'.
