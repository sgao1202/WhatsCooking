const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const recipeData = data.recipes;

router.get('/', async (req, res) => {
    try {
        let userList = await userData.getAllusers();
        res.status(200).json(userList);
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

router.post('/', async (req, res) => {
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
    if (!userInfo.password || typeof userInfo.password != "string") {
        res.status(400).json({
            error: 'You must provide a valid password'
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

    // CHECK IF USERNAME IS UNIQUE
    if (!userInfo.username || typeof userInfo.username != "string") {
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
			// do nothing
		}
    }

    try {
        const newUser = await userData.addUser(
            userInfo.firstName,
            userInfo.lastName,
            userInfo.username,
            userInfo.password,
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
    if (!userInfo.password || typeof userInfo.password != "string") {
        res.status(400).json({
            error: 'You must provide a valid password'
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

    // CHECK IF USERNAME IS UNIQUE
    if (!userInfo.username || typeof userInfo.username != "string") {
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
			// do nothing
		}
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

	if (userInfo.password && userInfo.password !== oldUser.password) {
        if (typeof userInfo.password != "string") {
            res.status(400).json({
                error: 'You must provide a valid password'
            });
            return;
        } else {
            updatedObject.password = userInfo.password;
        }
    } else {
        updatedObject.password = oldUser.password;
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
    if (!bookmarkInfo.recipeId || typeof bookmarkInfo.recipeId != "string") {
        res.status(400).json({
            error: 'You must provide recipeId'
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

	let recipe = null;
	try {
        recipe = await recipeData.getRecipeById(bookmarkInfo.recipeId);
    } catch (e) {
        res.status(404).json({
            error: 'recipe not found'
        });
        return;
    }

    try {
        const newUser = await userData.addBookmarkToUser(req.params.id, bookmarkInfo.recipeId);
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
        user = await userData.getUserById(req.params.id);
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