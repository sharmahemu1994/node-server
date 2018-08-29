/**
 * To store and edit data
 * 
*/

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const baseDir = path.join(__dirname, '/../.data/');
const libData = {};

// create data in a File
libData.create = (dir, file, data, cb) => {
	// open file for writing
	fs.open(baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			// convert data to string and save it on file
			fs.writeFile(fileDescriptor, JSON.stringify(data), (err) => {
				if (!err) {
					fs.close(fileDescriptor, (err) => {
						if (!err) {
							cb(false);
						} else {
							cb('error in closing File');
						}
					});
				} else {
					cb('error in writing data');
				}
			});
		} else {
			cb('could not create new file or it already exist.')
		}
	});
};

// Read data in a File
libData.read = (dir, file, cb) => {
	fs.readFile(baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
		if (!err && data) {
			const parseData = helpers.parseJsonToObject(data);
			cb(false, parseData);
		} else {
			cb(err, data);
		}
	});
};

// Update data in a File
libData.update = (dir, file, data, cb) => {
	// open file for writing
	fs.open(baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			fs.truncate(fileDescriptor, (fileDescriptor) => {
				if (!err) {
					fs.writeFile(fileDescriptor, JSON.stringify(data), (err) => {
						if (!err) {
							fs.close(fileDescriptor, (err) => {
								if (!err) {
									cb(false);
								} else {
									cb('error in closing File');
								}
							});
						} else {
							cb('error in writing data');
						}
					});
				} else {
					cb('error in truncate File');
				}
			});
		} else {
			cb('could not create new file or it already exist.');
		}
	});
};

// Delete a File
libData.delete = (dir, file, cb) => {
	// unlink file
	fs.unlink(baseDir + dir + '/' + file + '.json', (err) => {
		if (!err) {
			cb(false);
		} else {
			cb('error in deleting file');
		}
 	});
};

module.exports = libData;
