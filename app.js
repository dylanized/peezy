// setup

	// libraries
	var express = require("express"),
		path = require("path"),
		fileExists = require("exists-file"),
		fs = require("fs");
	
	// site config
	var site = {
		"theme": "default",
		"homepage": "index",
		"error" : "error"
	};
	
	// folder config
	var folders = {
		"site" : "site",
	};
	
	var subfolders = {
		"themes": "themes",
		"content": "content",
		"public" : "public"		
	};
	
	// build folder object
	for (sub in subfolders) {
		folders[sub] = path.join(folders["site"], subfolders[sub]);
	}
	
	// build paths
	
	var paths = {};	
	
	paths.themes = "/" + folders.themes;
	paths.themes_abs = path.join(__dirname, folders.themes);
	paths.themes_rel = "/" + subfolders["themes"];
	
	paths.theme = path.join(folders.themes, site.theme);
	paths.theme_abs = path.join(__dirname, paths.theme);
	
	paths.content = path.join(folders.content);
	paths.homepage = path.join(paths.content, site.homepage);	
	paths.error = path.join(paths.content, site.error);
	
	paths.public_abs = path.join(__dirname, folders.public);
	
	// set vars
	var test_mode = true;
	
	// instantiate express
	var app = express();
	var port = process.env.PORT || 8080;
	
	// set up view engine
	app.set("view engine", "ejs");	
	
	// set view folder
	app.set("views", paths.theme_abs);	
	
	// serve themes static files
	app.use(paths.themes_rel, express.static(paths.themes_abs));	

	// serve root static files
	app.use("/", express.static(paths.public_abs));	

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
			req.slug = site.homepage;
			console.log("Route 1");
			console.log(req.slug);
		    renderTheme("index", req, res);
		});
	
	// pages
	
		router.get("/:slug", function(req, res) {
			if (req.slug) renderTheme("index", req, res);
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

	function renderTheme(template, req, res) {
	
		// build page vars
		var pageVars = buildPageVars(req);
		
		// if theme override
		if (req.query.theme) {		
			// set override view folder
			var theme_override_path_abs = path.join(paths.themes_abs, req.query.theme);			
			app.set("views", theme_override_path_abs);	
		}
		
		// render view
		res.render(template, pageVars);
	
	}

	function buildPageVars(req) {
	
		var page_vars = {};
		
		// try to read file
		var content = readFileSync(path.join(paths.content, req.slug));
		
		// if file had content, assign to page_var
		if (content) page_vars.content = content;
		else page_vars.content = readFileSync(path.join(paths.content, "404"));
		
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