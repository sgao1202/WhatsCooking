const bcrypt = require('bcryptjs');
const saltRounds = 16;

let exportedMethods = {

    async hashPassword(password) {
        return await bcrypt.hash(password, saltRounds);
    },

    async comparePasswordToHash(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

};

module.exports = exportedMethods;