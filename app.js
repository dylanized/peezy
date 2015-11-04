// config

	// app config
	var config = require("./config.json");
	
// app setup

	var path = require("path"),
		express = require("express"),
		fileHelper = require("peezy-file-helper");
	
	var peezy = {};
	
// peezy init
	
	peezy.init = function(app_config) {
	
		// get site config
		
			var site_config = require("./" + app_config.folder + "/site.json");
	
		// build vars
	
			// build folders object
			var folders = {};
			
			for (sub in app_config.subfolders) {
				folders[sub] = path.join(app_config.folder, app_config.subfolders[sub]);
			}
			
			// build paths object	
			var paths = {};	
			
			paths.themes = "/" + folders.themes;
			paths.themes_abs = path.join(__dirname, folders.themes);
			paths.themes_rel = "/" + app_config.subfolders["themes"];
			
			paths.content = path.join(folders.content);
			paths.homepage = path.join(paths.content, site_config.homepage);	
			paths.error = path.join(paths.content, site_config.error);
			
			paths.public_abs = path.join(__dirname, folders.public);
		
			// other vars
			var test_mode = true;
			
		// express setup
			
			// instantiate express
			var app = express();
			var port = process.env.PORT || 1234;
			
			// set view engine
			app.set("view engine", "ejs");
			
			// serve theme static files
			app.use(paths.themes_rel, express.static(paths.themes_abs));	
		
			// serve root static files
			app.use("/", express.static(paths.public_abs));	
	
		// routing
		
			var router = express.Router();
			
			// index
			
				router.get("/", function(req, res) {
					req.slug = site_config.homepage;
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
				site_config.theme = theme;
				paths.theme = path.join(folders.themes, theme);
				paths.theme_abs = path.join(__dirname, paths.theme);
				
				// load folder
				app.set("views", paths.theme_abs);							
				
			}
		
			function renderTemplate(template, req, res) {
			
				// build page vars
				var pageVars = buildPageVars(req);
				
				// if theme override
				if (req.query.theme) site_config.theme = req.query.theme;
				
				// load theme
				loadTheme(site_config.theme, app);
		
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
	
	}
	
// launch peezy	

peezy.init(site, app);	