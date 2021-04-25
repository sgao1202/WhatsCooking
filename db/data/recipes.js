const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const elasticsearch = require('elasticsearch');
const recipes = mongoCollections.recipes;
const users = mongoCollections.users;

const elasticsearchClient = new elasticsearch.Client({
    host:'localhost:9200', // process.env.elasticsearchAddress
    log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

let exportedMethods = {

  // GET /recipes
  async getAllrecipes() {
    const recipeCollection = await recipes();
    const recipeList = await recipeCollection.find({}).toArray();
    if (!recipeList) throw 'No recipes in system!';
    return recipeList;
  },

  async getRecipeById(id) {
	  if (!id || typeof id !== 'string') throw 'must provide valid id';
    const recipeCollection = await recipes();
    let recipe = await recipeCollection.findOne({ _id: mongoDB.ObjectID(String(id)) });
    if (!recipe) throw 'Recipe not found';
    return recipe;
  },

  async getRecipesByUser(userId) {
	  if (!userId || typeof userId !== 'string') throw 'must provide valid recipeId';
    const recipeCollection = await recipes();
    let recipeList = await recipeCollection.find({userId: userId}).toArray();
    return recipeList;
  },

  async getUserById(id) {
    if (!id || typeof id !== 'string') throw 'must provide valid id';

    const userCollection = await users();
    let user = await userCollection.findOne({
        _id: mongoDB.ObjectID(String(id))
    });
    if (!user) throw 'User not found';
    return user;
  },

  // POST /recipes
  async addRecipe(userId, title, picture, description, ingredients, procedure) {
    if (!userId || typeof userId != "string") throw 'You must provide a valid userId'
	  if (!title || typeof title != "string") throw 'You must provide a valid title'
    if (!picture || typeof picture != "string") throw 'You must provide a valid picture'
    if (!description || typeof description != "string") throw 'You must provide a valid description'

    let user = await this.getUserById(userId);

    if (!ingredients || !Array.isArray(ingredients)) {
      throw 'You must provide a valid array of ingredients'
    } else {
      ingredients.forEach(ingredient => {
        if (typeof ingredient != "object") {
          throw 'You must provide valid ingredients'
        } else if (!ingredient.name || typeof ingredient.name != "string") {
          throw 'You must provide valid ingredient names'
        } else if (!ingredient.portion || typeof ingredient.portion != "number") {
          throw 'You must provide valid ingredient portions'
        } else if (!ingredient.units || typeof ingredient.units != "string") {
                  throw 'You must provide valid ingredient units'
              }
      });
    }

    if (!procedure || !Array.isArray(procedure)) {
      throw 'You must provide a valid procedure'
    } else {
      procedure.forEach(step => {
        if (typeof step != "string") {
          throw 'You must provide valid procedure steps'
        }
      });
    }

    const recipeCollection = await recipes();

    let newRecipe = {
      userId: String(userId),
      title: title,
      picture: picture,
      description: description,
      ingredients: ingredients,
      procedure: procedure
    };

    const newInsertInformation = await recipeCollection.insertOne(newRecipe);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    newRecipe = await this.getRecipeById(String(newInsertInformation.insertedId));

    // elasticsearchClient.index({
    //     index: 'whatscooking',
    //     id: String(newInsertInformation._id),
    //     type: 'recipe',
    //     body: {
    //       "recipe": {
    //         id: newRecipe._id,
    //         title: newRecipe.title
    //       }
    //    }
    // }, function(err, resp, status) {
    //     throw err;
    // });

    return newRecipe;
  },

  // PUT /recipes/{id}
  // PATCH /recipes/{id}
  async updateRecipe(id, updatedRecipe) {
    if (!id || typeof id != "string") throw 'You must provide a valid id'
	  if (!updatedRecipe.title || typeof updatedRecipe.title != "string") throw 'You must provide a valid title'
    if (!updatedRecipe.picture || typeof updatedRecipe.picture != "string") throw 'You must provide a valid picture'
    if (!updatedRecipe.description || typeof updatedRecipe.description != "string") throw 'You must provide a valid description'

    const recipe = await this.getRecipeById(id);

    if (!updatedRecipe.ingredients || !Array.isArray(updatedRecipe.ingredients)) {
      throw 'You must provide an array of ingredients'
    } else {
      updatedRecipe.ingredients.forEach(ingredient => {
        if (typeof ingredient != "object") {
          throw 'You must provide valid ingredients'
        } else if (!ingredient.name || typeof ingredient.name != "string") {
          throw 'You must provide valid ingredient names'
        } else if (!ingredient.portion || typeof ingredient.portion != "number") {
          throw 'You must provide valid ingredient portions'
        } else if (!ingredient.units || typeof ingredient.units != "string") {
                  throw 'You must provide valid ingredient units'
              }
      });
    }

    if (!updatedRecipe.procedure || !Array.isArray(updatedRecipe.procedure)) {
      throw 'You must provide a valid procedure'
    } else {
      updatedRecipe.procedure.forEach(step => {
        if (typeof step != "string") {
          throw 'You must provide valid procedure steps'
        }
      });
    }

    let recipeUpdateInfo = {
      userId: recipe.userId,
      title: updatedRecipe.title,
      picture: updatedRecipe.picture,
      description: updatedRecipe.description,
      ingredients: updatedRecipe.ingredients,
      procedure: updatedRecipe.procedure
    };

    const recipeCollection = await recipes();
    const updateInfo = await recipeCollection.updateOne(
      { _id: mongoDB.ObjectID(String(id)) },
      { $set: recipeUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getRecipeById(id);
  },

  // DELETE /recipes/{id}
  async deleteRecipe(id) {
	  if (!id || typeof id !== 'string') throw 'must provide valid id';

    const recipeCollection = await recipes();
    const deletionInfo = await recipeCollection.removeOne({ _id: mongoDB.ObjectID(String(id)) });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete recipe with id of ${id}`;
    }
    return {"recipeId":String(id), "deleted":true};
  },

};

module.exports = exportedMethods;
