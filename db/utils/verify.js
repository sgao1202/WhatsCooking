// Functions for validating input

function validString(str) {
    if (!str || typeof str !== 'string' || !str.trim()) return false;
    return true;
}

module.exports = {
    validString
};