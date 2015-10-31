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
	
	// app config
	var folders = {
		"themes": "themes",
		"content": "content",
		"pages": "pages"	
	};
	
	var paths = {};	
	paths.theme = path.join(folders.themes, site.theme);
	paths.pages = path.join(folders.content, folders.pages);
	paths.homepage = path.join(paths.pages, site.homepage);
	
	// instantiate express
	var app = express();
	var port = process.env.PORT || 8080;
	
	// set up view engine
	app.set("view engine", "ejs");	
	app.set("views", path.join(__dirname, folders.themes, site.theme));	
	app.use(express.static(path.join(folders.themes, site.theme)));

// config

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
		    res.render("index", {content: fileOpen(paths.homepage)});
		});
	
	// other pages
	
		router.get("/:page", function(req, res) {
		    res.render("index", {content: fileOpen(path.join(paths.pages, req.page))});
		});
		
		router.param("page", function(req, res, next, page) {
		    req.page = page;
		    next(); 
		});
	
	// apply routes and start the server
	
		app.use('/', router);		
		app.listen(port);
		
// functions

	function fileOpen(filepath) {
	
		var file_formats = [
			".html",
			".md",
			".ejs"
		];
	
		if (fileExists(filepath)) return fs.readFileSync(filepath, "utf8");
	
		else {
			file_formats.forEach(function(file_format) {
				if (fileExists(filepath + file_format)) return fs.readFileSync(filepath + file_format, "utf8");
			});	
		}		

		return false;
				
	}