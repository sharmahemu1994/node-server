/**
 * primary file to start server
 * calls server js and other background scripts js which are supposed to run in background
 *
 */

'use strict';

// Dependencies
const app = require('./app');

// container for app
const server = {};

// Init function

server.init = () => {
	// To run server without clustering
	app.init();
};

// execute init function
server.init();

// export module
module.exports = server;
