/**
 * primary file for API
 *  
 */

 // Dependencies

const server = require('./server');

// container for app

const app = {};

// Init function

app.init = () => {
	// start server
	server.init();
};

// execute init function

app.init();

// export module
module.exports = app;