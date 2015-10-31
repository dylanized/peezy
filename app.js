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
	
	// instantiate express
	var app = express();
	var port = process.env.PORT || 8080;
	
	// set up view engine
	app.set("view engine", "ejs");	
	app.set("views", paths.abstheme);	
	app.use("/", express.static(paths.theme));

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
		    res.render("index", {content: readFileSync(paths.homepage)});
		});
	
	// other pages
	
		router.get("/:page", function(req, res) {
		    res.render("index", {content: readFileSync(path.join(paths.pages, req.page))});
		});
		
		router.param("page", function(req, res, next, page) {
		    req.page = page;
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
				".md",
				".ejs",
				""
			];

		// for each file format	
		
			for (i = 0; i < file_formats.length; i++) {
			
				// if file exists, return its contents
				if (fileExists(filepath + file_formats[i])) return fs.readFileSync(filepath + file_formats[i], "utf8");
			
			}	

		// else return an error
		return false;
				
	}	