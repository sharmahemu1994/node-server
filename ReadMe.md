# node-boilerplate-expressless
## To create local ssl cetificate for https server
	openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
## Hello World API
### The NodeJS Master Class - Homework Assignment #1
	Simple "Hello World" API - When posted to /hello, user will recieve JSON response "hello" on http port 3000 and https port 3001. If not posted to /hello then response will load a 404 template page
