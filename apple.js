/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

(function () {
	
	var apnagent = require("apnagent");
	var config = require("./config.json");
	var path = require("path");
	var Logger = require("./logger");
	
	function ApplePush() {
		this.apns = {}
		for (var index in config.ios) {
			this.apns[index] = setupApn(index, config.ios[index]);
		}
	}
	
	function setupApn(index, data) {
		var agent = new apnagent.Agent();
		agent.set("pfx file", path.join(__dirname, data.certificate));
		agent.enable(data.env);
		agent.connect(function (err) {
			if (err) {
				Logger.error("Cannot connect to", index, ":", err);
				throw err;
			}
			else {
				Logger.log("APNAgent is connect to", index, "(" + data.env + ")");
				agent.on("message:error", function (err) {
					Logger.error("APNAgent encountered an error", err.name, ":", err.message);
				});
			}
		});
		return agent;
	};
	
	ApplePush.prototype.isValidApp = function (app) {
		var a = this.apns[app];
		return typeof a != "undefined" && a != null 
	}
	
	ApplePush.prototype.send = function (app, data, next) {
		var message = this.apns[app].createMessage().device(data.token).alert({
			title: data.title,
			body: data.body,
			"launch-image": data.launch_image,
			"action-loc-key": data.action_loc_key
		});
		message.expires(data.expiration);
		message.badge(data.badge);
		message.sound(data.sound);
		message.send(function (err) {
			if (err) {
				Logger.error("[" + app + "]: Cannot send push notification to device [" + data.token + "]", err);
			}
			next(err);
		})
	};
	
	
	
	module.exports = new ApplePush;
	
}).call(this);