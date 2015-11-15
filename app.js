// app setup

	var peezy = require("peezy");
	
	var config = require("./config.json");

// launch server

	peezy.serve(config, function() {
	
		peezy.log("Peezy is running");
	
	});	
