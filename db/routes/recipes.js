const express = require('express');
const router = express.Router();
const bluebird = require('bluebird');
const redis = require('redis');
const data = require('../data');
const userData = data.users;
const recipeData = data.recipes;

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

router.get('/', async (req, res) => {
    try {
        let recipeList = await recipeData.getAllrecipes();
        res.status(200).json(recipeList);
    } catch (e) {
        res.status(500).json({
            error: String(e)
        })
    }
    return;
});

router.get('/popular', async (req, res) => {
    try {
        
        await client.zrevrange('recipeHits',0,19,'WITHSCORES',async function(err,results){ // 'recipeHits',0,19,'WITHSCORES'
            if (err != null) {
                res.status(404).json({
                    error: 'error occured while getting popular recipes'
                });
            } else {
                let recipes = [];

                i = 0;
                n = results.length;
                while (i < n) {
                    try {
                        let result = results.slice(i, i+=2);
                        var recipe = await recipeData.getRecipeById(result[0]);
                        recipe['hits'] = result[1];              
                        recipes.push(recipe);
                    } catch (error) {
                        // do nothing, no recipe found for id
                    }
                }
                res.status(200).json(recipes)
            }
        });

        return;
    } catch (e) {
        res.status(404).json({error: String(e)});
    }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    try {
        let recipe = await recipeData.getRecipeById(req.params.id);

        recipe._id = String(recipe._id);

        res.status(200).json(recipe);
    } catch (e) {
        res.status(404).json({
            error: 'recipe not found'
        });
    }
    return recipe;
});

router.post('/', async (req, res) => {
    let recipeInfo = req.body;

    if (!recipeInfo) {
        res.status(400).json({
            error: 'You must provide data to create a recipe'
        });
        return;
    }

    if (!recipeInfo.userId || typeof recipeInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            let user = await userData.getUserById(recipeInfo.userId);
            if (!user) {
                res.status(400).json({
                    error: 'user does not exist'
                });
                return;
            }
        } catch (error) {
            // do nothing
        }
    }

    if (!recipeInfo.title || typeof recipeInfo.title != "string" || recipeInfo.title == "popular") {
        res.status(400).json({
            error: 'You must provide a valid title'
        });
        return;
    }

    if (!recipeInfo.picture || typeof recipeInfo.picture != "string") {
        res.status(400).json({
            error: 'You must provide a valid picture'
        });
        return;
    }

    if (!recipeInfo.description || typeof recipeInfo.description != "string") {
        res.status(400).json({
            error: 'You must provide a valid description'
        });
        return;
    }

    if (!recipeInfo.ingredients || !Array.isArray(recipeInfo.ingredients)) {
        res.status(400).json({
            error: 'You must provide a valid array of ingredients'
        });
        return;
    } else {
        recipeInfo.ingredients.forEach(ingredient => {
            if (typeof ingredient != "object") {
                res.status(400).json({
                    error: 'You must provide valid ingredients'
                });
                return;
            } else if (!ingredient.name || typeof ingredient.name != "string") {
                res.status(400).json({
                    error: 'You must provide valid ingredient names'
                });
                return;
            } else if (!ingredient.portion || typeof ingredient.portion != "number") {
                res.status(400).json({
                    error: 'You must provide valid ingredient portions'
                });
                return;
            } else if (!ingredient.units || typeof ingredient.units != "string") {
                res.status(400).json({
                    error: 'You must provide valid ingredient units'
                });
            }
        });
    }

    if (!recipeInfo.procedure || !Array.isArray(recipeInfo.procedure)) {
        res.status(400).json({
            error: 'You must provide a valid procedure'
        });
        return;
    } else {
        recipeInfo.procedure.forEach(step => {
            if (typeof step != "string") {
                res.status(400).json({
                    error: 'You must provide valid procedure steps'
                });
                return;
            }
        });
    }

    try {
        const newRecipe = await recipeData.addRecipe(
            recipeInfo.userId,
            recipeInfo.title,
            recipeInfo.picture,
            recipeInfo.description,
            recipeInfo.ingredients,
            recipeInfo.procedure
        );
        res.status(200).json(newRecipe);
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
    }
    return;
});


