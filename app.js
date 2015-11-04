// app setup

	var config = require("./config.json");
	
	var path = require("path"),
		express = require("express"),
		fileHelper = require("peezy-file-helper");
	
	var peezy = {};
	
// module init
	
	peezy.init = function(app_config, cb) {
	
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
				
			// optional callback	
				
				if (cb) cb();
			
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
				
				// if theme override
				if (req.query.theme) site_config.theme = req.query.theme;
				
				// load theme
				loadTheme(site_config.theme, app);
		
				// if template or inc override
				if (req.query.template) template = req.query.template;
				if (req.query.inc) template = path.join("inc", req.query.inc);
					
				// build locals
				var locals = site_config;
				
				locals.slug = req.slug;
				locals.template = template;
				locals.content = getContent(req.slug);
				
				// render view
				res.render(template, locals);
			
			}
		
			function getContent(slug) {
			
				var filepath = path.join(paths.content, req.slug);
				var error = path.join(paths.content, site.error);
			
				if (fileHelper.exists(filepath)) return fileHelper.readSync(filepath);
				else return fileHelper.readSync(error);
					
			}
			
	}
	
// launch server	

	peezy.init(config, function() {
	
		console.log("Success!");
	
	});	