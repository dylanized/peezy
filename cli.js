#!/usr/bin/env node

// script setup
	
	var program = require('commander'),
		peezy = require('peezy');
		
// commander setup		
		
	program
	  .version('0.0.1')
	  .option('-c, --config [config]', 'Set config file')	  
	  .option('-f, --folder [folder]', 'Set site folder')
	  .option('-t, --theme [theme]', 'Set theme')
	  .option('-l, --level [level]', 'Set logging level')
	  .option('-p, --port [port]', 'Set port')  
	  .parse(process.argv);
	  
// load peezy config

	var config_filename = "config.json";

	if (program.config) config_filename = program.config;
	
	var config = require("./" + config_filename);
	
// overrides

	if (program.folder) config.siteFolder = program.folder;
	if (program.theme) config.themeOverride = program.theme;
	if (program.level) config.level = program.level;
	if (program.port) config.port = program.port;
					
// launch peezy

	peezy.serve(config);
