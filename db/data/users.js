const mongoDB = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const elasticsearch = require('elasticsearch');
const users = mongoCollections.users;
const recipeData = require('./recipes');

const elasticsearchClient = new elasticsearch.Client({
    host:'localhost:9200', // process.env.elasticsearchAddress
    log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

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
        if (!id || typeof id !== 'string') throw 'must provide valid id';

        const userCollection = await users();
        let user = await userCollection.findOne({_id: mongoDB.ObjectID(String(id))});
        if (!user) {
            throw 'User not found';
        } else {
            delete user.password;
        }
        return user;
    },

    async getUserByIdWithPword(id) {
        if (!id || typeof id !== 'string') throw 'must provide valid id';
        const userCollection = await users();
        let user = await userCollection.findOne({_id: mongoDB.ObjectID(String(id))});
        if (!user) throw 'User not found';
        return user;
    },

    async getUserByUsername(username) {
        if (!username || typeof username !== 'string') throw 'must provide valid username';

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
    async addUser(firstName, lastName, username, password, profilePicture, aboutMe) {
        if (!firstName || typeof firstName != "string") throw 'You must provide a valid first name'
        if (!lastName || typeof lastName != "string") throw 'You must provide a valid last name'
        if (!password || typeof password != "string") throw 'You must provide a valid password'
        if (!profilePicture || typeof profilePicture != "string") throw 'You must provide a valid profile picture'
        if (!aboutMe || typeof aboutMe != "string") throw 'You must provide a valid about me'

        // CHECK IF USERNAME IS UNIQUE
        const userCollection = await users();
        if (!username || typeof username != "string") {
            throw 'You must provide a username'
        } else {
            let userNameTaken = await userCollection.findOne({
                username: username
            });
            if (userNameTaken) {
                throw 'username is taken'
            }
        }

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            profilePicture: profilePicture,
            bookmarks: [],
            following: [],
            aboutMe: aboutMe
        };

        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

        return await this.getUserById(String(newInsertInformation.insertedId));
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

        return await this.getUserById(id);
    },

    // DELETE /users/{id}
    async removeUser(id) {
        if (!id || typeof id !== 'string') throw 'must provide valid id';

        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({
            _id: mongoDB.ObjectID(String(id))
        });
        if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${id}`;

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