router.put('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    let recipeInfo = req.body;

    if (!recipeInfo) {
        res.status(400).json({
            error: 'You must provide data to create a recipe'
        });
        return;
    }

    if (!recipeInfo.userId || typeof recipeInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            let user = await userData.getUserById(recipeInfo.userId);
            if (!user) {
                res.status(400).json({
                    error: 'user does not exist'
                });
                return;
            }
        } catch (error) {
            // do nothing
        }
    }

    if (!recipeInfo.title || typeof recipeInfo.title != "string") {
        res.status(400).json({
            error: 'You must provide a valid title'
        });
        return;
    }

    if (!recipeInfo.picture || typeof recipeInfo.picture != "string") {
        res.status(400).json({
            error: 'You must provide a valid picture'
        });
        return;
    }

    if (!recipeInfo.description || typeof recipeInfo.description != "string") {
        res.status(400).json({
            error: 'You must provide a valid description'
        });
        return;
    }

    if (!recipeInfo.ingredients || !Array.isArray(recipeInfo.ingredients)) {
        res.status(400).json({
            error: 'You must provide a valid array of ingredients'
        });
        return;
    } else {
        recipeInfo.ingredients.forEach(ingredient => {
            if (typeof ingredient != "object") {
                res.status(400).json({
                    error: 'You must provide valid ingredients'
                });
                return;
            } else if (!ingredient.name || typeof ingredient.name != "string") {
                res.status(400).json({
                    error: 'You must provide valid ingredient names'
                });
                return;
            } else if (!ingredient.portion || typeof ingredient.portion != "number") {
                res.status(400).json({
                    error: 'You must provide valid ingredient portions'
                });
                return;
            } else if (!ingredient.units || typeof ingredient.units != "string") {
                res.status(400).json({
                    error: 'You must provide valid ingredient units'
                });
            }
        });
    }

    if (!recipeInfo.procedure || !Array.isArray(recipeInfo.procedure)) {
        res.status(400).json({
            error: 'You must provide a valid procedure'
        });
        return;
    } else {
        recipeInfo.procedure.forEach(step => {
            if (typeof step != "string") {
                res.status(400).json({
                    error: 'You must provide valid procedure steps'
                });
                return;
            }
        });
    }

    try {
        await recipeData.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'recipe not found'
        });
        return;
    }

    try {
        await recipeData.updateRecipe(req.params.id, recipeInfo);
        let updatedRecipe = await recipeData.getRecipeById(req.params.id);
        res.status(200).json(updatedRecipe);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});

router.patch('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    const recipeInfo = req.body;
    let updatedObject = {};
    let oldRecipe = null;

    if (!recipeInfo) {
        res.status(400).json({
            error: 'You must provide data to patch a recipe'
        });
        return;
    }

    try {
        oldRecipe = await recipeData.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'recipe not found'
        });
        return;
    }

    if (recipeInfo.title && recipeInfo.title !== oldRecipe.title) {
        if (typeof recipeInfo.title != "string") {
            res.status(400).json({
                error: 'You must provide a valid title'
            });
            return;
        } else {
            updatedObject.title = recipeInfo.title;
        }
    } else {
        updatedObject.title = oldRecipe.title;
    }

	if (recipeInfo.picture && recipeInfo.picture !== oldRecipe.picture) {
        if (typeof recipeInfo.picture != "string") {
            res.status(400).json({
                error: 'You must provide a valid picture'
            });
            return;
        } else {
            updatedObject.picture = recipeInfo.picture;
        }
    } else {
        updatedObject.picture = oldRecipe.picture;
    }

	if (recipeInfo.description && recipeInfo.description !== oldRecipe.description) {
        if (typeof recipeInfo.description != "string") {
            res.status(400).json({
                error: 'You must provide a valid description'
            });
            return;
        } else {
            updatedObject.description = recipeInfo.description;
        }
    } else {
        updatedObject.description = oldRecipe.description;
    }

    let ingerdientsEqual = arraysEqual(recipeInfo.ingredients, oldRecipe.ingredients);
	if (recipeInfo.ingredients && !ingerdientsEqual) {
        if (!Array.isArray(recipeInfo.ingredients)) {
            res.status(400).json({
                error: 'You must provide an array of ingredients'
            });
            return;
        } else {
            updatedObject.ingredients = recipeInfo.ingredients;
        }
    } else {
        updatedObject.ingredients = oldRecipe.ingredients;
    }

    let procedureEqual = arraysEqual(recipeInfo.procedure, oldRecipe.procedure);
	if (recipeInfo.procedure && !procedureEqual) {
        if (!Array.isArray(recipeInfo.procedure)) {
            res.status(400).json({
                error: 'You must provide a valid procedure'
            });
            return;
        } else {
            updatedObject.procedure = recipeInfo.procedure;
        }
    } else {
        updatedObject.procedure = oldRecipe.ingredients;
    }

    try {
        await recipeData.updateRecipe(req.params.id, updatedObject);
        let updatedRecipe = await recipeData.getRecipeById(req.params.id);
        res.status(200).json(updatedRecipe);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});



module.exports = router;