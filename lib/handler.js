/**
 * request handlers
 * 
 */

// define handler
const _data = require('./data');
const helpers = require('./helpers');
const handlers = {};


// ping handler
handlers.ping = (data, cb) => {
    console.log('----------------', data);
    // callback http status code and payload object
    cb(200);
};

// users  handler
handlers.users = (data, cb) => {
    const acceptAbleMethods = ['post', 'get', 'put', 'delete'];
    if (acceptAbleMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, cb);
    } else {
        cb(405)
    }
};

// token handler handler
handlers.users = (data, cb) => {
    const acceptAbleMethods = ['post', 'get', 'put', 'delete'];
    if (acceptAbleMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, cb);
    } else {
        cb(405)
    }
};

// container for the tokens submethods
handlers._tokens = {};

// container for the user submethods
handlers._users = {};

// user-post
// required data : firstname, lastname, phone, password, tosAgreement
// optional data : none
handlers._users.post = (data, cb) => {
    // check the all required filled exist
    const firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
    const lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
    const phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement === true ? true : false;

    if (firstname && lastname && phone && password && tosAgreement) {
        // check user exist or not
        _data.read('users', phone, (err, data) => {
            if (err) {
                // hash the password
                const hashPassword = helpers.hash(password);
                if (hashPassword) {
                    const userData = {
                        firstname,
                        lastname,
                        phone,
                        tosAgreement,
                        password: hashPassword
                    };
                    // store user
                    _data.create('users', phone, userData, (err) => {
                        if (!err) {
                            cb(200);
                        } else {
                            cb(500, { 'error': 'could not able to create user' });
                        }
                    });
                } else {
                    cb(500, { 'error': 'could not hash user password' });
                }
            } else {
                cb(400, { 'error': 'user already exist' });
            }
        });
    } else {
        cb(404, { 'error': 'missing required filed'} )
    }
};

// user-get
// required data : phone
// optional data : none
// only authenticated user to access
handlers._users.get = (data, cb) => {
    // check phone no. exist
    const phone = typeof (data.queryString.phone) === 'string' && data.queryString.phone.trim().length === 10 ? data.queryString.phone : false;
    if(phone) {
        _data.read('users', phone, (err, data) => {
            console.log(data);
            if (!err && data) {
                // remove password from user object
                delete data.password;
                cb(200, data);
            } else {
                cb(404);
            }
        });
    } else {
        cb(400, {error: 'missing required field'});
    }
    
};

// user-put
// required data : phone
// optional data : firstname, lastname, password, tosAgreement one should exist
// only authenticated user to access
handlers._users.put = (data, cb) => {
    // check for required field
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;

    // check of optional fileds
    const firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
    const lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false;
    const password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone) {
        if (firstname || lastname || password) {
            _data.read('users', phone, (err, data) => {
                if (!err && userData) {
                    // update the files necessary
                    if (firstname) {
                        userData.firstname = firstname
                    }
                    if (lastname) {
                        userData.lastname = lastname
                    }
                    if (password) {
                        userData.password = helpers.hash(password);
                    }
                    // store the new update
                    _data.update('users', phone, userData, (err) => {
                        console.log(data);
                        if (!err) {
                            cb(200);
                        } else {
                            cb(500, {error: "error in updating user data"});
                        }
                    });
                } else {
                    cb(400, { error: 'specifieed user does not exist' });
                }
            });
        } else {
            cb(400, { error: 'missiing fields to update' });
        }
    } else {
        cb(400, {error: 'missiing required field'});
    }
};

// user-put
// required data : phone
// optional data : none
// only authenticated user to access
// user-delete
handlers._users.delete = (data, cb) => {
    // check for required field
    const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;
    if (phone) {
        _data.delete('users', phone, (err) => {
            if (!err) {
                cb(200);
            } else {
                cb(400, { error: 'could not delete specified user' });
            }
        });
    } else {
        cb(400, { error: 'missing required field' });
    }
};

// no handler found
handlers.notFound = (data, cb) => {
    cb(404)
};

module.exports = handlers;