/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */

(function () {
	
	var express = require("express");
	var config = require("./config.json");
	var bodyParser = require("body-parser");
	
	var ApplePush = require("./apple");
	
	var app = express();
	
	app.use(bodyParser.json());
	
	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", config.allowed_origins);
		res.setHeader("Access-Control-Allow-Methods", config.allowed_methods);
		res.setHeader("Access-Control-Allow-Headers", config.allowed_headers);
		next();
	});
	
	function checkString(d) {
		if (d === "" || typeof d != typeof "") {
			return false
		}
		return true;
	}
	
	function checkInteger(d) {
		if (typeof d != typeof 0) {
			return false;
		}
		return true;
	}
	
	/**
	 * @api {post} /api/push/ios Push notification for iOS
	 * @apiName iOS
	 * @apiGroup Push
	 * 
	 * @apiParam {String} token Push notification token to push to
	 * @apiParam {String} title Title of the push notification
	 * @apiParam {String} body Body of the push notification
	 * @apiParam {String} launch_image Launch image (not sure what it's used for)
	 * @apiParam {String} action_loc_key Action loc key (not sure what it's used for)
	 * @apiParam {String} expiration Expiration of the push notification
	 * @apiParam {String} sound Sound of the push notification
	 * @apiParam {Integer} badge Badge of the push notification
	 */
	app.post("/api/push/ios", function (req, res) {
		var e = null;
		for (var idx in ["app", "token", "title", "body", "launch_image", "action_loc_key", "expiration", "sound"]) {
			if (req.body.hasOwnProperty(idx) && checkString(req.body[idx]) == false) {
				e = idx;
				break;
			}
		}
		if (e == null) {
			if (checkInteger(req.body.badge) == false) {
				e = "badge";
			}
			else if (ApplePush.isValidApp(req.body.app) == false) {
				e = "app";
			}
		}
		if (e != null) {
			res.status(400).send({
				error: "BadRequest",
				data: e
			})
		}
		else {
			ApplePush.send(req.body.app, {
				token: req.body.token,
				title: req.body.title,
				body: req.body.body,
				launch_image: req.body.launch_image,
				action_loc_key: req.body.action_loc_key,
				expiration: req.body.expiration,
				sound: req.body.sound,
				badge: req.body.badge
			}, function (err) {
				if (err != null) {
					res.status(500).send({
						success: false
					});
				}
				else {
					res.status(200).send({
						success: true
					});
				}
			})
		}
	});
	
	app.listen(config.port);
	
}).call(this);