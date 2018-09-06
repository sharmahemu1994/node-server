const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const helpers = require('../utils/helpers');
const util = require('util');
const debug = util.debuglog('server');
const router = require('../routes/index');

// Server Container
const server = {};

// server logic handler for both HTTP and HTTPS
server.handleRequest = (req, res) => {
	// get url and parse it
	const parseURL = url.parse(req.url, true);

	// get the path form the url
	const path = parseURL.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// get the query string as an object
	const { query: queryString } = parseURL;

	// get the http method
	const method = req.method.toLowerCase();

	// get headers as an object
	const { headers } = req;

	// get payload if any
	const decoder = new stringDecoder('utf8');
	let payload = '';

	req.on('data', (data) => {
		payload += decoder.write(data);
	});

	req.on('end', () => {
		payload += decoder.end();
		console.log('-------router.routes[trimmedPath]------', router[trimmedPath]);
		// choose handler this request should go else go to notFound
		const chooseHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : (data, callback) => {
			helpers.getTempalte('error', (err, str) => {
				if (!err) {
					callback(404, str, 'html');
				} else {
					callback(500, undefined, 'html');
				}
			});
		};

		// construct data object send to the handler
		const data = {
			trimmedPath,
			queryString,
			method,
			headers,
			payload: helpers.parseJsonToObject(payload)
		};

		try {
			chooseHandler(data, (statusCode, payload, contentType) => {
				server.processHandlerResponse(res, method, trimmedPath, statusCode, payload, contentType);
			});
		} catch (error) {
			debug(error);
			server.processHandlerResponse(res, method, trimmedPath, 500, { error: 'unknown error has occured' }, 'json');
		}
	});
};

server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType) => {
	// determine the type of response (fallback to json);
	contentType = typeof (contentType) === 'string' ? contentType : 'json';

	// define default status code
	statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

	// Return the response part as content specific
	let payloadString = '';

	if (contentType === 'json') {
		res.setHeader('Content-Type', 'application/json');
		payload = typeof (payload) === 'object' ? payload : {};
		payloadString = JSON.stringify(payload);
	}

	if (contentType === 'html') {
		res.setHeader('Content-Type', 'text/html');
		payloadString = typeof (payload) === 'string' ? payload : payload;
	}

	if (contentType === 'favicon') {
		res.setHeader('Content-Type', 'image/x-icon');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'css') {
		res.setHeader('Content-Type', 'text/css');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'image') {
		res.setHeader('Content-Type', 'image/png');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'jpg') {
		res.setHeader('Content-Type', 'image/jpeg');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}

	if (contentType === 'plain') {
		res.setHeader('Content-Type', 'text/plain');
		payloadString = typeof (payload) === 'undefined' ? payload : '';
	}
	// Return the response parts that are common to all content=types
	res.writeHead(statusCode);
	res.end(payloadString);
};

// exports module
module.exports = server;
