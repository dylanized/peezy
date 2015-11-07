// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");
	config.siteFolder = "bsdkit";	

// launch server

	peezy.init(config, function() {
	
		console.log("Peezy is running");
	
	});	