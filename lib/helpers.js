/**
 * helpers for various tasks
 */

 // create container for the helpers

const crypto = require('crypto');
const helpers = {};


// create SHA256 hash
helpers.hash = (string) => {
    if (typeof (string) === 'string') {
        const hash = crypto.createHmac('sha256', 'hashingSecret').update(string).digest('hex');
        return (hash);
    } else {
        return false;
    }
};

// parse a JSON string to object in all cases
helpers.parseJsonToObject = (string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        return {};
    }
}

 module.exports = helpers;