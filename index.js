/**
 * primary file for API
 *  
 */

 // Dependencies

const server = require('./server');
const cli = require('./lib/cli');

// container for app

const app = {};

// Init function

app.init = () => {
	// start server
	server.init();

	// star server CLI
	setTimeout(() => {
		cli.init();
	}, 100);
};

// execute init function

app.init();

// export module
module.exports = app;