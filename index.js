#!/usr/bin/env node

// setup
	
	// libraries
	
		var path = require("path"),
			express = require("express"),
			compress = require("compression"),
			errorhandler = require("errorhandler"),
			_ = require("lodash"),
			program = require("commander");
		
	// submodules
	
		var	fileHelper = require("peezy-file-helper"),
			log = require("peezy-logger"),
			renderMinified = require("render-minified");
		
		var	buildPaths = require("./modules/build-paths.js"),
			contentLoader = require("./modules/content-loader.js"),
			themeEngine = require("./modules/theme-engine.js");
		
	// map submodules
		
		var peezy = {};				
	
		peezy.log = log;	
		peezy.file = fileHelper;
		peezy.theme = themeEngine;		
		
// peezy init

	peezy.init = function(app_config) {
	
		// init logger
		if (app_config.level) log.set(app_config.level);
		else if (process.env.NODE_ENV && process.env.NODE_ENV != "production") log.set("detail");
		
		// vars
		var config = {};
		var pages = {};		
			
		// app config

			config.app = app_config;
		
			if (!config.app.appBase) config.app.appBase = path.join(__dirname, "../../");
			if (!config.app.siteFolder) config.app.siteFolder = "site";
			if (!config.app.siteBase) config.app.siteBase = path.join(config.app.appBase, config.app.siteFolder);
			
			log.info("Initializing app", config.app, true);
			
		// site config
		
			config.site = require(path.join(config.app.siteBase, "site.json"));	
					
			log.info("Loading site", config.site, true);

			config.paths = buildPaths(config.app, config.site);		
				
			log.info("Paths built", config.paths, true);
					
			peezy.config = config;				
			
		// load content
		
			peezy.content = {};
		
			peezy.content.pages = contentLoader.getPages(config.paths.contentBase);			
			peezy.pages = peezy.content.pages;
			
			log.inspect(peezy.pages, "Pages loaded");
			
	}	

// server functions

	peezy.serve = function(app_config, cb) {
	
		// setup
		
			peezy.init(app_config);
		
			// instantiate express
			var app = express();
			var port = process.env.PORT || peezy.config.app.port;
			
			// set view engine
			app.set("view engine", "ejs");
			
			// if dev mode		
			if (app.get('env') == "development") {
				// error handler
				app.use(errorhandler());
			}
			
			// else if production mode
			else if (app.get('env') == "production") {
				// minify html
				app.use(renderMinified);
			}
		
			// serve theme static files
			app.use(peezy.config.paths.themes, express.static(peezy.config.paths.themesBase));	
		
			// serve root static files
			app.use("/", express.static(peezy.config.paths.publicBase));	
			
			// gzip compression
			app.use(compress());
				
			peezy.theme.init(peezy.config, app);				
			peezy.themes = peezy.theme.locals.themes;
			
			log.inspect(peezy.themes, "Themes loaded");
				
		// routing
		
			var router = express.Router();
			
			// index			
			router.get("/", function(req, res) {
				// render homepage
				log.info("Request: homepage");
			    peezy.handler(peezy.config.site.homepage, req, res);
			});
			
			// pages
			router.get(/^\/((?:[^\/]+\/?)+)\/?/, function(req, res) {				
			
				var slug = req.params[0];
					
				// remove optional trailing slash
				if(slug.substr(-1) === '/') slug = slug.substr(0, slug.length - 1);
				
				// handle requested page
				log.info("Request: " + slug);
				peezy.handler(slug, req, res);
				
			});
				
			// apply routes
			app.use('/', router);
				
			// default route				
			app.use(function(req, res){
				// render error page
				log.info("Request: error");				
				peezy.handler(peezy.config.site.error, req, res);
			});				
		
		// finish up
		
			// start server
			app.listen(port);
			
			log.status(peezy.config.site.name + " is running!", null, true);
				
			// optional callback	
			if (cb) cb();		
	
	}
	
	peezy.handler = function(slug, req, res) {
	
		if (peezy.pages) {
		
			// load page or error
			if (peezy.pages[slug]) peezy.theme.setPage(peezy.pages[slug]);
			else peezy.theme.setError(peezy.pages[peezy.config.site.error]);
			
			// set theme and template
			peezy.theme.setTheme(req.query);
			peezy.theme.setTemplate(peezy.pages[slug], req.query);
			
			// launch view engine
			peezy.theme.render(res, peezy.content);
		
		}
		
	}
	
// if command line

	if (require.main === module) {
	
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
		
	}	
	
// exports	
	
	module.exports = peezy;