// Takes in a string argument.
// Return true if the argument is non-empty, a string, and non-empty when trimmed; otherwise return false.
function validString(str) {
    if (!str || typeof str !== 'string' || !str.trim()) return false;
    return true;
}

// Takes in a MongoDB document (JavaScript object).
// Returns the same document with its _id field as a string.
function convertId(obj) {
    obj._id = obj._id.toString();
    return obj;
}

module.exports = {
    validString,
    convertId
};