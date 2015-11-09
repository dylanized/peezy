// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");
	
	config.siteFolder = "site";

// launch server

	peezy.serve(config, function() {
	
		peezy.log("Peezy is running");
	
	});	
