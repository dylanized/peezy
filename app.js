// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");
	
	// siteFolder override
	var args = process.argv.slice(2);
	if (args[0]) config.siteFolder = args[0];

// launch server

	peezy.serve(config, function() {
	
		peezy.log("Peezy is running");
	
	});	
