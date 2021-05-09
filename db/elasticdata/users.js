var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
  apiVersion: "7.2", // use the same version of your Elasticsearch instance
});

async function search(data) {
  let result = await client.search({
    index: "users",
    body: {
      query: {
        query_string: { query: "*" + data + "*" },
      },
    },
  });
  let matchedUsers = [];
  result.hits.hits.forEach((hit) => {
    matchedUsers.push(Object.assign({}, hit._source));
  });
  return matchedUsers;
}

async function addUser(user) {
  let newUser = Object.assign({}, user);
  newUser.id = newUser._id.toString();
  delete newUser._id;
  await client.index({
    index: "users",
    id: newUser.id,
    body: newUser,
  });
}

async function updateUser(user) {
  let newUser = Object.assign({}, user);
  newUser.id = newUser._id.toString();
  delete newUser._id;
  await client.update({
    index: "users",
    id: newUser.id,
    body: {
      doc: newUser,
    },
  });
}

async function removeUser(id) {
  await client.delete({
    index: "users",
    id: id,
  });
}

module.exports = { addUser, updateUser, removeUser, search };
