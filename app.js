// setup

	// libraries
	var peezy = require("peezy");
	
	// site config
	var site = {
		"name": "Peezy Demo Site",
		"desc": "a micro-CMS for Node.js",
		"theme": "default",
		"homepage": "index",
		"error" : "error",
	};
	
	// app config
	var app = {
		"folder" : "site",
		"subfolders" : {
			"themes": "themes",
			"content": "content",
			"public" : "public"		
		}
	};
	
	peezy.init(site, app);