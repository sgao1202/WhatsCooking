const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const userData = require('./users');
const recipeData = require('./recipes');

const exportedMethods = {
  
  async getAllComments() {
    const commentCollection = await comments();
    const commentList = await commentCollection.find({}).toArray();
    if (!commentList) throw 'No comments in system!';
    return commentList;
  },

  async getCommentById(id) {
	  if (!id || typeof id !== 'string') throw 'must provide valid id';
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: mongoDB.ObjectId(String(id)) });
    if (!comment) throw 'comment not found';
    return comment
  },

  async getCommentsByRecipe(recipeId) {
	  if (!recipeId || typeof recipeId !== 'string') throw 'must provide valid recipeId';
    const commentCollection = await comments();
    const commentsList = await commentCollection.find({recipeId: recipeId}).toArray();
    return commentsList;
  },
  
  async addComment(comment, userId, recipeId) {
    if (!comment || typeof comment !== 'string') throw 'must provide valid content';
    if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
    if (!recipeId || typeof recipeId !== 'string') throw 'must provide valid recipeId';

    let u = await userData.getUserById(userId);
    let r = await recipeData.getRecipeById(recipeId);

    const commentCollection = await comments();

    const newComment = {
      comment: comment,
      userId: userId,
      recipeId: recipeId    
    };

    const newInsertInformation = await commentCollection.insertOne(newComment);

    return await this.getCommentById(String(newInsertInformation.insertedId));
  },

  // PUT /recipes/{id}
  // PATCH /recipes/{id}
  async updateComment(id, updatedComment) {
    if (!id || typeof id != "string") throw 'You must provide a valid id'
    if (!updatedComment.comment || typeof updatedComment.comment != "string") throw 'You must provide a valid rating'

    const comment = await this.getCommentById(id);

    let ratingUpdateInfo = {
      recipeId: comment.recipeId,
      userId: comment.userId,
      comment: updatedComment.comment
    };

    const commentCollection = await comments();
    const updateInfo = await commentCollection.updateOne(
      { _id: mongoDB.ObjectID(String(comment._id)) },
      { $set: ratingUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';

    return await this.getCommentById(id);
  },
  
  async deleteComment(commentId) {
    if (!commentId || typeof commentId !== 'string') throw 'must provide valid commentId';

    const commentCollection = await comments();
    const comment = await this.getCommentById(commentId);

 	  const deletionInfo = await commentCollection.removeOne({ _id: mongoDB.ObjectId(String(commentId)) });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${commentId}`;
    }
    return {"commentId":commentId,"deleted":true};
  }

};

module.exports = exportedMethods;
