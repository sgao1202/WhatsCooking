var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
  apiVersion: "7.2", // use the same version of your Elasticsearch instance
});

async function search(data) {
  let result = await client.search({
    index: "recipes",
    body: {
      query: {
        query_string: { query: data },
      },
    },
  });
  let matchedRecipes = [];
  result.hits.hits.forEach((hit) => {
    matchedRecipes.push(Object.assign({}, hit._source));
  });
  return matchedRecipes;
}

async function addRecipe(recipe) {
  let newRecipe = Object.assign({}, recipe);
  newRecipe.id = newRecipe._id.toString();
  delete newRecipe._id;
  console.log("indexing recipe");
  console.log(newRecipe);
  await client.index({
    index: "recipes",
    id: newRecipe.id,
    body: newRecipe,
  });
}

async function updateRecipe(recipe) {
  let newRecipe = Object.assign({}, recipe);
  newRecipe.id = newRecipe._id.toString();
  delete newRecipe._id;
  await client.update({
    index: "recipes",
    id: newRecipe.id,
    body: {
      doc: newRecipe,
    },
  });
}

async function removeRecipe(id) {
  await client.delete({
    index: "recipes",
    id: id,
  });
}

module.exports = { addRecipe, updateRecipe, removeRecipe, search };
