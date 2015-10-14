/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

(function () {
	
	function Logger() {
		
	}
	
	function process(fn, args) {
		Array.prototype.unshift.call(args, new Date())
		console[fn].apply(console, args);
	}
	
	Logger.prototype.log = function () {
		process.call(this, "log", arguments)
	}
	
	Logger.prototype.error = function () {
		process.call(this, "error", arguments);
	}
	
	module.exports = new Logger;
	
}).call(this);