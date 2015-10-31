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
		"pages": "pages"	
	};
	
	// build paths
	var paths = {};	
	paths.theme = path.join(folders.themes, site.theme);
	paths.abstheme = path.join(__dirname, paths.theme);
	paths.pages = path.join(folders.content, folders.pages);
	paths.homepage = path.join(paths.pages, site.homepage);
	
	// set vars
	var test_mode = true;
	
	// instantiate express
	var app = express();
	var port = process.env.PORT || 8080;
	
	// set up view engine
	app.set("view engine", "ejs");	
	app.set("views", paths.abstheme);	
	app.use("/", express.static(paths.abstheme));

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
			req.slug = "";
		    res.render("index", {content: readFileSync(paths.homepage)});
		});
	
	// pages
	
		router.get("/:slug", function(req, res) {
			if (req.slug) res.render("index", {content: readFileSync(path.join(paths.pages, req.slug))});
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

	function readFileSync(filepath) {
	
		// list file formats
		
			var file_formats = [
				".html",
				".ejs",
				""
			];

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