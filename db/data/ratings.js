const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const ratings = mongoCollections.ratings;
const userData = require('./users');
const recipeData = require('./recipes');

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
	  if (!recipeId || typeof recipeId !== 'string') throw 'must provide valid recipeId';
    const ratingCollection = await ratings();
    const ratingsList = await ratingCollection.find({recipeId: recipeId}).toArray();
    return ratingsList;
  },
  
  async addRating(rating, userId, recipeId) {
    if (!rating || typeof rating != "number" || rating < 1 || rating > 5) throw 'You must provide a valid rating'
    if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
    if (!recipeId || typeof recipeId !== 'string') throw 'must provide valid recipeId';

    let u = await userData.getUserById(userId);
    let r = await recipeData.getRecipeById(recipeId);

    const ratingCollection = await ratings();

    const newRating = {
      rating: rating,
      userId: userId,
      recipeId: recipeId
	  };

    const newInsertInformation = await ratingCollection.insertOne(newRating);

    return await this.getRatingById(String(newInsertInformation.insertedId));
  },

  // PUT /recipes/{id}
  // PATCH /recipes/{id}
  async updateRating(id, updatedRating) {
    if (!id || typeof id != "string") throw 'You must provide a valid id'
    if (!updatedRating.rating || typeof updatedRating.rating != "number" || updatedRating.rating < 1 || updatedRating.rating > 5) throw 'You must provide a valid rating'

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

    return await this.getRatingById(id);
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
