const dbConnection = require('../../config/mongoConnection');
const { users, recipes, ratings, comments } = require('../../data');

const userList = require('./data');

async function main() {
    console.log('Starting seed task...');
    const db = await dbConnection();
    await db.dropDatabase();

    // create users
    try {
        for (const user of userList) {
            let u;

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
            } catch (e) {
                console.log(`Error adding user: ${e}`);
                db.serverConfig.close();
                return;
            }

            

            // create recipes for user
            if ('recipes' in user) {
                try {
                    let r = null;
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
                    }

                    for (const rating of user.ratings) {
                        //(rating, user, recipe)
                        await ratings.addRating(rating.rating, u, r);
                    }

                    for (const comment of user.comments) {
                        //(comment, user, recipe)
                        await comments.addComment(comment.comment, u, r);
                    }

                } catch (e) {
                    console.log(`Error adding task: ${e}`);
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

    await db.serverConfig.close();
    console.log('Seed task completed');
}

main();