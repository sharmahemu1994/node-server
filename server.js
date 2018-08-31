/*
* server related tasks
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

// create server container
const server = {};

// instinciating http server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

server.httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}

// instinciating https server
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// servic logc for both http and https
server.unifiedServer = (req, res) => {
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

        // choose handler this request should go else go to notFound
        const chooseHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // construct data object send to the handler
        const data = {
            trimmedPath,
            queryString,
            method,
            headers,
            payload: helpers.parseJsonToObject(payload)
        }

        chooseHandler(data, (statusCode, payload, contentType) => {

            console.log('----dasda-------', data);
            // determine the type of response (fallback to json);
            contentType = typeof (contentType) === 'string' ? contentType : 'json';

            // define default status code
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
            let payloadString = '';

            // Return the response part as content specific
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                payload = typeof (payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }

            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) == 'string' ? payload : '';
            }

            // Return the response parts that are common to all content=types
            res.writeHead(statusCode);
            res.end(payloadString);

            // log the request path
            console.log('----statusCode---:', statusCode, 'payloadString::', payloadString);
        });

    });
};

// defining a request router
server.router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'index': handlers.index
}



server.init = () => {
    // start a server and ahave it listen to PORT 3000, where we can say it handles http server
    server.httpServer.listen(3000, () => {
        console.log('http server is listening on port 3000');
    })

    // start the https server
    server.httpsServer.listen(3001, () => {
        console.log('https server is listening on port 3001');
    })
}

// export modules
module.exports = server;

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