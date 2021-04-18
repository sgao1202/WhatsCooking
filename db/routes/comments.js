const e = require('express');
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const recipeData = data.recipes;
const commentData = data.comments;

router.get('/', async (req, res) => {
    try {
        let commentList = await commentData.getAllcomments();
        res.status(200).json(commentList);
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
        let comment = await commentData.getCommentById(req.params.id);

        comment._id = String(comment._id);

        res.status(200).json(comment);
    } catch (e) {
        res.status(404).json({
            error: 'comment not found'
        });
    }
    return;
});

router.get('/:recipeId', async (req, res) => {
    if (!req.params.commentId) {
        res.status(400).json({
            error: 'You must supply recipeId'
        });
        return;
    }

    try {
        let comments = await commentsData.getCommentsByRecipe(req.params.recipeId);

        res.status(200).json(comments);
    } catch (e) {
        res.status(404).json({
            error: 'comments not found'
        });
    }
    return;
});

router.post('/', async (req, res) => {
    let commentInfo = req.body;

    if (!commentInfo) {
        res.status(400).json({
            error: 'You must provide data to create a comment'
        });
        return;
    }

    let recipe = null;
    if (!commentInfo.recipeId || typeof commentInfo.recipeId != "string") {
        res.status(400).json({
            error: 'You must provide a valid recipeId'
        });
        return;
    } else {
        try {
            recipe = await recipeData.getRecipeById(commentInfo.recipeId);
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
    if (!commentInfo.userId || typeof commentInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            user = await userData.getUserById(commentInfo.userId);
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

    if (!commentInfo.comment || typeof commentInfo.title != "string") {
        res.status(400).json({
            error: 'You must provide a valid comment'
        });
        return;
    }

    try {
        const newComment = await commentData.addComment(
            commentInfo.comment,
            user,
            recipe
        );
        res.status(200).json(newComment);
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

    let commentInfo = req.body;

    if (!commentInfo) {
        res.status(400).json({
            error: 'You must provide data to create a comment'
        });
        return;
    }

    let recipe = null;
    if (!commentInfo.recipeId || typeof commentInfo.recipeId != "string") {
        res.status(400).json({
            error: 'You must provide a valid recipeId'
        });
        return;
    } else {
        try {
            recipe = await recipeData.getRecipeById(commentInfo.recipeId);
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
    if (!commentInfo.userId || typeof commentInfo.userId != "string") {
        res.status(400).json({
            error: 'You must provide a valid userId'
        });
        return;
    } else {
        try {
            user = await userData.getUserById(commentInfo.userId);
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

    if (!commentInfo.comment || typeof commentInfo.title != "number" || 1 < comment || comment > 5) {
        res.status(400).json({
            error: 'You must provide a valid comment'
        });
        return;
    }

    try {
        await commentData.updateComment(req.params.id, commentInfo);
        let updateComment = await commentData.getCommentById(req.params.id);
        res.status(200).json(updateComment);
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

    const commentInfo = req.body;
    let updatedObject = {};
    let oldComment = null;

    if (!commentInfo) {
        res.status(400).json({
            error: 'You must provide data to patch a comment'
        });
        return;
    }

    try {
        oldComment = await commentData.getCommentById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'comment not found'
        });
        return;
    }

    if (commentInfo.comment && commentInfo.comment  !== oldComment.comment) {
        if (typeof commentInfo.comment != "number" || 1 < commentInfo.comment || commentInfo.comment > 5) {
            res.status(400).json({
                error: 'You must provide a valid comment'
            });
            return;
        } else {
            updatedObject.comment = commentInfo.comment; 
        }
    } else {
        updatedObject.comment = oldComment.comment;
    }

    try {
        await commentData.updateComment(req.params.id, updatedObject);
        let updatedComment = await commentData.getCommentById(req.params.id);
        res.status(200).json(updatedComment);
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