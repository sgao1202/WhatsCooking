function validString(str) {
    if (!str || typeof str !== 'string' || !str.trim()) return false;
    return true;
};

const utils = {
    validString
};

export default utils;