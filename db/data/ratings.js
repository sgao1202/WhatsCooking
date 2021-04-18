const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const ratings = mongoCollections.ratings;
const userData = require('./users');
const recipeData = require('./recipes');

// const elasticsearchClient = new elasticsearch.Client({
//     host:'localhost:9200', // process.env.elasticsearchAddress
//     log: 'trace',
//     apiVersion: '7.2', // use the same version of your Elasticsearch instance
// });

const exportedMethods = {
  
  async getAllRatings() {
    const ratingCollection = await ratings();
    const ratingList = await ratingCollection.find({}).toArray();
    if (!ratingList) throw 'No ratings in system!';
    return ratingList;
  },

  async getRatingById(id) {
    if (!id || typeof id !== 'string') throw 'must provide valid id';
    const ratingCollection = await ratings();
    const rating = await ratingCollection.findOne({ _id: mongoDB.ObjectId(String(id)) });
    if (!rating) throw 'rating not found';
    return rating
  },

  async getRatingsByRecipe(recipeId) {
	  if (!recipe || typeof recipeId !== 'string') throw 'must provide valid recipeId';
    const ratingCollection = await ratings();
    const ratings = await ratingCollection.find({recipeId: recipeId}).toArray();
    return ratings;
  },
  
  async addRating(rating, user, recipe) {
    if (!rating || typeof rating != "number" || rating < 1 || rating > 5) throw 'You must provide a valid rating'
    if (!user || typeof user !== 'object') throw 'must provide valid user';
    if (!recipe || typeof recipe !== 'object') throw 'must provide valid recipe';

    const ratingCollection = await ratings();

    const newRating = {
      rating: rating,
      userId: user._id,
      recipeId: recipe._id    
	  };

    const newInsertInformation = await ratingCollection.insertOne(newRating);

    // elasticsearchClient.index({
    //     index: 'WhatsCooking',
    //     id: String(newInsertInformation._id),
    //     type: 'rating',
    //     body: {"rating": rating,}
    // }, function(err, resp, status) {
    //     throw err;
    // });

    return await this.getRatingById(String(newInsertInformation.insertedId));
  },

  // PUT /recipes/{id}
  // PATCH /recipes/{id}
  async updateRating(id, updatedRating) {
    if (!id || typeof id != "string") throw 'You must provide a valid id'
    if (!updatedRating.rating || typeof updatedRating.rating != "number" || 1 < updatedRating.rating || updatedRating.rating > 5) throw 'You must provide a valid rating'

    const rating = await this.getRatingById(id);

    let ratingUpdateInfo = {
      recipeId: rating.recipeId,
      userId: rating.userId,
      rating: updatedRating.rating
    };

    const ratingCollection = await ratings();
    const updateInfo = await ratingCollection.updateOne(
      { _id: mongoDB.ObjectID(String(rating._id)) },
      { $set: ratingUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getRecipeById(id);
  },
  
  async deleteRating(ratingId) {
    if (!ratingId || typeof ratingId !== 'string') throw 'must provide valid ratingId';

    const ratingCollection = await ratings();
    const rating = await this.getRatingById(ratingId);

 	  const deletionInfo = await ratingCollection.removeOne({ _id: mongoDB.ObjectId(String(ratingId)) });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete rating with id of ${ratingId}`;
    }
    
    return {"ratingId":ratingId,"deleted":true};
  }

};

module.exports = exportedMethods;
