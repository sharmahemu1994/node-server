/*
* primary API file
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const handlers = require('./lib/handler');
const helpers = require('./lib/helpers');

// instinciating http server
const httpServer = http.createServer((req, res) => {
	unifiedServer(req, res);	
});

// start a server and ahave it listen to PORT 3000, where we can say it handles http server
httpServer.listen(3000, () => {
	console.log('http server is listening on port 3000');
})

const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
}

// instinciating https server
const httpsServer = https.createServer(httpsServerOptions ,(req, res) => {
	unifiedServer(req, res);	
});

// start the https server
httpsServer.listen(3001, () => {
	console.log('https server is listening on port 3001');
})

// servic logc for both http and https
const unifiedServer = (req, res) => {
	// get url and parse it
	const parseURL = url.parse(req.url, true);

	// get the path form the url
	const path = parseURL.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// get the query string as an object
	const {query: queryString} = parseURL;

	// get the http method
	const method = req.method.toLowerCase();
   
	// get headers as an object
	const {headers} = req;

	// get payload if any
	const decoder = new stringDecoder('utf8');
	let payload = '';

	req.on('data', (data) => {
		payload += decoder.write(data);
	});

	req.on('end', () => {
		payload += decoder.end();

		// choose handler this request should go else go to notFound
		const chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// construct data object send to the handler
		const data = {
			trimmedPath,
			queryString,
			method,
			headers,
			payload: helpers.parseJsonToObject(payload)
		}

		chooseHandler(data, (statusCode, payload) => {
			// define default status code
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

			// define default payload
			payload = typeof(payload) === 'object' ? payload : {};

			const payloadString = JSON.stringify(payload);

			// send the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// log the request path
			console.log('----statusCode---:', statusCode, 'payloadString::', payloadString);
		});

	});
};

// defining a request router
const router = {
	'ping': handlers.ping,
	'users': handlers.users
}

/*
	Destructuring concept
*/
// const ram  = {
// 	b: "abc",
// 	c: "xyz",
// 	a: {
// 		q: "pqr",
// 		r: "zwx",
// 		abc: {
// 			pqr: "pqr"
// 		}
// 	}
// }

// const {b: callsign, a: {abc:{pqr}}} = ram;
// // const b  = ram.b;
// // const c  = ram.c;
// console.log(pqr);