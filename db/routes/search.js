const express = require("express");
const router = express.Router();
const elasticData = require("../elasticdata");
const elasticUsers = elasticData.users;
const elasticRecipes = elasticData.recipes;

router.get("/:searchTerm", async (req, res) => {
  let matchedRecipes = await elasticRecipes.search(req.params.searchTerm);
  let matchedUsers = await elasticUsers.search(req.params.searchTerm);
  res.json({
      recipes: matchedRecipes,
      users: matchedUsers
  });
  return;
});

module.exports = router;
