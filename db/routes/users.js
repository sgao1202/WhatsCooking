const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const recipeData = data.recipes;
const utils = require('../utils/utils');

router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    try {
        let user = await userData.getUserById(req.params.id);

        user._id = String(user._id);

        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({
            error: 'user not found'
        });
    }
    return;
});

// Custom route to get user by Firebase's uid
router.get('/uid/:uid', async (req, res) => {
    let uid = req.params.uid.trim();
    if (!utils.validString(uid)) return res.status(400).json({error: 'Uid is not valid'});
    try {
        let user = await userData.getUserByUid(uid);
        res.json(user);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

// Get all the data needed to display on my-profile page 

/*
    {
        uid: <current user's uid from firebase>
    }
*/
// Includes getting all bookmarked recipes and recipes created by the current user
router.get('/my-profile/:uid', async (req, res) => {
    let uid = req.params.uid.trim();
    if (!utils.validString(uid)) return res.status(400).json({ error: "uid is required in request body for '/users/my-profile' route" });

    try {
        // Get the user
        let user = await userData.getUserByUid(uid);
        let bookmarkedRecipes = [];
        for (let recipeId of user.bookmarks) {
            if (!utils.validString(recipeId)) return res.status(400).json({error: 'bookmarkList contains invalid ids'});
            let recipe = await recipeData.getRecipeById(recipeId);
            let author = await userData.getUserById(recipe.userId);
            bookmarkedRecipes.push({
                _id: recipeId,
                title: recipe.title,
                picture: recipe.picture,
                userId: author.uid,
                createdBy: `${author.firstName} ${author.lastName}`
            });
        }
        let myRecipes = await recipeData.getRecipesByUser(user._id.toString());

        let followingUsers = [];
        for (let userId of user.following) {
            if (!utils.validString(userId)) return res.status(400).json({ error: 'following list contains invalid ids' });
            let currentUser = await userData.getUserById(userId);
            followingUsers.push({
                _id: userId,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                profilePicture: currentUser.profilePicture,
                aboutMe: currentUser.aboutMe,
                uid: currentUser.uid
            });
        }
        for(myRecipe of myRecipes) {
            let tempUser = await userData.getUserById(myRecipe.userId);
            myRecipe.name = tempUser.firstName +" " +tempUser.lastName;
        }
        res.json({
            user: user,
            bookmarkedRecipes: bookmarkedRecipes,
            myRecipes: myRecipes,
            following: followingUsers
        });
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.post('/', async (req, res) => {
    let userInfo = req.body;
    
    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to create a user'
        });
        return;
    }

    if (!utils.validString(userInfo.uid)) return res.status(400).json({ error: 'Uid must be provided'});

    if (!userInfo.firstName || typeof userInfo.firstName != "string") {
        res.status(400).json({
            error: 'You must provide a valid first name'
        });
        return;
    }
    if (!userInfo.lastName || typeof userInfo.lastName != "string") {
        res.status(400).json({
            error: 'You must provide a valid last name'
        });
        return;
    }

    if (!userInfo.profilePicture || typeof userInfo.profilePicture != "string") {
        res.status(400).json({
            error: 'You must provide a valid profile picture'
        });
        return;
    }

    if (!userInfo.aboutMe || typeof userInfo.aboutMe != "string") {
        res.status(400).json({
            error: 'You must provide a valid about me'
        });
        return;
    }

    try {
        const newUser = await userData.addUser(
            userInfo.uid,
            userInfo.firstName,
            userInfo.lastName,
            userInfo.profilePicture,
            userInfo.aboutMe
        );
        res.status(200).json(newUser);
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

    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to create a user'
        });
        return;
    }

    if (!userInfo.firstName || typeof userInfo.firstName != "string") {
        res.status(400).json({
            error: 'You must provide a valid first name'
        });
        return;
    }
    if (!userInfo.lastName || typeof userInfo.lastName != "string") {
        res.status(400).json({
            error: 'You must provide a valid last name'
        });
        return;
    }

    if (!userInfo.profilePicture || typeof userInfo.profilePicture != "string") {
        res.status(400).json({
            error: 'You must provide a valid profile picture'
        });
        return;
    }

    if (!userInfo.aboutMe || typeof userInfo.aboutMe != "string") {
        res.status(400).json({
            error: 'You must provide a valid about me'
        });
        return;
    }

    try {
        await userData.getUserById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'user not found'
        });
        return;
    }
    try {
        await userData.updateUser(req.params.id, userInfo);
        let updatedUser = await userData.getUserById(req.params.id);
        res.status(200).json(updatedUser);
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

    const userInfo = req.body;
    let updatedObject = {};
    let oldUser = null;

    if (!userInfo) {
        res.status(400).json({
            error: 'You must provide data to patch a user'
        });
        return;
    }

    try {
        oldUser = await userData.getUserByIdWithPword(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'user not found'
        });
        return;
    }

    if (userInfo.firstName && userInfo.firstName !== oldUser.firstName) {
        if (typeof userInfo.firstName != "string") {
            res.status(400).json({
                error: 'You must provide a valid first name'
            });
            return;
        } else {
            updatedObject.firstName = userInfo.firstName;
        }
    } else {
        updatedObject.firstName = oldUser.firstName;
    }

	if (userInfo.lastName && userInfo.lastName !== oldUser.lastName) {
        if (typeof userInfo.lastName != "string") {
            res.status(400).json({
                error: 'You must provide a valid last name'
            });
            return;
        } else {
            updatedObject.lastName = userInfo.lastName;
        }
    } else {
        updatedObject.lastName = oldUser.lastName;
    }

	if (userInfo.profilePicture && userInfo.profilePicture !== oldUser.profilePicture) {
        if (typeof userInfo.profilePicture != "string") {
            res.status(400).json({
                error: 'You must provide a valid profile picture'
            });
            return;
        } else {
            updatedObject.profilePicture = userInfo.profilePicture;
        }
    } else {
        updatedObject.profilePicture = oldUser.profilePicture;
    }

	if (userInfo.aboutMe && userInfo.aboutMe !== oldUser.aboutMe) {
        if (typeof userInfo.aboutMe != "string") {
            res.status(400).json({
                error: 'You must provide a valid about me'
            });
            return;
        } else {
            updatedObject.aboutMe = userInfo.aboutMe;
        }
    } else {
        updatedObject.aboutMe = oldUser.aboutMe;
    }

	if (userInfo.username && userInfo.username !== oldUser.username) {
        if (typeof userInfo.username != "string") {
            res.status(400).json({
                error: 'You must provide a valid username'
            });
            return;
        } else {
			try {
				let user = await userData.getUserByUsername(userInfo.username);
				if (user) {
					res.status(400).json({
						error: 'username is taken'
					});
					return;
				}
			} catch (error) {
				updatedObject.username = userInfo.username;
			}
        }
    } else {
        updatedObject.username = oldUser.username;
    }

    try {
        await userData.updateUser(req.params.id, updatedObject);
        let updatedUser = await userData.getUserById(req.params.id);
        res.status(200).json(updatedUser);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});

