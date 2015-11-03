// setup

	// libraries
	var express = require("express"),
		path = require("path"),
		fileExists = require("exists-file"),
		fs = require("fs");
	
	// site config
	var site = {
		"theme": "default",
		"homepage": "index"
	};
	
	// folder config
	var folders = {
		"themes": "themes",
		"content": "content",
		"pages": "pages",
		"public" : "public"	
	};
	
	// build paths
	var paths = {};	
	paths.themes = "/" + folders.themes;
	paths.themes_abs = path.join(__dirname, folders.themes);
	paths.theme = path.join(folders.themes, site.theme);
	paths.theme_abs = path.join(__dirname, paths.theme);
	paths.pages = path.join(folders.content, folders.pages);
	paths.homepage = path.join(paths.pages, site.homepage);
	paths.public_abs = path.join(__dirname, folders.public);
	
	// set vars
	var test_mode = true;
	
	// instantiate express
	var app = express();
	var port = process.env.PORT || 8080;
	
	// set up view engine
	app.set("view engine", "ejs");	
	app.set("views", paths.theme_abs);	
	
	// serve themes static files
	app.use(paths.themes, express.static(paths.themes_abs));

	// serve root static files
	app.use("/", express.static(paths.public_abs));	

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
			req.slug = site.homepage;
		    res.render("index", buildPageVars(req.slug));
		});
	
	// pages
	
		router.get("/:slug", function(req, res) {
			if (req.slug) res.render("index", buildPageVars(req.slug));
		});
		
		router.param("slug", function(req, res, next, slug) {

			// if request is not an asset file		
			if (slug.indexOf(".") == -1) {
		
				// assign the slug
				test_msg("Request: " + slug);		
			    req.slug = slug;
		    
		    }
		    
		    next(); 
		    
		});
	
	// apply routes and start the server
	
		app.use('/', router);		
		app.listen(port);
		
// functions

	function buildPageVars(slug) {
		
		var page_vars = {};
		
		// try to read file
		var content = readFileSync(path.join(paths.pages, slug));
		
		// if file had content, assign to page_var
		if (content) page_vars.content = content;

		// else set error and assign error msg
		else {
			page_vars.error = 404;
			page_vars.content = readFileSync(path.join(paths.pages, "404"));
		}
		
		return page_vars;
		
	}

	function readFileSync(filepath) {
	
		// list file formats
		
			var file_formats = [".html"];

		// for each file format	
		
			for (i = 0; i < file_formats.length; i++) {
			
				test_msg("Trying to read: " + filepath + file_formats[i]);
			
				// if file exists, return its contents
				if (fileExists(filepath + file_formats[i])) return fs.readFileSync(filepath + file_formats[i], "utf8");
			
			}	

		// else return an error
		return false;
				
	}
	
	function test_msg(msg1, msg2) {
		if (test_mode) {
			console.log(msg1);
			if (msg2) console.log(msg2);
		}
	}	