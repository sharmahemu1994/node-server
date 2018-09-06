/**
 * Directly exporting the routes as key and require the module directly for the routr rpt.
 *
 */

module.exports = {
	'': require('./dashboard'),
	'hello': require('./hello')
};
