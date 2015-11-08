// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");
	config.siteFolder = "site";	

// launch server

	peezy.init(config, function() {
	
		console.log("Peezy is running");
	
	});	