router.post('/:id/bookmarks', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    const bookmarkInfo = req.body;

    if (!bookmarkInfo) {
        res.status(400).json({
            error: 'You must provide valid info'
        });
        return;
    }
    if (!bookmarkInfo._id || typeof bookmarkInfo._id != "string") {
        res.status(400).json({
            error: 'You must provide recipeId'
        });
        return;
    }
    let user = null;
    try {
        user = await userData.getUserByUid(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'user not found'
        });
        return;
    }

	let recipe = null;
	try {
        recipe = await recipeData.getRecipeById(bookmarkInfo._id);
    } catch (e) {
        res.status(404).json({
            error: 'recipe not found'
        });
        return;
    }
    try {
        const newUser = await userData.addBookmarkToUser(req.params.id, bookmarkInfo._id);
        res.status(200).json(newUser);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});

router.delete('/:id/bookmarks/:recipeId', async (req, res) => {
    if (!req.params.id || !req.params.recipeId) {
        res.status(400).json({
            error: 'You must supply id and recipeId'
        });
        return;
    }

    let user = null;
    try {
        user = await userData.getUserByUid(req.params.id);
    } catch (e) {
        console.log(e)
        res.status(404).json({
            error: String(e)
        });
        return;
    }

    let recipe = null;
    try {
        recipe = await recipeData.getRecipeById(req.params.recipeId);
    } catch (e) {
        console.log(e)
        res.status(404).json({
            error: String(e)
        });
        return;
    }

    try {
        const newUser = await userData.removeBookmarkFromUser(String(user._id), String(recipe._id));
        res.status(200).json(newUser);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});

router.post('/:id/following', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({
            error: 'You must supply id'
        });
        return;
    }

    const followInfo = req.body;

    if (!followInfo) {
        res.status(400).json({
            error: 'You must provide valid follow info'
        });
        return;
    }
    if (!followInfo.followUserId || typeof followInfo.followUserId != "string") {
        res.status(400).json({
            error: 'You must provide follow user id'
        });
        return;
    }

    let user = null;
    try {
        user = await userData.getUserById(req.params.id);
    } catch (e) {
        res.status(404).json({
            error: 'user not found'
        });
        return;
    }

	let followUser = null;
	try {
        followUser = await userData.getUserById(followInfo.followUserId);
    } catch (e) {
        res.status(404).json({
            error: 'follow user not found'
        });
        return;
    }

    try {
        const newUser = await userData.addFollowToUser(req.params.id, followInfo.followUserId);
        res.status(200).json(newUser);
        return;
    } catch (e) {
        res.status(400).json({
            error: String(e)
        });
        return;
    }

    return;
});

router.delete('/:id/following/:followUserId', async (req, res) => {
    if (!req.params.id || !req.params.followUserId) {
        res.status(400).json({
            error: 'You must supply id and followUserId'
        });
        return;
    }

    let user = null;
    try {
        user = await userData.getUserById(req.params.id);
    } catch (e) {
        console.log(e)
        res.status(404).json({
            error: String(e)
        });
        return;
    }

    let followUser = null;
    try {
        followUser = await userData.getUserById(req.params.followUserId);
    } catch (e) {
        console.log(e)
        res.status(404).json({
            error: String(e)
        });
        return;
    }

    try {
        const newUser = await userData.removeFollowFromUser(String(user._id), String(followUser._id));
        res.status(200).json(newUser);
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