/**
 * helpers for various tasks
 */

 // create container for the helpers

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
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

// parse a JSON string to object in all cases
helpers.getTempalte = (templateName, cb) => {
    templateName = typeof (templateName) === 'string' ? templateName : false;
    if (templateName) {
        const templateDir = path.join(__dirname,'/../templates/');
        fs.readFile(templateDir + templateName + '.html', 'utf8', (err, str) => {
            if (!err && str) {
                cb(false, str);
            } else {
                cb('no template could be found');
            }
        });
    } else {
        cb('valid template name required');
    }
}

module.exports = helpers;