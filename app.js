// setup

	// libraries
	var express = require("express"),
		path = require("path"),
		fileHelper = require("peezy-file-helper");
	
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
	
	// serve themes static files
	app.use(paths.themes_rel, express.static(paths.themes_abs));	

	// serve root static files
	app.use("/", express.static(paths.public_abs));	

// routing

	var router = express.Router();
	
	// index
	
		router.get("/", function(req, res) {
			req.slug = site.homepage;
		    renderTemplate("index", req, res);
		});
	
	// pages
	
		router.get("/:slug", function(req, res) {
			// if req passed the param filter, render the theme
			if (req.slug) renderTemplate("index", req, res);
		});
		
		router.param("slug", function(req, res, next, slug) {

			// if request is not an asset file		
			if (slug.indexOf(".") == -1) {
		
				// assign the slug	
			    req.slug = slug;
		    
		    }
		    
		    next(); 
		    
		});
	
	// apply routes and start the server
	
		app.use('/', router);		
		app.listen(port);
		
// functions

	function loadTheme(theme, app) {
	
		// set vars
		site.theme = theme;
		paths.theme = path.join(folders.themes, theme);
		paths.theme_abs = path.join(__dirname, paths.theme);
		
		// load folder
		app.set("views", paths.theme_abs);							
		
	}

	function renderTemplate(template, req, res) {
	
		// build page vars
		var pageVars = buildPageVars(req);
		
		// if theme override
		if (req.query.theme) site.theme = req.query.theme;
		
		// load theme
		loadTheme(site.theme, app);

		// if template or inc override
		if (req.query.template) template = req.query.template;
		if (req.query.inc) template = path.join("inc", req.query.inc);

		// render view
		res.render(template, pageVars);
	
	}

	function buildPageVars(req) {
	
		var page_vars = {};
		
		// try to read file
		var content = fileHelper.readSync(path.join(paths.content, req.slug));
		
		// if file had content, assign to page_var
		if (content) page_vars.content = content;
		else page_vars.content = fileHelper.readSync(path.join(paths.content, "404"));
		
		return page_vars;
		
	}
	
	function test_msg(msg1, msg2) {
		if (test_mode) {
			console.log(msg1);
			if (msg2) console.log(msg2);
		}
	}	