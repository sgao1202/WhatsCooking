const e = require('express');
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const recipeData = data.recipes;
const ratingData = data.ratings;

router.get('/', async (req, res) => {
    try {
        let ratingList = await ratingData.getAllratings();
        res.status(200).json(ratingList);
    } catch (e) {
        res.status(500).json({
            error: String(e)
        })
    }
    return;
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    try {
        let rating = await ratingData.getRatingById(req.params.id);

        rating._id = String(rating._id);

        res.status(200).json(rating);
    } catch (e) {
        res.status(404).json({
            error: 'rating not found'
        });
    }
    return;
});

router.get('/:recipeId', async (req, res) => {
    if (!req.params.ratingId) {
        res.status(400).json({
            error: 'You must supply recipeId'
        });
        return;
    }

    try {
        let ratings = await ratingData.getRatingsByRecipe(req.params.recipeId);

        res.status(200).json(ratings);
    } catch (e) {
        res.status(404).json({
            error: 'ratings not found'
        });
    }
    return;
});

router.post('/', async (req, res) => {
    let ratingInfo = req.body;

    if (!ratingInfo) {
        res.status(400).json({
            error: 'You must provide data to create a rating'
        });
        return;
    }

    let recipe = null;
    if (!ratingInfo.recipeId || typeof ratingInfo.recipeId != "string") {
        res.status(400).json({
            error: 'You must provide a valid recipeId'
        });
        return;
    } else {
        try {
            recipe = await recipeData.getRecipeById(ratingInfo.recipeId);
            if (!user) {
                res.status(400).json({
                    error: 'recipe does not exist'
                });
                return;
            }
        } catch (error) {
            // do nothing
        }
    }

    let user = null;
    if (!ratingInfo.userId || typeof ratingInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            user = await userData.getUserById(ratingInfo.userId);
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

    if (!ratingInfo.rating || typeof ratingInfo.title != "number" || 1 < rating || rating > 5) {
        res.status(400).json({
            error: 'You must provide a valid rating'
        });
        return;
    }

    try {
        const newRating = await ratingData.addRating(
            ratingInfo.rating,
            user,
            recipe
        );
        res.status(200).json(newRating);
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

    let ratingInfo = req.body;

    if (!ratingInfo) {
        res.status(400).json({
            error: 'You must provide data to create a rating'
        });
        return;
    }

    let recipe = null;
    if (!ratingInfo.recipeId || typeof ratingInfo.recipeId != "string") {
        res.status(400).json({
            error: 'You must provide a valid recipeId'
        });
        return;
    } else {
        try {
            recipe = await recipeData.getRecipeById(ratingInfo.recipeId);
            if (!user) {
                res.status(400).json({
                    error: 'recipe does not exist'
                });
                return;
            }
        } catch (error) {
            // do nothing
        }
    }

    let user = null;
    if (!ratingInfo.userId || typeof ratingInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            user = await userData.getUserById(ratingInfo.userId);
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

    if (!ratingInfo.rating || typeof ratingInfo.title != "number" || 1 < rating || rating > 5) {
        res.status(400).json({
            error: 'You must provide a valid rating'
        });
        return;
    }

    try {
        await ratingData.updateRating(req.params.id, ratingInfo);
        let updateRating = await ratingData.getRatingById(req.params.id);
        res.status(200).json(updateRating);
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

    const ratingInfo = req.body;
    let updatedObject = {};
    let oldRating = null;

    if (!ratingInfo) {
        res.status(400).json({
            error: 'You must provide data to patch a rating'
        });
        return;
    }

    try {
        oldRating = await ratingData.getRatingById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'rating not found'
        });
        return;
    }

    if (ratingInfo.rating && ratingInfo.rating  !== oldRating.rating) {
        if (typeof ratingInfo.rating != "number" || 1 < ratingInfo.rating || ratingInfo.rating > 5) {
            res.status(400).json({
                error: 'You must provide a valid rating'
            });
            return;
        } else {
            updatedObject.rating = ratingInfo.rating; 
        }
    } else {
        updatedObject.rating = oldRating.rating;
    }

    try {
        await ratingData.updateRating(req.params.id, updatedObject);
        let updatedRating = await ratingData.getRatingById(req.params.id);
        res.status(200).json(updatedRating);
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