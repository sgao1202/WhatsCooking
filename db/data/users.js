const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const elasticData = require('../elasticdata');
const elasticUsers = elasticData.users;
const users = mongoCollections.users;
const recipeData = require('./recipes');
const verify = require('../utils/verify');

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
        if (!verify.validString(id)) throw 'must provide valid id';

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
        if (!verify.validString(uid)) throw 'User uid must be valid';
        const userCollection = await users();
        let user = await userCollection.findOne({ uid: uid });
        if (!user) throw `User with uid=${uid} was not found`;
    },

    // What is this for?
    async getUserByIdWithPword(id) {
        if (!verify.validString(id)) throw 'must provide valid id';
        const userCollection = await users();
        let user = await userCollection.findOne({_id: mongoDB.ObjectID(String(id))});
        if (!user) throw 'User not found';
        return user;
    },

    // When will we use this?
    async getUserByUsername(username) {
        if (!verify.validString(username)) throw 'must provide valid username';

        const userCollection = await users();
        let user = await userCollection.findOne({username: username});
        if (!user) {
            throw 'User not found'
        } else {
            delete user.password;
        };
        return user;
    },

    // We don't need to store password in the database
    // POST /users
    async addUser(uid, firstName, lastName, username, profilePicture, aboutMe) {
        if (!verify.validString(uid)) throw 'You must provide a valid uid'
        if (!verify.validString(firstName)) throw 'You must provide a valid first name'
        if (!verify.validString(lastName)) throw 'You must provide a valid last name'
        // if (!verify.validString(username)) throw 'You must provide a username'
        // if (!verify.validString(password)) throw 'You must provide a valid password'
        if (!verify.validString(profilePicture)) throw 'You must provide a valid profile picture'
        if (!verify.validString(aboutMe)) throw 'You must provide a valid about me'

        // I don't think we're going to use username 
        // CHECK IF USERNAME IS UNIQUE
        // const userCollection = await users();
        // let userNameTaken = await userCollection.findOne({
        //     username: username
        // });
        // if (userNameTaken) throw `Username '${username}' is taken`;

        let newUser = {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            // username: username,
            // password: password,  I do not think we need password as a field in the document (handeld by Firebase)
            profilePicture: profilePicture,
            aboutMe: aboutMe,
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
        if (!updatedUser.firstName || typeof updatedUser.firstName != "string") throw 'You must provide a valid first name'
        if (!updatedUser.lastName || typeof updatedUser.lastName != "string") throw 'You must provide a valid last name'
        if (!updatedUser.password || typeof updatedUser.password != "string") throw 'You must provide a valid password'
        if (!updatedUser.profilePicture || typeof updatedUser.profilePicture != "string") throw 'You must provide a valid profile picture'
        if (!updatedUser.aboutMe || typeof updatedUser.aboutMe != "string") throw 'You must provide a valid about me'

        // CHECK IF USERNAME IS UNIQUE
        const userCollection = await users();
        if (!updatedUser.username || typeof updatedUser.username != "string") {
            throw 'You must provide a valid username'
        } else {
            let userNameTaken = await userCollection.findOne({
                username: updatedUser.username
            });
            if (userNameTaken) {
                throw 'username is taken'
            }
        }

        const user = await this.getUserById(id);

        let newUser = {
            uid: user.uid,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            username: updatedUser.username,
            password: updatedUser.password,
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
        if (!id || typeof id !== 'string') throw 'must provide valid id';

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
        if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
        if (!recipeId || typeof recipeId != "string") throw 'You must provide valid recipeId';

        let user = await this.getUserById(userId);
        let recipe = await recipeData.getRecipeById(recipeId);

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({
            _id: mongoDB.ObjectID(String(userId))
        }, {
            $addToSet: {
                bookmarks: String(recipe._id)
            }
        });

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw 'Update failed';
        }

        return await this.getUserById(userId);
    },

    // DELETE /users/{userId}/bookmarks/{recipeId}
    async removeBookmarkFromUser(userId, recipeId) {
        if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
        if (!recipeId || typeof recipeId !== 'string') throw 'must provide valid recipeId';

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

    // POST /users/{userId}/following/
    async addFollowToUser(userId, followUserId) {
        if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
        if (!followUserId || typeof followUserId != "string") throw 'You must provide valid followUserId';

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
        if (!userId || typeof userId !== 'string') throw 'must provide valid userId';
        if (!followUserId || typeof followUserId !== 'string') throw 'must provide valid follow userId';

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