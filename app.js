// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");	
	config.dirname = __dirname;
	
// launch server

	peezy.init(config, function() {
	
		console.log("Success!");
	
	});	