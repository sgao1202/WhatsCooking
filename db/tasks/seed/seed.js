const dbConnection = require('../../config/mongoConnection');
const { users, recipes, ratings, comments } = require('../../data');
var elasticsearch = require('elasticsearch');

elasticsearchClient = new elasticsearch.Client({
    host:'localhost:9200', // process.env.elasticsearchAddress
    //log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const userList = require('./data');

async function main() {
    console.log('Starting seed task...');
    const db = await dbConnection();
    await db.dropDatabase();

    await elasticsearchClient.indices.delete({
        index:  '_all'
      }, function(err, res) {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
      });

    await elasticsearchClient.indices.create({
        index: 'whatscooking'
    }, function(err, resp, status) {
        if (err) {
            console.log("create err:", err);
        }
    });

    // create users
    try {
        for (const user of userList) {
            let u;
            let r;

            // ADD USER
            try {
                // (firstName, lastName, username, password, profilePicture, aboutMe) 
                u = await users.addUser(
                    user.firstName,
                    user.lastName,
                    user.username,
                    user.password,
                    user.profilePicture,
                    user.aboutMe
                );

                // let allUsers = await users.getAllusers();
                // let idUser = await users.getUserById(String(u._id));
                // let usernameUser = await users.getUserByUsername(u.username);
                // let followUser = await users.addFollowToUser(String(u._id),String(u._id));
                // let removeFollowUser = await users.removeFollowFromUser(String(u._id),String(u._id));

                // u.username = 'updatedUsername';
                // let updatedUser = await users.updateUser(String(u._id), u);

                // console.log(removeFollowUser);
            } catch (e) {
                console.log(`Error adding user: ${e}`);
                db.serverConfig.close();
                return;
            }

            // create recipes for user
            if ('recipes' in user) {
                try {
                    
                    for (const recipe of user.recipes) {
                        //(userId, title, picture, description, ingredients, procedure)
                        r = await recipes.addRecipe(
                            u._id.toString(),
                            recipe.title,
                            recipe.recipePicture,
                            recipe.description,
                            recipe.ingredients,
                            recipe.procedure
                        );
                        // let allRecipes = await recipes.getAllrecipes();
                        // let idRecipe = await recipes.getRecipeById(String(r._id));
                        // let userRecipes = await recipes.getRecipesByUser(String(u._id));
                        // let bookmarkUser = await users.addBookmarkToUser(String(u._id), String(r._id));
                        // let removeBookmarkUser = await users.removeBookmarkFromUser(String(u._id), String(r._id));

                        // r.procedure[2] = 'updated step'
                        // let updatedRecipe = await recipes.updateRecipe(String(r._id), r)

                        // let deletedRecipe = await recipes.deleteRecipe(String(r._id));
                        // let allRecipes = await recipes.getAllrecipes();
                        console.log(removeBookmarkUser);
                    }

                    for (const rating of user.ratings) {
                        let rat = await ratings.addRating(rating.rating, String(u._id), String(r._id));
                        // let allRatings = await ratings.getAllRatings();
                        // let idRating = await ratings.getRatingById(String(rec._id))
                        // let recipeRating = await ratings.getRatingsByRecipe(String(r._id));

                        // rat.rating = 4;
                        // let updatedRating = await ratings.updateRating(String(rat._id), rat);

                        // let deletedRating = await ratings.deleteRating(String(rat._id));
                        // let allRatings = await ratings.getAllRatings();

                        // console.log(allRatings)
                    }

                    for (const comment of user.comments) {
                        //(comment, user, recipe)
                        let c = await comments.addComment(comment.comment, String(u._id), String(r._id));
                        // let allComments = await comments.getAllComments();
                        // let idComment = await comments.getCommentById(String(c._id));
                        // let recipeComment = await comments.getCommentsByRecipe(String(r._id))

                        // c.comment = 'updated a lot'
                        // let updatedComment = await comments.updateComment(String(c._id), c)

                        // let deletedComment = await comments.deleteComment(String(c._id));
                        // let allComments = await comments.getAllComments();

                        // console.log(allComments);
                    }

                } catch (e) {
                    console.log(`Error: ${e}`);
                    db.serverConfig.close();
                    return;
                }
            }
        }
    } catch (e) {
        console.log(`Seed error: ${e}`);
        db.serverConfig.close();
        return;
    }

    await elasticsearchClient.indices.delete({
        index:  '_all'
      }, function(err, res) {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
    });

    await db.serverConfig.close();
    console.log('Seed task completed');
}

main();