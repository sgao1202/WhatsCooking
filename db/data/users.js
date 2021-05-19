const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const elasticData = require('../elasticdata');
const elasticUsers = elasticData.users;
const users = mongoCollections.users;
const recipeData = require('./recipes');
const utils = require('../utils/utils');

let exportedMethods = {

    // GET /users
    async getAllusers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();

        // remove passwords
        userList.forEach(user => {
            delete user.password;
        })

        if (!userList) throw 'No users in system!';
        return userList;
    },

    async getUserById(id) {
        if (!utils.validString(id)) throw 'must provide valid id';

        const userCollection = await users();
        let user = await userCollection.findOne({_id: mongoDB.ObjectID(String(id))});
        if (!user) {
            throw 'User not found';
        } else {
            delete user.password;
        }
        return user;
    },

    async getUserByUid(uid) {
        if (!utils.validString(uid)) throw 'User uid must be valid';
        const userCollection = await users();
        let user = await userCollection.findOne({ uid: uid });
        if (!user) throw `User with uid=${uid} was not found`;
        return utils.convertId(user);
    },

    // What is this for?
    async getUserByIdWithPword(id) {
        if (!utils.validString(id)) throw 'must provide valid id';
        const userCollection = await users();
        let user = await userCollection.findOne({_id: mongoDB.ObjectID(String(id))});
        if (!user) throw 'User not found';
        return user;
    },

    // When will we use this?
    async getUserByUsername(username) {
        if (!utils.validString(username)) throw 'must provide valid username';

        const userCollection = await users();
        let user = await userCollection.findOne({username: username});
        if (!user) {
            throw 'User not found'
        } else {
            delete user.password;
        };
        return user;
    },

    // POST /users
    async addUser(uid, firstName, lastName, profilePicture, aboutMe) {
        if (!utils.validString(uid)) throw 'You must provide a valid uid'
        if (!utils.validString(firstName)) throw 'You must provide a valid first name'
        if (!utils.validString(lastName)) throw 'You must provide a valid last name'
        if (!utils.validString(profilePicture)) throw 'You must provide a valid profile picture'
        if (!utils.validString(aboutMe)) throw 'You must provide a valid about me'

        const userCollection = await users();
        let newUser = {
            uid: uid.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            profilePicture: profilePicture,
            aboutMe: aboutMe.trim(),
            bookmarks: [],
            following: [],
            recipes: []
        };

        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

        let returnUser = await this.getUserById(String(newInsertInformation.insertedId));
        elasticUsers.addUser(returnUser);
        return returnUser;
    },
     
    // PUT /users/{id}
    // PATCH /users/{id}
    async updateUser(id, updatedUser) {
        if (!utils.validString(updatedUser.firstName)) throw 'You must provide a valid first name'
        if (!utils.validString(updatedUser.lastName)) throw 'You must provide a valid last name'
        if (!utils.validString(updatedUser.profilePicture)) throw 'You must provide a valid profile picture'
        if (!utils.validString(updatedUser.aboutMe)) throw 'You must provide a valid about me'

        const userCollection = await users();
        const user = await this.getUserById(id);
        let newUser = {
            uid: user.uid,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            profilePicture: updatedUser.profilePicture,
            bookmarks: user.bookmarks,
            following: user.following,
            aboutMe: updatedUser.aboutMe
        };

        const updateInfo = await userCollection.updateOne({
            _id: mongoDB.ObjectID(String(id))
        }, {
            $set: newUser
        });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        let returnUser = await this.getUserById(id);
        elasticUsers.updateUser(user);
        return returnUser;
    },

    // DELETE /users/{id}
    async removeUser(id) {
        if (!utils.validString(id)) throw 'must provide valid id';

        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({
            _id: mongoDB.ObjectID(String(id))
        });
        if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${id}`;
        elasticUsers.removeUser(id);
        return {
            "userId": String(id),
            "deleted": true
        };
    },

    // POST /users/{userId}/bookmarks/
    async addBookmarkToUser(userId, recipeId) {
        if (!utils.validString(userId)) throw 'must provide valid userId';
        if (!utils.validString(recipeId)) throw 'You must provide valid recipeId';

        let user = await this.getUserByUid(userId);
        let recipe = await recipeData.getRecipeById(recipeId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
            uid: userId
        }, {
            $addToSet: {
                bookmarks: String(recipe._id)
            }
        });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getUserByUid(userId);
    },

    // DELETE /users/{userId}/bookmarks/{recipeId}
    async removeBookmarkFromUser(userId, recipeId) {
        if (!utils.validString(userId)) throw 'must provide valid userId';
        if (!utils.validString(recipeId)) throw 'must provide valid recipeId';

        let user = await this.getUserById(userId);
        let recipe = await recipeData.getRecipeById(recipeId);

        let recipeFound = false;
        user.bookmarks.forEach(bookmark => {
            if (recipeId == bookmark) {
                recipeFound = true;
            }
        })

        if (recipeFound === false) {
            throw 'bookmark not found for user'
        }

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
            _id: mongoDB.ObjectID(String(userId))
            }, {
                $pull: {
                    bookmarks: String(recipeId)
                }
            },
            true
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return await this.getUserById(userId);
    },

    // POST /users/{userId}/bookmarks/
    async addRecipeToUser(userId, recipeId) {
        if (!utils.validString(userId)) throw 'must provide valid userId';
        if (!utils.validString(recipeId)) throw 'You must provide valid recipeId';

        let user = await this.getUserById(userId);
        let recipe = await recipeData.getRecipeById(recipeId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
            _id: mongoDB.ObjectID(String(userId))
        }, {
            $addToSet: {
                recipes: String(recipe._id)
            }
        });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getUserById(userId);
    },

    // POST /users/{userId}/following/
    async addFollowToUser(userId, followUserId) {
        if (!utils.validString(userId)) throw 'must provide valid userId';
        if (!utils.validString(followUserId)) throw 'You must provide valid followUserId';

        let user = await this.getUserById(userId);
        let followUser = await this.getUserById(followUserId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
            _id: mongoDB.ObjectID(String(userId))
        }, {
            $addToSet: {
                following: String(followUser._id)
            }
        });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getUserById(userId);
    },

    // DELETE /users/{userId}/following/{followUserId}
    async removeFollowFromUser(userId, followUserId) {
        if (!utils.validString(userId)) throw 'must provide valid userId';
        if (!utils.validString(followUserId)) throw 'must provide valid follow userId';

        let user = await this.getUserById(userId);
        let followUser = await this.getUserById(followUserId);

        let userFound = false;
        user.following.forEach(follow => {
            console.log(follow)
            if (followUserId == follow) {
                userFound = true;
            }
        })

        if (userFound === false) {
            throw 'follow not found for user'
        }

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
                _id: mongoDB.ObjectID(String(userId))
            }, {
                $pull: {
                    following: String(followUserId)
                }
            },
            true
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return await this.getUserById(userId);
    },

};

module.exports = exportedMethods;