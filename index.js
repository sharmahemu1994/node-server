// /**
//  * primary file for API
//  *  
//  */

//  // Dependencies

// const server = require('./server');
// const cli = require('./lib/cli');

// // container for app

// const app = {};

// // Init function

// app.init = () => {
// 	// start server
// 	server.init();

// 	// star server CLI
// 	setTimeout(() => {
// 		cli.init();
// 	}, 100);
// };

// // execute init function

// app.init();

// // export module
// module.exports = app;


/**
 * primary file for API
 * clusterd index.js
 */

// Dependencies

const server = require('./server');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');

// container for app

const app = {};

// Init function

app.init = () => {
	if (cluster.isMaster) {
		// if we are on the master thread start other process and cli
		// star server CLI
		setTimeout(() => {
			cli.init();
		}, 100);

		// fork the process
		for (let i = 0; i < os.cpus().length; i++) {
			cluster.fork();
		}
	} else {
		// if we are not on the master thread
		// start server
		server.init();	
	}
	
};

// execute init function

app.init();

// export module
module.exports = app;
